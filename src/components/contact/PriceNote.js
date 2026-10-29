'use client';

import { useLanguage } from '@/context/LanguageContext';
import { HOURS, PRICE_NOTE, waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import { STORES } from '@/components/ui/stores';
import { Clock, Phone, WhatsApp } from '@/components/ui/Icons';
import styles from './PriceNote.module.css';

const COPY = {
    id: {
        whatsapp: 'WhatsApp',
        whatsappLabel: 'Tanya lewat WhatsApp {number}',
        call: 'Telepon {name}',
        callLabel: 'Telepon {name}, {phone}',
    },
    en: {
        whatsapp: 'WhatsApp',
        whatsappLabel: 'Ask on WhatsApp {number}',
        call: 'Call {name}',
        callLabel: 'Call {name}, {phone}',
    },
};

/**
 * "Contact us for price and availability" block: the owner's price policy (prices are not published),
 * a WhatsApp button with a prefilled message, a call button per store and the opening hours.
 *
 * waText: prefilled WhatsApp message (already translated). Defaults to the general hello.
 * title / text: override the heading (defaults to PRICE_NOTE) and add a sentence under it.
 * stores: which stores get a call button (default: both).
 * headingAs: the heading element ('p' by default, so it never interrupts the page outline).
 * tone: 'light' (white card on grey/white sections) | 'dark' (on navy).
 */
export default function PriceNote({ waText, title, text, stores = STORES, headingAs = 'p', tone = 'light', className }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const t = COPY[lang];
    const Heading = headingAs;
    const dark = tone === 'dark';
    const rootClass = [styles.note, dark ? 'on-dark ' + styles.dark : styles.light, className].filter(Boolean).join(' ');
    const callClass = 'btn btn-block-sm ' + (dark ? 'btn-ghost' : 'btn-outline');

    return (
        <aside className={rootClass}>
            <div className={styles.text}>
                <Heading className={styles.title}>{title || PRICE_NOTE[lang]}</Heading>
                {text && <p className={styles.body}>{text}</p>}
                <p className={styles.hours}>
                    <Clock size={16} />
                    <span>
                        {HOURS.label[lang]}: {HOURS.text[lang]} · {HOURS.closed[lang]}
                    </span>
                </p>
            </div>
            <div className={styles.actions}>
                <a
                    href={waLink(waText || WA_TEXT.general[lang])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-block-sm"
                    aria-label={t.whatsappLabel.replace('{number}', WHATSAPP.display)}
                >
                    <WhatsApp />
                    {t.whatsapp} {WHATSAPP.display}
                </a>
                {stores.map((store) => (
                    <a
                        key={store.id}
                        href={store.tel}
                        className={callClass}
                        aria-label={t.callLabel.replace('{name}', store.name).replace('{phone}', store.phone)}
                    >
                        <Phone />
                        {t.call.replace('{name}', store.name)}
                    </a>
                ))}
            </div>
        </aside>
    );
}
