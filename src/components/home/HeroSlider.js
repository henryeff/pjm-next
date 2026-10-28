'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import useReducedMotionSafe from '@/components/motion/useReducedMotionSafe';
import { Pause, Play } from '@/components/ui/Icons';
import styles from './HeroSlider.module.css';

// pos = desktop object-position (engines sit right of the text); posMobile = ≤767px (engines centred).
export const SLIDES = [
    { src: '/images/home2.jpg', pos: '0% 55%', posMobile: '42% 50%' },
    { src: '/images/home3.png', pos: '0% 50%', posMobile: '47% 50%' },
];

// The 2.26:1 photos are cover-cropped: on phones and portrait tablets the rendered width is ~1.5× the
// hero height (see HeroSlider.module.css), so "100vw" would fetch a far too small, blurry file.
const IMAGE_SIZES = '(max-width: 767px) 150vh, (orientation: portrait) 150vh, 100vw';

const SLIDE_INTERVAL = 6000; // ms each slide stays up
const FADE = 1.4; // s crossfade
const KEN_BURNS_SCALE = 1.06;

const COPY = {
    en: {
        slides: 'Slides',
        slide: 'Show slide {n} of {total}',
        pause: 'Pause slideshow',
        play: 'Play slideshow',
    },
    id: {
        slides: 'Slide',
        slide: 'Tampilkan slide {n} dari {total}',
        pause: 'Jeda tayangan',
        play: 'Putar tayangan',
    },
};

const supportsWaapi = () =>
    typeof window !== 'undefined' && typeof window.Animation === 'function' && typeof window.KeyframeEffect === 'function';

/**
 * Full-bleed hero slideshow. Renders the <section> itself so it can pause on hover;
 * the hero markup (scrims + content) is passed as children and sits between the slides and the controls.
 *
 * Timing runs on one Web Animation per slide (the progress bar fill), so pausing freezes the bar,
 * the Ken Burns zoom and the timer together, and resuming continues from the same spot.
 * Paused while: the visitor paused it (persists), a mouse is over the hero, or keyboard focus is on a slide bar.
 * Reduced motion: starts paused, no Ken Burns, static bars (the timer still works if they press play).
 */
export default function HeroSlider({ className, children }) {
    const { language } = useLanguage();
    const t = COPY[language] || COPY.en;
    const reduce = useReducedMotionSafe();

    const [index, setIndex] = useState(0);
    const [run, setRun] = useState(0); // bumps on every slide change, so re-selecting a slide restarts its timer
    const [userPaused, setUserPaused] = useState(null); // null = no choice yet → follows the reduced-motion preference
    const [hovered, setHovered] = useState(false);
    const [keyboardFocus, setKeyboardFocus] = useState(false);

    const isUserPaused = userPaused ?? reduce;
    const paused = isUserPaused || hovered || keyboardFocus;

    const fillRefs = useRef([]);
    const kbRefs = useRef([]);
    const kbAnims = useRef([]);
    const timer = useRef(null);

    const goTo = (i) => {
        setIndex(i);
        setRun((r) => r + 1);
    };

    // Timer + progress bar for the active slide (created idle; the pause effect below starts it).
    useEffect(() => {
        if (!supportsWaapi()) return undefined;
        const fill = reduce ? null : fillRefs.current[index] || null;
        const keyframes = fill ? [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }] : null;
        const anim = new Animation(
            new KeyframeEffect(fill, keyframes, { duration: SLIDE_INTERVAL, easing: 'linear', fill: 'forwards' }),
            document.timeline
        );
        anim.onfinish = () => {
            setIndex((i) => (i + 1) % SLIDES.length);
            setRun((r) => r + 1);
        };
        timer.current = anim;
        return () => {
            anim.onfinish = null;
            anim.cancel();
            if (timer.current === anim) timer.current = null;
        };
    }, [index, run, reduce]);

    // Ken Burns: the active slide zooms 1 → 1.06 over interval + fade. The outgoing slide keeps its zoom while it fades.
    useEffect(() => {
        const anims = kbAnims.current;
        if (reduce || !supportsWaapi()) {
            anims.forEach((a) => a && a.cancel());
            kbAnims.current = [];
            return;
        }
        const el = kbRefs.current[index];
        if (!el || typeof el.animate !== 'function') return;
        if (anims[index]) anims[index].cancel();
        anims[index] = el.animate([{ transform: 'scale(1)' }, { transform: `scale(${KEN_BURNS_SCALE})` }], {
            duration: SLIDE_INTERVAL + FADE * 1000,
            easing: 'linear',
            fill: 'forwards',
        });
    }, [index, run, reduce]);

    // Play / pause everything together. Runs after the effects above (declaration order).
    useEffect(() => {
        const all = [timer.current, ...kbAnims.current].filter(Boolean);
        all.forEach((a) => {
            if (paused) a.pause();
            else if (a.playState !== 'finished') a.play();
        });
    }, [paused, index, run, reduce]);

    // Stop every animation on unmount.
    useEffect(() => {
        const anims = kbAnims;
        return () => anims.current.forEach((a) => a && a.cancel());
    }, []);

    const onPointerEnter = (e) => {
        if (e.pointerType !== 'touch') setHovered(true);
    };
    const onPointerLeave = () => setHovered(false);

    // Keyboard focus on the slide bars pauses (so a slide does not change under the focus ring).
    // Mouse clicks leave focus on a bar without :focus-visible, so they never freeze the slideshow,
    // and focus on the play/pause button does not pause either (pressing Play must visibly play).
    const onBarsFocus = (e) => {
        let visible = true;
        try {
            visible = e.target.matches(':focus-visible');
        } catch {
            visible = true;
        }
        setKeyboardFocus(visible);
    };
    const onBarsBlur = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setKeyboardFocus(false);
    };

    return (
        <section className={className} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
            <div className={styles.slides} aria-hidden="true">
                {SLIDES.map((slide, i) => {
                    const active = i === index;
                    return (
                        <motion.div
                            key={slide.src}
                            className={styles.slide}
                            initial={false}
                            // The incoming slide fades in on top; the outgoing one only hides once it is covered (no dip to dark).
                            animate={{ opacity: active ? 1 : 0 }}
                            transition={active ? { duration: FADE, ease: 'easeInOut' } : { duration: 0, delay: FADE }}
                            style={{ zIndex: active ? 1 : 0 }}
                        >
                            <div
                                ref={(el) => {
                                    kbRefs.current[i] = el;
                                }}
                                className={styles.kb}
                                style={{ '--pos': slide.pos, '--pos-m': slide.posMobile }}
                            >
                                <Image
                                    src={slide.src}
                                    alt=""
                                    fill
                                    priority={i === 0}
                                    sizes={IMAGE_SIZES}
                                    className={styles.image}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {children}

            <div className={styles.controls}>
                <div className={styles.bars} role="group" aria-label={t.slides} onFocus={onBarsFocus} onBlur={onBarsBlur}>
                    {SLIDES.map((slide, i) => {
                        const active = i === index;
                        return (
                            <button
                                key={slide.src}
                                type="button"
                                className={styles.bar}
                                aria-label={t.slide.replace('{n}', i + 1).replace('{total}', SLIDES.length)}
                                aria-current={active ? 'true' : undefined}
                                onClick={() => goTo(i)}
                            >
                                <span className={styles.track} aria-hidden="true">
                                    <span
                                        ref={(el) => {
                                            fillRefs.current[i] = el;
                                        }}
                                        className={styles.fill + (active && reduce ? ' ' + styles.fillFull : '')}
                                    />
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    className={styles.toggle}
                    aria-label={isUserPaused ? t.play : t.pause}
                    onClick={() => setUserPaused(!isUserPaused)}
                >
                    {isUserPaused ? <Play size={16} /> : <Pause size={16} />}
                </button>
            </div>
        </section>
    );
}
