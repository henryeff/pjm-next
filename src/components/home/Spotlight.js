'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import Eyebrow from '@/components/ui/Eyebrow';
import { ArrowRight } from '@/components/ui/Icons';
import { getHp } from '@/components/ui/productUtils';
import fourStrokes from '@/data/four-strokes.json';
import styles from './Spotlight.module.css';

const COPY = {
    en: {
        eyebrow: 'Highest output in our range',
        specs: 'View specifications',
        all: 'All 4 Strokes',
        unit: 'HP',
        stats: {
            volume: 'Displacement',
            diameter: 'Bore x Stroke',
            jangkauan: 'Max RPM',
            berat: 'Weight',
            sistemInduksi: 'Induction',
        },
    },
    id: {
        eyebrow: 'Tenaga tertinggi di jajaran kami',
        specs: 'Lihat spesifikasi',
        all: 'Semua 4 Tak',
        unit: 'PK',
        stats: {
            volume: 'Volume Silinder',
            diameter: 'Diameter x Langkah',
            jangkauan: 'Putaran Maks.',
            berat: 'Berat',
            sistemInduksi: 'Sistem Induksi',
        },
    },
};

const STAT_KEYS = ['volume', 'diameter', 'jangkauan', 'berat', 'sistemInduksi'];

const hpOf = (p) => {
    const n = Number(getHp(p.name));
    return Number.isFinite(n) ? n : 0;
};

// The 4-stroke with the highest horsepower, straight from the data (first one wins a tie).
const PRODUCT = fourStrokes.reduce((best, p) => (hpOf(p) > hpOf(best) ? p : best), fourStrokes[0]);
const HP = getHp(PRODUCT.name);

// Display only: "5559cc" → "5559 cc", "5000-6000rpm" → "5000–6000 rpm". The values themselves are untouched.
const formatStat = (value) =>
    String(value)
        .trim()
        .replace(/(\d)\s*-\s*(\d)/g, '$1–$2')
        .replace(/(\d)(cc|rpm|kg)$/i, '$1 $2');

const STATS = STAT_KEYS.filter((key) => PRODUCT[key] && String(PRODUCT[key]).trim()).slice(0, 4);

export default function Spotlight({ titleId = 'home-spotlight-title' }) {
    const { language } = useLanguage();
    const c = COPY[language] || COPY.en;

    return (
        <section className={'section on-dark stage-dark ' + styles.spotlight} aria-labelledby={titleId}>
            <div className={'container ' + styles.grid}>
                <div className={styles.media}>
                    {HP && (
                        <span className={styles.watermark} aria-hidden="true">
                            {HP}
                        </span>
                    )}
                    <Reveal
                        className={styles.figure}
                        y={0}
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        duration={0.9}
                    >
                        <div className={'floor-shadow ' + styles.imgBox}>
                            <Image
                                src={PRODUCT.image}
                                alt={PRODUCT.name}
                                fill
                                sizes="(max-width: 1023px) 92vw, 640px"
                                className={styles.img}
                            />
                        </div>
                    </Reveal>
                </div>

                <div className={styles.copy}>
                    <Reveal>
                        <Eyebrow>{c.eyebrow}</Eyebrow>
                        <h2 id={titleId} className={'display ' + styles.name}>
                            {PRODUCT.name}
                        </h2>
                        {HP && (
                            <p className={styles.hp}>
                                <span className="tabular">{HP}</span> {c.unit}
                            </p>
                        )}
                        {PRODUCT.tipeMesin && <p className={styles.type}>{PRODUCT.tipeMesin}</p>}
                    </Reveal>

                    {STATS.length > 0 && (
                        <StaggerGroup as="dl" className={styles.stats}>
                            {STATS.map((key) => (
                                <StaggerItem key={key} className={styles.stat} y={12}>
                                    <dt>{c.stats[key]}</dt>
                                    <dd className="tabular">{formatStat(PRODUCT[key])}</dd>
                                </StaggerItem>
                            ))}
                        </StaggerGroup>
                    )}

                    <Reveal className={styles.actions} delay={0.1}>
                        <Link href={'/products/four-strokes/' + PRODUCT.id} className="btn btn-primary btn-lg btn-block-sm">
                            {c.specs}
                            <ArrowRight className="btn-arrow" />
                        </Link>
                        <Link href="/products/four-strokes" className="btn btn-link">
                            {c.all}
                            <ArrowRight className="btn-arrow" />
                        </Link>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
