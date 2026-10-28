'use client';

import { useEffect, useId, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { EASE_OUT } from '@/components/motion/Reveal';
import { Close } from '@/components/ui/Icons';
import NewsDate from './NewsDate';
import styles from './NewsModal.module.css';

// News content is plain text with blank-line paragraphs. Two older posts also contain a little HTML
// (<strong>, <ul><li>). Render that small subset as real elements and drop any other tag — never inject
// raw HTML, so the data can't break or script the page.
const stripTags = (s) => s.replace(/<[^>]*>/g, '');

function renderInline(text, keyPrefix) {
    return text.split(/(<strong>[\s\S]*?<\/strong>)/gi).map((part, i) => {
        const bold = part.match(/^<strong>([\s\S]*?)<\/strong>$/i);
        return bold ? <strong key={`${keyPrefix}-${i}`}>{stripTags(bold[1])}</strong> : stripTags(part);
    });
}

function renderContent(content) {
    return content.split('\n').map((line, idx) => {
        if (!line.trim()) return <br key={idx} />;
        if (/<li>/i.test(line)) {
            const items = [...line.matchAll(/<li>([\s\S]*?)<\/li>/gi)].map((m) => m[1]);
            return (
                <ul key={idx}>
                    {items.map((it, j) => (
                        <li key={j}>{renderInline(it, `${idx}-${j}`)}</li>
                    ))}
                </ul>
            );
        }
        return <p key={idx}>{renderInline(line, idx)}</p>;
    });
}

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Article dialog. Fades the navy overlay in (0.25s) and lifts the panel 24px → 0 (0.35s).
 * Focus goes to the close button, Tab is trapped in the panel, Escape / overlay click close it,
 * and the page behind is scroll-locked until the exit animation finishes.
 * The caller owns `item` (null = closed) and restores focus to the opener in `onClose`.
 */
export default function NewsModal({ item, language, closeLabel, onClose }) {
    return (
        <AnimatePresence>
            {item && (
                <Dialog
                    key={item.id}
                    item={item}
                    language={language}
                    closeLabel={closeLabel}
                    onClose={onClose}
                />
            )}
        </AnimatePresence>
    );
}

function Dialog({ item, language, closeLabel, onClose }) {
    const panelRef = useRef(null);
    const closeRef = useRef(null);
    const titleId = useId();
    const isPresent = useIsPresent();

    // Mount: lock the page scroll (on <html>, which owns the viewport scroll here) and focus the close button.
    useEffect(() => {
        const html = document.documentElement;
        const prevOverflow = html.style.overflow;
        const prevGutter = html.style.scrollbarGutter;
        const hasScrollbar = window.innerWidth > html.clientWidth;

        html.style.overflow = 'hidden';
        // Keep the scrollbar's space so the page doesn't jump sideways while locked.
        if (hasScrollbar) html.style.scrollbarGutter = 'stable';
        closeRef.current?.focus({ preventScroll: true });

        return () => {
            html.style.overflow = prevOverflow;
            html.style.scrollbarGutter = prevGutter;
        };
    }, []);

    // Escape closes; Tab / Shift+Tab cycle inside the panel. Off while the exit animation runs.
    useEffect(() => {
        if (!isPresent) return undefined;

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }
            if (e.key !== 'Tab') return;

            const panel = panelRef.current;
            if (!panel) return;
            const nodes = [panel, ...panel.querySelectorAll(FOCUSABLE)].filter(
                (el) => el.tabIndex >= 0 && el.getClientRects().length > 0
            );
            if (nodes.length === 0) {
                e.preventDefault();
                return;
            }

            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            const active = document.activeElement;

            if (!panel.contains(active)) {
                e.preventDefault();
                (e.shiftKey ? last : first).focus();
            } else if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isPresent, onClose]);

    return (
        <div className={styles.root} style={isPresent ? undefined : { pointerEvents: 'none' }}>
            <motion.div
                className={styles.overlay}
                aria-hidden="true"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'linear' }}
            />

            <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                // Focusable so keyboard users can scroll a long article (arrow keys / Page Down).
                tabIndex={0}
                className={styles.panel}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24, transition: { duration: 0.25, ease: EASE_OUT } }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
            >
                <div className={styles.closeBar}>
                    <button
                        ref={closeRef}
                        type="button"
                        className={styles.close}
                        aria-label={closeLabel}
                        onClick={onClose}
                    >
                        <Close size={22} />
                    </button>
                </div>

                <div className={styles.media}>
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 808px) 760px, 100vw"
                        className={styles.img}
                    />
                </div>

                <div className={styles.body}>
                    <NewsDate value={item.date} language={language} />
                    <h2 id={titleId} className={styles.title}>
                        {item.title}
                    </h2>
                    <div className={styles.content}>
                        {renderContent(item.content)}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
