'use client';

import Image from 'next/image';
import Link from 'next/link';
import { StaggerItem } from '@/components/motion/Stagger';
import { ArrowRight } from '@/components/ui/Icons';
import { newsHref } from '@/lib/paths';
import NewsDate from './NewsDate';
import { categoryLabel, getHighlight, isDuotone } from './newsUtils';
import styles from './NewsCard.module.css';

/**
 * Grid story card (no border, no shadow). The title is a link to the article page (/news/<slug>) whose
 * ::after stretches over the whole card, so the card is one click target with the title as its name.
 * Under 640px it collapses to a compact row: 112px thumbnail + date + title.
 * Stock imagery gets the navy duotone (`.duo`); the real dealership photos stay in natural colour.
 *
 * item: card fields from newsCardFields() in './newsServer' ({ id, slug, title, date, excerpt, image,
 * imageAlt, category }).
 */
export default function NewsCard({ item, language, readMore }) {
    const thumbClass = styles.thumb + (isDuotone(item.image) ? ' ' + styles.duo : '');

    return (
        <StaggerItem as="article" className={styles.card}>
            <div className={thumbClass}>
                <Image
                    src={item.image}
                    alt={item.imageAlt || item.title}
                    fill
                    sizes="(min-width: 1280px) 384px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 112px"
                    className={styles.img}
                />
            </div>

            <div className={styles.body}>
                <NewsDate
                    value={item.date}
                    language={language}
                    prefix={categoryLabel(item.category, language)}
                    className={styles.date}
                />
                <h3 className={styles.title}>
                    <Link href={newsHref(item)} className={styles.link}>
                        <span className={styles.clamp}>{item.title}</span>
                    </Link>
                </h3>
                <p className={styles.excerpt}>{getHighlight(item.excerpt)}</p>
                <span className={styles.more} aria-hidden="true">
                    {readMore}
                    <ArrowRight size={16} className={styles.arrow} />
                </span>
            </div>
        </StaggerItem>
    );
}
