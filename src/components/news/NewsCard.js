'use client';

import Image from 'next/image';
import { StaggerItem } from '@/components/motion/Stagger';
import { ArrowRight } from '@/components/ui/Icons';
import NewsDate from './NewsDate';
import { getHighlight } from './newsUtils';
import styles from './NewsCard.module.css';

/**
 * Grid story card (no border, no shadow). The title is a <button> whose ::after stretches over the
 * whole card, so the card is one click target with the title as its accessible name.
 * Under 640px it collapses to a compact row: 112px thumbnail + date + title.
 */
export default function NewsCard({ item, language, readMore, onOpen }) {
    return (
        <StaggerItem as="article" id={item.id} className={styles.card}>
            <div className={styles.thumb}>
                <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1280px) 384px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 112px"
                    className={styles.img}
                />
            </div>

            <div className={styles.body}>
                <NewsDate value={item.date} language={language} className={styles.date} />
                <h3 className={styles.title}>
                    <button
                        type="button"
                        className={styles.button}
                        data-news-id={item.id}
                        onClick={(e) => onOpen(item, e.currentTarget)}
                    >
                        <span className={styles.clamp}>{item.title}</span>
                    </button>
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
