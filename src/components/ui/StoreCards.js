'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import { HOURS, waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import { STORES } from './stores';
import { Pin, Phone, ExternalLink, Mail, Clock, WhatsApp, Wrench } from './Icons';
import styles from './StoreCards.module.css';

const COPY = {
    en: {
        call: 'Call {phone}',
        directions: 'Get directions',
        fax: 'Fax',
        map: 'Map: {name}',
        whatsapp: 'WhatsApp',
        whatsappLabel: 'Chat on WhatsApp {number}',
        workshop: 'Service & workshop',
        hours: 'Opening hours',
    },
    id: {
        call: 'Telepon {phone}',
        directions: 'Petunjuk arah',
        fax: 'Fax',
        map: 'Peta: {name}',
        whatsapp: 'WhatsApp',
        whatsappLabel: 'Chat lewat WhatsApp {number}',
        workshop: 'Servis & bengkel',
        hours: 'Jam buka',
    },
};

/**
 * Both stores as cards, call-first: name (+ a workshop tag on the store that does servicing) → address
 * → opening hours → the phone number as the typographic hero (a tel: link behind a hairline) → a quiet
 * row with WhatsApp, directions and email. No red fills.
 * tone: 'light' (white cards) | 'dark' (for navy sections)
 * showMap: stacks the cards and adds an embedded Google Map to each (≥1024px: info | map).
 */
export default function StoreCards({ tone = 'light', showMap = false, headingLevel = 'h3' }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const t = COPY[lang];
    const Heading = headingLevel;
    const dark = tone === 'dark';

    const cardClass = [
        styles.card,
        dark ? 'on-dark ' + styles.dark : styles.light,
        showMap ? styles.withMap : styles.hoverable,
    ].join(' ');

    return (
        <StaggerGroup className={showMap ? styles.stack : styles.grid}>
            {STORES.map((store) => (
                <StaggerItem key={store.id} className={styles.cell}>
                    <article className={cardClass}>
                        <div className={styles.info}>
                            <div className={styles.head}>
                                <span className={styles.pin}>
                                    <Pin size={20} />
                                </span>
                                <Heading className={styles.name}>{store.name}</Heading>
                            </div>

                            {store.servicing && (
                                <Link href="/servis" className={styles.tag}>
                                    <Wrench size={14} />
                                    {t.workshop}
                                </Link>
                            )}

                            <address className={styles.address}>
                                <span>{store.street}</span>
                                <span>{store.city[lang] || store.city.en}</span>
                                {showMap && (
                                    <span className={styles.fax}>
                                        {t.fax} {store.fax}
                                    </span>
                                )}
                            </address>

                            <p className={styles.hours}>
                                <Clock size={16} />
                                <span>
                                    <span className="visually-hidden">{t.hours}: </span>
                                    {HOURS.text[lang]}
                                    <span className={styles.closed}>{HOURS.closed[lang]}</span>
                                </span>
                            </p>

                            <div className={styles.contact}>
                                <a
                                    href={store.tel}
                                    className={styles.phone}
                                    aria-label={t.call.replace('{phone}', store.phone) + ', ' + store.name}
                                >
                                    <span className={styles.phoneIcon}>
                                        <Phone size={18} />
                                    </span>
                                    <span className={styles.phoneNum}>{store.phone}</span>
                                </a>

                                <div className={styles.links}>
                                    <a
                                        href={waLink(WA_TEXT.general[lang])}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.mail}
                                        aria-label={t.whatsappLabel.replace('{number}', WHATSAPP.display)}
                                    >
                                        <WhatsApp size={16} />
                                        {t.whatsapp} {WHATSAPP.display}
                                    </a>
                                    <a
                                        href={store.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={'btn btn-link ' + styles.directions}
                                    >
                                        {t.directions}
                                        <ExternalLink className="btn-arrow" />
                                    </a>
                                    <a href={'mailto:' + store.email} className={styles.mail}>
                                        <Mail size={16} />
                                        {store.email}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {showMap && (
                            <div className={styles.map}>
                                <div className={styles.placeholder} aria-hidden="true">
                                    <Pin size={32} />
                                    <span>{store.name}</span>
                                </div>
                                <iframe
                                    className={styles.iframe}
                                    src={store.mapEmbed}
                                    title={t.map.replace('{name}', store.name)}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    allowFullScreen
                                />
                            </div>
                        )}
                    </article>
                </StaggerItem>
            ))}
        </StaggerGroup>
    );
}
