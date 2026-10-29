'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import Cutout from '@/components/ui/Cutout';
import Eyebrow from '@/components/ui/Eyebrow';
import { ArrowRight } from '@/components/ui/Icons';
import { formatSpec, getHp } from '@/components/ui/productUtils';
import { productHref, seriesHref } from '@/lib/paths';
import styles from './Spotlight.module.css';

const COPY = {
    id: {
        eyebrow: 'Tenaga tertinggi di jajaran kami',
        specs: 'Lihat spesifikasi',
        all: 'Semua 4 Tak',
        unit: 'PK',
        alt: (name, hp) => `Mesin tempel Yamaha 4 tak ${name}${hp ? ` ${hp.replace('.', ',')} PK` : ''}`,
        stats: {
            volume: 'Volume Silinder',
            diameter: 'Diameter x Langkah',
            jangkauan: 'Putaran Maks.',
            berat: 'Berat',
            sistemInduksi: 'Sistem Induksi',
        },
    },
    en: {
        eyebrow: 'Highest output in our range',
        specs: 'View specifications',
        all: 'All 4 Strokes',
        unit: 'HP',
        alt: (name, hp) => `Yamaha ${name}${hp ? ` ${hp} HP` : ''} 4-stroke outboard`,
        stats: {
            volume: 'Displacement',
            diameter: 'Bore x Stroke',
            jangkauan: 'Max RPM',
            berat: 'Weight',
            sistemInduksi: 'Induction',
        },
    },
};

const STAT_KEYS = ['volume', 'diameter', 'jangkauan', 'berat', 'sistemInduksi'];

// The rendered width of the engine (contain-fit in the box, files up to 0.89:1): the box is
// min(360px, 88vw) tall ≤640px, min(440px, 88vw) ≤1023px, and clamp(340px, 40vw, 560px) above.
const IMAGE_SIZES = '(max-width: 1023px) min(79vw, 392px), min(36vw, 500px)';

/**
 * The highest-output 4-stroke on the dark stage. `product` comes from the server page
 * (src/app/page.js): { id, slug, name, image, tipeMesin, ...the spec fields in STAT_KEYS }.
 */
export default function Spotlight({ product, titleId = 'home-spotlight-title' }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const c = COPY[lang];

    if (!product) return null;

    const hp = getHp(product.name);
    // The name already ends in "-NNPK" for some models; only add the PK figure when it doesn't.
    const altHp = /PK$/i.test(product.name) ? null : hp;
    const stats = STAT_KEYS.filter((key) => product[key] && String(product[key]).trim()).slice(0, 4);

    return (
        <section className={'section on-dark stage-dark ' + styles.spotlight} aria-labelledby={titleId}>
            <div className={'container ' + styles.grid}>
                <div className={styles.media}>
                    {hp && (
                        <span className={styles.watermark} aria-hidden="true">
                            {hp}
                        </span>
                    )}
                    <Reveal
                        className={styles.figure}
                        y={0}
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        duration={0.9}
                    >
                        {/* Cutout feathers the cropped top and right edges of the source PNG. */}
                        <div className={'floor-shadow ' + styles.imgBox}>
                            <Cutout src={product.image} alt={c.alt(product.name, altHp)} sizes={IMAGE_SIZES} />
                        </div>
                    </Reveal>
                </div>

                <div className={styles.copy}>
                    <Reveal>
                        <Eyebrow>{c.eyebrow}</Eyebrow>
                        <h2 id={titleId} className={'display ' + styles.name}>
                            {product.name}
                        </h2>
                        {hp && (
                            <p className={styles.hp}>
                                <span className="tabular">{hp}</span> {c.unit}
                            </p>
                        )}
                        {product.tipeMesin && <p className={styles.type}>{product.tipeMesin}</p>}
                    </Reveal>

                    {stats.length > 0 && (
                        <StaggerGroup as="dl" className={styles.stats}>
                            {stats.map((key) => (
                                <StaggerItem key={key} className={styles.stat} y={12}>
                                    <dt>{c.stats[key]}</dt>
                                    <dd className="tabular">{formatSpec(product[key])}</dd>
                                </StaggerItem>
                            ))}
                        </StaggerGroup>
                    )}

                    <Reveal className={styles.actions} delay={0.1}>
                        <Link href={productHref('four', product)} className="btn btn-primary btn-lg btn-block-sm">
                            {c.specs}
                            <ArrowRight className="btn-arrow" />
                        </Link>
                        <Link href={seriesHref('four')} className="btn btn-link">
                            {c.all}
                            <ArrowRight className="btn-arrow" />
                        </Link>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
