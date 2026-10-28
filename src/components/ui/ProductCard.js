'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
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
 */
export default function ProductCard({
    product,
    series = 'four',
    headingLevel = 'h3',
    sizes = '(max-width: 640px) 45vw, (max-width: 1200px) 30vw, 300px',
}) {
    const { language } = useLanguage();
    const t = COPY[language] || COPY.en;
    const Heading = headingLevel;
    const hp = getHp(product.name);

    return (
        <Link href={seriesPath(series) + '/' + product.id} className={styles.card}>
            <div className={'stage-light floor-shadow ' + styles.stage}>
                <Image src={product.image} alt={product.name} fill sizes={sizes} className={styles.img} />
            </div>

            <div className={styles.body}>
                {hp && (
                    <p className={styles.hp}>
                        <span className={styles.hpNum}>{hp}</span>
                        <span className={styles.hpUnit}>{t.unit}</span>
                    </p>
                )}
                <Heading className={styles.model}>{product.name}</Heading>
                {product.tipeMesin && <p className={styles.type}>{product.tipeMesin}</p>}

                <span className={styles.footer}>
                    <span className={styles.more}>{t.view}</span>
                    <ArrowRight size={16} className={styles.arrow} />
                </span>
            </div>
        </Link>
    );
}
