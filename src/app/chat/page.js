'use client';

import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef, useState } from 'react';
import styles from './chat.module.css';

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, isLoading, error } = useChat({
        api: '/api/chat',
        // onError: (err) => {
        //     console.error("Chat error:", err);
        // }
    });

    const messagesEndRef = useRef(null);
    const [isFading, setIsFading] = useState(false);
    const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const suggestedQuestions = [
        "Apa saja produk Yamaha Marine yang tersedia?",
        "Dimana lokasi bengkel resmi yamaha marine?",
        "Apakah ada promo pembelian mesin tempel?",
        "Bagaimana cara menghubungi kami?",
        "Bagaimana cara order?"
    ];

    const greetings = [
        "Halo! Saya asisten virtual Perkasa Jaya Marine.",
        "Selamat datang! Ada yang bisa saya bantu tentang produk Yamaha Marine?",
        "Butuh informasi sparepart atau service? Tanyakan saja!"
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

    // Custom submit handler to allow clicking suggestions
    const onFormSubmit = (e) => {
        e?.preventDefault();
        originalHandleSubmit(e);
    };

    const handleSuggestionClick = (question) => {
        // We need to simulate an event or manually set input and submit
        // useChat's setInput is not exposed in the destructured object above directly unless we grab typical helpers
        // simpler way: set input event then submit
        const event = {
            target: { value: question },
            preventDefault: () => { }
        };
        handleInputChange(event); // update internal state

        // Timeout to allow state update before submitting (hacky but works often) or just call append
        // Better: use append from useChat if exposed, but let's try direct submit.
        // Actually, let's just use the `setInput` returned by useChat if we need it, but useChat returns `setInput` as helper?
        // Wait, standard useChat returns `setInput`. Let's destructure it.
    };

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
                                    onClick={() => {
                                        // Creating a synthetic event for handleInputChange
                                        const syntheticEvent = { target: { value: q } };
                                        handleInputChange(syntheticEvent);
                                        // We want to submit immediately. 
                                        // Since state updates are async, we might need a different approach or 
                                        // use `append` if we destructured it.
                                        // For now, let's just populate the input so user can hit enter.
                                    }}
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
                <form onSubmit={onFormSubmit} className={styles.inputForm}>
                    <input
                        className={styles.inputBox}
                        value={input}
                        onChange={handleInputChange}
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
