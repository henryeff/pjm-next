'use client';

import { motion } from 'framer-motion';
import { EASE_OUT } from './Reveal';
import { cssMotionVars } from './cssMotion';
import m from './motion.module.css';

const LINE_STYLE = {
    display: 'inline-block',
    width: 24,
    height: 2,
    background: 'var(--secondary)',
    transformOrigin: 'left center',
    flex: 'none',
};

/**
 * The short red rule that leads every eyebrow. Draws in from the left (scaleX 0 → 1, 0.6s).
 * `immediate` (above the fold) draws from the first paint with CSS; otherwise it draws when fully in view.
 */
export default function KickerLine({ className, immediate = false, delay = 0 }) {
    if (immediate) {
        return (
            <span
                aria-hidden="true"
                className={className ? `${m.draw} ${className}` : m.draw}
                style={{ ...LINE_STYLE, ...cssMotionVars({ delay }) }}
            />
        );
    }

    return (
        <motion.span
            aria-hidden="true"
            className={className}
            style={LINE_STYLE}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay }}
        />
    );
}
