'use client';

import { motion } from 'framer-motion';
import { EASE_OUT, MOTION } from './Reveal';

/**
 * Wraps a group of StaggerItem children and reveals them in sequence
 * as the group scrolls into view. Use for grids/lists (cards, features).
 * Pass `immediate` for above-the-fold groups: they animate on mount.
 */
export function StaggerGroup({
    children,
    className,
    stagger = MOTION.stagger,
    delayChildren = 0,
    once = true,
    amount = 0.15,
    as = 'div',
    immediate = false,
    ...rest
}) {
    const MotionTag = motion[as] || motion.div;
    const trigger = immediate
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport: { once, amount } };

    return (
        <MotionTag
            className={className}
            initial="hidden"
            {...trigger}
            variants={{
                hidden: {},
                visible: {
                    transition: { staggerChildren: stagger, delayChildren },
                },
            }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}

export function StaggerItem({
    children,
    className,
    y = MOTION.y,
    duration = 0.6,
    as = 'div',
    ...rest
}) {
    const MotionTag = motion[as] || motion.div;

    return (
        <MotionTag
            className={className}
            variants={{
                hidden: { opacity: 0, y },
                visible: { opacity: 1, y: 0, transition: { duration, ease: EASE_OUT } },
            }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}
