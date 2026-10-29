'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal, { EASE_OUT } from '@/components/motion/Reveal';
import { cssMotionVars, motionClasses } from '@/components/motion/cssMotion';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import Eyebrow from '@/components/ui/Eyebrow';
import SectionHeader from '@/components/ui/SectionHeader';
import CtaBand from '@/components/ui/CtaBand';
import Cutout from '@/components/ui/Cutout';
import ProductCard from '@/components/ui/ProductCard';
import { ArrowRight, Chat, Clock, Phone, WhatsApp } from '@/components/ui/Icons';
import {
    displaySpec,
    engineAlt,
    engineName,
    engineSummary,
    getHp,
    HP_UNIT,
    localizeSpec,
    modelCode,
    SERIES_NOUN,
    seriesPath,
    soldBy,
    SPEC_LABELS,
    specRows,
} from '@/components/ui/productUtils';
import { MAIN_STORE, STORES } from '@/components/ui/stores';
import { productHref } from '@/lib/paths';
import { HOURS, PRICE_NOTE, SERVICE, waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import styles from '@/app/products/four-strokes/[slug]/page.module.css';

// The headline stats: the first four of these that have a value.
const STAT_KEYS = ['volume', 'berat', 'jangkauan', 'konsumsibb', 'diameter', 'kompresi'];

// How many differing specs a same-power variant lists before '…and N more'.
const VARIANT_DIFFS = 3;

const COPY = {
    id: {
        eyebrow: 'Dealer resmi Yamaha Marine · Padang',
        priceTitle: 'Harga & ketersediaan',
        priceNote: PRICE_NOTE.id + '.',
        priceSub: 'Harga tidak dicantumkan di situs ini. Tanyakan lewat WhatsApp atau telepon salah satu toko kami.',
        whatsapp: 'Tanya harga lewat WhatsApp',
        // Accessible names start with the visible text (WCAG 2.5.3), then add the model and the number.
        whatsappLabel: (visible, name) => visible + ' – ' + name + ' (WhatsApp ' + WHATSAPP.display + ')',
        call: 'Telepon',
        or: 'atau',
        askPevita: 'Tanya Pevita, asisten virtual kami',
        askQuery: (name) => 'Saya ingin tahu lebih lanjut tentang Yamaha ' + name + '.',
        specsEyebrow: 'Spesifikasi',
        specsTitle: (name) => 'Spesifikasi lengkap ' + name,
        variantsTitle: (hp) => 'Varian ' + hp + ' PK lainnya',
        variantsLead: 'Perbedaannya menurut data spesifikasi kami:',
        differs: 'Berbeda pada',
        here: 'model ini',
        empty: 'tidak tercantum',
        moreDiffs: (n) => 'dan ' + n + ' spesifikasi lain',
        careTitle: 'Perawatan & servis',
        careLead: SERVICE.summary.id,
        care: {
            oil: { four: 'Oli mesin Yamalube 4 Tak', two: 'Oli Yamalube 2 Tak' },
            gear: 'Oli gardan Yamalube GL-4',
            parts: 'Suku cadang asli Yamaha',
            service: 'Servis & bengkel Toko Tunggal Jaya',
        },
        pager: 'Model lainnya',
        all: { four: 'Lihat semua 4 Tak', two: 'Lihat semua 2 Tak' },
        barWhatsapp: 'Tanya harga',
        barChat: 'Chat dengan Pevita',
    },
    en: {
        eyebrow: 'Authorized Yamaha Marine dealer · Padang',
        priceTitle: 'Price & availability',
        priceNote: PRICE_NOTE.en + '.',
        priceSub: 'Prices are not listed on the site. Ask us on WhatsApp or call one of our stores.',
        whatsapp: 'Ask the price on WhatsApp',
        whatsappLabel: (visible, name) => visible + ' – ' + name + ' (WhatsApp ' + WHATSAPP.display + ')',
        call: 'Call',
        or: 'or',
        askPevita: 'Ask Pevita, our virtual assistant',
        askQuery: (name) => "I'd like to know more about the Yamaha " + name + '.',
        specsEyebrow: 'Specifications',
        specsTitle: (name) => name + ' full specifications',
        variantsTitle: (hp) => 'Other ' + hp + ' HP variants',
        variantsLead: 'How they differ, according to our spec data:',
        differs: 'Differs in',
        here: 'this model',
        empty: 'not listed',
        moreDiffs: (n) => 'and ' + n + ' more ' + (n === 1 ? 'spec' : 'specs'),
        careTitle: 'Care & servicing',
        careLead: SERVICE.summary.en,
        care: {
            oil: { four: 'Yamalube 4-Stroke engine oil', two: 'Yamalube 2-Stroke oil' },
            gear: 'Yamalube GL-4 gear oil',
            parts: 'Yamaha genuine parts',
            service: 'Service & workshop at Toko Tunggal Jaya',
        },
        pager: 'More models',
        all: { four: 'View all 4 Strokes', two: 'View all 2 Strokes' },
        barWhatsapp: 'Ask the price',
        barChat: 'Chat with Pevita',
    },
};

const hasValue = (v) => v !== undefined && v !== null && String(v).trim() !== '';

/** Length of the longest '/'-separated segment of the model code (sizes the title to its column). */
function longestSegment(code) {
    return String(code || '')
        .split('/')
        .reduce((max, seg) => Math.max(max, seg.length), 0);
}

/**
 * The title's model code, never broken mid-code: each '/'-separated segment is unbreakable and the only
 * wrap point is after a '/'.
 */
function ModelCode({ code }) {
    return String(code || '')
        .split('/')
        .map((seg, i) => (
            <Fragment key={i}>
                {i > 0 && (
                    <>
                        /<wbr />
                    </>
                )}
                <span className={styles.seg}>{seg}</span>
            </Fragment>
        ));
}

// The scrolled navbar's height (Navbar.module.css): the hero buttons count as gone once they slip under it.
const SCROLLED_NAV_H = 68;
// Stretches an observer's root far past one edge of the viewport, so the target has a single boundary
// ('reached'). A plain viewport root misses jumps that skip over a target entirely (a fast fling, scroll
// restoration on Back, an anchor link): no intersection change, no callback.
const FAR = '100000px';

/**
 * Phone action bar visibility: shown whenever the hero's WhatsApp / call buttons are off screen — below
 * the first screen on load (the summary and price block push them down on phones) or scrolled up under
 * the navbar — and hidden while they are visible, and once the closing CtaBand (endRef) or the site footer
 * reaches the screen (both carry their own WhatsApp / chat / call actions). Hidden until the first
 * observer callback, so it never flashes during hydration. Observers only; nothing runs on scroll.
 */
function useActionBar(ctasRef, endRef) {
    const [ctasOnScreen, setCtasOnScreen] = useState(null);
    const [endInView, setEndInView] = useState(false);

    useEffect(() => {
        const ctas = ctasRef.current;
        if (!ctas || typeof IntersectionObserver === 'undefined') return undefined;
        // Root: the viewport below the navbar. Jumping over the buttons keeps them off screen, which is
        // the same state, so a missed crossing changes nothing here.
        const io = new IntersectionObserver(([entry]) => setCtasOnScreen(entry.isIntersecting), {
            rootMargin: '-' + SCROLLED_NAV_H + 'px 0px 0px 0px',
        });
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

    return ctasOnScreen === false && !endInView;
}

/**
 * Engine detail page: breadcrumb; dark stage + H1 ('Yamaha E40GMH 40 PK – Mesin Tempel 2 Tak'), a summary
 * generated from the spec data, key stats and the 'Harga & ketersediaan' block (WhatsApp prefilled with the
 * model + call); the full spec list with same-power variants and care links; a 'More models' rail and the
 * closing CtaBand. Phones also get a sticky action bar (WhatsApp + chat + call) while the hero buttons are off screen.
 *
 * product: the engine (with `slug`). series: 'four' | 'two'.
 * related: up to 4 neighbouring models ({ id, slug, name, image, tipeMesin }), see relatedModels.js.
 * variants: same-power models with the spec fields that differ (productUtils.sameHpVariants).
 * Indonesian is the server-rendered language; English swaps in after hydration (useLanguage).
 */
export default function ProductDetail({ product, series = 'four', related = [], variants = [] }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const c = COPY[lang];
    const labels = SPEC_LABELS[lang];
    const nav = translations[lang].navbar;

    const key = series === 'two' ? 'two' : 'four';
    const listHref = seriesPath(key);
    const seriesLabel = key === 'two' ? nav.twoStrokes : nav.fourStrokes;

    const code = modelCode(product.name);
    const hp = getHp(product.name);
    const name = engineName(product, lang);
    const askQuery = c.askQuery(product.name);
    const chatHref = '/chat?q=' + encodeURIComponent(askQuery);
    // The full model name ('E40GMH-40PK') so staff know exactly which engine is meant.
    const waText = WA_TEXT.price[lang]('Yamaha ' + product.name);
    const waHref = waLink(waText);
    const altStore = STORES.find((s) => s.id !== MAIN_STORE.id) || STORES[0];

    const ctasRef = useRef(null);
    const endRef = useRef(null);
    const showBar = useActionBar(ctasRef, endRef);

    // Values are worded for the page language and tidied for display ('5000-6000rpm' → '5000–6000 rpm').
    const stats = STAT_KEYS.filter((k) => hasValue(product[k]))
        .slice(0, 4)
        .map((k) => ({ key: k, label: labels[k], value: displaySpec(product[k], lang) }));
    const specs = specRows(product, lang);

    // The title scales to its column by the longest unbreakable segment (min 6 so short codes stay large).
    const titleChars = Math.max(6, longestSegment(code));
    const oilAnchor = key === 'two' ? 'yamalube-2t' : 'yamalube-4t';

    return (
        <>
            {/* ---- Breadcrumb (same trail as the BreadcrumbList JSON-LD) ---- */}
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
                    {/* The engine is the LCP: a CSS settle from 0.97 at first paint, never hidden (no opacity). */}
                    <div
                        className={styles.stageCol + ' ' + motionClasses.settle}
                        style={cssMotionVars({ scale: 0.97, duration: 0.9 })}
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
                            {/* Rendered engine width: ≤0.75 of the stage on phones, ~0.6 on tablets, ≤400px from 1024px. */}
                            <Cutout
                                src={product.image}
                                alt={engineAlt(product, lang)}
                                priority
                                fetchPriority="high"
                                sizes="(max-width: 640px) 70vw, (max-width: 1023px) 56vw, 400px"
                                className={styles.stageCutout}
                            />
                        </div>
                    </div>

                    <div className={styles.info}>
                        <Eyebrow immediate>{c.eyebrow}</Eyebrow>

                        {/* textContent: 'Yamaha E40GMH 40 PK – Mesin Tempel 2 Tak' (the <title> without the brand). */}
                        <h1
                            className={'h1 ' + styles.title + ' ' + motionClasses.rise}
                            style={{ ...cssMotionVars({ y: 16, duration: 0.8 }), '--chars': String(titleChars) }}
                        >
                            <span className={styles.titleBrand}>Yamaha</span>{' '}
                            <span className={styles.titleCode}>
                                <ModelCode code={code} />
                            </span>{' '}
                            <span className={styles.suffix}>
                                {hp && (
                                    <>
                                        {hp} {HP_UNIT[lang]}
                                        <span className={styles.suffixSep}> – </span>
                                    </>
                                )}
                                {SERIES_NOUN[key][lang]}
                            </span>
                        </h1>

                        <Reveal immediate delay={0.1} y={12}>
                            {hasValue(product.tipeMesin) && (
                                <p className={styles.engineType}>{localizeSpec(product.tipeMesin, lang)}</p>
                            )}
                            <p className={styles.summary}>
                                {engineSummary(product, key, lang)} {soldBy(lang)}
                            </p>
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

                        {/* ---- Price & availability: prices are not published, so ask (WhatsApp prefilled / call) ---- */}
                        <Reveal immediate delay={0.26} y={12}>
                            <section className={styles.priceBox} aria-labelledby="product-price-title">
                                <h2 id="product-price-title" className={styles.priceTitle}>
                                    {c.priceTitle}
                                </h2>
                                <p className={styles.priceNote}>{c.priceNote}</p>
                                <p className={styles.priceSub}>{c.priceSub}</p>
                                <div ref={ctasRef} className={styles.ctas}>
                                    <a
                                        href={waHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={'btn btn-primary btn-lg ' + styles.cta}
                                        aria-label={c.whatsappLabel(c.whatsapp, name)}
                                    >
                                        <WhatsApp />
                                        {c.whatsapp}
                                    </a>
                                    <a href={MAIN_STORE.tel} className={'btn btn-outline btn-lg ' + styles.cta}>
                                        <Phone />
                                        {c.call} {MAIN_STORE.name}
                                    </a>
                                </div>
                                <div className={styles.ctaMeta}>
                                    <p className={styles.altStore}>
                                        {c.or} {altStore.name}: <a href={altStore.tel}>{altStore.phone}</a>
                                    </p>
                                    <p className={styles.hoursLine}>
                                        <Clock size={16} />
                                        <span>
                                            {HOURS.short[lang]} · {HOURS.closed[lang]}
                                        </span>
                                    </p>
                                </div>
                                <Link href={chatHref} prefetch={false} className={'btn btn-link ' + styles.chatLink}>
                                    <Chat size={18} />
                                    {c.askPevita}
                                    <ArrowRight className="btn-arrow" />
                                </Link>
                            </section>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ---- Full specifications, same-power variants, care links ---- */}
            {specs.length > 0 && (
                <section className="section section-alt" aria-labelledby="product-specs-title">
                    <div className="container">
                        <SectionHeader
                            eyebrow={c.specsEyebrow}
                            title={c.specsTitle(name)}
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

                        <div className={styles.extras}>
                            {variants.length > 0 && hp && (
                                <Reveal className={styles.extra}>
                                    <h3 className={styles.extraTitle}>{c.variantsTitle(hp)}</h3>
                                    <p className={styles.extraLead}>{c.variantsLead}</p>
                                    <ul className={styles.variantList}>
                                        {variants.map((v) => {
                                            const shown = v.diffs.slice(0, VARIANT_DIFFS);
                                            const rest = v.diffs.length - shown.length;
                                            return (
                                                <li key={v.id} className={styles.variant}>
                                                    <Link href={productHref(key, v)} className={styles.variantName}>
                                                        {v.name}
                                                        <ArrowRight size={16} className={styles.variantArrow} />
                                                    </Link>
                                                    {shown.length > 0 && (
                                                        <p className={styles.variantDiff}>
                                                            {c.differs}{' '}
                                                            {shown.map((d, i) => (
                                                                <Fragment key={d.key}>
                                                                    {i > 0 && '; '}
                                                                    <strong>{labels[d.key]}</strong>:{' '}
                                                                    {displaySpec(d.value, lang) || c.empty} ({c.here}:{' '}
                                                                    {displaySpec(product[d.key], lang) || c.empty})
                                                                </Fragment>
                                                            ))}
                                                            {rest > 0 ? ' ' + c.moreDiffs(rest) : ''}.
                                                        </p>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Reveal>
                            )}

                            <Reveal className={styles.extra} delay={variants.length > 0 ? 0.1 : 0}>
                                <h3 className={styles.extraTitle}>{c.careTitle}</h3>
                                <p className={styles.extraLead}>{c.careLead}</p>
                                <ul className={styles.careList}>
                                    <li>
                                        <Link href={'/yamalube#' + oilAnchor}>
                                            {c.care.oil[key]}
                                            <ArrowRight size={16} className={styles.variantArrow} />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/yamalube#yamalube-gl4">
                                            {c.care.gear}
                                            <ArrowRight size={16} className={styles.variantArrow} />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/parts">
                                            {c.care.parts}
                                            <ArrowRight size={16} className={styles.variantArrow} />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/servis">
                                            {c.care.service}
                                            <ArrowRight size={16} className={styles.variantArrow} />
                                        </Link>
                                    </li>
                                </ul>
                            </Reveal>
                        </div>
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
                                    {/* Cards: 2 columns to 899px, 4 from 900px; sizes = the engine (~0.6 × card). */}
                                    <ProductCard
                                        product={p}
                                        series={key}
                                        headingLevel="h3"
                                        sizes="(max-width: 899px) 28vw, (max-width: 1199px) 15vw, 172px"
                                    />
                                </StaggerItem>
                            ))}
                        </StaggerGroup>
                    </div>
                </section>
            )}

            {/* Wrapper = the action bar's 'end' marker: the bar hides while the band is on screen. */}
            <div ref={endRef}>
                <CtaBand chatQuery={askQuery} waText={waText} />
            </div>

            {/* ---- Phone action bar (≤767px) ----
                Slides up while the hero buttons are off screen, away again over them, the CtaBand and footer.
                Transform only, so reduced motion makes it instant; hidden = aria-hidden + inert. */}
            <motion.div
                className={styles.actionBar}
                initial={false}
                animate={{ y: showBar ? 0 : '150%' }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                aria-hidden={!showBar}
                inert={!showBar}
            >
                <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={'btn btn-primary ' + styles.barAsk}
                    aria-label={c.whatsappLabel(c.barWhatsapp, name)}
                >
                    <WhatsApp />
                    {c.barWhatsapp}
                </a>
                <Link
                    href={chatHref}
                    prefetch={false}
                    className={'btn btn-outline ' + styles.barIcon}
                    aria-label={c.barChat}
                >
                    <Chat />
                </Link>
                <a
                    href={MAIN_STORE.tel}
                    className={'btn btn-outline ' + styles.barIcon}
                    aria-label={c.call + ' ' + MAIN_STORE.name}
                >
                    <Phone />
                </a>
            </motion.div>
        </>
    );
}
