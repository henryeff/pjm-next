'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import ImageReveal from '@/components/motion/ImageReveal';
import KickerLine from '@/components/motion/KickerLine';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import Eyebrow from '@/components/ui/Eyebrow';
import StoreCards from '@/components/ui/StoreCards';
import CtaBand from '@/components/ui/CtaBand';
import { ArrowRight } from '@/components/ui/Icons';

// Page-only labels. The story pillars quote the dealer's own wording from about.p2.
const COPY = {
    en: {
        storyEyebrow: 'Our story',
        storyTitle: 'Yamaha Marine 3S Main Dealer',
        pillars: [
            'Authorized Dealer of Yamaha Outboard Motors',
            'Genuine Parts and Accessories',
            'Yamalube Yamaha and Water Vehicles',
        ],
        offerTitle: 'What we offer',
        outboards: 'Outboard Motors',
        parts: 'Genuine Parts & Accessories',
        yamalube: 'Yamalube',
        visitEyebrow: 'Visit us',
        visitTitle: 'Two stores in Padang',
    },
    id: {
        storyEyebrow: 'Cerita kami',
        storyTitle: 'Main Dealer 3S Yamaha Marine',
        pillars: [
            'Dealer Resmi Mesin Tempel Yamaha',
            'Suku Cadang Asli dan Aksesoris',
            'Yamalube Yamaha dan Kendaraan Air',
        ],
        offerTitle: 'Yang kami tawarkan',
        outboards: 'Mesin Tempel',
        parts: 'Suku Cadang Asli & Aksesoris',
        yamalube: 'Yamalube',
        visitEyebrow: 'Kunjungi kami',
        visitTitle: 'Dua toko di Padang',
    },
};

// The three "What we offer" tiles. Images are decorative: the tile title names the link.
const TILES = [
    {
        key: 'outboards',
        href: '/products/four-strokes',
        src: '/images/FourStrokes/150pk.png',
        fit: 'contain',
        position: '50% 100%',
        sizes: '(min-width: 900px) 18vw, 40vw',
        variant: 'engine',
    },
    {
        key: 'parts',
        href: '/parts',
        src: '/images/parts2.jpg',
        fit: 'cover',
        position: '40% 50%',
        sizes: '(min-width: 900px) 33vw, 100vw',
        variant: 'parts',
    },
    {
        key: 'yamalube',
        href: '/yamalube',
        src: '/images/yamalube.jpg',
        fit: 'cover',
        position: '78% 50%',
        sizes: '(min-width: 900px) 33vw, 100vw',
        variant: 'lube',
    },
];

export default function AboutPage() {
    const { language } = useLanguage();
    const t = translations[language].about;
    const nav = translations[language].navbar;
    const c = COPY[language] || COPY.en;

    const story = [t.p2, t.p3, t.p4, t.p5];

    return (
        <>
            {/* The wrapper only re-tunes the mobile scrim token (home1 is mostly bright sky). */}
            <div className={styles.heroScope}>
                <PageHero
                    image="/images/home1.jpg"
                    imagePosition="50% 40%"
                    imagePositionMobile="35% 50%"
                    size="default"
                    eyebrow={t.title}
                    title="Perkasa Jaya Marine"
                    lead={t.p1}
                />
            </div>

            {/* Story: sticky summary on the left, the dealer's own words on the right */}
            <section className={'section ' + styles.story} aria-labelledby="about-story-title">
                <div className={'container ' + styles.storyGrid}>
                    <div className={styles.storyAside}>
                        <Reveal>
                            <Eyebrow>{c.storyEyebrow}</Eyebrow>
                            <h2 id="about-story-title" className={'h2 ' + styles.storyTitle}>
                                {c.storyTitle}
                            </h2>
                        </Reveal>

                        <StaggerGroup as="ul" className={styles.pillars} stagger={0.1} delayChildren={0.1}>
                            {/* Index keys: the items must survive a language switch after they've revealed. */}
                            {c.pillars.map((pillar, i) => (
                                <StaggerItem as="li" key={i} className={styles.pillar} y={12}>
                                    <KickerLine className={styles.pillarRule} delay={0.15 + i * 0.1} />
                                    <span>{pillar}</span>
                                </StaggerItem>
                            ))}
                        </StaggerGroup>
                    </div>

                    <StaggerGroup className={styles.storyBody} stagger={0.1} amount={0.1}>
                        {story.map((text, i) => (
                            <StaggerItem
                                as="p"
                                key={i}
                                className={i === 0 ? styles.paragraph + ' ' + styles.dropCap : styles.paragraph}
                            >
                                {text}
                            </StaggerItem>
                        ))}
                    </StaggerGroup>
                </div>
            </section>

            {/* What we offer: three image tiles into the product areas */}
            <section className="section section-alt" aria-labelledby="about-offer-title">
                <div className="container">
                    <SectionHeader id="about-offer-title" eyebrow={nav.products} title={c.offerTitle} />

                    <StaggerGroup as="ul" className={styles.tiles}>
                        {TILES.map((tile, i) => {
                            const tileClass = [
                                styles.tile,
                                styles[tile.variant],
                                tile.variant === 'engine' ? 'stage-light floor-shadow' : '',
                            ]
                                .filter(Boolean)
                                .join(' ');

                            return (
                                <StaggerItem as="li" key={tile.key} className={styles.tileCell}>
                                    <Link href={tile.href} className={tileClass}>
                                        <div className={styles.media}>
                                            <ImageReveal className={styles.reveal} delay={0.1 + i * 0.08}>
                                                <div className={styles.zoom}>
                                                    <Image
                                                        src={tile.src}
                                                        alt=""
                                                        fill
                                                        sizes={tile.sizes}
                                                        style={{ objectFit: tile.fit, objectPosition: tile.position }}
                                                    />
                                                </div>
                                            </ImageReveal>
                                        </div>

                                        <div className={styles.label}>
                                            <h3 className={styles.tileTitle}>
                                                {c[tile.key]}
                                                <ArrowRight className={styles.arrow} size={22} />
                                            </h3>
                                        </div>
                                    </Link>
                                </StaggerItem>
                            );
                        })}
                    </StaggerGroup>
                </div>
            </section>

            {/* Quote band: the dealer's promise, set large on deep navy */}
            <section className={'section section-deep on-dark ' + styles.quoteBand}>
                <Reveal className={'container ' + styles.quoteInner}>
                    <span className={styles.quoteMark} aria-hidden="true">
                        &ldquo;
                    </span>
                    <blockquote className={styles.quote}>
                        <p>{t.highlight}</p>
                    </blockquote>
                    <Eyebrow as="p" className={styles.signoff}>
                        {t.p6}
                    </Eyebrow>
                </Reveal>
            </section>

            {/* Stores */}
            <section className="section" aria-labelledby="about-visit-title">
                <div className="container">
                    <SectionHeader id="about-visit-title" eyebrow={c.visitEyebrow} title={c.visitTitle} />
                    <StoreCards tone="light" />
                </div>
            </section>

            <CtaBand />
        </>
    );
}
