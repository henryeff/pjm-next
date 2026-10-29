'use client';

import { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT, MOTION } from './Reveal';

// True inside an `immediate` group: its items slide in without fading, so the server HTML shows them.
const ImmediateGroup = createContext(false);

/**
 * Wraps a group of StaggerItem children and reveals them in sequence
 * as the group scrolls into view. Use for grids/lists (cards, features).
 * Pass `immediate` for above-the-fold groups: they animate on mount, transform-only (no opacity 0 in
 * the server HTML — see the rules in Reveal.js).
 * Default trigger: the group's top edge past 88% of the viewport (amount 'some', bottom margin -12%).
 *
 * Once a one-time (`once`) group has revealed, it switches from whileInView to animate="visible".
 * Items that mount later — e.g. children keyed by translated text remounting on an EN/ID switch,
 * or a filtered grid — inherit an `animate` label and rise in on mount, instead of inheriting a
 * whileInView label they can never trigger themselves (which would leave them at opacity 0).
 */
export function StaggerGroup({
    children,
    className,
    stagger = MOTION.stagger,
    delayChildren = 0,
    once = true,
    amount = 'some',
    margin = '0px 0px -12% 0px',
    as = 'div',
    immediate = false,
    onAnimationComplete,
    ...rest
}) {
    const MotionTag = motion[as] || motion.div;
    const [revealed, setRevealed] = useState(false);
    const trigger =
        immediate || revealed
            ? { animate: 'visible' }
            : { whileInView: 'visible', viewport: { once, amount, margin } };

    // Fires after the group and all of its items have finished (variant children are awaited).
    const handleAnimationComplete = (definition) => {
        if (once && definition === 'visible') setRevealed(true);
        if (onAnimationComplete) onAnimationComplete(definition);
    };

    return (
        <ImmediateGroup.Provider value={immediate}>
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
                onAnimationComplete={handleAnimationComplete}
                {...rest}
            >
                {children}
            </MotionTag>
        </ImmediateGroup.Provider>
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
    const immediate = useContext(ImmediateGroup);

    return (
        <MotionTag
            className={className}
            variants={{
                hidden: immediate ? { y } : { opacity: 0, y },
                visible: immediate
                    ? { y: 0, transition: { duration, ease: EASE_OUT } }
                    : { opacity: 1, y: 0, transition: { duration, ease: EASE_OUT } },
            }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}
