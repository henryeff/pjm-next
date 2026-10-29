'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal from '@/components/motion/Reveal';
import LangSwitch from '@/components/ui/LangSwitch';
import { STORES } from '@/components/ui/stores';
import { Clock, ExternalLink, Phone, WhatsApp, Wrench } from '@/components/ui/Icons';
import { HOURS, waLink, WA_TEXT, WHATSAPP } from '@/lib/site';

const COPY = {
    en: {
        tagline: 'Authorized Yamaha Marine dealer in Padang: Yamaha outboards, genuine parts, Yamalube oil and servicing.',
        directions: 'Directions',
        company: 'Company',
        rights: 'All rights reserved.',
        whatsapp: 'WhatsApp',
        whatsappLabel: 'Chat on WhatsApp',
        workshop: 'Service & workshop',
    },
    id: {
        tagline: 'Dealer Resmi Yamaha Marine di Padang: mesin tempel Yamaha, suku cadang asli, oli Yamalube, dan servis.',
        directions: 'Petunjuk arah',
        company: 'Perusahaan',
        rights: 'Hak cipta dilindungi.',
        whatsapp: 'WhatsApp',
        whatsappLabel: 'Chat lewat WhatsApp',
        workshop: 'Servis & bengkel',
    },
};

const Footer = () => {
    const { language } = useLanguage();
    const t = translations[language].navbar;
    const c = COPY[language] || COPY.en;
    const lang = language === 'en' ? 'en' : 'id';

    const productLinks = [
        { href: '/products/four-strokes', label: t.fourStrokes },
        { href: '/products/two-strokes', label: t.twoStrokes },
        { href: '/parts', label: t.parts },
        { href: '/yamalube', label: t.yamalube },
        { href: '/servis', label: t.serviceLong },
    ];

    const companyLinks = [
        { href: '/about', label: t.about },
        { href: '/news', label: t.news },
        { href: '/faq', label: t.faq },
        { href: '/chat', label: t.chat, prefetch: false },
        { href: '/contact', label: t.contact },
    ];

    return (
        <footer className={'on-dark ' + styles.footer}>
            <div className="container">
                {/* Logo + tagline, and the shared WhatsApp line. The chat CTA lives in the CtaBand right above. */}
                <Reveal className={styles.brandRow}>
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoPlate}>
                                <Image src="/images/logo.png" alt="" width={34} height={34} className={styles.logoImg} />
                            </span>
                            <span className={styles.brandName}>Perkasa Jaya Marine</span>
                        </Link>
                        <p className={styles.tagline}>{c.tagline}</p>
                    </div>
                    <a
                        href={waLink(WA_TEXT.general[lang])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={'btn btn-ghost ' + styles.wa}
                        aria-label={`${c.whatsappLabel}: ${WHATSAPP.display}`}
                    >
                        <WhatsApp />
                        <span>
                            {c.whatsapp} <span className={styles.waNum}>{WHATSAPP.display}</span>
                        </span>
                    </a>
                </Reveal>

                <div className={styles.divider} />

                <div className={styles.grid}>
                    {STORES.map((store) => (
                        <div key={store.id} className={`${styles.column} ${styles.storeColumn}`}>
                            {/* A label, not a heading: footer columns stay out of the page outline. */}
                            <p className={styles.storeName}>{store.name}</p>
                            <address className={styles.address}>
                                <span>{store.street}</span>
                                <span>{store.city[lang] || store.city.en}</span>
                            </address>
                            <p className={styles.hours}>
                                <Clock size={16} />
                                <span>
                                    {HOURS.short[lang]} · {HOURS.closed[lang]}
                                </span>
                            </p>
                            <ul className={styles.list}>
                                <li>
                                    <a href={store.tel} className={styles.iconLink}>
                                        <Phone size={16} />
                                        {store.phone}
                                    </a>
                                </li>
                                {store.servicing && (
                                    <li>
                                        <Link href="/servis" className={styles.iconLink}>
                                            <Wrench size={16} />
                                            {c.workshop}
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <a
                                        href={store.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.iconLink}
                                    >
                                        <ExternalLink size={16} />
                                        {c.directions}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    ))}

                    <nav className={styles.column} aria-label={t.productsService}>
                        <p className={styles.heading}>{t.productsService}</p>
                        <ul className={styles.list}>
                            {productLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav className={styles.column} aria-label={c.company}>
                        <p className={styles.heading}>{c.company}</p>
                        <ul className={styles.list}>
                            {companyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} prefetch={link.prefetch}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        &copy; {new Date().getFullYear()} Perkasa Jaya Marine. {c.rights}
                    </p>
                    <LangSwitch variant="pill" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
