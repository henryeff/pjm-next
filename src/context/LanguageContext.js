'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';

/*
 * Site language. Indonesian is the default and the server-rendered language (crawlers and AI bots read
 * Indonesian; <html lang="id">). English is a client-side toggle on the same URLs.
 *
 * A visitor's explicit choice is remembered in localStorage and applied AFTER hydration:
 * useSyncExternalStore renders the server snapshot ('id') while hydrating — so the HTML always
 * matches — and then re-renders with the stored choice. No hydration mismatch, no effect + setState.
 */

export const DEFAULT_LANGUAGE = 'id';
export const LANGUAGES = ['id', 'en'];
const STORAGE_KEY = 'pjm-lang';

const listeners = new Set();
let memoryChoice = null; // fallback when storage is blocked (private mode, sandboxed previews)

const isLanguage = (v) => LANGUAGES.includes(v);

function readChoice() {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (isLanguage(stored)) return stored;
    } catch {
        // storage unavailable — fall through to the in-memory choice
    }
    return memoryChoice;
}

function getSnapshot() {
    return readChoice() || DEFAULT_LANGUAGE;
}

function getServerSnapshot() {
    return DEFAULT_LANGUAGE;
}

function subscribe(callback) {
    listeners.add(callback);
    // Keep other open tabs in sync.
    const onStorage = (e) => {
        if (e.key === STORAGE_KEY) callback();
    };
    window.addEventListener('storage', onStorage);
    return () => {
        listeners.delete(callback);
        window.removeEventListener('storage', onStorage);
    };
}

function writeChoice(language) {
    if (!isLanguage(language)) return;
    memoryChoice = language;
    try {
        window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
        // storage unavailable — the in-memory choice still applies for this page view
    }
    listeners.forEach((l) => l());
}

const LanguageContext = createContext({
    language: DEFAULT_LANGUAGE,
    setLanguage: () => {},
    toggleLanguage: () => {},
});

export function LanguageProvider({ children }) {
    const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const setLanguage = (next) => writeChoice(next);
    const toggleLanguage = () => writeChoice(language === 'en' ? 'id' : 'en');

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

/** { language: 'id' | 'en', setLanguage(code), toggleLanguage() } */
export function useLanguage() {
    return useContext(LanguageContext);
}
