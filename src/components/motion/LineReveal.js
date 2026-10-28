'use client';

import { motion } from 'framer-motion';
import { EASE_OUT } from './Reveal';

const LINE_WRAP_STYLE = { display: 'block', overflow: 'hidden', paddingBottom: '0.06em' };
const LINE_STYLE = { display: 'inline-block' };

const lineVariants = {
    hidden: { y: '105%' },
    visible: { y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

/**
 * Headline that rises line by line from behind a mask, on mount (not in view).
 * Opacity is never animated, so the text is LCP-safe. Only the home hero uses it.
 * Reduced-motion visitors get the final state immediately (MotionConfig skips transforms).
 */
export default function LineReveal({ lines = [], as = 'h1', className, delay = 0.15, stagger = 0.08 }) {
    const MotionTag = motion[as] || motion.h1;

    return (
        <MotionTag
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
            }}
        >
            {lines.map((line, i) => (
                <span key={i} style={LINE_WRAP_STYLE}>
                    <motion.span style={LINE_STYLE} variants={lineVariants}>
                        {line}
                    </motion.span>{' '}
                </span>
            ))}
        </MotionTag>
    );
}
