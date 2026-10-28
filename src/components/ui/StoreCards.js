'use client';

import { useLanguage } from '@/context/LanguageContext';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import { STORES } from './stores';
import { Pin, Phone, ExternalLink, Mail } from './Icons';
import styles from './StoreCards.module.css';

const COPY = {
    en: {
        call: 'Call {phone}',
        directions: 'Get directions',
        fax: 'Fax',
        map: 'Map: {name}',
    },
    id: {
        call: 'Telepon {phone}',
        directions: 'Petunjuk arah',
        fax: 'Fax',
        map: 'Peta: {name}',
    },
};

/**
 * Both stores as cards, call-first: name → address → the phone number as the typographic hero (a
 * tel: link behind a hairline) → a quiet row with directions and email. No red fills.
 * tone: 'light' (white cards) | 'dark' (for navy sections)
 * showMap: stacks the cards and adds an embedded Google Map to each (≥1024px: info | map).
 */
export default function StoreCards({ tone = 'light', showMap = false, headingLevel = 'h3' }) {
    const { language } = useLanguage();
    const t = COPY[language] || COPY.en;
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

                            <address className={styles.address}>
                                <span>{store.street}</span>
                                <span>{store.city[language] || store.city.en}</span>
                                {showMap && (
                                    <span className={styles.fax}>
                                        {t.fax} {store.fax}
                                    </span>
                                )}
                            </address>

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
