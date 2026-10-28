'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal, { EASE_OUT } from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import Eyebrow from '@/components/ui/Eyebrow';
import SectionHeader from '@/components/ui/SectionHeader';
import CtaBand from '@/components/ui/CtaBand';
import { ArrowLeft, ArrowRight, Chat, Phone } from '@/components/ui/Icons';
import { getHp, seriesPath } from '@/components/ui/productUtils';
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
        prev: 'Previous model',
        next: 'Next model',
        backAll: { four: 'Back to all 4 Strokes', two: 'Back to all 2 Strokes' },
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
        prev: 'Model sebelumnya',
        next: 'Model berikutnya',
        backAll: { four: 'Kembali ke semua 4 Tak', two: 'Kembali ke semua 2 Tak' },
    },
};

const hasValue = (v) => v !== undefined && v !== null && String(v).trim() !== '';

/** Model names like 'F300BET/FL300BET-300PK' get a soft break after each slash. */
function ModelName({ name }) {
    return String(name)
        .split('/')
        .map((part, i) => (
            <Fragment key={i}>
                {i > 0 && (
                    <>
                        /<wbr />
                    </>
                )}
                {part}
            </Fragment>
        ));
}

function PagerCard({ item, dir, href, label }) {
    const isNext = dir === 'next';
    const Arrow = isNext ? ArrowRight : ArrowLeft;
    return (
        <Link
            href={href}
            rel={dir}
            className={styles.pagerCard + (isNext ? ' ' + styles.pagerNext : '')}
        >
            <Arrow size={20} className={styles.pagerArrow} />
            <span className={'stage-light ' + styles.thumb}>
                <Image src={item.image} alt="" fill sizes="96px" className={styles.thumbImg} />
            </span>
            <span className={styles.pagerText}>
                <span className={'eyebrow eyebrow-plain ' + styles.pagerLabel}>{label}</span>
                <span className={styles.pagerName}>
                    <ModelName name={item.name} />
                </span>
            </span>
        </Link>
    );
}

/**
 * Engine detail page: breadcrumb, dark stage + key stats + CTAs, full spec list, prev / next.
 * series: 'four' | 'two'. prev / next: neighbouring models ({ id, name, image }) or null.
 */
export default function ProductDetail({ product, series = 'four', prev = null, next = null }) {
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
    const altStore = STORES[0];

    const stats = STAT_KEYS.filter((k) => hasValue(product[k]))
        .slice(0, 4)
        .map((k) => ({ key: k, label: labels[k], value: product[k] }));

    const specs = SPEC_KEYS.filter((k) => hasValue(product[k])).map((k) => ({
        key: k,
        label: labels[k],
        value: product[k],
    }));

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
                            <span aria-current="page">
                                <ModelName name={product.name} />
                            </span>
                        </li>
                    </ol>
                </nav>
            </div>

            {/* ---- Stage + summary ---- */}
            <section className={styles.hero}>
                <div className={'container ' + styles.heroGrid}>
                    {/* Reveal on mount (not in view), settling from 0.96 instead of rising. */}
                    <Reveal
                        immediate
                        y={0}
                        duration={0.9}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={styles.stageCol}
                    >
                        <div className={'stage-dark floor-shadow ' + styles.stage}>
                            {hp && (
                                <span className={styles.watermark} aria-hidden="true">
                                    {hp}
                                </span>
                            )}
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 58vw"
                                className={styles.stageImg}
                            />
                        </div>
                    </Reveal>

                    <div className={styles.info}>
                        <Eyebrow immediate>{c.eyebrow[key]}</Eyebrow>

                        <motion.h1
                            className={'h1 ' + styles.title}
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
                            <div className={styles.ctas}>
                                <Link
                                    href={'/chat?q=' + encodeURIComponent(askQuery)}
                                    className={'btn btn-primary btn-lg ' + styles.cta}
                                >
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

            {/* ---- Previous / next ---- */}
            <section className="section">
                <div className="container">
                    {(prev || next) && (
                        <nav aria-label={c.pager} className={styles.pagerGrid}>
                            {prev && (
                                <PagerCard
                                    item={prev}
                                    dir="prev"
                                    href={listHref + '/' + prev.id}
                                    label={c.prev}
                                />
                            )}
                            {next && (
                                <PagerCard
                                    item={next}
                                    dir="next"
                                    href={listHref + '/' + next.id}
                                    label={c.next}
                                />
                            )}
                        </nav>
                    )}
                    <div className={styles.backRow}>
                        <Link href={listHref} className={'btn btn-link ' + styles.backLink}>
                            <ArrowLeft className={styles.backArrow} />
                            {c.backAll[key]}
                        </Link>
                    </div>
                </div>
            </section>

            <CtaBand chatQuery={askQuery} />
        </>
    );
}
