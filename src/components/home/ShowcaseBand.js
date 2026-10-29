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
import { seriesHref } from '@/lib/paths';
import styles from './ShowcaseBand.module.css';

const COPY = {
    id: {
        eyebrow: 'Dari 2 Tak hingga 4 Tak',
        unit: 'PK',
        // e.g. 'Dari 16 model mesin tempel 2 tak (4–200 PK) hingga 14 model 4 tak (9,9–450 PK): …'
        desc: (two, four) =>
            `Dari ${two.count} model mesin tempel 2 tak (${two.range}) hingga ${four.count} model 4 tak (${four.range}): kami bantu memilih mesin Yamaha yang sesuai dengan perahu dan kebutuhan Anda.`,
        alt: 'Perahu nelayan kayu melaju menembus ombak di laut lepas',
    },
    en: {
        eyebrow: 'From 2 Strokes to 4 Strokes',
        unit: 'HP',
        desc: (two, four) =>
            `From ${two.count} 2-stroke models (${two.range}) to ${four.count} 4-stroke models (${four.range}): we'll help you choose the Yamaha engine that suits your boat and the way you use it.`,
        alt: 'Wooden fishing boat running through the waves at sea',
    },
};

/** '4–200 PK' / '9,9–450 PK' (ID decimal comma) or '9.9–450 HP' (EN); null without data. */
function rangeText(range, lang, unit) {
    if (!range || !range.hp) return null;
    const fmt = (n) => (lang === 'id' ? String(n).replace('.', ',') : String(n));
    return `${fmt(range.hp.min)}–${fmt(range.hp.max)} ${unit}`;
}

/**
 * ranges: { two: { count, hp: { min, max } }, four: {…} } from the server page (the catalogue data).
 *
 * Editorial split band: a solid navy copy column (static contour lines) beside a full-height photo with a
 * slow ±40px parallax. ≥1024px the copy sits left, its text on the site container's left edge; below that the
 * photo comes first and fades into the navy copy. Static for reduced motion.
 */
export default function ShowcaseBand({ ranges, titleId = 'home-showcase-title' }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const t = translations[lang].home;
    const c = COPY[lang];

    const two = rangeText(ranges && ranges.two, lang, c.unit);
    const four = rangeText(ranges && ranges.four, lang, c.unit);
    const desc =
        two && four
            ? c.desc({ count: ranges.two.count, range: two }, { count: ranges.four.count, range: four })
            : t.showcaseDesc;
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
                    <p className={styles.text}>{desc}</p>
                    <div className={styles.actions}>
                        <Link href={seriesHref('four')} className={'btn btn-ghost btn-lg ' + styles.primaryAction}>
                            {t.btn4Stroke}
                            <ArrowRight className="btn-arrow" />
                        </Link>
                        <Link href={seriesHref('two')} className="btn btn-link">
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
                        alt={c.alt}
                        fill
                        sizes="(min-width: 1024px) 80vw, (min-width: 640px) 100vw, 135vw"
                        className={styles.img}
                    />
                </motion.div>
            </div>
        </section>
    );
}
