'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal from '@/components/motion/Reveal';
import useReducedMotionSafe from '@/components/motion/useReducedMotionSafe';
import ContourLines from '@/components/ui/ContourLines';
import Eyebrow from '@/components/ui/Eyebrow';
import { ArrowRight } from '@/components/ui/Icons';
import styles from './ShowcaseBand.module.css';

const COPY = {
    en: { eyebrow: 'From 2 Strokes to 4 Strokes' },
    id: { eyebrow: 'Dari 2 Tak hingga 4 Tak' },
};

/**
 * Editorial split band: a solid navy copy column (static contour lines) beside a full-height photo with a
 * slow ±40px parallax. ≥1024px the copy sits left, its text on the site container's left edge; below that the
 * photo comes first and fades into the navy copy. Static for reduced motion.
 */
export default function ShowcaseBand({ titleId = 'home-showcase-title' }) {
    const { language } = useLanguage();
    const t = translations[language].home;
    const c = COPY[language] || COPY.en;
    const reduce = useReducedMotionSafe();

    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
    const parallaxY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

    return (
        <section ref={sectionRef} className={'on-dark ' + styles.band} aria-labelledby={titleId}>
            <div className={styles.copy}>
                <ContourLines />
                <Reveal className={styles.copyInner}>
                    <Eyebrow>{c.eyebrow}</Eyebrow>
                    <h2 id={titleId} className={'display ' + styles.title}>
                        {t.showcaseTitle}
                    </h2>
                    <p className={styles.text}>{t.showcaseDesc}</p>
                    <div className={styles.actions}>
                        <Link href="/products/four-strokes" className={'btn btn-ghost btn-lg ' + styles.primaryAction}>
                            {t.btn4Stroke}
                            <ArrowRight className="btn-arrow" />
                        </Link>
                        <Link href="/products/two-strokes" className="btn btn-link">
                            {t.btn2Stroke}
                            <ArrowRight className="btn-arrow" />
                        </Link>
                    </div>
                </Reveal>
            </div>

            {/* Photo column (decorative layout; the image keeps its alt). Placed first below 1024px via CSS order. */}
            <div className={styles.media}>
                <motion.div className={styles.bg} style={{ y: reduce ? 0 : parallaxY }}>
                    <Image
                        src="/images/showcase-perahu.jpg"
                        alt={language === 'id' ? 'Perahu kayu melaju di laut lepas pantai Padang' : 'Wooden fishing boat running off the Padang coast'}
                        fill
                        sizes="(min-width: 1024px) 80vw, (min-width: 640px) 100vw, 135vw"
                        className={styles.img}
                    />
                </motion.div>
            </div>
        </section>
    );
}
