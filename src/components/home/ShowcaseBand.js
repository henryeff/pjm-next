'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal from '@/components/motion/Reveal';
import useReducedMotionSafe from '@/components/motion/useReducedMotionSafe';
import Eyebrow from '@/components/ui/Eyebrow';
import { ArrowRight } from '@/components/ui/Icons';
import styles from './ShowcaseBand.module.css';

const COPY = {
    en: { eyebrow: 'From 2 Strokes to 4 Strokes' },
    id: { eyebrow: 'Dari 2 Tak hingga 4 Tak' },
};

/** Full-bleed photo band with a slow parallax (±40px) and a glass panel. Static for reduced motion. */
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
            <motion.div className={styles.bg} style={{ y: reduce ? 0 : parallaxY }}>
                <Image
                    src="/images/home1.jpg"
                    alt="Yamaha Outboard Showcase"
                    fill
                    sizes="100vw"
                    className={styles.img}
                />
            </motion.div>
            <div className={styles.scrim} aria-hidden="true" />

            <div className={'container ' + styles.inner}>
                <Reveal className={styles.panel}>
                    <Eyebrow>{c.eyebrow}</Eyebrow>
                    <h2 id={titleId} className={'h2 ' + styles.title}>
                        {t.showcaseTitle}
                    </h2>
                    <p className={styles.text}>{t.showcaseDesc}</p>
                    <Link href="/yamalube" className={'btn btn-ghost ' + styles.cta}>
                        {t.showcaseLink}
                        <ArrowRight className="btn-arrow" />
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
