'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef, useState } from 'react';
import styles from './chat.module.css';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);
    const [isFading, setIsFading] = useState(false);
    const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
        };

        // Update UI immediately
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            // Send ONLY the last message to the server
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [userMessage] // Wrap in array to match server expectation of 'messages' payload
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} `);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No response body');

            const decoder = new TextDecoder();

            // Create a placeholder assistant message
            const assistantMessageId = (Date.now() + 1).toString();
            setMessages((prev) => [
                ...prev,
                { id: assistantMessageId, role: 'assistant', content: '' }
            ]);

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                const lines = buffer.split('\n');

                // Keep the last possibly incomplete line in buffer
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.trim()) continue;

                    // AI SDK Stream Protocol: type:content
                    // 0: text
                    if (line.startsWith('0:')) {
                        try {
                            // Parse the JSON string after '0:'
                            const textContent = JSON.parse(line.slice(2));

                            setMessages((prev) => {
                                const newMessages = [...prev];
                                const lastMsgIndex = newMessages.length - 1;
                                const lastMsg = newMessages[lastMsgIndex];

                                if (lastMsg && lastMsg.role === 'assistant') {
                                    const updatedMsg = { ...lastMsg, content: lastMsg.content + textContent };
                                    newMessages[lastMsgIndex] = updatedMsg;
                                    return newMessages;
                                }
                                return newMessages;
                            });
                        } catch (e) {
                            console.error('Error parsing line:', line, e);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Chat error:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e?.preventDefault();
        sendMessage(input);
    };

    const suggestedQuestions = [
        "Informasi produk Yamaha Outboard Motor?",
        "Informasi produk Yamaha Genuine Part?",
        "Informasi produk Yamaha Yamalube?",
        "Informasi produk Garmin?",
        "Dimana lokasi bengkel resmi Yamaha Marine Padang?",
        "Bagaimana cara menghubungi kami?",
    ];

    const greetings = [
        "Halo! Saya Pevita (Perkasa Jaya Marine Virtual Assistant)",
        "Selamat datang! Ada yang bisa saya bantu tentang produk Yamaha Marine?",
        "Tuliskan informasi yang anda butuhkan: Outboard Motor, Yamaha Geniune Part, Yamalube, Service, Garmin"
    ];


    useEffect(() => {
        const cycleGreeting = () => {
            setIsFading(true);
            setTimeout(() => {
                setCurrentGreetingIndex((prev) => (prev + 1) % greetings.length);
                setIsFading(false);
            }, 500); // Wait for fade out (matches CSS transition)
        };

        const interval = setInterval(cycleGreeting, 4000); // Change every 4 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Tanyakan apa saja tentang produk dan layanan kami.</h1>
            </header>

            <div className={styles.chatContainer}>
                {messages.length === 0 && (
                    <div className={styles.welcomeMessage}>
                        <p
                            className={`${styles.greeting} ${isFading ? styles.greetingHidden : ''}`}
                        >
                            {greetings[currentGreetingIndex]}
                        </p>
                        <div className={styles.suggestionContainer}>
                            {suggestedQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(q)}
                                    className={styles.suggestionBtn}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((m) => (
                    <div key={m.id} className={`${styles.message} ${m.role === 'user' ? styles.messageUser : ''} `}>
                        {/* 
                Only show the message container if there is actual content to display.
                We hide messages that are purely tool calls without visible text response yet. 
            */}
                        {m.content && (
                            <>
                                <div className={`${styles.avatar} ${m.role === 'user' ? styles.avatarUser : styles.avatarAi} `}>
                                    {m.role === 'user' ? 'U' : 'AI'}
                                </div>
                                <div className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleAi} `}>
                                    {m.role === 'user' ? (
                                        <p>{m.content}</p>
                                    ) : (
                                        <div className={styles.prose}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {m.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className={styles.message}>
                        <div className={`${styles.avatar} ${styles.avatarAi} `}>AI</div>
                        <div className={`${styles.bubble} ${styles.bubbleAi} `}>
                            <div className={styles.typingIndicator}>
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className={styles.message}>
                        <div className={`${styles.bubble} ${styles.bubbleAi} `} style={{ color: '#ef4444' }}>
                            Error: {error.message}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputArea}>
                <form onSubmit={handleSubmit} className={styles.inputForm}>
                    <input
                        className={styles.inputBox}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Tulis pertanyaan Anda..."
                        disabled={isLoading}
                        autoFocus
                    />
                    <button type="submit" className={styles.sendBtn} disabled={isLoading || !input.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
