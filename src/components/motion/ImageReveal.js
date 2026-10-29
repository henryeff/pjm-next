'use client';

import { motion } from 'framer-motion';
import { EASE_OUT } from './Reveal';
import { cssMotionVars } from './cssMotion';
import useReducedMotionSafe from './useReducedMotionSafe';
import m from './motion.module.css';

const OUTER_STYLE = { position: 'relative' };
const CLIP_STYLE = { position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 'inherit' };
const INNER_STYLE = { position: 'relative', width: '100%', height: '100%' };

/**
 * Editorial image reveal: a top-down clip-path wipe (0.9s) while the image settles from 1.08 → 1 (1.2s).
 * Give it a size via className (e.g. aspect-ratio + border-radius) and put a next/image `fill` inside.
 * Triggers once at 30% in view. Static for reduced-motion visitors.
 *
 * `immediate` (above the fold, often the LCP image): no wipe — only the CSS scale settle, from the
 * first paint, so the image is fully visible in the server HTML (see the rules in Reveal.js).
 *
 * The in-view trigger sits on the unclipped outer box: Chrome's IntersectionObserver honours the
 * target's own clip-path, so a fully clipped element would never report as visible.
 */
export default function ImageReveal({ children, className, delay = 0, immediate = false }) {
    const reduce = useReducedMotionSafe();

    if (reduce || immediate) {
        return (
            <div className={className} style={OUTER_STYLE}>
                <div style={CLIP_STYLE}>
                    <div
                        className={immediate ? m.settle : undefined}
                        style={immediate ? { ...INNER_STYLE, ...cssMotionVars({ delay, duration: 1.2, scale: 1.08 }) } : INNER_STYLE}
                    >
                        {children}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className={className}
            style={OUTER_STYLE}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <motion.div
                style={CLIP_STYLE}
                variants={{
                    hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
                    visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.9, ease: EASE_OUT, delay } },
                }}
            >
                <motion.div
                    style={INNER_STYLE}
                    variants={{
                        hidden: { scale: 1.08 },
                        visible: { scale: 1, transition: { duration: 1.2, ease: EASE_OUT, delay } },
                    }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
