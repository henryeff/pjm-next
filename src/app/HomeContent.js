'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import HeroSlider from '@/components/home/HeroSlider';
import EngineLineup from '@/components/home/EngineLineup';
import Spotlight from '@/components/home/Spotlight';
import ShowcaseBand from '@/components/home/ShowcaseBand';
import LatestNews from '@/components/home/LatestNews';
import Reveal, { EASE_OUT } from '@/components/motion/Reveal';
import LineReveal from '@/components/motion/LineReveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import Eyebrow from '@/components/ui/Eyebrow';
import SectionHeader from '@/components/ui/SectionHeader';
import StoreCards from '@/components/ui/StoreCards';
import CtaBand from '@/components/ui/CtaBand';
import { ArrowRight, Chat } from '@/components/ui/Icons';
import fourStrokes from '@/data/four-strokes.json';
import twoStrokes from '@/data/two-strokes.json';
import styles from './page.module.css';

const COPY = {
    en: {
        // Non-breaking spaces keep "dealer · Padang" together when the eyebrow wraps on phones.
        heroEyebrow: 'Authorized Yamaha Marine dealer · Padang',
        heroLines: ['Power Your', 'Journey'],
        rangeTitle: 'Explore our range',
        models: (n) => `${n} models`,
        whyEyebrow: 'Why Yamaha',
        storesEyebrow: 'Visit us',
        storesTitle: 'Two stores in Padang',
        storesAction: 'Contact page',
    },
    id: {
        heroEyebrow: 'Dealer Resmi Yamaha Marine · Padang',
        heroLines: ['Tenagai', 'Perjalanan Anda'],
        rangeTitle: 'Jelajahi produk kami',
        models: (n) => `${n} model`,
        whyEyebrow: 'Kenapa Yamaha',
        storesEyebrow: 'Kunjungi kami',
        storesTitle: 'Dua toko di Padang',
        storesAction: 'Halaman kontak',
    },
};

/** First sentence of a paragraph (up to the first ". "), keeping its full stop. */
const firstSentence = (text = '') => {
    const i = text.indexOf('. ');
    return i === -1 ? text : text.slice(0, i + 1);
};

export default function Home() {
    const { language } = useLanguage();
    const c = COPY[language] || COPY.en;
    const all = translations[language];
    const t = all.home;
    const nav = all.navbar;

    const tiles = [
        {
            href: '/products/four-strokes',
            label: nav.fourStrokes,
            sub: c.models(fourStrokes.length),
            src: '/images/FourStrokes/250pk.png',
            kind: 'engine',
        },
        {
            href: '/products/two-strokes',
            label: nav.twoStrokes,
            sub: c.models(twoStrokes.length),
            src: '/images/TwoStrokes/40pk.png',
            kind: 'engine',
        },
        {
            href: '/parts',
            label: nav.parts,
            sub: firstSentence(all.parts.description),
            src: '/images/parts1.jpg',
            position: '25% 50%',
            kind: 'photo',
        },
        {
            href: '/yamalube',
            label: nav.yamalube,
            sub: all.yamalube.heroSubtitle,
            src: '/images/yamalube.jpg',
            position: '78% 50%',
            kind: 'photo',
        },
    ];

    const reasons = [
        { title: t.reliabilityTitle, desc: t.reliabilityDesc },
        { title: t.performanceTitle, desc: t.performanceDesc },
        { title: t.innovationTitle, desc: t.innovationDesc },
    ];

    return (
        <>
            {/* 1 — Hero (photo, dark). Sits under the transparent navbar. */}
            <HeroSlider className={'on-dark ' + styles.hero}>
                <div className={styles.scrimLeft} aria-hidden="true" />
                <div className={styles.scrimBottom} aria-hidden="true" />

                <div className={'container ' + styles.heroInner}>
                    <div className={styles.heroContent}>
                        <Eyebrow immediate>{c.heroEyebrow}</Eyebrow>
                        <LineReveal as="h1" className={'display ' + styles.heroTitle} lines={c.heroLines} />
                        <Reveal as="p" immediate delay={0.45} className={styles.heroLead}>
                            {t.heroSubtitle}
                        </Reveal>
                        <Reveal immediate delay={0.6} className={styles.heroCtas}>
                            <Link href="/products/four-strokes" className="btn btn-primary btn-lg btn-block-sm">
                                {t.btn4Stroke}
                                <ArrowRight className="btn-arrow" />
                            </Link>
                            <Link href="/products/two-strokes" className="btn btn-ghost btn-lg btn-block-sm">
                                {t.btn2Stroke}
                            </Link>
                            <Link href="/chat" className={styles.heroChat}>
                                <Chat size={20} />
                                {t.talkToUs}
                            </Link>
                        </Reveal>
                    </div>
                </div>
            </HeroSlider>

            {/* 2 — Explore our range (white) */}
            <section className="section" aria-labelledby="home-range-title">
                <div className="container">
                    <SectionHeader eyebrow={nav.products} title={c.rangeTitle} id="home-range-title" />

                    <StaggerGroup as="ul" className={styles.tiles}>
                        {tiles.map((tile) => {
                            const engine = tile.kind === 'engine';
                            const tileClass = [
                                styles.tile,
                                engine ? 'stage-light floor-shadow ' + styles.tileEngine : styles.tilePhoto,
                            ].join(' ');

                            return (
                                <StaggerItem as="li" key={tile.href} className={styles.tileCell}>
                                    <Link href={tile.href} className={tileClass}>
                                        <span className={styles.tileMedia}>
                                            <Image
                                                src={tile.src}
                                                alt=""
                                                fill
                                                sizes={
                                                    engine
                                                        ? '(max-width: 1023px) 40vw, 240px'
                                                        : '(max-width: 1023px) 50vw, 320px'
                                                }
                                                className={styles.tileImg}
                                                style={tile.position ? { objectPosition: tile.position } : undefined}
                                            />
                                        </span>
                                        {!engine && <span className={styles.tileScrim} aria-hidden="true" />}
                                        <span className={styles.tileLabel}>
                                            <span className={styles.tileTitle}>
                                                {tile.label}
                                                <ArrowRight size={20} className={styles.tileArrow} />
                                            </span>
                                            <span className={styles.tileSub}>{tile.sub}</span>
                                        </span>
                                    </Link>
                                </StaggerItem>
                            );
                        })}
                    </StaggerGroup>
                </div>
            </section>

            {/* 3 — Engine lineup (surface-alt) */}
            <EngineLineup />

            {/* 4 — Spotlight: the highest-output engine (dark stage) */}
            <Spotlight />

            {/* 5 — Why Yamaha (white, editorial) */}
            <section className="section" aria-labelledby="home-why-title">
                <div className={'container ' + styles.whyGrid}>
                    <div className={styles.whyHead}>
                        <SectionHeader eyebrow={c.whyEyebrow} title={t.whyChoose} id="home-why-title" />
                    </div>

                    <StaggerGroup as="ol" className={styles.whyList}>
                        {reasons.map((reason, i) => (
                            <StaggerItem as="li" key={i} className={styles.whyRow}>
                                <motion.span
                                    className={styles.whyRule}
                                    aria-hidden="true"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: EASE_OUT }}
                                />
                                <span className={'tabular ' + styles.whyNum} aria-hidden="true">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <div className={styles.whyBody}>
                                    <h3 className={styles.whyTitle}>{reason.title}</h3>
                                    <p className={styles.whyText}>{reason.desc}</p>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerGroup>
                </div>
            </section>

            {/* 6 — Showcase parallax band (photo) */}
            <ShowcaseBand />

            {/* 7 — Stores (surface-alt) */}
            <section className="section section-alt" aria-labelledby="home-stores-title">
                <div className="container">
                    <SectionHeader
                        eyebrow={c.storesEyebrow}
                        title={c.storesTitle}
                        id="home-stores-title"
                        action={{ label: c.storesAction, href: '/contact' }}
                    />
                    <StoreCards tone="light" />
                </div>
            </section>

            {/* 8 — Latest news (white, text list) */}
            <LatestNews />

            {/* 9 — Closing CTA (navy) */}
            <CtaBand />
        </>
    );
}
