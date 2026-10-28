'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
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
import NewsModal from '@/components/news/NewsModal';
import { SORTED_NEWS, getHighlight } from '@/components/news/newsUtils';

const COPY = {
    en: { eyebrow: 'News & guides', more: 'More stories', close: 'Close' },
    id: { eyebrow: 'Berita & panduan', more: 'Berita lainnya', close: 'Tutup' },
};

// Newest first: the 2026 guides lead. The newest post is the featured story.
const [FEATURED, ...REST] = SORTED_NEWS;

function readHashId() {
    const raw = window.location.hash.slice(1);
    if (!raw) return '';
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
}

export default function NewsContent() {
    const { language } = useLanguage();
    const t = translations[language].news;
    const c = COPY[language] || COPY.en;

    const [selected, setSelected] = useState(null);
    // The button that opened the dialog (null when it was opened from a /news#<id> deep link).
    const openerRef = useRef(null);

    const openStory = (item, opener) => {
        openerRef.current = opener || null;
        setSelected(item);
    };

    const closeStory = () => {
        const current = selected;
        setSelected(null);

        if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }

        // Give focus back to the card that opened the story (or that story's card after a deep link).
        let target = openerRef.current;
        openerRef.current = null;
        if ((!target || !target.isConnected) && current) {
            target = document.querySelector(`[data-news-id="${CSS.escape(current.id)}"]`);
        }
        target?.focus({ preventScroll: true });
    };

    // Deep link: /news#<id> opens that story (the home page links here).
    useEffect(() => {
        const openFromHash = () => {
            const id = readHashId();
            if (!id) return;
            const match = SORTED_NEWS.find((n) => n.id === id);
            if (match) {
                openerRef.current = null;
                setSelected(match);
            }
        };

        openFromHash();
        window.addEventListener('hashchange', openFromHash);
        return () => window.removeEventListener('hashchange', openFromHash);
    }, []);

    return (
        <>
            <PageHero size="compact" eyebrow={c.eyebrow} title={t.title} />

            <div className={'section ' + styles.page}>
                <div className="container">
                    {/* Text-first: the headline is the on-topic part. ≥1024px the body leads (7fr) and the
                        duotone photo sits beside it (5fr); below that the photo comes first. */}
                    {FEATURED && (
                        <article id={FEATURED.id} className={styles.featured}>
                            <ImageReveal immediate className={styles.featuredMedia}>
                                <Image
                                    src={FEATURED.image}
                                    alt={FEATURED.title}
                                    fill
                                    priority
                                    sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, 100vw"
                                    className={styles.featuredImg}
                                />
                                <span className={styles.featuredShade} aria-hidden="true" />
                            </ImageReveal>

                            <Reveal immediate delay={0.15} className={styles.featuredBody}>
                                <NewsDate value={FEATURED.date} language={language} />
                                <h2 className={styles.featuredTitle}>
                                    <button
                                        type="button"
                                        className={styles.storyButton}
                                        data-news-id={FEATURED.id}
                                        onClick={(e) => openStory(FEATURED, e.currentTarget)}
                                    >
                                        <span className={styles.featuredClamp}>{FEATURED.title}</span>
                                    </button>
                                </h2>
                                <p className={styles.featuredExcerpt}>{getHighlight(FEATURED.excerpt)}</p>
                                <span className={'btn btn-link ' + styles.featuredMore} aria-hidden="true">
                                    {t.readMore}
                                    <ArrowRight className="btn-arrow" />
                                </span>
                            </Reveal>
                        </article>
                    )}

                    {REST.length > 0 && (
                        <section className={styles.more} aria-labelledby="news-more-title">
                            <Reveal>
                                <h2 id="news-more-title" className={'eyebrow ' + styles.moreTitle}>
                                    {c.more}
                                </h2>
                            </Reveal>

                            <StaggerGroup className={styles.grid} amount={0.05}>
                                {REST.map((item) => (
                                    <NewsCard
                                        key={item.id}
                                        item={item}
                                        language={language}
                                        readMore={t.readMore}
                                        onOpen={openStory}
                                    />
                                ))}
                            </StaggerGroup>
                        </section>
                    )}
                </div>
            </div>

            <CtaBand />

            <NewsModal item={selected} language={language} closeLabel={c.close} onClose={closeStory} />
        </>
    );
}
