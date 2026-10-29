'use client';

import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";

// The server renders <html lang="id">. This keeps it in sync after the visitor switches language
// (screen readers, hyphenation, translation prompts).
function HtmlLang() {
    const { language } = useLanguage();
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);
    return null;
}

export default function Providers({ children }) {
    return (
        <LanguageProvider>
            <HtmlLang />
            {/* Respect the visitor's OS "reduce motion" setting for all Framer Motion animations. */}
            <MotionConfig reducedMotion="user">
                {children}
            </MotionConfig>
        </LanguageProvider>
    );
}
