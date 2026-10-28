'use client';

import { motion } from 'framer-motion';
import { EASE_OUT } from './Reveal';
import useReducedMotionSafe from './useReducedMotionSafe';

const OUTER_STYLE = { position: 'relative' };
const CLIP_STYLE = { position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 'inherit' };
const INNER_STYLE = { position: 'relative', width: '100%', height: '100%' };

/**
 * Editorial image reveal: a top-down clip-path wipe (0.9s) while the image settles from 1.08 → 1 (1.2s).
 * Give it a size via className (e.g. aspect-ratio + border-radius) and put a next/image `fill` inside.
 * Triggers once at 30% in view, or on mount with `immediate`. Static for reduced-motion visitors.
 *
 * The in-view trigger sits on the unclipped outer box: Chrome's IntersectionObserver honours the
 * target's own clip-path, so a fully clipped element would never report as visible.
 */
export default function ImageReveal({ children, className, delay = 0, immediate = false }) {
    const reduce = useReducedMotionSafe();

    if (reduce) {
        return (
            <div className={className} style={OUTER_STYLE}>
                <div style={CLIP_STYLE}>
                    <div style={INNER_STYLE}>{children}</div>
                </div>
            </div>
        );
    }

    const trigger = immediate
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport: { once: true, amount: 0.3 } };

    return (
        <motion.div className={className} style={OUTER_STYLE} initial="hidden" {...trigger}>
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
