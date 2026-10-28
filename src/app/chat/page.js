'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Send, Phone as PhoneIcon } from '@/components/ui/Icons';
import { MAIN_STORE, STORES } from '@/components/ui/stores';
import ContourLines from '@/components/ui/ContourLines';
import Eyebrow from '@/components/ui/Eyebrow';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import Reveal, { EASE_OUT } from '@/components/motion/Reveal';
import useReducedMotionSafe from '@/components/motion/useReducedMotionSafe';
import AssistantMark from '@/components/chat/AssistantMark';
import { Outboard, Gear, OilDrop, Gps, Pin, Phone } from '@/components/chat/SuggestionIcons';
import styles from './chat.module.css';

const COPY = {
    en: {
        eyebrow: 'Virtual assistant',
        name: 'Pevita',
        subline: 'Virtual Assistant · Perkasa Jaya Marine',
        call: 'Call a store',
        title: "Hi, I'm Pevita",
        srTitle: 'Chat with Pevita',
        lead: 'Welcome! How can I help you with Yamaha Marine products?',
        hint: 'Ask about outboard motors, Yamaha Genuine Parts, Yamalube, service or Garmin.',
        suggestionsLabel: 'Suggested questions',
        suggestions: [
            'Yamaha outboard motor info?',
            'Yamaha Genuine Parts info?',
            'Yamalube info?',
            'Garmin products info?',
            'Where is the official Yamaha Marine workshop in Padang?',
            'How can I contact you?',
        ],
        typing: 'Pevita is typing…',
        error: 'Something went wrong. Please try again or call our stores.',
        retry: 'Retry',
        placeholder: 'Type your question…',
        send: 'Send',
        // Composer note: one sentence with both stores as tel links (see render).
        notePre: 'Pevita can make mistakes. For orders, call ',
        noteOr: ' or ',
        noteEnd: '.',
    },
    id: {
        eyebrow: 'Asisten virtual',
        name: 'Pevita',
        subline: 'Asisten Virtual · Perkasa Jaya Marine',
        call: 'Telepon toko',
        title: 'Halo, saya Pevita',
        srTitle: 'Chat dengan Pevita',
        lead: 'Selamat datang! Ada yang bisa saya bantu tentang produk Yamaha Marine?',
        hint: 'Tuliskan informasi yang anda butuhkan: Outboard Motor, Yamaha Genuine Part, Yamalube, Service, Garmin',
        suggestionsLabel: 'Pertanyaan yang disarankan',
        suggestions: [
            'Informasi produk Yamaha Outboard Motor?',
            'Informasi produk Yamaha Genuine Part?',
            'Informasi produk Yamaha Yamalube?',
            'Informasi produk Garmin?',
            'Dimana lokasi bengkel resmi Yamaha Marine Padang?',
            'Bagaimana cara menghubungi kami?',
        ],
        typing: 'Pevita sedang mengetik…',
        error: 'Terjadi kesalahan. Silakan coba lagi atau hubungi toko kami.',
        retry: 'Coba lagi',
        placeholder: 'Tulis pertanyaan Anda…',
        send: 'Kirim',
        notePre: 'Pevita bisa keliru. Untuk pemesanan, hubungi ',
        noteOr: ' atau ',
        noteEnd: '.',
    },
};

// One icon per suggestion, in the same order as COPY.*.suggestions.
const SUGGESTION_ICONS = [Outboard, Gear, OilDrop, Gps, Pin, Phone];

const MAX_LINES = 5;
const MAX_PREFILL = 1000;

// Reads ?q= (product, parts and Yamalube CTAs link to /chat?q=…) and hands it to the composer.
// Lives in its own Suspense boundary so the rest of the page still prerenders statically.
function QueryPrefill({ onPrefill }) {
    const searchParams = useSearchParams();
    const handledRef = useRef(null);

    useEffect(() => {
        const q = searchParams.get('q');
        if (!q || !q.trim() || handledRef.current === q) return;
        handledRef.current = q;
        onPrefill(q);
    }, [searchParams, onPrefill]);

    return null;
}

export default function Chat() {
    const { language } = useLanguage();
    const c = COPY[language] || COPY.en;
    const reducedMotion = useReducedMotionSafe();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const pageRef = useRef(null);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const nearBottomRef = useRef(true);

    // Track whether the reader is at the end of the conversation. Measured against the bottom of the
    // chat page (not the document), because the site footer sits below it.
    useEffect(() => {
        const onScroll = () => {
            const page = pageRef.current;
            if (!page) return;
            nearBottomRef.current = page.getBoundingClientRect().bottom - window.innerHeight <= 200;
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Auto-scroll: never on load (keeps the greeting in view); follow new content only when the reader
    // is already near the end, or when they just sent a message.
    useEffect(() => {
        if (messages.length === 0) return;
        const last = messages[messages.length - 1];
        if (!nearBottomRef.current && last.role !== 'user') return;
        messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: reducedMotion ? 'auto' : 'smooth' });
    }, [messages, isLoading, error, reducedMotion]);

    // Focus the composer on mount only for mouse/trackpad users, so phones don't pop the keyboard.
    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
            textareaRef.current?.focus({ preventScroll: true });
        }
    }, []);

    // Auto-grow the textarea up to MAX_LINES, then scroll inside it.
    useLayoutEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        const cs = window.getComputedStyle(el);
        const lineHeight = parseFloat(cs.lineHeight) || 24;
        const max = lineHeight * MAX_LINES + (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
        el.style.height = Math.min(el.scrollHeight, max) + 'px';
        el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
    }, [input]);

    const handlePrefill = (q) => {
        setInput(q.slice(0, MAX_PREFILL));
        requestAnimationFrame(() => {
            const el = textareaRef.current;
            if (!el) return;
            el.focus({ preventScroll: true });
            const end = el.value.length;
            el.setSelectionRange(end, end);
        });
    };

    const sendMessage = async (text, { retry = false } = {}) => {
        if (!text || !text.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
        };

        if (retry) {
            // Re-send the last question without a duplicate user bubble; drop a failed/partial reply.
            setMessages((prev) =>
                prev.length && prev[prev.length - 1].role === 'assistant' ? prev.slice(0, -1) : prev
            );
        } else {
            // Update UI immediately
            setMessages((prev) => [...prev, userMessage]);
            setInput('');
        }
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleRetry = () => {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
                sendMessage(messages[i].content, { retry: true });
                return;
            }
        }
    };

    const lastMessage = messages[messages.length - 1];
    const isStreamingText = lastMessage?.role === 'assistant' && Boolean(lastMessage.content);
    const showTyping = isLoading && !isStreamingText;
    const messageMotion = {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25, ease: EASE_OUT },
    };

    const isEmpty = messages.length === 0;

    return (
        <div ref={pageRef} className={`${styles.page} ${isEmpty ? styles.pageEmpty : ''}`}>
            {isEmpty ? (
                /* Empty state: the navy band grows into a branded opener. Pevita's mark sits on its bottom
                   edge, half over the suggestions below. */
                <div className={styles.opener}>
                    <div className={`${styles.band} ${styles.bandOpen} on-dark`}>
                        <ContourLines />
                        <div className={styles.openerInner}>
                            <Reveal immediate delay={0.05} y={12}>
                                <Eyebrow immediate>{c.eyebrow}</Eyebrow>
                            </Reveal>

                            {/* LCP text: slides up, never fades in from nothing. */}
                            <motion.h1
                                className={`h1 ${styles.openerTitle}`}
                                initial={{ y: 16 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, ease: EASE_OUT }}
                            >
                                {c.title}
                            </motion.h1>

                            <Reveal immediate delay={0.15}>
                                <p className={`lead ${styles.openerLead}`}>{c.lead}</p>
                                <p className={styles.openerHint}>{c.hint}</p>
                            </Reveal>

                            <Reveal immediate delay={0.25} className={styles.openerCalls}>
                                {STORES.map((store) => (
                                    <a
                                        key={store.id}
                                        href={store.tel}
                                        className={`btn btn-ghost btn-sm ${styles.callBtn}`}
                                    >
                                        <PhoneIcon />
                                        <span className={styles.callText}>
                                            {store.name} · <span className={styles.callNum}>{store.phone}</span>
                                        </span>
                                    </a>
                                ))}
                            </Reveal>
                        </div>
                    </div>

                    <div className={styles.openerMark}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
                        >
                            <AssistantMark size={64} ring status />
                        </motion.div>
                    </div>
                </div>
            ) : (
                /* Conversation: the opener collapses to a slim identity band. */
                <div className={`${styles.band} on-dark`}>
                    <ContourLines />
                    <motion.div
                        className={styles.bandInner}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                    >
                        <AssistantMark size={40} />
                        <div className={styles.bandText}>
                            <p className={styles.bandName}>{c.name}</p>
                            <p className={styles.bandSub}>
                                <span className={styles.statusDot} aria-hidden="true" />
                                {c.subline}
                            </p>
                        </div>
                        <a href={MAIN_STORE.tel} className={styles.bandCall}>
                            <PhoneIcon size={18} />
                            {c.call}
                        </a>
                    </motion.div>
                </div>
            )}

            {/* Once the greeting (and its h1) gives way to the conversation, keep a page heading for screen readers. */}
            {!isEmpty && <h1 className="visually-hidden">{c.srTitle}</h1>}

            {isEmpty && (
                <div className={`${styles.starters} section-alt`}>
                    <div className={styles.startersInner}>
                        <StaggerGroup
                            as="ul"
                            immediate
                            stagger={0.05}
                            delayChildren={0.2}
                            className={styles.suggestions}
                            role="list"
                            aria-label={c.suggestionsLabel}
                        >
                            {c.suggestions.map((q, i) => {
                                const Icon = SUGGESTION_ICONS[i];
                                return (
                                    <StaggerItem as="li" key={i} y={12} duration={0.5} className={styles.suggestionItem}>
                                        <button type="button" className={styles.suggestion} onClick={() => sendMessage(q)}>
                                            <span className={styles.suggestionIcon}>
                                                {Icon && <Icon size={20} />}
                                            </span>
                                            <span className={styles.suggestionLabel}>{q}</span>
                                        </button>
                                    </StaggerItem>
                                );
                            })}
                        </StaggerGroup>
                    </div>
                </div>
            )}

            <div
                className={`${styles.thread} ${isEmpty ? styles.threadEmpty : ''}`}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
            >
                {messages.map((m) => {
                    // Hide the assistant placeholder until its first streamed text arrives.
                    if (!m.content) return null;

                    if (m.role === 'user') {
                        return (
                            <motion.div key={m.id} className={`${styles.row} ${styles.rowUser}`} {...messageMotion}>
                                <div className={styles.bubbleUser}>{m.content}</div>
                            </motion.div>
                        );
                    }

                    return (
                        <motion.div key={m.id} className={styles.rowAssistant} {...messageMotion}>
                            <AssistantMark size={32} className={styles.avatar} />
                            <div className={styles.bubbleAssistant}>
                                <div className={styles.prose}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {m.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {showTyping && (
                    <motion.div className={styles.rowAssistant} {...messageMotion}>
                        <AssistantMark size={32} className={styles.avatar} />
                        <div className={styles.bubbleAssistant}>
                            <span className={styles.typing} aria-hidden="true">
                                <span /><span /><span />
                            </span>
                            <span className="visually-hidden">{c.typing}</span>
                        </div>
                    </motion.div>
                )}

                {error && !isLoading && (
                    <motion.div className={styles.rowAssistant} {...messageMotion}>
                        <AssistantMark size={32} className={styles.avatar} />
                        <div className={`${styles.bubbleAssistant} ${styles.bubbleError}`}>
                            <p className={styles.errorText}>{c.error}</p>
                            <button type="button" className="btn btn-outline btn-sm" onClick={handleRetry}>
                                {c.retry}
                            </button>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} className={styles.end} aria-hidden="true" />
            </div>

            <div className={`${styles.composer} ${isEmpty ? styles.composerAlt : ''}`}>
                <div className={styles.composerInner}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            className={styles.textarea}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={c.placeholder}
                            aria-label={c.placeholder}
                            enterKeyHint="send"
                        />
                        <button
                            type="submit"
                            className={styles.send}
                            disabled={isLoading || !input.trim()}
                            aria-label={c.send}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                    {/* Both stores stay one tap away in every state (the opener's call buttons hide on phones). */}
                    <p className={styles.note}>
                        {c.notePre}
                        <a href={STORES[0].tel}>{STORES[0].name}</a>
                        {c.noteOr}
                        <a href={STORES[1].tel}>{STORES[1].name}</a>
                        {c.noteEnd}
                    </p>
                </div>
            </div>

            <Suspense fallback={null}>
                <QueryPrefill onPrefill={handlePrefill} />
            </Suspense>
        </div>
    );
}
