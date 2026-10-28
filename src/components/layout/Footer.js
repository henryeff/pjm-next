'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal from '@/components/motion/Reveal';
import LangSwitch from '@/components/ui/LangSwitch';
import { STORES } from '@/components/ui/stores';
import { Phone, ExternalLink } from '@/components/ui/Icons';

const COPY = {
    en: {
        tagline: 'Your trusted Yamaha Marine dealer in Padang. Providing sales, service, and spare parts.',
        directions: 'Directions',
        company: 'Company',
        rights: 'All rights reserved.',
    },
    id: {
        tagline: 'Dealer Yamaha Marine terpercaya Anda di Padang. Melayani penjualan, servis, dan suku cadang.',
        directions: 'Petunjuk arah',
        company: 'Perusahaan',
        rights: 'Hak cipta dilindungi.',
    },
};

const Footer = () => {
    const { language } = useLanguage();
    const t = translations[language].navbar;
    const c = COPY[language] || COPY.en;

    const productLinks = [
        { href: '/products/four-strokes', label: t.fourStrokes },
        { href: '/products/two-strokes', label: t.twoStrokes },
        { href: '/parts', label: t.parts },
        { href: '/yamalube', label: t.yamalube },
    ];

    const companyLinks = [
        { href: '/about', label: t.about },
        { href: '/news', label: t.news },
        { href: '/chat', label: t.chat },
        { href: '/contact', label: t.contact },
    ];

    return (
        <footer className={'on-dark ' + styles.footer}>
            <div className="container">
                {/* Logo + tagline only: the chat CTA lives in the CtaBand right above, the navbar and the Company list. */}
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
                </Reveal>

                <div className={styles.divider} />

                <div className={styles.grid}>
                    {STORES.map((store) => (
                        <div key={store.id} className={`${styles.column} ${styles.storeColumn}`}>
                            <h2 className={styles.storeName}>{store.name}</h2>
                            <address className={styles.address}>
                                <span>{store.street}</span>
                                <span>{store.city[language] || store.city.en}</span>
                            </address>
                            <ul className={styles.list}>
                                <li>
                                    <a href={store.tel} className={styles.iconLink}>
                                        <Phone size={16} />
                                        {store.phone}
                                    </a>
                                </li>
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

                    <nav className={styles.column} aria-label={t.products}>
                        <h2 className={styles.heading}>{t.products}</h2>
                        <ul className={styles.list}>
                            {productLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav className={styles.column} aria-label={c.company}>
                        <h2 className={styles.heading}>{c.company}</h2>
                        <ul className={styles.list}>
                            {companyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
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
