'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal from '@/components/motion/Reveal';
import ImageReveal from '@/components/motion/ImageReveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import Eyebrow from '@/components/ui/Eyebrow';
import CtaBand from '@/components/ui/CtaBand';
import { Chat, Check } from '@/components/ui/Icons';
import VideoFacade from '@/components/yamalube/VideoFacade';

// Page-only labels (translations.js carries the hero, intro and product copy for this page).
const COPY = {
    en: {
        heroAlt: 'Yamalube oils and Yamaha genuine parts in front of a Yamaha four-stroke outboard',
        askYamalube: 'Ask about Yamalube',
        findStore: 'Find a store',
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
        heroAlt: 'Oli Yamalube dan suku cadang asli Yamaha di depan mesin tempel Yamaha empat tak',
        askYamalube: 'Tanya tentang Yamalube',
        findStore: 'Cari toko',
        chatQuery: 'Oli Yamalube mana yang cocok untuk mesin tempel saya?',
        introEyebrow: 'Diformulasikan untuk kondisi laut',
        introTitle: 'Dibuat untuk mesin tempel Yamaha',
        rangeAlt: 'Oli mesin 2 tak dan 4 tak serta pelumas roda gigi Yamalube dalam botol, pail, dan tube',
        rangeCaption: 'Rangkaian Yamalube untuk mesin tempel',
        productsEyebrow: 'Produk',
        productsTitle: 'Oli mesin & pelumas roda gigi',
        jumpLabel: 'Produk Yamalube',
        packagingCaption: (title) => `${title} – kemasan`,
        colPart: 'Nomor Bagian',
        colVolume: 'Volume',
        colPackaging: 'Kemasan',
        packaging: { bottle: 'Botol', pail: 'Pail', drum: 'Drum', tube: 'Tube' },
        kinds: {
            '2t': '2 Tak',
            '4t': '4 Tak',
            gl4: 'Pelumas roda gigi · GL-4',
            gl5: 'Pelumas roda gigi · GL-5',
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

// Keep hyphenated tokens ("2-Stroke", "GL-4") on one line so titles never break as "2-" / "Stroke".
function keepHyphensTogether(text) {
    return text
        .split(/(\S*\w-\w\S*)/)
        .map((part, i) => (i % 2 ? <span key={i} className={styles.nowrap}>{part}</span> : part));
}

export default function YamalubePage() {
    const { language } = useLanguage();
    const t = translations[language].yamalube;
    const c = COPY[language] || COPY.en;
    const chatHref = '/chat?q=' + encodeURIComponent(c.chatQuery);

    return (
        <>
            <PageHero
                image="/images/yamalube.jpg"
                imageAlt={c.heroAlt}
                imagePosition="82% 50%"
                imagePositionMobile="62% 50%"
                bandHeight="min(70vw, 300px)"
                scrim="strong"
                size="tall"
                eyebrow="Yamalube"
                title={t.heroTitle}
                lead={t.heroSubtitle}
            >
                <Link href={chatHref} className="btn btn-primary btn-lg btn-block-sm">
                    <Chat />
                    {c.askYamalube}
                </Link>
                <Link href="/contact" className="btn btn-ghost btn-lg btn-block-sm">
                    {c.findStore}
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
                    <nav aria-label={c.jumpLabel} className={'no-scrollbar ' + styles.jump}>
                        {PRODUCTS.map((product) => (
                            <a key={product.id} href={'#yamalube-' + product.id} className={styles.jumpLink}>
                                {c.kinds[product.id]}
                            </a>
                        ))}
                    </nav>

                    <StaggerGroup className={styles.productGrid} amount={0.05}>
                        {PRODUCTS.map((product) => {
                            const title = t[product.titleKey];
                            return (
                                <StaggerItem
                                    key={product.id}
                                    as="article"
                                    id={'yamalube-' + product.id}
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

            <CtaBand chatQuery={c.chatQuery} title={c.ctaTitle} />
        </>
    );
}
