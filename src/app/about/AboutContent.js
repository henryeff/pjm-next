'use client';

import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import KickerLine from '@/components/motion/KickerLine';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import Eyebrow from '@/components/ui/Eyebrow';
import StoreCards from '@/components/ui/StoreCards';
import CtaBand from '@/components/ui/CtaBand';
import RangeTile from '@/components/ui/RangeTile';

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

export default function AboutPage() {
    const { language } = useLanguage();
    const t = translations[language].about;
    const nav = translations[language].navbar;
    const c = COPY[language] || COPY.en;

    const story = [t.p2, t.p3, t.p4, t.p5];

    return (
        <>
            {/* Phones: photo band (both cowls in frame) with the copy on solid navy below it. */}
            <PageHero
                image="/images/home1.jpg"
                imagePosition="50% 40%"
                imagePositionMobile="62% 40%"
                size="default"
                eyebrow={t.title}
                title="Perkasa Jaya Marine"
                lead={t.p1}
            />

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

                    {/* Opening paragraph set as a lead; the closing mission paragraph carries a red rule. */}
                    <StaggerGroup className={styles.storyBody} stagger={0.1} amount={0.1}>
                        {story.map((text, i) => {
                            let paragraphClass = styles.paragraph;
                            if (i === 0) paragraphClass += ' ' + styles.storyLead;
                            if (i === story.length - 1) paragraphClass += ' ' + styles.mission;

                            return (
                                <StaggerItem as="p" key={i} className={paragraphClass}>
                                    {text}
                                </StaggerItem>
                            );
                        })}
                    </StaggerGroup>
                </div>
            </section>

            {/* What we offer: the shared RangeTile anatomy (media on top, label below) into each product area */}
            <section className="section section-alt" aria-labelledby="about-offer-title">
                <div className="container">
                    <SectionHeader id="about-offer-title" eyebrow={nav.products} title={c.offerTitle} />

                    <StaggerGroup as="ul" className={styles.offer}>
                        <StaggerItem as="li" className={styles.offerItem}>
                            <RangeTile
                                kind="engine"
                                src="/images/FourStrokes/150pk.png"
                                href="/products/four-strokes"
                                title={c.outboards}
                                sizes="(max-width: 767px) 80vw, 320px"
                            />
                        </StaggerItem>
                        <StaggerItem as="li" className={styles.offerItem}>
                            <RangeTile
                                kind="photo"
                                src="/images/parts2.jpg"
                                objectPosition="40% 50%"
                                href="/parts"
                                title={c.parts}
                                sizes="(max-width: 767px) 160vw, 680px"
                            />
                        </StaggerItem>
                        <StaggerItem as="li" className={styles.offerItem}>
                            <RangeTile
                                kind="photo"
                                src="/images/yamalube.jpg"
                                objectPosition="78% 50%"
                                href="/yamalube"
                                title={c.yamalube}
                                sizes="(max-width: 767px) 160vw, 680px"
                            />
                        </StaggerItem>
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
                    <SectionHeader id="about-visit-title" size="sm" eyebrow={c.visitEyebrow} title={c.visitTitle} />
                    <StoreCards tone="light" />
                </div>
            </section>

            <CtaBand />
        </>
    );
}
