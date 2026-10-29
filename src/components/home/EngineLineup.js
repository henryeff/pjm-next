'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { EASE_OUT, MOTION } from '@/components/motion/Reveal';
import Reveal from '@/components/motion/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import ProductCard from '@/components/ui/ProductCard';
import { seriesHref } from '@/lib/paths';
import styles from './EngineLineup.module.css';

const COPY = {
    id: {
        eyebrow: 'Mesin Tempel Yamaha',
        title: 'Temukan mesin tempel Anda',
        group: 'Jenis mesin',
        all: { four: 'Lihat semua 4 Tak', two: 'Lihat semua 2 Tak' },
    },
    en: {
        eyebrow: 'Yamaha Outboards',
        title: 'Find your outboard',
        group: 'Engine type',
        all: { four: 'View all 4 Strokes', two: 'View all 2 Strokes' },
    },
};

const ORDER = ['four', 'two'];

// The engine cut-out's RENDERED width (not the card's): a square stage, 10% padding, files up to 0.89:1.
// <900px: cards are clamp(240px, 72vw, 320px); 900–1199px: 4 columns; ≥1200px: 4 columns of ~286px.
const CARD_SIZES = '(max-width: 899px) min(52vw, 230px), (max-width: 1199px) 17vw, 210px';

// First reveal: cards rise in with a 0.08s stagger. After a switch: the old list fades/slides out,
// then the new one fades/slides 12px in (0.3s each).
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

/**
 * Home "find your outboard": a 4-stroke / 2-stroke switch over 8 models of each series.
 * BOTH lists are in the server HTML (the inactive one carries the `hidden` attribute), so crawlers
 * and no-JS visitors get links to the 2-stroke models too.
 *
 * lineup: { four: { count, picks }, two: { count, picks } } from the server page (src/app/page.js);
 * picks carry `slug` for the product links.
 */
export default function EngineLineup({ lineup, titleId = 'home-lineup-title' }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const c = COPY[lang];
    const nav = translations[lang].navbar;
    const keys = ORDER.filter((key) => lineup && lineup[key] && lineup[key].picks.length > 0);
    const first = keys[0] || ORDER[0];

    // `series` is the selected option; `shown` is the list on screen. While they differ, the old
    // list plays its exit, and its onAnimationComplete hands over to the new one.
    const [series, setSeries] = useState(first);
    const [shown, setShown] = useState(first);
    const [switched, setSwitched] = useState(false);

    const listWrap = useRef(null);
    const inView = useInView(listWrap, { once: true, amount: 0.15 });

    if (keys.length === 0) return null;

    const labels = { four: nav.fourStrokes, two: nav.twoStrokes };

    const choose = (next) => {
        if (next === series) return;
        setSeries(next);
        setSwitched(true);
    };

    const onListAnimationComplete = (key, definition) => {
        if (definition === 'exit' && key === shown && series !== shown) setShown(series);
    };

    const listId = (key) => `${titleId}-${key}`;

    return (
        <section className={'section section-alt ' + styles.lineup} aria-labelledby={titleId}>
            <div className="container">
                <SectionHeader
                    eyebrow={c.eyebrow}
                    title={c.title}
                    id={titleId}
                    action={{ label: c.all[series], href: seriesHref(series) }}
                />

                <Reveal className={styles.switchRow} delay={0.1}>
                    <div className={styles.switcher} role="group" aria-label={c.group}>
                        {keys.map((key) => {
                            const active = key === series;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    aria-pressed={active}
                                    aria-controls={listId(key)}
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
                                        <span className={styles.count}> · {lineup[key].count}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Reveal>

                <div ref={listWrap} className={styles.listWrap}>
                    {keys.map((key) => {
                        const isShown = key === shown;
                        let animate = 'enter'; // hidden lists wait in their entrance pose
                        if (isShown) {
                            if (series !== shown) animate = 'exit';
                            else if (inView || switched) animate = 'visible';
                            else animate = undefined;
                        }
                        return (
                            <motion.ul
                                key={key}
                                id={listId(key)}
                                aria-label={labels[key]}
                                hidden={!isShown}
                                className={'no-scrollbar ' + styles.list}
                                variants={listVariants}
                                custom={!switched}
                                initial={key === first ? 'hidden' : 'enter'}
                                animate={animate}
                                onAnimationComplete={(definition) => onListAnimationComplete(key, definition)}
                            >
                                {lineup[key].picks.map((product) => (
                                    <motion.li key={product.id} className={styles.item} variants={itemVariants}>
                                        <ProductCard product={product} series={key} sizes={CARD_SIZES} />
                                    </motion.li>
                                ))}
                            </motion.ul>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
