'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Reveal from '@/components/motion/Reveal';
import Eyebrow from './Eyebrow';
import { Chat, Phone } from './Icons';
import { STORES } from './stores';
import styles from './CtaBand.module.css';

const COPY = {
    en: {
        eyebrow: 'Need help?',
        title: 'Need help choosing an engine or part?',
        lead: 'Ask Pevita, our virtual assistant, or call one of our stores.',
        chat: 'Chat with Pevita',
        contact: 'Contact us',
    },
    id: {
        eyebrow: 'Butuh bantuan?',
        title: 'Butuh bantuan memilih mesin atau suku cadang?',
        lead: 'Tanyakan ke Pevita, asisten virtual kami, atau hubungi toko kami.',
        chat: 'Chat dengan Pevita',
        contact: 'Hubungi kami',
    },
};

/**
 * Closing call-to-action band (full bleed, navy). Pass already-translated `title` / `lead`
 * to override the defaults, and `chatQuery` to prefill the chat (/chat?q=…).
 */
export default function CtaBand({ chatQuery, title, lead }) {
    const { language } = useLanguage();
    const t = COPY[language] || COPY.en;
    const chatHref = '/chat' + (chatQuery ? '?q=' + encodeURIComponent(chatQuery) : '');

    return (
        <section className={'section on-dark ' + styles.band}>
            <div className={'container ' + styles.grid}>
                <Reveal className={styles.text}>
                    <Eyebrow>{t.eyebrow}</Eyebrow>
                    <h2 className={'h2 ' + styles.title}>{title || t.title}</h2>
                    <p className={'lead ' + styles.lead}>{lead || t.lead}</p>
                </Reveal>

                <Reveal className={styles.side} delay={0.1}>
                    <div className={styles.buttons}>
                        <Link href={chatHref} className="btn btn-primary btn-lg btn-block-sm">
                            <Chat />
                            {t.chat}
                        </Link>
                        <Link href="/contact" className="btn btn-ghost btn-lg btn-block-sm">
                            {t.contact}
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
                </Reveal>
            </div>
        </section>
    );
}
