'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import StoreCards from '@/components/ui/StoreCards';
import { ArrowRight, WhatsApp } from '@/components/ui/Icons';
import { waLink, WA_TEXT } from '@/lib/site';
import styles from './NotFoundContent.module.css';

const COPY = {
    id: {
        eyebrow: 'Error 404',
        title: 'Halaman tidak ditemukan',
        lead: 'Halaman yang Anda cari tidak ada atau sudah dipindahkan. Coba salah satu halaman di bawah ini, atau hubungi kami.',
        home: 'Ke beranda',
        whatsapp: 'Tanya lewat WhatsApp',
        linksEyebrow: 'Mungkin Anda mencari',
        linksTitle: 'Halaman populer',
        storesEyebrow: 'Toko kami',
        storesTitle: 'Hubungi atau kunjungi kami',
        links: [
            { href: '/products/four-strokes', label: 'Mesin tempel Yamaha 4 tak' },
            { href: '/products/two-strokes', label: 'Mesin tempel Yamaha 2 tak' },
            { href: '/servis', label: 'Servis & bengkel' },
            { href: '/parts', label: 'Suku cadang asli Yamaha' },
            { href: '/yamalube', label: 'Oli Yamalube' },
            { href: '/news', label: 'Berita & panduan' },
            { href: '/faq', label: 'Tanya jawab (FAQ)' },
            { href: '/contact', label: 'Kontak & alamat toko' },
        ],
    },
    en: {
        eyebrow: 'Error 404',
        title: 'Page not found',
        lead: 'The page you are looking for does not exist or has moved. Try one of the pages below, or get in touch.',
        home: 'Go to the home page',
        whatsapp: 'Ask on WhatsApp',
        linksEyebrow: 'You may be looking for',
        linksTitle: 'Popular pages',
        storesEyebrow: 'Our stores',
        storesTitle: 'Call or visit us',
        links: [
            { href: '/products/four-strokes', label: 'Yamaha 4-stroke outboards' },
            { href: '/products/two-strokes', label: 'Yamaha 2-stroke outboards' },
            { href: '/servis', label: 'Service & workshop' },
            { href: '/parts', label: 'Yamaha genuine parts' },
            { href: '/yamalube', label: 'Yamalube oils' },
            { href: '/news', label: 'News & guides' },
            { href: '/faq', label: 'FAQ' },
            { href: '/contact', label: 'Contact & store addresses' },
        ],
    },
};

/** Bilingual 404 body (src/app/not-found.js renders it). */
export default function NotFoundContent() {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const c = COPY[lang];

    return (
        <>
            <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} size="compact">
                <Link href="/" className="btn btn-primary btn-lg btn-block-sm">
                    {c.home}
                </Link>
                <a
                    href={waLink(WA_TEXT.general[lang])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-lg btn-block-sm"
                >
                    <WhatsApp />
                    {c.whatsapp}
                </a>
            </PageHero>

            <section className="section">
                <div className="container">
                    <SectionHeader eyebrow={c.linksEyebrow} title={c.linksTitle} size="sm" />
                    <ul className={styles.links}>
                        {c.links.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className={styles.link}>
                                    <span>{link.label}</span>
                                    <ArrowRight size={18} className={styles.arrow} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <SectionHeader eyebrow={c.storesEyebrow} title={c.storesTitle} size="sm" />
                    <StoreCards />
                </div>
            </section>
        </>
    );
}
