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
import StoreCards from '@/components/ui/StoreCards';
import CtaBand from '@/components/ui/CtaBand';
import { Chat } from '@/components/ui/Icons';

// Page-only labels (translations.js only carries the title and description for this page).
const COPY = {
    en: {
        heroEyebrow: 'Parts & accessories',
        heroAlt: 'Close-up of machined aluminium with water droplets',
        askPart: 'Ask about a part',
        contactStore: 'Contact a store',
        chatQuery: "I'm looking for a Yamaha genuine part for my outboard.",
        howEyebrow: 'How it works',
        howTitle: 'How to get the right part',
        steps: [
            'Tell us your engine model',
            'Chat with us or call a store',
            'Pick up at one of our two stores in Padang',
        ],
        rangeAlt: 'Yamaha Components',
        rangeCaption: 'Yamaha Genuine Parts & Accessories',
        visitEyebrow: 'Visit us',
        visitTitle: 'Two stores in Padang',
        ctaTitle: 'Not sure which part you need?',
    },
    id: {
        heroEyebrow: 'Suku cadang & aksesori',
        heroAlt: 'Detail aluminium hasil mesin bubut dengan butiran air',
        askPart: 'Tanya suku cadang',
        contactStore: 'Hubungi toko',
        chatQuery: 'Saya mencari suku cadang asli Yamaha untuk mesin tempel saya.',
        howEyebrow: 'Cara kerjanya',
        howTitle: 'Cara mendapatkan suku cadang yang tepat',
        steps: [
            'Sebutkan model mesin Anda',
            'Chat atau telepon toko kami',
            'Ambil di salah satu dari dua toko kami di Padang',
        ],
        rangeAlt: 'Komponen Yamaha',
        rangeCaption: 'Suku Cadang & Aksesori Asli Yamaha',
        visitEyebrow: 'Kunjungi kami',
        visitTitle: 'Dua toko di Padang',
        ctaTitle: 'Tidak yakin suku cadang mana yang Anda butuhkan?',
    },
};

export default function PartsPage() {
    const { language } = useLanguage();
    const t = translations[language].parts;
    const c = COPY[language] || COPY.en;

    return (
        <>
            {/* Phones: the shared photo band puts the machined detail above the copy. Desktop: the strong scrim keeps
                the headline on the dark side of the metal. */}
            <PageHero
                image="/images/parts-hero-machined.jpg"
                imageAlt={c.heroAlt}
                imagePosition="50% 50%"
                imagePositionMobile="85% 50%"
                bandHeight="min(74vw, 320px)"
                scrim="strong"
                size="default"
                eyebrow={c.heroEyebrow}
                title={t.title}
                lead={t.description}
            >
                <Link
                    href={'/chat?q=' + encodeURIComponent(c.chatQuery)}
                    className="btn btn-primary btn-lg btn-block-sm"
                >
                    <Chat />
                    {c.askPart}
                </Link>
                <Link href="/contact" className="btn btn-ghost btn-lg btn-block-sm">
                    {c.contactStore}
                </Link>
            </PageHero>

            {/* How to get the right part: header left, numbered steps right (stacked below 1024px), then the
                genuine parts & accessories pack shot across the full row. */}
            <section className="section" aria-labelledby="parts-how-title">
                <div className={'container ' + styles.howGrid}>
                    <SectionHeader
                        id="parts-how-title"
                        eyebrow={c.howEyebrow}
                        title={c.howTitle}
                        className={styles.howHeader}
                    />

                    {/* role="list" keeps list semantics in Safari once list-style is removed. */}
                    <StaggerGroup as="ol" role="list" className={styles.steps} stagger={0.1}>
                        {/* Index keys: the rows must survive a language switch after they've revealed. */}
                        {c.steps.map((step, i) => (
                            <StaggerItem as="li" key={i} className={styles.step} y={16}>
                                <span className={styles.stepNum} aria-hidden="true">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <p className={styles.stepText}>{step}</p>
                            </StaggerItem>
                        ))}
                    </StaggerGroup>

                    {/* Pack shot on the white section, no card chrome: wide screens show the whole range at its
                        natural ratio; phones/tablets bleed to the screen edge and crop in on the propeller boxes,
                        gears and con-rod so the parts read at a usable size. */}
                    <figure className={styles.rangeFigure}>
                        <ImageReveal className={styles.range}>
                            <Image
                                src="/images/parts2.jpg"
                                alt={c.rangeAlt}
                                fill
                                sizes="(max-width: 640px) 170vw, (max-width: 1023px) 130vw, 1080px"
                                className={styles.rangeImg}
                            />
                        </ImageReveal>
                        <Reveal as="figcaption" className={'eyebrow eyebrow-plain ' + styles.caption} delay={0.2} y={8}>
                            {c.rangeCaption}
                        </Reveal>
                    </figure>
                </div>
            </section>

            {/* Stores: grey, so the white how-it-works section doesn't run straight into them. */}
            <section className="section section-alt" aria-labelledby="parts-visit-title">
                <div className="container">
                    <SectionHeader id="parts-visit-title" size="sm" eyebrow={c.visitEyebrow} title={c.visitTitle} />
                    <StoreCards tone="light" />
                </div>
            </section>

            <CtaBand chatQuery={c.chatQuery} title={c.ctaTitle} />
        </>
    );
}
