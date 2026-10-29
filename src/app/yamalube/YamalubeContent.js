'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { SERVICE_STORE } from '@/components/ui/stores';
import { waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import Reveal from '@/components/motion/Reveal';
import ImageReveal from '@/components/motion/ImageReveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import Eyebrow from '@/components/ui/Eyebrow';
import CtaBand from '@/components/ui/CtaBand';
import { ArrowRight, Chat, Check, WhatsApp } from '@/components/ui/Icons';
import VideoFacade from '@/components/yamalube/VideoFacade';
import PriceNote from '@/components/contact/PriceNote';

// Page-only labels (translations.js carries the intro and product copy for this page). The H1 names
// the product people search for ('oli Yamalube'); the old slogan lives on in the lead.
const COPY = {
    en: {
        home: 'Home',
        crumb: 'Yamalube Oil',
        heroEyebrow: 'Yamalube · Crafted by Yamaha',
        heroTitle: 'Yamalube Oil for Yamaha Outboards',
        heroLead: '2-stroke and 4-stroke engine oils and SAE90 gear oils for Yamaha outboards — crafted by Yamaha, for your Yamaha.',
        heroAlt: 'Golden oil pouring onto brushed steel',
        whatsapp: 'Ask on WhatsApp',
        whatsappLabel: `Ask about Yamalube on WhatsApp ${WHATSAPP.display}`,
        askYamalube: 'Ask Pevita',
        serviceNote: (link) => <>Engine oil and gear oil changes can also be done at our {link}.</>,
        serviceLink: `${SERVICE_STORE.name} workshop`,
        guideLink: 'Guide: changing Yamalube oil in a Yamaha outboard',
        chatQuery: 'Which Yamalube oil is right for my outboard?',
        introEyebrow: 'Formulated for marine conditions',
        introTitle: 'Made for Yamaha outboards',
        rangeAlt: 'Yamalube 2-stroke and 4-stroke motor oils and gear oils in bottles, pails and tubes',
        rangeCaption: 'The Yamalube outboard range',
        productsEyebrow: 'Products',
        productsTitle: 'Motor oils & gear oils',
        jumpLabel: 'Yamalube products',
        packagingCaption: (title) => `${title} – packaging`,
        colPart: 'Part No.',
        colVolume: 'Volume',
        colPackaging: 'Packaging',
        packaging: { bottle: 'Bottle', pail: 'Pail', drum: 'Drum', tube: 'Tube' },
        kinds: {
            '2t': '2-Stroke',
            '4t': '4-Stroke',
            gl4: 'Gear oil · GL-4',
            gl5: 'Gear oil · GL-5',
        },
        videoEyebrow: 'Watch',
        videoTitle: 'Watch the Yamalube video',
        videoAria: 'Play video: Yamalube',
        videoPlay: 'Play video',
        videoFrameTitle: 'Yamalube video',
        ctaTitle: 'Which Yamalube is right for your engine?',
    },
    id: {
        home: 'Beranda',
        crumb: 'Oli Yamalube',
        heroEyebrow: 'Yamalube · Dibuat oleh Yamaha',
        heroTitle: 'Oli Yamalube untuk Mesin Tempel Yamaha',
        heroLead: 'Oli mesin 2 tak dan 4 tak serta oli gardan SAE90 untuk mesin tempel Yamaha — dibuat oleh Yamaha, untuk Yamaha Anda.',
        heroAlt: 'Oli keemasan mengalir di atas baja',
        whatsapp: 'Tanya lewat WhatsApp',
        whatsappLabel: `Tanya Yamalube lewat WhatsApp ${WHATSAPP.display}`,
        askYamalube: 'Tanya Pevita',
        serviceNote: (link) => <>Ganti oli mesin dan oli gardan juga bisa dikerjakan di {link}.</>,
        serviceLink: `bengkel kami di ${SERVICE_STORE.name}`,
        guideLink: 'Panduan mengganti oli Yamalube pada mesin tempel Yamaha',
        chatQuery: 'Oli Yamalube mana yang cocok untuk mesin tempel saya?',
        introEyebrow: 'Diformulasikan untuk kondisi laut',
        introTitle: 'Dibuat untuk mesin tempel Yamaha',
        rangeAlt: 'Oli mesin 2 tak dan 4 tak serta oli gardan Yamalube dalam botol, pail, dan tube',
        rangeCaption: 'Rangkaian Yamalube untuk mesin tempel',
        productsEyebrow: 'Produk',
        productsTitle: 'Oli mesin & oli gardan',
        jumpLabel: 'Produk Yamalube',
        packagingCaption: (title) => `${title} – kemasan`,
        colPart: 'Nomor Part',
        colVolume: 'Volume',
        colPackaging: 'Kemasan',
        packaging: { bottle: 'Botol', pail: 'Pail', drum: 'Drum', tube: 'Tube' },
        kinds: {
            '2t': '2 Tak',
            '4t': '4 Tak',
            gl4: 'Oli gardan · GL-4',
            gl5: 'Oli gardan · GL-5',
        },
        videoEyebrow: 'Tonton',
        videoTitle: 'Tonton video Yamalube',
        videoAria: 'Putar video: Yamalube',
        videoPlay: 'Putar video',
        videoFrameTitle: 'Video Yamalube',
        ctaTitle: 'Yamalube mana yang tepat untuk mesin Anda?',
    },
};

// Packaging tables (transcribed from the yamalube-*-info / SAE90 table images).
const PRODUCTS = [
    {
        id: '2t',
        titleKey: 'product2TTitle',
        listKey: 'product2TList',
        rows: [
            ['90790BS212', '0.5L', 'bottle'],
            ['90790BS214', '1.0L', 'bottle'],
            ['90790BS215', '4.0L', 'bottle'],
            ['90790BS216', '20.0L', 'pail'],
            ['90790BS217', '209L', 'drum'],
        ],
    },
    {
        id: '4t',
        titleKey: 'product4TTitle',
        listKey: 'product4TList',
        rows: [
            ['90790BS401', '1.0L', 'bottle'],
            ['90790BS402', '4.0L', 'bottle'],
            ['90790BS403', '20.0L', 'pail'],
            ['90790BS404', '209L', 'drum'],
        ],
    },
    {
        id: 'gl4',
        titleKey: 'productGL4Title',
        listKey: 'productGL4List',
        rows: [
            ['90790BS801', '0.35L', 'tube'],
            ['90790BS802', '0.75L', 'tube'],
            ['90790BS803', '20.0L', 'pail'],
            ['90790BS804', '209L', 'drum'],
            ['90790BS805', '1.0L', 'bottle'],
        ],
    },
    {
        id: 'gl5',
        titleKey: 'productGL5Title',
        listKey: 'productGL5List',
        rows: [['90790BS810', '20.0L', 'pail']],
    },
];

const CARD_ID = (id) => 'yamalube-' + id;

// Keep hyphenated tokens ("2-Stroke", "GL-4") on one line so titles never break as "2-" / "Stroke".
function keepHyphensTogether(text) {
    return text
        .split(/(\S*\w-\w\S*)/)
        .map((part, i) => (i % 2 ? <span key={i} className={styles.nowrap}>{part}</span> : part));
}

/**
 * Product jump chips (< 1024px; CSS hides them above) with a scroll-spy: the chip of the card crossing
 * a thin band at 40–45% of the viewport gets aria-current, and the chip row scrolls sideways — never
 * the page — to keep that chip in view. Its own component so only the chip row re-renders on scroll.
 */
function ProductJump({ label, kinds }) {
    const rowRef = useRef(null);
    const chipRefs = useRef({});
    const [active, setActive] = useState(null);

    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return undefined;
        const cards = PRODUCTS.map((product) => document.getElementById(CARD_ID(product.id))).filter(Boolean);
        if (!cards.length) return undefined;

        const idOf = new Map(PRODUCTS.map((product) => [CARD_ID(product.id), product.id]));
        const inBand = new Set();
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const id = idOf.get(entry.target.id);
                    if (entry.isIntersecting) inBand.add(id);
                    else inBand.delete(id);
                }
                // Nothing in the band (a 24px gutter between cards, or past the last card): keep the last
                // chip rather than flicker off.
                const current = PRODUCTS.find((product) => inBand.has(product.id));
                if (current) setActive(current.id);
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );
        cards.forEach((card) => observer.observe(card));

        // Back above the products — the first card's top below the band — clears the chip. A root that
        // reaches far above the viewport makes this flip even on an instant jump to the top from below
        // the products (Home key; the site has no smooth scrolling), which crosses no card edge.
        const above = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) return;
                inBand.clear();
                setActive(null);
            },
            { rootMargin: '100000px 0px -55% 0px' }
        );
        above.observe(cards[0]);

        return () => {
            observer.disconnect();
            above.disconnect();
        };
    }, []);

    // Keep the active chip in view by scrolling the chip row horizontally only (scrollIntoView could
    // also move the page). Leave the row alone while the chip is already fully visible beside the fade;
    // with no active chip (back above the products) return the row to its start.
    useEffect(() => {
        const row = rowRef.current;
        if (!row || !row.clientWidth) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const behavior = reduce ? 'auto' : 'smooth';
        const chip = active ? chipRefs.current[active] : null;
        if (!chip) {
            if (row.scrollLeft) row.scrollTo({ left: 0, behavior });
            return;
        }
        const fade = 24;
        const start = chip.offsetLeft;
        const end = start + chip.offsetWidth;
        if (start >= row.scrollLeft && end <= row.scrollLeft + row.clientWidth - fade) return;
        const inset = parseFloat(window.getComputedStyle(row).paddingLeft) || 16;
        row.scrollTo({ left: start - inset, behavior });
    }, [active]);

    return (
        <nav ref={rowRef} aria-label={label} className={'no-scrollbar ' + styles.jump}>
            {PRODUCTS.map((product) => (
                <a
                    key={product.id}
                    ref={(node) => {
                        chipRefs.current[product.id] = node;
                    }}
                    href={'#' + CARD_ID(product.id)}
                    className={styles.jumpLink}
                    aria-current={active === product.id ? 'true' : undefined}
                >
                    {kinds[product.id]}
                </a>
            ))}
        </nav>
    );
}

export default function YamalubePage({ oilGuideHref = null }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const t = translations[lang].yamalube;
    const c = COPY[lang];
    const chatHref = '/chat?q=' + encodeURIComponent(c.chatQuery);
    const waOil = WA_TEXT.oil[lang];

    return (
        <>
            <PageHero
                image="/images/yamalube-hero-oil.jpg"
                imageAlt={c.heroAlt}
                imagePosition="50% 50%"
                imagePositionTablet="80% 50%"
                imagePositionMobile="85% 50%"
                bandHeight="min(70vw, 300px)"
                scrim="strong"
                size="tall"
                breadcrumbs={[{ label: c.home, href: '/' }, { label: c.crumb }]}
                eyebrow={c.heroEyebrow}
                title={c.heroTitle}
                lead={c.heroLead}
            >
                <a
                    href={waLink(waOil)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg btn-block-sm"
                    aria-label={c.whatsappLabel}
                >
                    <WhatsApp />
                    {c.whatsapp}
                </a>
                <Link href={chatHref} prefetch={false} className="btn btn-ghost btn-lg btn-block-sm">
                    <Chat />
                    {c.askYamalube}
                </Link>
            </PageHero>

            {/* Intro + product range */}
            <section className={'section ' + styles.intro}>
                <div className="container">
                    <div className={styles.introGrid}>
                        <SectionHeader
                            className={styles.introHeader}
                            eyebrow={c.introEyebrow}
                            title={c.introTitle}
                        />
                        <Reveal className={styles.introBody} delay={0.1}>
                            <p className={'lead ' + styles.introLead}>{t.intro1}</p>
                            <p className={styles.introText}>{t.intro2}</p>
                            <p className={styles.introText}>
                                {c.serviceNote(
                                    <Link href="/servis" className={styles.inlineLink}>
                                        {c.serviceLink}
                                    </Link>
                                )}
                            </p>
                            {oilGuideHref && (
                                <Link href={oilGuideHref} className={'btn btn-link ' + styles.guideLink}>
                                    {c.guideLink}
                                    <ArrowRight className="btn-arrow" />
                                </Link>
                            )}
                        </Reveal>
                    </div>

                    <figure className={styles.range}>
                        <ImageReveal className={styles.rangeMedia}>
                            <Image
                                src="/images/News/yamalube.jpg"
                                alt={c.rangeAlt}
                                width={1070}
                                height={424}
                                sizes="(min-width: 1144px) 1080px, 100vw"
                                className={styles.rangeImg}
                            />
                        </ImageReveal>
                        <figcaption className={'eyebrow eyebrow-plain ' + styles.rangeCaption}>
                            {c.rangeCaption}
                        </figcaption>
                    </figure>
                </div>
            </section>

            {/* Products */}
            <section className="section section-alt">
                <div className="container">
                    <SectionHeader eyebrow={c.productsEyebrow} title={c.productsTitle} />

                    {/* Jump bar (< 1024px, sticky on phones): the stacked cards run ~4,000px tall there. */}
                    <ProductJump label={c.jumpLabel} kinds={c.kinds} />

                    <StaggerGroup className={styles.productGrid} amount={0.05}>
                        {PRODUCTS.map((product) => {
                            const title = t[product.titleKey];
                            return (
                                <StaggerItem
                                    key={product.id}
                                    as="article"
                                    id={CARD_ID(product.id)}
                                    className={styles.card}
                                >
                                    <Eyebrow>{c.kinds[product.id]}</Eyebrow>
                                    <h3 className={styles.cardTitle}>{keepHyphensTogether(title)}</h3>

                                    <ul className={styles.bullets}>
                                        {t[product.listKey].map((item, index) => (
                                            <li key={index}>
                                                <Check size={18} className={styles.check} />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <table className={styles.table}>
                                        <caption className="visually-hidden">{c.packagingCaption(title)}</caption>
                                        <thead>
                                            <tr>
                                                <th scope="col">{c.colPart}</th>
                                                <th scope="col">{c.colVolume}</th>
                                                <th scope="col">{c.colPackaging}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.rows.map(([partNo, volume, pack]) => (
                                                <tr key={partNo}>
                                                    <td className={styles.partNo}>{partNo}</td>
                                                    <td>{volume}</td>
                                                    <td>{c.packaging[pack]}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </StaggerItem>
                            );
                        })}
                    </StaggerGroup>

                    <Reveal className={styles.priceNote}>
                        <PriceNote waText={waOil} />
                    </Reveal>
                </div>
            </section>

            {/* Video (click-to-load) */}
            <section className="section">
                <div className="container">
                    <SectionHeader align="center" eyebrow={c.videoEyebrow} title={c.videoTitle} />
                    <Reveal delay={0.05}>
                        <VideoFacade
                            videoId="Bs7bmI6WlI0"
                            title={c.videoFrameTitle}
                            ariaLabel={c.videoAria}
                            playLabel={c.videoPlay}
                            poster="/images/yamalube2.jpg"
                            posterClassName={styles.videoPoster}
                        />
                    </Reveal>
                </div>
            </section>

            <CtaBand chatQuery={c.chatQuery} title={c.ctaTitle} waText={waOil} />
        </>
    );
}
