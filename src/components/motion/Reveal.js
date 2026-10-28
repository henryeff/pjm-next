'use client';

/*
 * MOTION LANGUAGE — Perkasa Jaya Marine ("Deep water, precise engineering")
 * ---------------------------------------------------------------------------
 * - One easing everywhere: EASE_OUT [0.16, 1, 0.3, 1] (CSS: var(--ease-out)).
 * - Sections rise 24px and fade in over 0.7s, once (never replay on scroll back).
 * - Grids stagger their children at 0.08s (StaggerGroup / StaggerItem).
 * - Red kicker rules draw in: scaleX 0 → 1 over 0.6s (KickerLine / Eyebrow).
 * - Editorial images reveal with a clip-path wipe plus a gentle 1.08 → 1 settle (ImageReveal).
 * - Hover: cards lift 4px, images scale to 1.04 over 0.7s, arrows nudge 4px — only inside
 *   @media (hover: hover).
 * - Only the home hero loops (slides), and it always has a pause control.
 * - The h1 / LCP text never starts at opacity 0 (it may slide, never fade from nothing).
 * - Above-the-fold content uses `immediate` (animate on mount) instead of waiting for in-view.
 * - MotionConfig reducedMotion="user" (Providers.js) turns transform animations off for visitors
 *   who ask for reduced motion; non-transform effects (clip-path) opt out explicitly.
 */

import { motion } from 'framer-motion';

// Shared easing for a refined, physical feel across the site.
export const EASE_OUT = [0.16, 1, 0.3, 1];

// Shared motion constants so every area moves the same way.
export const MOTION = { y: 24, duration: 0.7, stagger: 0.08, hoverLift: -4 };

/**
 * Fades and slides an element into view as it scrolls into the viewport.
 * Animates once by default so it never replays while scrolling up/down.
 * Pass `immediate` for above-the-fold content: it animates on mount instead of in view.
 */
export default function Reveal({
    children,
    className,
    delay = 0,
    y = MOTION.y,
    duration = MOTION.duration,
    once = true,
    amount = 0.2,
    as = 'div',
    immediate = false,
    ...rest
}) {
    const MotionTag = motion[as] || motion.div;
    const trigger = immediate
        ? { animate: { opacity: 1, y: 0 } }
        : { whileInView: { opacity: 1, y: 0 }, viewport: { once, amount } };

    return (
        <MotionTag
            className={className}
            initial={{ opacity: 0, y }}
            {...trigger}
            transition={{ duration, delay, ease: EASE_OUT }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}
