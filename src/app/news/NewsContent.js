'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import { ArrowRight } from '@/components/ui/Icons';
import Reveal from '@/components/motion/Reveal';
import ImageReveal from '@/components/motion/ImageReveal';
import { StaggerGroup } from '@/components/motion/Stagger';
import NewsCard from '@/components/news/NewsCard';
import NewsDate from '@/components/news/NewsDate';
import { categoryLabel, getHighlight, isDuotone } from '@/components/news/newsUtils';
import { newsHref } from '@/lib/paths';

const COPY = {
    id: {
        home: 'Beranda',
        crumb: 'Berita',
        eyebrow: 'Dealer Resmi Yamaha Marine · Padang',
        title: 'Berita & Panduan Mesin Tempel Yamaha',
        lead: 'Kabar dari Perkasa Jaya Marine dan panduan praktis untuk memilih, merawat, dan menyervis mesin tempel Yamaha.',
        more: 'Berita & panduan lainnya',
    },
    en: {
        home: 'Home',
        crumb: 'News',
        eyebrow: 'Authorized Yamaha Marine dealer · Padang',
        title: 'Yamaha Outboard News & Guides',
        lead: 'News from Perkasa Jaya Marine and practical guides to choosing, maintaining and servicing Yamaha outboards. Most guides are written in Indonesian.',
        more: 'More news & guides',
    },
};

function readHashId() {
    const raw = window.location.hash.slice(1);
    if (!raw) return '';
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
}

/**
 * /news: text-first featured story (the newest post) + an editorial grid. Every story links to its own
 * server-rendered article page (/news/<slug>). `items` are card fields from newsCards() (newest first).
 */
export default function NewsContent({ items = [] }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const t = translations[lang].news;
    const c = COPY[lang];
    const router = useRouter();

    const [featured, ...rest] = items;
    // Stock imagery gets the navy duotone; a real dealership photo stays in natural colour.
    const featuredDuo = featured ? isDuotone(featured.image) : false;

    // Old deep links (/news#<id>, used by the home page before articles had URLs) → the article page.
    useEffect(() => {
        const redirectFromHash = () => {
            const id = readHashId();
            if (!id) return;
            const match = items.find((n) => n.id === id || n.slug === id);
            if (match) router.replace(newsHref(match));
        };
        redirectFromHash();
        window.addEventListener('hashchange', redirectFromHash);
        return () => window.removeEventListener('hashchange', redirectFromHash);
    }, [items, router]);

    return (
        <>
            <PageHero
                size="compact"
                eyebrow={c.eyebrow}
                title={c.title}
                lead={c.lead}
                breadcrumbs={[{ label: c.home, href: '/' }, { label: c.crumb }]}
            />

            <div className={'section ' + styles.page}>
                <div className="container">
                    {/* Text-first: the headline is the on-topic part. ≥1024px the body leads (7fr) and the
                        photo sits beside it (5fr); below that the photo comes first. Stock photos get the navy duotone. */}
                    {featured && (
                        <article className={styles.featured}>
                            <ImageReveal
                                immediate
                                className={styles.featuredMedia + (featuredDuo ? ' ' + styles.featuredDuo : '')}
                            >
                                <Image
                                    src={featured.image}
                                    alt={featured.imageAlt || featured.title}
                                    fill
                                    preload
                                    fetchPriority="high"
                                    sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, 100vw"
                                    className={styles.featuredImg}
                                />
                                {featuredDuo && (
                                    <>
                                        <span className={styles.duoShadow} aria-hidden="true" />
                                        <span className={styles.duoTint} aria-hidden="true" />
                                    </>
                                )}
                            </ImageReveal>

                            <Reveal immediate delay={0.15} className={styles.featuredBody}>
                                <NewsDate
                                    value={featured.date}
                                    language={lang}
                                    prefix={categoryLabel(featured.category, lang)}
                                />
                                <h2 className={styles.featuredTitle}>
                                    <Link href={newsHref(featured)} className={styles.storyLink}>
                                        <span className={styles.featuredClamp}>{featured.title}</span>
                                    </Link>
                                </h2>
                                <p className={styles.featuredExcerpt}>{getHighlight(featured.excerpt, 220)}</p>
                                <span className={'btn btn-link ' + styles.featuredMore} aria-hidden="true">
                                    {t.readMore}
                                    <ArrowRight className="btn-arrow" />
                                </span>
                            </Reveal>
                        </article>
                    )}

                    {rest.length > 0 && (
                        <section className={styles.more} aria-labelledby="news-more-title">
                            <Reveal>
                                <h2 id="news-more-title" className={'eyebrow ' + styles.moreTitle}>
                                    {c.more}
                                </h2>
                            </Reveal>

                            <StaggerGroup className={styles.grid} amount={0.05}>
                                {rest.map((item) => (
                                    <NewsCard key={item.id} item={item} language={lang} readMore={t.readMore} />
                                ))}
                            </StaggerGroup>
                        </section>
                    )}
                </div>
            </div>

            <CtaBand />
        </>
    );
}
