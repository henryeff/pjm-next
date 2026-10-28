'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Cutout from './Cutout';
import { ArrowRight } from './Icons';
import { getHp, seriesPath } from './productUtils';
import styles from './ProductCard.module.css';

const COPY = {
    en: { view: 'View details', unit: 'HP' },
    id: { view: 'Lihat detail', unit: 'PK' },
};

/**
 * One engine as a single link card: lit stage + big HP numeral + model code.
 * series: 'four' | 'two' (decides the detail URL).
 * Wrap it in a StaggerItem if you want an entrance — the card's own hover lift lives on the <a>.
 * sizes: the rendered engine width (the cut-out sits inside 10% padding).
 * priority / fetchPriority: pass to the first card(s) of a listing — their engine is the LCP image on
 *   phones and tablets. Off by default (Home's lineup is below the fold).
 */
export default function ProductCard({
    product,
    series = 'four',
    headingLevel = 'h3',
    sizes = '(max-width: 640px) 45vw, (max-width: 1200px) 30vw, 300px',
    priority = false,
    fetchPriority,
}) {
    const { language } = useLanguage();
    const t = COPY[language] || COPY.en;
    const Heading = headingLevel;
    const hp = getHp(product.name);

    return (
        <Link href={seriesPath(series) + '/' + product.id} className={styles.card}>
            <div className={'stage-light floor-shadow ' + styles.stage}>
                <Cutout
                    src={product.image}
                    alt={product.name}
                    sizes={sizes}
                    priority={priority}
                    fetchPriority={fetchPriority}
                    className={styles.cutout}
                />
            </div>

            <div className={styles.body}>
                {hp && (
                    <p className={styles.hp}>
                        <span className={styles.hpNum}>{hp}</span>
                        <span className={styles.hpUnit}>{t.unit}</span>
                    </p>
                )}
                <Heading className={styles.model}>
                    {product.name}
                    {/* Phones: the footer row is hidden and this arrow marks the card as a link. */}
                    <ArrowRight size={14} aria-hidden="true" className={styles.inlineArrow} />
                </Heading>
                {product.tipeMesin && <p className={styles.type}>{product.tipeMesin}</p>}

                <span className={styles.footer}>
                    <span className={styles.more}>{t.view}</span>
                    <ArrowRight size={16} className={styles.arrow} />
                </span>
            </div>
        </Link>
    );
}
