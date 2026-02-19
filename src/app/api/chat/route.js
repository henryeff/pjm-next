import { openai } from '@ai-sdk/openai';
import { streamText, generateText, tool } from 'ai';
import { checkRateLimit } from '@/lib/rate-limiter';
import { headers, cookies } from 'next/headers';
import { z } from 'zod';
import { sendPushoverNotification } from '@/lib/pushover';
import { getConversation, saveConversation } from '@/lib/store';
import { randomUUID } from 'crypto';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
    // 1. Rate Limiting based on IP
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';

    const rateLimitStatus = await checkRateLimit(ip);

    if (!rateLimitStatus.success) {
        return new Response('Too many requests. Please try again later.', { status: 429 });
    }

    // 2. Session Management (In-Memory)
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('chat_session')?.value;

    // For now, if no session, we generate one.
    if (!sessionId) {
        sessionId = randomUUID();
    }

    // Load server history
    const serverHistory = getConversation(sessionId);

    const dynamicSystemPrompt = ""; // User will fill this in

    // 4. Parse request body
    const { messages } = await req.json();

    // The 'useChat' hook sends the full history in the 'messages' field. 
    // However, per user request, we want to IGNORE the client-provided history 
    // and ONLY process the LAST message, appending it to our server-side history.
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== 'user') {
        // Handle case where maybe just initialized or empty
        return new Response('Invalid request: No user message found', { status: 400 });
    }

    // Convert to CoreMessage to match AI SDK expectations
    const newUserMessage = {
        role: 'user',
        content: lastMessage.content
    };

    // Combine server history + new message
    // Note: serverHistory contains AI SDK Messages. CoreMessage is a subset.
    // We cast to any to allow mixing for input.
    let finalMessages = [...serverHistory, newUserMessage];

    // 5. Context Window Management / Summarization
    if (finalMessages.length > 10) {
        const recentMessages = finalMessages.slice(-4);
        const olderMessages = finalMessages.slice(0, -4);

        if (olderMessages.length > 0) {
            try {
                const { text: summary } = await generateText({
                    model: openai('gpt-4o-mini'),
                    system: 'You are a helpful assistant. Summarize the key points of the following conversation concisely.',
                    messages: olderMessages,
                });

                finalMessages = [
                    { role: 'system', content: `Previous conversation summary: ${summary}` },
                    ...recentMessages,
                ];
            } catch (error) {
                console.error('Summarization failed:', error);
                finalMessages = recentMessages;
            }
        }
    }

    try {
        // 6. Stream Response
        const result = await streamText({
            model: openai('gpt-4o-mini'),
            system: dynamicSystemPrompt,
            messages: finalMessages,
            maxSteps: 20,
            toolChoice: 'auto',
            tools: {
                recordUserDetails: tool({
                    description: 'Use this tool to record that a user is interested in being in touch and provided an email address',
                    parameters: z.object({
                        email: z.string().describe('The email address of this user'),
                        name: z.string().describe("The user's name, if they provided it").optional(),
                        notes: z.string().describe("Any additional information about the conversation that's worth recording to give context").optional(),
                    }),
                    execute: async ({ email, name, notes }) => {
                        console.log('Executing recordUserDetails tool', { email, name, notes });
                        const message = `Name: ${name || 'Not provided'}\nEmail: ${email}\nNotes: ${notes || 'Not provided'}`;
                        const success = await sendPushoverNotification('New Lead Captured', message);
                        console.log('Pushover notification result:', success);
                        return success ? 'Details recorded successfully. Thank the user.' : 'Failed to record details. Apologize to the user.';
                    },
                }),
                recordUnknownQuestion: tool({
                    description: "Always use this tool to record any question that couldn't be answered as you didn't know the answer",
                    parameters: z.object({
                        question: z.string().describe("The question that couldn't be answered"),
                    }),
                    execute: async ({ question }) => {
                        console.log('Executing recordUnknownQuestion tool', { question });
                        const success = await sendPushoverNotification('Unknown Question', `Question: ${question}`);
                        console.log('Pushover notification result:', success);
                        return success ? 'Question recorded. Inform the user you will look into it.' : 'Failed to record question.';
                    },
                }),
            },
            async onFinish({ response }) {
                // Append new interactions to the store
                const currentHistory = getConversation(sessionId);
                const newAssistantMessages = response.messages;

                const userMessageToSave = {
                    ...newUserMessage,
                    id: randomUUID(),
                    createdAt: new Date(),
                };

                const assistantMessagesToSave = newAssistantMessages.map(msg => {
                    const messageId = randomUUID();
                    return {
                        ...msg,
                        id: messageId,
                        createdAt: new Date(),
                    };
                });

                const messagesToSave = [
                    ...currentHistory,
                    userMessageToSave,
                    ...assistantMessagesToSave
                ];
                saveConversation(sessionId, messagesToSave);
            },
        });

        // For ai@3.x / @ai-sdk/openai@0.0.x
        // streamText returns a result that you can call .toDataStreamResponse() on.
        const dataStreamResponse = result.toDataStreamResponse();

        // Set cookie if needed
        if (!cookieStore.get('chat_session')) {
            dataStreamResponse.headers.set('Set-Cookie', `chat_session=${sessionId}; Path=/; HttpOnly; SameSite=Strict`);
        }

        return dataStreamResponse;
    } catch (error) {
        console.error('API Route Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
