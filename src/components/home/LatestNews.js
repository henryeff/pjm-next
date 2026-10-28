'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import SectionHeader from '@/components/ui/SectionHeader';
import { ArrowRight } from '@/components/ui/Icons';
import newsData from '@/data/news.json';
import styles from './LatestNews.module.css';

const COPY = {
    en: { eyebrow: 'News & guides', all: 'View all news', read: 'Read' },
    id: { eyebrow: 'Berita & panduan', all: 'Lihat semua berita', read: 'Baca' },
};

const COUNT = 3;

const MONTHS = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
};

/** "2026-02-19" or "12 December 2023" → local Date; anything else → null. */
function parseDate(str) {
    if (!str) return null;
    const s = String(str).trim();
    let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    m = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (m) {
        const month = MONTHS[m[2].toLowerCase()];
        if (month !== undefined) return new Date(Number(m[3]), month, Number(m[1]));
    }
    return null;
}

const pad = (n) => String(n).padStart(2, '0');
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Newest first (Array#sort is stable, so same-day posts keep their file order); undated posts go last.
const LATEST = newsData
    .map((item) => ({ item, date: parseDate(item.date) }))
    .sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date - a.date;
    })
    .slice(0, COUNT);

/** The three newest posts as a text list (no thumbnails). Each opens its article on the News page. */
export default function LatestNews({ titleId = 'home-news-title' }) {
    const { language } = useLanguage();
    const c = COPY[language] || COPY.en;
    const tNews = translations[language].news;
    const fmt = new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <section className={'section ' + styles.news} aria-labelledby={titleId}>
            <div className="container">
                <SectionHeader
                    size="sm"
                    eyebrow={c.eyebrow}
                    title={tNews.title}
                    id={titleId}
                    action={{ label: c.all, href: '/news' }}
                />

                <StaggerGroup as="ul" className={styles.list}>
                    {LATEST.map(({ item, date }) => (
                        <StaggerItem as="li" key={item.id} className={styles.item}>
                            <Link href={`/news#${encodeURIComponent(item.id)}`} className={styles.link}>
                                {date ? (
                                    <time className={'eyebrow eyebrow-plain ' + styles.date} dateTime={isoDate(date)}>
                                        {fmt.format(date)}
                                    </time>
                                ) : (
                                    item.date && <span className={'eyebrow eyebrow-plain ' + styles.date}>{item.date}</span>
                                )}
                                <h3 className={styles.title}>{item.title}</h3>
                                <span className={styles.read}>
                                    {c.read}
                                    <ArrowRight size={16} className={styles.arrow} />
                                </span>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerGroup>
            </div>
        </section>
    );
}
