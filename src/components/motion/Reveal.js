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
 * - The home hero's bottom-rail scroll cue is the only other loop: pure CSS, and off for reduced motion.
 * - Numbered rails (Why Yamaha, How to get the right part): each hairline draws scaleX 0 → 1 over 0.8s,
 *   staggered 0.1s.
 * - ContourLines (the bathymetric signature on navy surfaces without a photo) are static — never animated.
 * - In-view trigger: top edge past 88% of the viewport (amount some, bottom margin -12%).
 * - MotionConfig reducedMotion="user" (Providers.js) turns transform animations off for visitors
 *   who ask for reduced motion; non-transform effects (clip-path) opt out explicitly.
 *
 * SERVER HTML / HYDRATION / LCP RULES
 * ---------------------------------------------------------------------------
 * - Everything above the fold must be VISIBLE IN THE SERVER HTML. Crawlers, AI bots and slow phones
 *   see the page before (or without) JavaScript, and LCP must not wait for hydration.
 * - Above-the-fold content uses `immediate` (Reveal, StaggerGroup, Eyebrow/KickerLine, ImageReveal)
 *   and PageHero / LineReveal. These entrances are TRANSFORM-ONLY (never opacity 0):
 *     · Reveal / KickerLine / ImageReveal `immediate`, LineReveal and PageHero use CSS keyframes
 *       (motion.module.css) that start with the first paint, no JS needed, and never restart on hydration.
 *     · StaggerGroup `immediate` keeps Framer Motion but its items only slide (no fade), so the server
 *       HTML shows them at full opacity.
 * - The h1 / LCP text never starts at opacity 0 (it may slide, never fade from nothing).
 * - LCP images use a transform-only entrance (scale settle), never opacity or a clip-path wipe.
 * - Below-the-fold reveals (default whileInView) keep the fade + rise. Their text is still in the HTML
 *   (crawlers read it); the root layout adds a <noscript> style that shows them when JS is off.
 */

import { motion } from 'framer-motion';
import m from './motion.module.css';
import { cssMotionVars } from './cssMotion';

export { cssMotionVars, motionClasses } from './cssMotion';

// Shared easing for a refined, physical feel across the site.
export const EASE_OUT = [0.16, 1, 0.3, 1];

// Shared motion constants so every area moves the same way.
export const MOTION = { y: 24, duration: 0.7, stagger: 0.08, hoverLift: -4 };

/**
 * Slides (and, below the fold, fades) an element into view.
 * Default: animates once when it scrolls into view (fade + rise; text stays in the HTML).
 * The default trigger fires as soon as the block's top edge passes 88% of the viewport height,
 * however tall the block is (a fractional `amount` could never be met by a block taller than the screen).
 *
 * `immediate` (above the fold): a CSS rise that starts at first paint — transform only, fully visible
 * in the server HTML. Framer-only props (initial, animate, variants…) are ignored in this mode.
 */
export default function Reveal({
    children,
    className,
    delay = 0,
    y = MOTION.y,
    duration = MOTION.duration,
    once = true,
    amount = 'some',
    margin = '0px 0px -12% 0px',
    as = 'div',
    immediate = false,
    ...rest
}) {
    if (immediate) {
        const {
            initial: _initial,
            animate: _animate,
            exit: _exit,
            variants: _variants,
            transition: _transition,
            whileInView: _whileInView,
            whileHover: _whileHover,
            whileTap: _whileTap,
            viewport: _viewport,
            layout: _layout,
            layoutId: _layoutId,
            onAnimationComplete: _onAnimationComplete,
            style,
            ...domProps
        } = rest;
        const Tag = as;
        return (
            <Tag
                className={className ? `${m.rise} ${className}` : m.rise}
                style={{ ...cssMotionVars({ y, delay, duration }), ...style }}
                {...domProps}
            >
                {children}
            </Tag>
        );
    }

    const MotionTag = motion[as] || motion.div;
    return (
        <MotionTag
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, amount, margin }}
            transition={{ duration, delay, ease: EASE_OUT }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}
