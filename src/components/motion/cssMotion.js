// Server-safe helpers for the CSS first-paint entrances in motion.module.css (no 'use client',
// so server components can use them too). Reveal.js re-exports both.

import m from './motion.module.css';

/** CSS class names for the first-paint entrances: { rise, line, draw, settle }. */
export const motionClasses = m;

const round = (n) => Math.round(Number(n) * 1000) / 1000;

/** Inline custom properties for the CSS entrances: --m-y, --m-delay, --m-dur, --m-scale. */
export function cssMotionVars({ y, delay, duration, scale } = {}) {
    const vars = {};
    if (y !== undefined && y !== null) vars['--m-y'] = typeof y === 'number' ? `${y}px` : y;
    if (delay) vars['--m-delay'] = `${round(delay)}s`;
    if (duration !== undefined && duration !== null) vars['--m-dur'] = `${round(duration)}s`;
    if (scale !== undefined && scale !== null) vars['--m-scale'] = String(scale);
    return vars;
}
