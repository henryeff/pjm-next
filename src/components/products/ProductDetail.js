'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal, { EASE_OUT } from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import Eyebrow from '@/components/ui/Eyebrow';
import SectionHeader from '@/components/ui/SectionHeader';
import CtaBand from '@/components/ui/CtaBand';
import Cutout from '@/components/ui/Cutout';
import ProductCard from '@/components/ui/ProductCard';
import { ArrowRight, Chat, Phone } from '@/components/ui/Icons';
import { formatSpec, getHp, seriesPath } from '@/components/ui/productUtils';
import { MAIN_STORE, STORES } from '@/components/ui/stores';
import styles from '@/app/products/four-strokes/[id]/page.module.css';

// Spec keys in display order, with their labels.
const SPEC_KEYS = [
    'tipeMesin',
    'volume',
    'diameter',
    'jangkauan',
    'kompresi',
    'sistemInduksi',
    'pengapian',
    'konsumsibb',
    'gigi',
    'pelumas',
    'trim',
    'starter',
    'kemudi',
    'berat',
    'transom',
];

const SPEC_LABELS = {
    en: {
        tipeMesin: 'Engine Type',
        volume: 'Displacement',
        diameter: 'Bore x Stroke',
        jangkauan: 'Max RPM',
        kompresi: 'Compression Ratio',
        sistemInduksi: 'Induction System',
        pengapian: 'Ignition System',
        konsumsibb: 'Fuel Consumption',
        gigi: 'Gear Ratio',
        pelumas: 'Lubrication',
        trim: 'Trim System',
        starter: 'Starter System',
        kemudi: 'Steering',
        berat: 'Weight',
        transom: 'Transom Height',
    },
    id: {
        tipeMesin: 'Tipe Mesin',
        volume: 'Volume Silinder',
        diameter: 'Diameter x Langkah',
        jangkauan: 'Putaran Maks.',
        kompresi: 'Rasio Kompresi',
        sistemInduksi: 'Sistem Induksi',
        pengapian: 'Sistem Pengapian',
        konsumsibb: 'Konsumsi BBM',
        gigi: 'Rasio Gigi',
        pelumas: 'Pelumasan',
        trim: 'Sistem Trim',
        starter: 'Sistem Starter',
        kemudi: 'Kemudi',
        berat: 'Berat',
        transom: 'Tinggi Transom',
    },
};

// The headline stats: the first four of these that have a value.
const STAT_KEYS = ['volume', 'berat', 'jangkauan', 'konsumsibb', 'diameter', 'kompresi'];

const COPY = {
    en: {
        eyebrow: { four: 'Yamaha 4-Stroke Outboard', two: 'Yamaha 2-Stroke Outboard' },
        unit: 'HP',
        ask: 'Ask about this engine',
        askQuery: (name) => "I'd like to know more about the Yamaha " + name + '.',
        call: 'Call',
        or: 'or',
        findStore: 'Find a store',
        specsEyebrow: 'Specifications',
        specsTitle: 'Full specifications',
        pager: 'More models',
        all: { four: 'View all 4 Strokes', two: 'View all 2 Strokes' },
    },
    id: {
        eyebrow: { four: 'Mesin Tempel Yamaha 4 Tak', two: 'Mesin Tempel Yamaha 2 Tak' },
        unit: 'PK',
        ask: 'Tanya tentang mesin ini',
        askQuery: (name) => 'Saya ingin tahu lebih lanjut tentang Yamaha ' + name + '.',
        call: 'Telepon',
        or: 'atau',
        findStore: 'Cari toko',
        specsEyebrow: 'Spesifikasi',
        specsTitle: 'Spesifikasi lengkap',
        pager: 'Model lainnya',
        all: { four: 'Lihat semua 4 Tak', two: 'Lihat semua 2 Tak' },
    },
};

const hasValue = (v) => v !== undefined && v !== null && String(v).trim() !== '';

// A trailing '-NNPK' (power in PK) is set apart from the model code: 'F300BET/FL300BET-300PK'.
const SUFFIX_RE = /-(\d+(?:\.\d+)?PK)$/i;

/**
 * { main, suffix } — suffix keeps its '-' so main + suffix === name ('FT9.9LMHL' + '-9.9PK').
 * Names without the pattern ('F250', 'F300D') get an empty suffix.
 */
function splitName(name) {
    const full = String(name ?? '');
    const m = full.match(SUFFIX_RE);
    if (!m) return { main: full, suffix: '' };
    return { main: full.slice(0, m.index), suffix: full.slice(m.index) };
}

/** Length of the longest '/'-separated segment of the main code (sizes the title to its column). */
function longestSegment(name) {
    return splitName(name)
        .main.split('/')
        .reduce((max, seg) => Math.max(max, seg.length), 0);
}

/**
 * The title's model code, never broken mid-code: each '/'-separated segment is unbreakable and the only
 * wrap point is after a '/'. The '-NNPK' suffix becomes a small spec tag under the code; its '-' is kept
 * (visually hidden), so the h1's textContent still equals the full name.
 */
function ModelName({ name }) {
    const { main, suffix } = splitName(name);
    return (
        <>
            {main.split('/').map((seg, i) => (
                <Fragment key={i}>
                    {i > 0 && (
                        <>
                            /<wbr />
                        </>
                    )}
                    <span className={styles.seg}>{seg}</span>
                </Fragment>
            ))}
            {suffix && (
                <span className={styles.suffix}>
                    <span className="visually-hidden">-</span>
                    {suffix.slice(1)}
                </span>
            )}
        </>
    );
}

// The scrolled navbar's height (Navbar.module.css): the hero buttons count as gone once they slip under it.
const SCROLLED_NAV_H = 68;
// Stretches an observer's root far past one edge of the viewport, so each target has a single boundary
// ('scrolled past' / 'reached'). A plain viewport root misses jumps that skip over a target entirely
// (a fast fling, scroll restoration on Back, an anchor link): no intersection change, no callback.
const FAR = '100000px';

/**
 * Phone action bar visibility: shown once the hero CTAs have scrolled up out of view (under the navbar),
 * hidden again once the closing CtaBand (endRef) or the site footer reaches the screen — both carry their
 * own chat / call actions. Observers only; nothing runs on scroll.
 */
function useActionBar(ctasRef, endRef) {
    const [ctasPassed, setCtasPassed] = useState(false);
    const [endInView, setEndInView] = useState(false);

    useEffect(() => {
        const ctas = ctasRef.current;
        if (!ctas || typeof IntersectionObserver === 'undefined') return undefined;
        // Root: from the navbar's bottom edge down to far below the page, so 'not intersecting' = above it.
        const io = new IntersectionObserver(
            ([entry]) => {
                const top = entry.rootBounds ? entry.rootBounds.top : 0;
                setCtasPassed(!entry.isIntersecting && entry.boundingClientRect.top < top);
            },
            { rootMargin: '-' + SCROLLED_NAV_H + 'px 0px ' + FAR + ' 0px' }
        );
        io.observe(ctas);
        return () => io.disconnect();
    }, [ctasRef]);

    useEffect(() => {
        const targets = [endRef.current, document.querySelector('footer')].filter(Boolean);
        if (targets.length === 0 || typeof IntersectionObserver === 'undefined') return undefined;
        // Root: from far above the page down to the viewport's bottom edge, so 'intersecting' = on screen
        // or already scrolled past (the band and footer close the page, so past still means 'at the end').
        const reached = new Set();
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) reached.add(entry.target);
                    else reached.delete(entry.target);
                });
                setEndInView(reached.size > 0);
            },
            { rootMargin: FAR + ' 0px 0px 0px' }
        );
        targets.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [endRef]);

    return ctasPassed && !endInView;
}

/**
 * Engine detail page: breadcrumb, dark stage + key stats + CTAs, full spec list, a 'More models' rail
 * and the closing CtaBand. Phones also get a sticky action bar (chat + call) between the hero and the band.
 * series: 'four' | 'two'. related: up to 4 neighbouring models ({ id, name, image, tipeMesin }), see
 * relatedModels.js.
 */
export default function ProductDetail({ product, series = 'four', related = [] }) {
    const { language } = useLanguage();
    const lang = language === 'id' ? 'id' : 'en';
    const c = COPY[lang];
    const labels = SPEC_LABELS[lang];
    const nav = translations[lang].navbar;

    const key = series === 'two' ? 'two' : 'four';
    const listHref = seriesPath(key);
    const seriesLabel = key === 'two' ? nav.twoStrokes : nav.fourStrokes;

    const hp = getHp(product.name);
    const askQuery = c.askQuery(product.name);
    const chatHref = '/chat?q=' + encodeURIComponent(askQuery);
    const altStore = STORES[0];

    const ctasRef = useRef(null);
    const endRef = useRef(null);
    const showBar = useActionBar(ctasRef, endRef);

    // Values go through formatSpec, a display-only tidy-up ('5000-6000rpm' → '5000–6000 rpm').
    const stats = STAT_KEYS.filter((k) => hasValue(product[k]))
        .slice(0, 4)
        .map((k) => ({ key: k, label: labels[k], value: formatSpec(product[k]) }));

    const specs = SPEC_KEYS.filter((k) => hasValue(product[k])).map((k) => ({
        key: k,
        label: labels[k],
        value: formatSpec(product[k]),
    }));

    // The title scales to its column by the longest unbreakable segment (min 6 so short codes stay large).
    const titleChars = Math.max(6, longestSegment(product.name));

    return (
        <>
            {/* ---- Breadcrumb ---- */}
            <div className={'container ' + styles.crumbs}>
                <nav aria-label="Breadcrumb">
                    <ol className={styles.crumbList}>
                        <li>
                            <Link href="/">{nav.home}</Link>
                        </li>
                        <li>
                            <Link href={listHref}>{seriesLabel}</Link>
                        </li>
                        <li>
                            <span aria-current="page">{product.name}</span>
                        </li>
                    </ol>
                </nav>
            </div>

            {/* ---- Stage + summary ---- */}
            <section className={styles.hero}>
                <div className={'container ' + styles.heroGrid}>
                    {/* The engine is the LCP: it settles from 0.97 on mount but is never hidden (no opacity). */}
                    <motion.div
                        className={styles.stageCol}
                        initial={{ scale: 0.97 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.9, ease: EASE_OUT }}
                    >
                        <div className={'stage-dark floor-shadow ' + styles.stage}>
                            {hp && (
                                <motion.span
                                    className={'tabular ' + styles.watermark}
                                    aria-hidden="true"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.2 }}
                                >
                                    {hp}
                                </motion.span>
                            )}
                            <Cutout
                                src={product.image}
                                alt={product.name}
                                priority
                                fetchPriority="high"
                                sizes="(max-width: 1024px) 100vw, 58vw"
                                className={styles.stageCutout}
                            />
                        </div>
                    </motion.div>

                    <div className={styles.info}>
                        <Eyebrow immediate>{c.eyebrow[key]}</Eyebrow>

                        <motion.h1
                            className={'h1 ' + styles.title}
                            style={{ '--chars': String(titleChars) }}
                            initial={{ y: 16 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.8, ease: EASE_OUT }}
                        >
                            <ModelName name={product.name} />
                        </motion.h1>

                        <Reveal immediate delay={0.1} y={12}>
                            {hp && (
                                <p className={styles.hp}>
                                    {hp} {c.unit}
                                </p>
                            )}
                            {hasValue(product.tipeMesin) && (
                                <p className={styles.engineType}>{product.tipeMesin}</p>
                            )}
                        </Reveal>

                        {stats.length > 0 && (
                            <Reveal immediate delay={0.18} y={12}>
                                <dl className={styles.stats}>
                                    {stats.map((stat) => (
                                        <div key={stat.key} className={styles.stat}>
                                            <dt>{stat.label}</dt>
                                            <dd className="tabular">{stat.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </Reveal>
                        )}

                        <Reveal immediate delay={0.26} y={12}>
                            <div ref={ctasRef} className={styles.ctas}>
                                <Link href={chatHref} className={'btn btn-primary btn-lg ' + styles.cta}>
                                    <Chat />
                                    {c.ask}
                                </Link>
                                <a href={MAIN_STORE.tel} className={'btn btn-outline btn-lg ' + styles.cta}>
                                    <Phone />
                                    {c.call} {MAIN_STORE.name}
                                </a>
                            </div>
                            <div className={styles.ctaMeta}>
                                <p className={styles.altStore}>
                                    {c.or} {altStore.name}:{' '}
                                    <a href={altStore.tel}>{altStore.phone}</a>
                                </p>
                                <Link href="/contact" className="btn btn-link">
                                    {c.findStore}
                                    <ArrowRight className="btn-arrow" />
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ---- Full specifications ---- */}
            {specs.length > 0 && (
                <section className="section section-alt" aria-labelledby="product-specs-title">
                    <div className="container">
                        <SectionHeader
                            eyebrow={c.specsEyebrow}
                            title={c.specsTitle}
                            id="product-specs-title"
                        />
                        <StaggerGroup as="dl" className={styles.specList} stagger={0.03} amount={0.05}>
                            {specs.map((spec) => (
                                <StaggerItem as="div" key={spec.key} y={12} className={styles.specRow}>
                                    <dt>{spec.label}</dt>
                                    <dd className="tabular">{spec.value}</dd>
                                </StaggerItem>
                            ))}
                        </StaggerGroup>
                    </div>
                </section>
            )}

            {/* ---- More models (neighbours in range order) ---- */}
            {related.length > 0 && (
                <section className={'section ' + styles.related} aria-labelledby="product-related-title">
                    <div className="container">
                        <SectionHeader
                            size="sm"
                            eyebrow={seriesLabel}
                            title={c.pager}
                            id="product-related-title"
                            action={{ label: c.all[key], href: listHref }}
                        />
                        <StaggerGroup as="ul" className={styles.relatedGrid}>
                            {related.map((p) => (
                                <StaggerItem as="li" key={p.id} className={styles.relatedItem}>
                                    <ProductCard
                                        product={p}
                                        series={key}
                                        headingLevel="h3"
                                        sizes="(max-width: 899px) 48vw, (max-width: 1199px) 23vw, 300px"
                                    />
                                </StaggerItem>
                            ))}
                        </StaggerGroup>
                    </div>
                </section>
            )}

            {/* Wrapper = the action bar's 'end' marker: the bar hides while the band is on screen. */}
            <div ref={endRef}>
                <CtaBand chatQuery={askQuery} />
            </div>

            {/* ---- Phone action bar (≤767px) ----
                Slides up once the hero buttons are gone, away again over the CtaBand and footer.
                Transform only, so reduced motion makes it instant; hidden = aria-hidden + inert. */}
            <motion.div
                className={styles.actionBar}
                initial={false}
                animate={{ y: showBar ? 0 : '150%' }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                aria-hidden={!showBar}
                inert={!showBar}
            >
                <Link href={chatHref} className={'btn btn-primary ' + styles.barAsk}>
                    <Chat />
                    {c.ask}
                </Link>
                <a
                    href={MAIN_STORE.tel}
                    className={'btn btn-outline ' + styles.barCall}
                    aria-label={c.call + ' ' + MAIN_STORE.name}
                >
                    <Phone />
                </a>
            </motion.div>
        </>
    );
}
