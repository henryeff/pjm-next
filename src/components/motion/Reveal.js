'use client';

import { motion } from 'framer-motion';

// Shared easing for a refined, physical feel across the site.
export const EASE_OUT = [0.16, 1, 0.3, 1];

/**
 * Fades and slides an element into view as it scrolls into the viewport.
 * Animates once by default so it never replays while scrolling up/down.
 */
export default function Reveal({
    children,
    className,
    delay = 0,
    y = 28,
    duration = 0.7,
    once = true,
    amount = 0.2,
    as = 'div',
    ...rest
}) {
    const MotionTag = motion[as] || motion.div;

    return (
        <MotionTag
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, amount }}
            transition={{ duration, delay, ease: EASE_OUT }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}
