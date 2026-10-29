'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal, { EASE_OUT, MOTION } from '@/components/motion/Reveal';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import Cutout from '@/components/ui/Cutout';
import ProductCard from '@/components/ui/ProductCard';
import { ArrowRight } from '@/components/ui/Icons';
import SectionHeader from '@/components/ui/SectionHeader';
import { getHp, hpBucket, hpRange, seriesPath, topModel } from '@/components/ui/productUtils';
import { productHref } from '@/lib/paths';
import { HOURS, PRICE_NOTE, SERVICE, waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import styles from '@/app/products/four-strokes/page.module.css';

// Indonesian first (the server-rendered language). Range figures come from the data (hpRange).
const COPY = {
    id: {
        eyebrow: 'Dealer resmi Yamaha Marine · Padang',
        title: { four: 'Mesin Tempel Yamaha 4 Tak', two: 'Mesin Tempel Yamaha 2 Tak' },
        lead: {
            four: (r) =>
                `Jajaran mesin tempel Yamaha 4 tak${r ? ` dari ${r.min} sampai ${r.max} PK` : ''} di Perkasa Jaya Marine, Padang. Lebih bersih, lebih senyap, lebih bertenaga.`,
            two: (r) =>
                `Jajaran mesin tempel Yamaha 2 tak${r ? ` dari ${r.min} sampai ${r.max} PK` : ''} di Perkasa Jaya Marine, Padang. Keandalan teruji dan perawatan mudah.`,
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
        about: {
            eyebrow: 'Panduan singkat',
            title: { four: 'Tentang mesin tempel Yamaha 4 tak', two: 'Tentang mesin tempel Yamaha 2 tak' },
            intro: (n, r, strokes) =>
                `Perkasa Jaya Marine adalah dealer resmi Yamaha Marine di Padang, Sumatera Barat. Di halaman ini ada ${n} model mesin tempel Yamaha ${strokes} tak${r ? `, dari ${r.min} PK sampai ${r.max} PK` : ''}. Setiap model punya halaman sendiri dengan spesifikasi lengkap: tipe mesin, volume silinder, berat, konsumsi BBM, sistem starter, kemudi dan tinggi transom.`,
            oil: {
                four: 'Pada mesin tempel 4 tak, oli mesin tidak dicampur dengan bensin: oli berada di dalam mesin (sistem wet sump). Oli yang sesuai:',
                two: 'Mesin tempel 2 tak di halaman ini memakai pelumasan campur (pre-mix): oli 2 tak dicampur dengan bensin. Oli yang sesuai:',
            },
            oilLink: { four: 'Yamalube 4 Tak', two: 'Yamalube 2 Tak' },
            price: 'Harga tidak dicantumkan di situs ini.',
            priceVia: 'lewat WhatsApp',
            priceOr: 'atau telepon salah satu toko kami',
            service: SERVICE.summary.id,
            serviceLink: 'Servis & bengkel',
            partsLink: 'Suku cadang asli Yamaha',
            groupsTitle: 'Pilih berdasarkan tenaga',
            guidesTitle: 'Panduan terkait',
        },
    },
    en: {
        eyebrow: 'Authorized Yamaha Marine dealer · Padang',
        title: { four: 'Yamaha 4-Stroke Outboards', two: 'Yamaha 2-Stroke Outboards' },
        lead: {
            four: (r) =>
                `The Yamaha 4-stroke outboard range${r ? ` from ${r.min} to ${r.max} HP` : ''} at Perkasa Jaya Marine, Padang. Cleaner, quieter, stronger.`,
            two: (r) =>
                `The Yamaha 2-stroke outboard range${r ? ` from ${r.min} to ${r.max} HP` : ''} at Perkasa Jaya Marine, Padang. Proven reliability and easy maintenance.`,
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
        about: {
            eyebrow: 'Quick guide',
            title: { four: 'About Yamaha 4-stroke outboards', two: 'About Yamaha 2-stroke outboards' },
            intro: (n, r, strokes) =>
                `Perkasa Jaya Marine is an authorized Yamaha Marine dealer in Padang, West Sumatra. This page lists ${n} Yamaha ${strokes}-stroke outboard ${n === 1 ? 'model' : 'models'}${r ? `, from ${r.min} HP to ${r.max} HP` : ''}. Each model has its own page with full specifications: engine type, displacement, weight, fuel consumption, starter, steering and transom height.`,
            oil: {
                four: 'In a 4-stroke outboard the engine oil is not mixed with the fuel: it stays inside the engine (wet sump). Matching oil:',
                two: 'The 2-stroke outboards on this page use pre-mix lubrication: 2-stroke oil is mixed with the fuel. Matching oil:',
            },
            oilLink: { four: 'Yamalube 4-Stroke', two: 'Yamalube 2-Stroke' },
            price: 'Prices are not listed on the site.',
            priceVia: 'on WhatsApp',
            priceOr: 'or call one of our stores',
            service: SERVICE.summary.en,
            serviceLink: 'Service & workshop',
            partsLink: 'Yamaha genuine parts',
            groupsTitle: 'Choose by power',
            guidesTitle: 'Related guides (in Indonesian)',
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
 * breadcrumb and a 4S / 2S switch, power filter chips + a live model count, a 2 / 3 / 4-column grid of
 * ProductCards, then a short guide (range, lubrication, price policy, service, models by power, guides).
 * series: 'four' | 'two'. products: [{ id, slug, name, image, tipeMesin }] (slug → model-name URLs).
 * guides: [{ href, title }] related articles (resolved on the server).
 */
export default function ProductGrid({ products = [], series = 'four', guides = [] }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
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

    // Same trail as the BreadcrumbList JSON-LD: Beranda › 4 Tak.
    const crumbs = [{ label: nav.home, href: '/' }, { label: key === 'two' ? nav.twoStrokes : nav.fourStrokes }];
    const range = hpRange(products);
    const strokes = key === 'two' ? 2 : 4;
    const a = c.about;
    // Models by power, in the same buckets as the filter chips, each labelled with its real range from the
    // data ('30–85 PK' for the 2-stroke mid group, where the chip just says '30–115').
    const unit = lang === 'en' ? 'HP' : 'PK';
    const groups = FILTERS.filter((id) => id !== 'all')
        .map((id) => {
            const groupItems = items.filter((item) => item.bucket === id);
            const r = hpRange(groupItems.map((item) => item.product));
            const label = !r ? c.filters[id] : r.min === r.max ? `${r.min} ${unit}` : `${r.min}–${r.max} ${unit}`;
            return { id, label, items: groupItems };
        })
        .filter((group) => group.items.length > 0);
    const seriesName = key === 'two' ? 'mesin tempel Yamaha 2 tak' : 'mesin tempel Yamaha 4 tak';
    // WhatsApp prefilled with a price question about this range.
    const priceText = WA_TEXT.price[lang](
        lang === 'en' ? (key === 'two' ? 'a Yamaha 2-stroke outboard' : 'a Yamaha 4-stroke outboard') : seriesName
    );

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
                    aria-hidden="true"
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
                breadcrumbs={crumbs}
                eyebrow={c.eyebrow}
                title={c.title[key]}
                lead={c.lead[key](range)}
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
                                    {/* sizes = the rendered ENGINE (~0.6 × the card): cards are ~46vw to 899px
                                        (2 columns), ~31vw to 1199px (3), ≤286px from 1200px (4). */}
                                    <ProductCard
                                        product={product}
                                        series={key}
                                        headingLevel="h2"
                                        sizes="(max-width: 899px) 28vw, (max-width: 1199px) 20vw, 172px"
                                        priority={!filtered && i < 2}
                                        fetchPriority={!filtered && i === 0 ? 'high' : undefined}
                                    />
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                </div>
            </section>

            {/* ---- Short guide: server-rendered text for buyers, search and AI (facts from the data and lib/site) ---- */}
            <section className="section section-alt" aria-labelledby="range-about-title">
                <div className="container">
                    <SectionHeader eyebrow={a.eyebrow} title={a.title[key]} id="range-about-title" />
                    <div className={styles.aboutGrid}>
                        <Reveal className={styles.prose}>
                            <p>{a.intro(products.length, range, strokes)}</p>
                            <p>
                                {a.oil[key]}{' '}
                                <Link href={key === 'two' ? '/yamalube#yamalube-2t' : '/yamalube#yamalube-4t'}>
                                    {a.oilLink[key]}
                                </Link>
                                .
                            </p>
                            <p>
                                {a.price} {PRICE_NOTE[lang]} {a.priceVia}{' '}
                                <a href={waLink(priceText)} target="_blank" rel="noopener noreferrer">
                                    {WHATSAPP.display}
                                </a>{' '}
                                {a.priceOr} ({HOURS.text[lang]}).
                            </p>
                            <p>
                                {a.service} <Link href="/servis">{a.serviceLink}</Link> ·{' '}
                                <Link href="/parts">{a.partsLink}</Link>
                            </p>
                        </Reveal>

                        <Reveal className={styles.aside} delay={0.1}>
                            <h3 className={styles.asideTitle}>{a.groupsTitle}</h3>
                            <dl className={styles.groups}>
                                {groups.map((group) => (
                                    <div key={group.id} className={styles.group}>
                                        <dt>{group.label}</dt>
                                        <dd>
                                            <ul className={styles.groupList}>
                                                {group.items.map(({ product }) => (
                                                    <li key={product.id}>
                                                        <Link href={productHref(key, product)}>{product.name}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            {guides.length > 0 && (
                                <>
                                    <h3 className={styles.asideTitle}>{a.guidesTitle}</h3>
                                    <ul className={styles.guideList}>
                                        {guides.map((guide) => (
                                            <li key={guide.href}>
                                                <Link href={guide.href}>
                                                    {guide.title}
                                                    <ArrowRight size={16} className={styles.guideArrow} />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </Reveal>
                    </div>
                </div>
            </section>

            <CtaBand chatQuery={c.chatQuery[key]} waText={priceText} />
        </>
    );
}
