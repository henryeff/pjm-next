'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Reveal from '@/components/motion/Reveal';
import { HOURS, waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import ContourLines from './ContourLines';
import Eyebrow from './Eyebrow';
import { ArrowRight, Chat, Clock, Phone, WhatsApp } from './Icons';
import { STORES } from './stores';
import styles from './CtaBand.module.css';

const COPY = {
    en: {
        eyebrow: 'Need help?',
        title: 'Need help choosing an engine or part?',
        lead: 'Message us on WhatsApp, ask Pevita, our virtual assistant, or call one of our stores.',
        chat: 'Chat with Pevita',
        whatsapp: 'WhatsApp',
        whatsappLabel: 'Chat on WhatsApp',
        contact: 'All contact details',
        hours: 'Both stores',
    },
    id: {
        eyebrow: 'Butuh bantuan?',
        title: 'Butuh bantuan memilih mesin atau suku cadang?',
        lead: 'Kirim pesan WhatsApp, tanya Pevita, asisten virtual kami, atau telepon salah satu toko kami.',
        chat: 'Chat dengan Pevita',
        whatsapp: 'WhatsApp',
        whatsappLabel: 'Chat lewat WhatsApp',
        contact: 'Semua info kontak',
        hours: 'Kedua toko',
    },
};

/**
 * Closing call-to-action band (full bleed, navy): WhatsApp, Pevita chat, both store phones and the
 * opening hours. Pass already-translated `title` / `lead` to override the defaults, `chatQuery` to
 * prefill the chat (/chat?q=…) and `waText` to prefill the WhatsApp message (defaults to a general hello).
 */
export default function CtaBand({ chatQuery, title, lead, waText }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const t = COPY[lang];
    const chatHref = '/chat' + (chatQuery ? '?q=' + encodeURIComponent(chatQuery) : '');

    return (
        <section className={'section on-dark ' + styles.band}>
            <ContourLines />
            <div className={'container ' + styles.grid}>
                <Reveal className={styles.text}>
                    <Eyebrow>{t.eyebrow}</Eyebrow>
                    <h2 className={'h2 ' + styles.title}>{title || t.title}</h2>
                    <p className={'lead ' + styles.lead}>{lead || t.lead}</p>
                </Reveal>

                <Reveal className={styles.side} delay={0.1}>
                    <div className={styles.buttons}>
                        <a
                            href={waLink(waText || WA_TEXT.general[lang])}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-lg btn-block-sm"
                            aria-label={`${t.whatsappLabel}: ${WHATSAPP.display}`}
                        >
                            <WhatsApp />
                            {t.whatsapp}
                        </a>
                        <Link href={chatHref} prefetch={false} className="btn btn-ghost btn-lg btn-block-sm">
                            <Chat />
                            {t.chat}
                        </Link>
                    </div>
                    <ul className={styles.tels}>
                        {STORES.map((store) => (
                            <li key={store.id}>
                                <a href={store.tel}>
                                    <Phone size={16} />
                                    {store.name} · {store.phone}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <p className={styles.meta}>
                        <span className={styles.hours}>
                            <Clock size={16} />
                            {t.hours}: {HOURS.short[lang]} · {HOURS.closed[lang]}
                        </span>
                        <Link href="/contact" className={styles.contact}>
                            {t.contact}
                            <ArrowRight size={16} />
                        </Link>
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
