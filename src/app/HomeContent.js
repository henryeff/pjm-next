'use client';

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
import RangeTile from '@/components/ui/RangeTile';
import StoreCards from '@/components/ui/StoreCards';
import CtaBand from '@/components/ui/CtaBand';
import { ArrowRight, Chat } from '@/components/ui/Icons';
import styles from './page.module.css';

const COPY = {
    en: {
        // Non-breaking spaces keep "dealer · Padang" together when the eyebrow wraps on phones.
        heroEyebrow: 'Authorized Yamaha Marine dealer · Padang',
        heroLines: ['Power Your', 'Journey'],
        scroll: 'Scroll',
        moreTitle: 'Genuine parts & Yamalube',
        whyEyebrow: 'Why Yamaha',
        storesEyebrow: 'Visit us',
        storesTitle: 'Two stores in Padang',
        storesAction: 'Contact page',
    },
    id: {
        heroEyebrow: 'Dealer Resmi Yamaha Marine · Padang',
        heroLines: ['Tenagai', 'Perjalanan Anda'],
        scroll: 'Gulir',
        moreTitle: 'Suku cadang asli & Yamalube',
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

    // Genuine parts & Yamalube. The 4S/2S choice lives in the hero CTAs and the engine lineup only.
    const more = [
        {
            href: '/parts',
            title: nav.parts,
            sub: firstSentence(all.parts.description),
            src: '/images/parts1.jpg',
            objectPosition: '25% 50%',
        },
        {
            href: '/yamalube',
            title: nav.yamalube,
            sub: all.yamalube.heroSubtitle,
            src: '/images/yamalube.jpg',
            objectPosition: '78% 50%',
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

                {/* Bottom rail (≥768px): scroll cue on the left; the slide controls sit at its right end. */}
                <div className={styles.heroRail} aria-hidden="true">
                    <span className={'eyebrow eyebrow-plain ' + styles.scrollLabel}>{c.scroll}</span>
                    <span className={styles.scrollTrack}>
                        <span className={styles.scrollFill} />
                    </span>
                </div>
            </HeroSlider>

            {/* 2 — Engine lineup: find your outboard (surface-alt) */}
            <EngineLineup />

            {/* 3 — Spotlight: the highest-output engine (dark stage) */}
            <Spotlight />

            {/* 4 — Genuine parts & Yamalube, 2-up (surface-alt) */}
            <section className="section section-alt" aria-labelledby="home-more-title">
                <div className="container">
                    <SectionHeader size="sm" eyebrow={nav.products} title={c.moreTitle} id="home-more-title" />

                    <StaggerGroup as="ul" className={styles.more}>
                        {more.map((tile) => (
                            <StaggerItem as="li" key={tile.href} className={styles.moreItem}>
                                <RangeTile
                                    kind="photo"
                                    ratio="16 / 9"
                                    href={tile.href}
                                    title={tile.title}
                                    sub={tile.sub}
                                    src={tile.src}
                                    objectPosition={tile.objectPosition}
                                    sizes="(max-width: 767px) 120vw, (max-width: 1279px) 64vw, 780px"
                                />
                            </StaggerItem>
                        ))}
                    </StaggerGroup>
                </div>
            </section>

            {/* 5 — Why Yamaha: full-width numbered rail (white) */}
            <section className={'section ' + styles.why} aria-labelledby="home-why-title">
                <div className="container">
                    <SectionHeader eyebrow={c.whyEyebrow} title={t.whyChoose} id="home-why-title" />

                    <StaggerGroup as="ol" className={styles.whyList}>
                        {reasons.map((reason, i) => (
                            <StaggerItem as="li" key={i} className={styles.whyItem}>
                                <motion.span
                                    className={styles.whyRule}
                                    aria-hidden="true"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.1 }}
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
                        size="sm"
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
