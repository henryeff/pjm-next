'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { PRICE_NOTE, SERVICE, WA_TEXT } from '@/lib/site';
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
import { SERVICE_STORE } from '@/components/ui/stores';
import { ArrowRight, Chat, Wrench } from '@/components/ui/Icons';
import styles from './page.module.css';

// Indonesian first (the server-rendered language). Non-breaking spaces keep "di Padang" / "in Padang"
// together when the hero h1 wraps on phones.
const COPY = {
    id: {
        // The h1: the search terms, styled as the small eyebrow above the slogan.
        heroH1: 'Dealer Resmi Mesin Tempel Yamaha di Padang',
        heroLines: ['Tenaga Andal', 'untuk Melaut'],
        heroLead: 'Mesin tempel Yamaha 2 tak & 4 tak, suku cadang asli, oli Yamalube, dan semua jenis servis mesin tempel Yamaha.',
        scroll: 'Gulir',
        moreTitle: 'Suku cadang asli & Yamalube',
        whyEyebrow: 'Kenapa Yamaha',
        serviceEyebrow: 'Servis & bengkel',
        serviceTitle: 'Semua jenis servis mesin tempel Yamaha',
        serviceLead: (store) =>
            `Bengkel kami ada di ${store.name}, ${store.street}, ${store.locality}. Kami mengerjakan semua jenis servis mesin tempel Yamaha (Yamaha Marine), mulai dari perawatan rutin hingga perbaikan.`,
        serviceListLabel: 'Contoh layanan',
        serviceCta: 'Info servis & bengkel',
        faqCta: 'Tanya jawab (FAQ)',
        storesEyebrow: 'Kunjungi kami',
        storesTitle: 'Dua toko di Padang',
        storesAction: 'Halaman kontak',
        ctaTitle: 'Ingin tahu harga mesin tempel Yamaha?',
        ctaLead: `${PRICE_NOTE.id}. Kirim pesan WhatsApp, telepon salah satu toko kami, atau tanya Pevita, asisten virtual kami.`,
    },
    en: {
        heroH1: 'Authorized Yamaha Outboard Dealer in Padang',
        heroLines: ['Power Your', 'Journey'],
        heroLead: 'Yamaha 2-stroke & 4-stroke outboards, genuine parts, Yamalube oil and all types of Yamaha outboard servicing.',
        scroll: 'Scroll',
        moreTitle: 'Genuine parts & Yamalube',
        whyEyebrow: 'Why Yamaha',
        serviceEyebrow: 'Service & workshop',
        serviceTitle: 'Every type of Yamaha outboard servicing',
        serviceLead: (store) =>
            `Our workshop is at ${store.name}, ${store.street}, ${store.locality}. We handle every type of Yamaha Marine outboard servicing, from routine maintenance to repairs.`,
        serviceListLabel: 'For example',
        serviceCta: 'Service & workshop details',
        faqCta: 'Questions & answers (FAQ)',
        storesEyebrow: 'Visit us',
        storesTitle: 'Two stores in Padang',
        storesAction: 'Contact page',
        ctaTitle: 'Want to know the price of a Yamaha outboard?',
        ctaLead: `${PRICE_NOTE.en}. Message us on WhatsApp, call either store, or ask Pevita, our virtual assistant.`,
    },
};

/** First sentence of a paragraph (up to the first ". "), keeping its full stop. */
const firstSentence = (text = '') => {
    const i = text.indexOf('. ');
    return i === -1 ? text : text.slice(0, i + 1);
};

/**
 * Home page body. The engine data arrives as props from the server page (src/app/page.js), so the
 * catalogue JSON stays out of the client bundle:
 *   lineup    { four: { count, picks }, two: { count, picks } } — picks carry `slug` for the links
 *   spotlight the highest-output 4-stroke (card fields + the specs it shows), or null
 *   ranges    { four: { count, hp: { min, max } }, two: {…} } — for the showcase copy
 */
export default function Home({ lineup, spotlight, ranges, news }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const c = COPY[lang];
    const all = translations[lang];
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
            {/* 1 — Hero (photo, dark). Sits under the transparent navbar.
                The h1 is the keyword line (styled as the eyebrow); the big slogan is a <p> with the display styling. */}
            <HeroSlider className={'on-dark ' + styles.hero}>
                <div className={styles.scrimLeft} aria-hidden="true" />
                <div className={styles.scrimBottom} aria-hidden="true" />

                <div className={'container ' + styles.heroInner}>
                    <div className={styles.heroContent}>
                        <Eyebrow as="h1" immediate className={styles.heroH1}>
                            {c.heroH1}
                        </Eyebrow>
                        <LineReveal as="p" className={'display ' + styles.heroTitle} lines={c.heroLines} />
                        <Reveal as="p" immediate delay={0.45} className={styles.heroLead}>
                            {c.heroLead}
                        </Reveal>
                        <Reveal immediate delay={0.6} className={styles.heroCtas}>
                            <Link href="/products/four-strokes" className="btn btn-primary btn-lg btn-block-sm">
                                {t.btn4Stroke}
                                <ArrowRight className="btn-arrow" />
                            </Link>
                            <Link href="/products/two-strokes" className="btn btn-ghost btn-lg btn-block-sm">
                                {t.btn2Stroke}
                            </Link>
                            <Link href="/chat" prefetch={false} className={styles.heroChat}>
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

            {/* 2 — Engine lineup: find your outboard (surface-alt). Both series are in the server HTML. */}
            <EngineLineup lineup={lineup} />

            {/* 3 — Spotlight: the highest-output engine (dark stage) */}
            <Spotlight product={spotlight} />

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
            <ShowcaseBand ranges={ranges} />

            {/* 7 — Service & workshop at Toko Tunggal Jaya (white): copy | examples list */}
            <section className={'section ' + styles.service} aria-labelledby="home-service-title">
                <div className={'container ' + styles.serviceGrid}>
                    <Reveal className={styles.serviceText}>
                        <Eyebrow>{c.serviceEyebrow}</Eyebrow>
                        <h2 id="home-service-title" className={'h2 ' + styles.serviceTitle}>
                            {c.serviceTitle}
                        </h2>
                        <p className={'lead ' + styles.serviceLead}>{c.serviceLead(SERVICE_STORE)}</p>
                        <div className={styles.serviceActions}>
                            <Link href="/servis" className="btn btn-primary btn-lg btn-block-sm">
                                {c.serviceCta}
                                <ArrowRight className="btn-arrow" />
                            </Link>
                            <Link href="/faq" className="btn btn-link">
                                {c.faqCta}
                                <ArrowRight className="btn-arrow" />
                            </Link>
                        </div>
                    </Reveal>

                    <div className={styles.serviceAside}>
                        <Reveal as="p" className={'eyebrow eyebrow-plain ' + styles.serviceListLabel} delay={0.1}>
                            {c.serviceListLabel}
                        </Reveal>
                        <StaggerGroup as="ul" className={styles.serviceList}>
                            {SERVICE.examples[lang].map((item, i) => (
                                <StaggerItem as="li" key={i} className={styles.serviceItem} y={12}>
                                    <span className={styles.serviceIcon} aria-hidden="true">
                                        <Wrench size={18} />
                                    </span>
                                    {item}
                                </StaggerItem>
                            ))}
                        </StaggerGroup>
                    </div>
                </div>
            </section>

            {/* 8 — Stores (surface-alt) */}
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

            {/* 9 — Latest news (white, text list) */}
            <LatestNews items={news} />

            {/* 10 — Closing CTA (navy): price & availability on request, via WhatsApp / phone / Pevita */}
            <CtaBand title={c.ctaTitle} lead={c.ctaLead} waText={WA_TEXT.price[lang]()} />
        </>
    );
}
