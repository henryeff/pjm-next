'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback) {
    if (typeof window === 'undefined' || !window.matchMedia) return () => {};
    const mql = window.matchMedia(QUERY);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
}

const getSnapshot = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(QUERY).matches : false);
const getServerSnapshot = () => false;

/**
 * Hydration-safe "prefers reduced motion". Unlike framer-motion's useReducedMotion (which reads
 * matchMedia during the first client render), this returns false while hydrating — matching the
 * server HTML — and then updates. Use it for effects MotionConfig can't switch off, like clip-path.
 */
export default function useReducedMotionSafe() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
