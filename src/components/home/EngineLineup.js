'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { EASE_OUT, MOTION } from '@/components/motion/Reveal';
import Reveal from '@/components/motion/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import ProductCard from '@/components/ui/ProductCard';
import { seriesPath } from '@/components/ui/productUtils';
import fourStrokes from '@/data/four-strokes.json';
import twoStrokes from '@/data/two-strokes.json';
import styles from './EngineLineup.module.css';

const COPY = {
    en: {
        eyebrow: 'Yamaha Outboards',
        title: 'Find your outboard',
        group: 'Engine type',
        all: { four: 'View all 4 Strokes', two: 'View all 2 Strokes' },
    },
    id: {
        eyebrow: 'Mesin Tempel Yamaha',
        title: 'Temukan mesin tempel Anda',
        group: 'Jenis mesin',
        all: { four: 'Lihat semua 4 Tak', two: 'Lihat semua 2 Tak' },
    },
};

const PICKS = 8;

/** An even spread of `count` models across the range, smallest to largest: indices round(i * (n - 1) / (count - 1)). */
function spread(list, count = PICKS) {
    const n = list.length;
    if (n <= count) return list;
    const seen = new Set();
    const out = [];
    for (let i = 0; i < count; i++) {
        const idx = Math.round((i * (n - 1)) / (count - 1));
        if (!seen.has(idx)) {
            seen.add(idx);
            out.push(list[idx]);
        }
    }
    return out;
}

const SERIES = {
    four: { all: fourStrokes, picks: spread(fourStrokes) },
    two: { all: twoStrokes, picks: spread(twoStrokes) },
};

const ORDER = ['four', 'two'];

// First reveal: cards rise in with a 0.08s stagger. After a switch: the whole list fades/slides 12px in 0.3s.
const listVariants = {
    hidden: { opacity: 1, y: 0 },
    enter: { opacity: 0, y: 12 },
    visible: (staggered) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: EASE_OUT,
            staggerChildren: staggered ? MOTION.stagger : 0,
        },
    }),
    exit: { opacity: 0, y: 12, transition: { duration: 0.3, ease: EASE_OUT } },
};

const itemVariants = {
    hidden: { opacity: 0, y: MOTION.y },
    enter: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export default function EngineLineup({ titleId = 'home-lineup-title' }) {
    const { language } = useLanguage();
    const c = COPY[language] || COPY.en;
    const nav = translations[language].navbar;

    const [series, setSeries] = useState('four');
    const [switched, setSwitched] = useState(false);

    const listWrap = useRef(null);
    const inView = useInView(listWrap, { once: true, amount: 0.15 });

    const labels = { four: nav.fourStrokes, two: nav.twoStrokes };
    const picks = SERIES[series].picks;

    const choose = (next) => {
        if (next === series) return;
        setSeries(next);
        setSwitched(true);
    };

    return (
        <section className={'section section-alt ' + styles.lineup} aria-labelledby={titleId}>
            <div className="container">
                <SectionHeader
                    eyebrow={c.eyebrow}
                    title={c.title}
                    id={titleId}
                    action={{ label: c.all[series], href: seriesPath(series) }}
                />

                <Reveal className={styles.switchRow} delay={0.1}>
                    <div className={styles.switcher} role="group" aria-label={c.group}>
                        {ORDER.map((key) => {
                            const active = key === series;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    aria-pressed={active}
                                    className={styles.option + (active ? ' ' + styles.optionActive : '')}
                                    onClick={() => choose(key)}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="home-lineup-pill"
                                            className={styles.pill}
                                            transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className={styles.optionText}>
                                        {labels[key]}
                                        <span className={styles.count}> · {SERIES[key].all.length}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Reveal>

                <div ref={listWrap} className={styles.listWrap}>
                    <AnimatePresence mode="wait">
                        <motion.ul
                            key={series}
                            className={'no-scrollbar ' + styles.list}
                            variants={listVariants}
                            custom={!switched}
                            initial={switched ? 'enter' : 'hidden'}
                            animate={inView || switched ? 'visible' : undefined}
                            exit="exit"
                        >
                            {picks.map((product) => (
                                <motion.li key={product.id} className={styles.item} variants={itemVariants}>
                                    <ProductCard
                                        product={product}
                                        series={series}
                                        sizes="(max-width: 899px) min(72vw, 320px), (max-width: 1199px) 23vw, 300px"
                                    />
                                </motion.li>
                            ))}
                        </motion.ul>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
