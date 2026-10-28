'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from './LangSwitch.module.css';

const OPTIONS = [
    { code: 'en', short: 'EN', label: 'English' },
    { code: 'id', short: 'ID', label: 'Bahasa Indonesia' },
];

/**
 * EN / ID language switch for dark surfaces (navbar, mobile menu, footer).
 * variant: 'pill' (compact, 36px) | 'segmented' (full width, 44px buttons).
 */
export default function LangSwitch({ variant = 'pill', className }) {
    const { language, toggleLanguage } = useLanguage();

    const choose = (code) => {
        if (code !== language) toggleLanguage();
    };

    const rootClass = [styles.switch, variant === 'segmented' ? styles.segmented : styles.pill, className || '']
        .filter(Boolean)
        .join(' ');

    return (
        <div className={rootClass} role="group" aria-label={language === 'id' ? 'Bahasa' : 'Language'}>
            {OPTIONS.map((opt) => {
                const active = language === opt.code;
                return (
                    <button
                        key={opt.code}
                        type="button"
                        lang={opt.code}
                        aria-pressed={active}
                        aria-label={opt.label}
                        onClick={() => choose(opt.code)}
                        className={styles.option + (active ? ' ' + styles.active : '')}
                    >
                        {opt.short}
                    </button>
                );
            })}
        </div>
    );
}
