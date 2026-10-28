'use client';

import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from "@/context/LanguageContext";

export default function Providers({ children }) {
    return (
        <LanguageProvider>
            {/* Respect the visitor's OS "reduce motion" setting for all Framer Motion animations. */}
            <MotionConfig reducedMotion="user">
                {children}
            </MotionConfig>
        </LanguageProvider>
    );
}
