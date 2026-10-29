'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import CtaBand from '@/components/ui/CtaBand';
import { ArrowRight, Clock, WhatsApp } from '@/components/ui/Icons';
import { StaggerGroup } from '@/components/motion/Stagger';
import { HOURS, PRICE_NOTE, waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import NewsCard from './NewsCard';
import { categoryLabel, formatDate } from './newsUtils';
import styles from './NewsArticle.module.css';

const COPY = {
    id: {
        home: 'Beranda',
        news: 'Berita',
        published: 'Diterbitkan',
        updated: 'Diperbarui',
        minutes: (n) => `${n} menit baca`,
        langNote: 'Artikel ini ditulis dalam bahasa Inggris.',
        archived: (date) =>
            `Ini berita lama yang diterbitkan pada ${date}. Informasi produk dan ketersediaannya mungkin sudah berubah; hubungi kami untuk info terbaru.`,
        toc: 'Daftar isi',
        links: 'Halaman terkait',
        relatedEyebrow: 'Baca juga',
        related: 'Artikel terkait',
        all: 'Semua berita & panduan',
        whatsapp: 'WhatsApp',
        whatsappLabel: 'Chat lewat WhatsApp',
        hours: 'Kedua toko',
        help: {
            general: { title: 'Ada pertanyaan?', text: 'Tanyakan apa saja tentang mesin tempel Yamaha kepada kami.' },
            price: { title: 'Cari mesin tempel?', text: `${PRICE_NOTE.id}.` },
            service: {
                title: 'Perlu servis?',
                text: 'Semua jenis servis mesin tempel Yamaha dikerjakan di bengkel Toko Tunggal Jaya, Padang.',
            },
            parts: { title: 'Cari suku cadang?', text: 'Tanyakan suku cadang asli Yamaha untuk model mesin Anda.' },
            oil: { title: 'Butuh Yamalube?', text: 'Tanyakan jenis dan kemasan Yamalube yang tepat untuk mesin Anda.' },
        },
        helpLink: {
            general: { href: '/faq', label: 'Tanya jawab (FAQ)' },
            price: { href: '/products/four-strokes', label: 'Lihat semua model' },
            service: { href: '/servis', label: 'Servis & bengkel' },
            parts: { href: '/parts', label: 'Suku cadang asli' },
            oil: { href: '/yamalube', label: 'Produk Yamalube' },
        },
        cta: {
            price: {
                title: PRICE_NOTE.id,
                lead: 'Kami bantu memilih model yang sesuai dengan perahu Anda. Kirim pesan WhatsApp, tanya Pevita, atau telepon salah satu toko kami.',
            },
            service: {
                title: 'Mesin tempel Anda perlu diservis?',
                lead: 'Semua jenis servis mesin tempel Yamaha kami kerjakan di bengkel Toko Tunggal Jaya, Padang. Kirim pesan WhatsApp, tanya Pevita, atau telepon salah satu toko kami.',
            },
            oil: {
                title: 'Butuh oli Yamalube untuk mesin Anda?',
                lead: 'Tanyakan jenis dan kemasan Yamalube yang tepat lewat WhatsApp, tanya Pevita, atau telepon salah satu toko kami.',
            },
        },
        chatQuery: {
            general: 'Saya ingin bertanya tentang mesin tempel Yamaha.',
            price: 'Bantu saya memilih mesin tempel Yamaha yang cocok untuk perahu saya.',
            service: 'Saya ingin bertanya tentang servis mesin tempel Yamaha.',
            parts: 'Saya mencari suku cadang asli Yamaha untuk mesin tempel saya.',
            oil: 'Yamalube apa yang cocok untuk mesin tempel saya?',
        },
    },
    en: {
        home: 'Home',
        news: 'News',
        published: 'Published',
        updated: 'Updated',
        minutes: (n) => `${n} min read`,
        langNote: 'This article is written in Indonesian.',
        archived: (date) =>
            `This is an older story, published ${date}. Product details and availability may have changed; contact us for the latest information.`,
        toc: 'Contents',
        links: 'Related pages',
        relatedEyebrow: 'Read next',
        related: 'Related articles',
        all: 'All news & guides',
        whatsapp: 'WhatsApp',
        whatsappLabel: 'Chat on WhatsApp',
        hours: 'Both stores',
        help: {
            general: { title: 'Have a question?', text: 'Ask us anything about Yamaha outboards.' },
            price: { title: 'Looking for an outboard?', text: `${PRICE_NOTE.en}.` },
            service: {
                title: 'Need a service?',
                text: 'All types of Yamaha outboard servicing are done at the Toko Tunggal Jaya workshop in Padang.',
            },
            parts: { title: 'Looking for parts?', text: 'Ask us about Yamaha genuine parts for your engine model.' },
            oil: { title: 'Need Yamalube?', text: 'Ask us which Yamalube oil and pack size suits your engine.' },
        },
        helpLink: {
            general: { href: '/faq', label: 'FAQ' },
            price: { href: '/products/four-strokes', label: 'See all models' },
            service: { href: '/servis', label: 'Service & workshop' },
            parts: { href: '/parts', label: 'Genuine parts' },
            oil: { href: '/yamalube', label: 'Yamalube products' },
        },
        cta: {
            price: {
                title: PRICE_NOTE.en,
                lead: 'We will help you choose the right model for your boat. Message us on WhatsApp, ask Pevita or call one of our stores.',
            },
            service: {
                title: 'Does your outboard need a service?',
                lead: 'We do all types of Yamaha outboard servicing at the Toko Tunggal Jaya workshop in Padang. Message us on WhatsApp, ask Pevita or call one of our stores.',
            },
            oil: {
                title: 'Need Yamalube oil for your engine?',
                lead: 'Ask us on WhatsApp which Yamalube oil and pack size is right, ask Pevita, or call one of our stores.',
            },
        },
        chatQuery: {
            general: 'I have a question about Yamaha outboards.',
            price: 'Help me choose the right Yamaha outboard for my boat.',
            service: 'I would like to ask about servicing a Yamaha outboard.',
            parts: 'I am looking for Yamaha genuine parts for my outboard.',
            oil: 'Which Yamalube oil suits my outboard?',
        },
    },
};

/** The prefilled WhatsApp message for an article topic, in `lang`. */
function waMessage(topic, lang) {
    const entry = WA_TEXT[topic] || WA_TEXT.general;
    const text = entry[lang] || entry.id;
    return typeof text === 'function' ? text() : text;
}

function Toc({ headings, label, className }) {
    return (
        <nav className={className} aria-label={label}>
            <ol className={styles.tocList}>
                {headings.map((h) => (
                    <li key={h.id}>
                        <a href={`#${h.id}`}>{h.text}</a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

/**
 * The chrome of an article page (/news/[slug]): compact hero with breadcrumbs, meta line, hero image,
 * table of contents, the server-rendered body (children), related pages and articles, and the CTA band.
 * All UI text follows the language toggle; the article text itself stays in its own language (item.lang).
 *
 * item: { slug, title, excerpt, category, lang, author, date, updated, image, imageAlt, imageWidth,
 *         imageHeight, readingMinutes, archived, topic, links: [{ href, label: { id, en } }] }
 * headings: [{ id, text }] (h2s of the body) · related: card fields for NewsCard
 */
export default function NewsArticle({ item, headings = [], related = [], children }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const c = COPY[lang];
    const readMore = translations[lang].news.readMore;
    const topic = c.help[item.topic] ? item.topic : 'general';
    const help = c.help[topic];
    const helpLink = c.helpLink[topic];
    const waText = waMessage(topic, lang);
    const cta = c.cta[topic];
    const showToc = headings.length >= 3;
    const links = Array.isArray(item.links) ? item.links : [];

    const heading = (item.heading && item.heading[lang]) || item.title;
    const crumbs = [{ label: c.home, href: '/' }, { label: c.news, href: '/news' }, { label: heading }];

    // Portrait and product shots are capped in height (~560px) instead of filling the column.
    const hasSize = item.imageWidth > 0 && item.imageHeight > 0;
    const figureStyle = hasSize
        ? { '--fig-max': `${Math.round((560 * item.imageWidth) / item.imageHeight)}px` }
        : undefined;

    return (
        <>
            <PageHero
                size="compact"
                eyebrow={categoryLabel(item.category, lang)}
                title={heading}
                lead={item.category === 'panduan' ? item.excerpt : undefined}
                breadcrumbs={crumbs}
            />

            <div className={'section ' + styles.page}>
                <div className={'container ' + styles.layout}>
                    <article className={styles.main}>
                        <div className={styles.meta}>
                            <p className={styles.metaRow}>
                                {item.date && (
                                    <span>
                                        {c.published}{' '}
                                        <time dateTime={item.date}>{formatDate(item.date, lang)}</time>
                                    </span>
                                )}
                                {item.updated && (
                                    <span>
                                        {c.updated}{' '}
                                        <time dateTime={item.updated}>{formatDate(item.updated, lang)}</time>
                                    </span>
                                )}
                                {item.author && <span>{item.author}</span>}
                                {item.readingMinutes > 0 && <span>{c.minutes(item.readingMinutes)}</span>}
                            </p>
                        </div>

                        {(item.archived || item.lang !== lang) && (
                            <div className={styles.notes}>
                                {item.archived && (
                                    <p className={styles.note}>{c.archived(formatDate(item.date, lang))}</p>
                                )}
                                {item.lang !== lang && <p className={styles.note}>{c.langNote}</p>}
                            </div>
                        )}

                        {item.image && (
                            <figure className={styles.figure} style={figureStyle}>
                                {hasSize ? (
                                    <Image
                                        src={item.image}
                                        alt={item.imageAlt || item.title}
                                        width={item.imageWidth}
                                        height={item.imageHeight}
                                        preload
                                        fetchPriority="high"
                                        sizes="(min-width: 1024px) 760px, calc(100vw - 32px)"
                                        className={styles.figureImg}
                                    />
                                ) : (
                                    <div className={styles.figureFill}>
                                        <Image
                                            src={item.image}
                                            alt={item.imageAlt || item.title}
                                            fill
                                            preload
                                            fetchPriority="high"
                                            sizes="(min-width: 1024px) 760px, calc(100vw - 32px)"
                                            className={styles.figureFillImg}
                                        />
                                    </div>
                                )}
                            </figure>
                        )}

                        {showToc && (
                            <details className={styles.tocMobile}>
                                <summary>{c.toc}</summary>
                                <Toc headings={headings} label={c.toc} />
                            </details>
                        )}

                        <div className={styles.body} lang={item.lang === 'en' ? 'en' : 'id'}>
                            {children}
                        </div>

                        {links.length > 0 && (
                            <nav className={styles.links} aria-label={c.links}>
                                <p className={'eyebrow ' + styles.linksTitle}>{c.links}</p>
                                <ul>
                                    {links.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href}>
                                                {(link.label && (link.label[lang] || link.label.id)) || link.href}
                                                <ArrowRight size={16} className={styles.linkArrow} />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </article>

                    <aside className={styles.aside}>
                        {showToc && (
                            <div className={styles.tocDesktop}>
                                <p className={'eyebrow ' + styles.asideTitle}>{c.toc}</p>
                                <Toc headings={headings} label={c.toc} />
                            </div>
                        )}

                        <div className={styles.help}>
                            <p className={styles.helpTitle}>{help.title}</p>
                            <p className={styles.helpText}>{help.text}</p>
                            <a
                                href={waLink(waText)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={'btn btn-primary ' + styles.helpButton}
                                aria-label={`${c.whatsappLabel}: ${WHATSAPP.display}`}
                            >
                                <WhatsApp />
                                {c.whatsapp}
                            </a>
                            <Link href={helpLink.href} className={'btn btn-link ' + styles.helpLink}>
                                {helpLink.label}
                                <ArrowRight className="btn-arrow" />
                            </Link>
                            <p className={styles.helpHours}>
                                <Clock size={16} />
                                <span>
                                    {c.hours}: {HOURS.short[lang]} · {HOURS.closed[lang]}
                                </span>
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {related.length > 0 && (
                <section className={'section section-alt ' + styles.related} aria-labelledby="news-related-title">
                    <div className="container">
                        <SectionHeader
                            size="sm"
                            eyebrow={c.relatedEyebrow}
                            title={c.related}
                            id="news-related-title"
                            action={{ label: c.all, href: '/news' }}
                        />
                        <StaggerGroup className={styles.grid} amount={0.05}>
                            {related.map((card) => (
                                <NewsCard key={card.id} item={card} language={lang} readMore={readMore} />
                            ))}
                        </StaggerGroup>
                    </div>
                </section>
            )}

            <CtaBand
                title={cta ? cta.title : undefined}
                lead={cta ? cta.lead : undefined}
                waText={waText}
                chatQuery={c.chatQuery[topic]}
            />
        </>
    );
}
