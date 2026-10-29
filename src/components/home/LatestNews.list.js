'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import SectionHeader from '@/components/ui/SectionHeader';
import { ArrowRight } from '@/components/ui/Icons';
import NewsDate from '@/components/news/NewsDate';
import { categoryLabel } from '@/components/news/newsUtils';
import { newsHref } from '@/lib/paths';
import styles from './LatestNews.module.css';

const COPY = {
    en: { eyebrow: 'News & guides', all: 'View all news & guides', read: 'Read' },
    id: { eyebrow: 'Berita & panduan', all: 'Lihat semua berita & panduan', read: 'Baca' },
};

/**
 * The newest posts as a text list (no thumbnails). Each row links to its article page (/news/<slug>).
 * items: [{ id, slug, title, date, category }] — newest first.
 */
export default function LatestNewsList({ items = [], titleId = 'home-news-title' }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const c = COPY[lang];
    const tNews = translations[lang].news;

    if (items.length === 0) return null;

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
                    {items.map((item) => (
                        <StaggerItem as="li" key={item.id} className={styles.item}>
                            <Link href={newsHref(item)} className={styles.link}>
                                <NewsDate
                                    value={item.date}
                                    language={lang}
                                    prefix={categoryLabel(item.category, lang)}
                                    className={styles.date}
                                />
                                <h3 className={styles.title}>{item.title}</h3>
                                <span className={styles.read} aria-hidden="true">
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
