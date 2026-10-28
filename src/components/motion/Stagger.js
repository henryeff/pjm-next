'use client';

import { motion } from 'framer-motion';
import { EASE_OUT } from './Reveal';

/**
 * Wraps a group of StaggerItem children and reveals them in sequence
 * as the group scrolls into view. Use for grids/lists (cards, features).
 */
export function StaggerGroup({
    children,
    className,
    stagger = 0.12,
    delayChildren = 0,
    once = true,
    amount = 0.15,
    as = 'div',
    ...rest
}) {
    const MotionTag = motion[as] || motion.div;

    return (
        <MotionTag
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
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
    y = 24,
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
