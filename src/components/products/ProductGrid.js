'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { EASE_OUT, MOTION } from '@/components/motion/Reveal';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import Cutout from '@/components/ui/Cutout';
import ProductCard from '@/components/ui/ProductCard';
import { getHp, hpBucket, seriesPath, topModel } from '@/components/ui/productUtils';
import styles from '@/app/products/four-strokes/page.module.css';

const COPY = {
    en: {
        eyebrow: 'Yamaha Outboards',
        title: { four: '4-Stroke Outboards', two: '2-Stroke Outboards' },
        lead: {
            four: "Experience the pinnacle of marine engineering with Yamaha's 4-stroke lineup. Cleaner, Quieter, Stronger.",
            two: 'Proven reliability and easy maintenance. The choice of professionals for decades.',
        },
        typeNav: 'Outboard type',
        models: (n) => n + (n === 1 ? ' model' : ' models'),
        filterLabel: 'Filter by power',
        filters: { all: 'All', small: 'Up to 25 HP', mid: '30–115 HP', large: '150 HP and up' },
        showing: (n, total) => 'Showing ' + n + ' of ' + total + ' models',
        chatQuery: {
            four: 'Help me choose a 4-stroke outboard.',
            two: 'Help me choose a 2-stroke outboard.',
        },
    },
    id: {
        eyebrow: 'Mesin Tempel Yamaha',
        title: { four: 'Mesin Tempel 4 Tak', two: 'Mesin Tempel 2 Tak' },
        lead: {
            four: 'Rasakan puncak rekayasa kelautan dengan jajaran mesin 4 tak Yamaha. Lebih bersih, lebih senyap, lebih bertenaga.',
            two: 'Keandalan teruji dan perawatan mudah. Pilihan para profesional selama puluhan tahun.',
        },
        typeNav: 'Jenis mesin tempel',
        models: (n) => n + ' model',
        filterLabel: 'Saring berdasarkan tenaga',
        filters: { all: 'Semua', small: 'Sampai 25 PK', mid: '30–115 PK', large: '150 PK ke atas' },
        showing: (n, total) => 'Menampilkan ' + n + ' dari ' + total + ' model',
        chatQuery: {
            four: 'Bantu saya memilih mesin tempel 4 tak.',
            two: 'Bantu saya memilih mesin tempel 2 tak.',
        },
    },
};

const FILTERS = ['all', 'small', 'mid', 'large'];

// Filtering: cards leave/enter with opacity + a 0.96 scale; the rest re-flow with a layout animation.
const FILTER_DURATION = 0.25;
const LAYOUT_TRANSITION = { duration: 0.4, ease: EASE_OUT };
const SHOWN = { opacity: 1, y: 0, scale: 1 };
const EXIT = { opacity: 0, scale: 0.96, transition: { duration: FILTER_DURATION, ease: EASE_OUT } };
const PILL_SPRING = { type: 'spring', stiffness: 480, damping: 38 };

// First load: the first row (up to 4 cards) only rises — transform-only, so the LCP engine is never at
// opacity 0 — and the rest rise and fade in. After a chip press, entering cards fade + scale in.
const FIRST_ROW = 4;
const entranceFrom = (filtered, i) => {
    if (filtered) return { opacity: 0, scale: 0.96 };
    if (i < FIRST_ROW) return { y: MOTION.y };
    return { opacity: 0, y: MOTION.y };
};

/**
 * Engine range listing: navy hero (the range's highest-output engine on the right from 1024px) with a
 * 4S / 2S switch, power filter chips + a live model count, and a 2 / 3 / 4-column grid of ProductCards.
 * series: 'four' | 'two'.
 */
export default function ProductGrid({ products = [], series = 'four' }) {
    const { language } = useLanguage();
    const lang = language === 'id' ? 'id' : 'en';
    const c = COPY[lang];
    const nav = translations[lang].navbar;
    const key = series === 'two' ? 'two' : 'four';

    const [filter, setFilter] = useState('all');
    // Becomes true after the first chip press: from then on entering cards scale in instead of rising.
    const [filtered, setFiltered] = useState(false);

    const gridRef = useRef(null);
    const inView = useInView(gridRef, { once: true, amount: 0.05 });

    // Chip row (scrolls sideways on phones): fade the right edge until it is scrolled to the end.
    const chipsRef = useRef(null);
    const [atEnd, setAtEnd] = useState(true);
    useEffect(() => {
        const el = chipsRef.current;
        if (!el) return undefined;
        const update = () => setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
        // Fires once on observe (mount / language switch) and again whenever the row resizes.
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
        if (ro) ro.observe(el);
        else update();
        el.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            if (ro) ro.disconnect();
            el.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, [lang]);

    const items = products.map((product) => ({ product, bucket: hpBucket(getHp(product.name)) }));
    const counts = { all: items.length, small: 0, mid: 0, large: 0 };
    items.forEach((item) => {
        if (item.bucket) counts[item.bucket] += 1;
    });
    const visible = filter === 'all' ? items : items.filter((item) => item.bucket === filter);

    const choose = (next) => {
        if (next === filter) return;
        setFilter(next);
        setFiltered(true);
    };

    const types = [
        { id: 'four', label: nav.fourStrokes, href: seriesPath('four') },
        { id: 'two', label: nav.twoStrokes, href: seriesPath('two') },
    ];

    // Hero figure: the range's highest-output engine (4S: F450A, 2S: 200AET/L200AET) on the navy.
    // Shown from 1024px only (PageHero hides the slot below), so the image stays lazy — phones never fetch it.
    const top = topModel(products);
    const topHp = top ? getHp(top.name) : null;
    const figure = top ? (
        <span className={styles.heroFigure}>
            <span className={styles.heroGlow} />
            {topHp && (
                <motion.span
                    className={'tabular ' + styles.heroWatermark}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.2 }}
                >
                    {topHp}
                </motion.span>
            )}
            {/* Transform-only entrance: the engine rises into place, it is never hidden. */}
            <motion.span
                className={styles.heroEngine}
                initial={{ y: 24 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: EASE_OUT }}
            >
                <Cutout src={top.image} sizes="560px" className={styles.heroCutout} />
            </motion.span>
        </span>
    ) : null;

    return (
        <>
            <PageHero
                size="compact"
                eyebrow={c.eyebrow}
                title={c.title[key]}
                lead={c.lead[key]}
                figure={figure}
            >
                <nav aria-label={c.typeNav} className={styles.segmented}>
                    {types.map((type) => {
                        const active = type.id === key;
                        return (
                            <Link
                                key={type.id}
                                href={type.href}
                                aria-current={active ? 'page' : undefined}
                                className={styles.segment}
                            >
                                {type.label}
                            </Link>
                        );
                    })}
                </nav>
                <p className={styles.heroCount}>{c.models(products.length)}</p>
            </PageHero>

            <section className={'section ' + styles.listing}>
                <div className="container">
                    <div className={styles.filterBar}>
                        <motion.div
                            ref={chipsRef}
                            role="group"
                            aria-label={c.filterLabel}
                            className={'no-scrollbar ' + styles.chips}
                            data-fade={atEnd ? undefined : ''}
                            layoutScroll
                        >
                            {FILTERS.filter((id) => counts[id] > 0).map((id) => {
                                const active = id === filter;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        aria-pressed={active}
                                        className={styles.chip}
                                        onClick={() => choose(id)}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId={'pjm-power-chip-' + key}
                                                className={styles.chipPill}
                                                transition={PILL_SPRING}
                                                aria-hidden="true"
                                            />
                                        )}
                                        <span className={styles.chipLabel}>{c.filters[id]}</span>
                                        <span className={styles.chipCount}>{counts[id]}</span>
                                    </button>
                                );
                            })}
                        </motion.div>

                        {/* Visible from 768px; visually hidden below, so screen readers still hear each change. */}
                        <p className={'tabular ' + styles.count} aria-live="polite" aria-atomic="true">
                            {c.showing(visible.length, items.length)}
                        </p>
                    </div>

                    <ul ref={gridRef} className={styles.grid}>
                        <AnimatePresence mode="popLayout">
                            {visible.map(({ product }, i) => (
                                <motion.li
                                    key={product.id}
                                    layout
                                    className={styles.item}
                                    initial={entranceFrom(filtered, i)}
                                    animate={inView ? SHOWN : undefined}
                                    exit={EXIT}
                                    transition={
                                        filtered
                                            ? { duration: FILTER_DURATION, ease: EASE_OUT, layout: LAYOUT_TRANSITION }
                                            : { duration: 0.6, ease: EASE_OUT, delay: i * 0.06, layout: LAYOUT_TRANSITION }
                                    }
                                >
                                    {/* The first cards fill the phone / tablet first screen (PageHero hides its
                                        figure below 1024px), so their engines are the LCP: preload them. */}
                                    <ProductCard
                                        product={product}
                                        series={key}
                                        headingLevel="h2"
                                        sizes="(max-width: 899px) 48vw, (max-width: 1199px) 31vw, 300px"
                                        priority={!filtered && i < 2}
                                        fetchPriority={!filtered && i === 0 ? 'high' : undefined}
                                    />
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                </div>
            </section>

            <CtaBand chatQuery={c.chatQuery[key]} />
        </>
    );
}
