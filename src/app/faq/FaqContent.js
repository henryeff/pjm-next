'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import { Chat, WhatsApp } from '@/components/ui/Icons';
import { faqGroups } from './faqData';

const COPY = {
    id: {
        home: 'Beranda',
        crumb: 'Tanya Jawab (FAQ)',
        eyebrow: 'Tanya jawab',
        title: 'Tanya Jawab Seputar Mesin Tempel Yamaha di Padang',
        lead: 'Jawaban singkat tentang toko dan jam buka kami, WhatsApp, harga, servis, suku cadang asli Yamaha dan oli Yamalube.',
        whatsapp: 'Tanya lewat WhatsApp',
        whatsappLabel: `Tanya lewat WhatsApp ${WHATSAPP.display}`,
        chat: 'Tanya Pevita',
        navLabel: 'Topik tanya jawab',
        ctaTitle: 'Pertanyaan Anda belum terjawab?',
        ctaLead: 'Kirim pesan WhatsApp, tanya Pevita, asisten virtual kami, atau telepon salah satu toko kami.',
        chatQuery: 'Saya punya pertanyaan tentang mesin tempel Yamaha.',
    },
    en: {
        home: 'Home',
        crumb: 'FAQ',
        eyebrow: 'FAQ',
        title: 'Questions About Yamaha Outboards in Padang',
        lead: 'Short answers about our stores and opening hours, WhatsApp, prices, servicing, Yamaha genuine parts and Yamalube oil.',
        whatsapp: 'Ask on WhatsApp',
        whatsappLabel: `Ask on WhatsApp ${WHATSAPP.display}`,
        chat: 'Ask Pevita',
        navLabel: 'FAQ topics',
        ctaTitle: "Didn't find your answer?",
        ctaLead: 'Message us on WhatsApp, ask Pevita, our virtual assistant, or call one of our stores.',
        chatQuery: 'I have a question about Yamaha outboards.',
    },
};

/** One answer: text segments and links (internal → <Link>, wa.me → new tab, tel: → plain <a>). */
function Answer({ segments }) {
    return (
        <p className={styles.answer}>
            {segments.map((seg, i) => {
                if (typeof seg === 'string') return seg;
                if (seg.href.startsWith('/')) {
                    return (
                        <Link key={i} href={seg.href} className={styles.link}>
                            {seg.text}
                        </Link>
                    );
                }
                const external = /^https?:/i.test(seg.href);
                // Phone and WhatsApp numbers never break across lines.
                const isNumber = seg.text.startsWith('+');
                return (
                    <a
                        key={i}
                        href={seg.href}
                        className={isNumber ? styles.link + ' ' + styles.num : styles.link}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                        {seg.text}
                    </a>
                );
            })}
        </p>
    );
}

/**
 * The FAQ page body. Static (no scroll reveals): the first answers sit near the fold, and every word
 * must be in the server HTML exactly as the FAQPage JSON-LD states it (faqData.js is the one source).
 */
export default function FaqContent({ ctx }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const c = COPY[lang];
    const groups = faqGroups(lang, ctx);

    return (
        <>
            <PageHero
                size="compact"
                breadcrumbs={[{ label: c.home, href: '/' }, { label: c.crumb }]}
                eyebrow={c.eyebrow}
                title={c.title}
                lead={c.lead}
            >
                <a
                    href={waLink(WA_TEXT.general[lang])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg btn-block-sm"
                    aria-label={c.whatsappLabel}
                >
                    <WhatsApp />
                    {c.whatsapp}
                </a>
                <Link
                    href={'/chat?q=' + encodeURIComponent(c.chatQuery)}
                    prefetch={false}
                    className="btn btn-ghost btn-lg btn-block-sm"
                >
                    <Chat />
                    {c.chat}
                </Link>
            </PageHero>

            <section className={'section ' + styles.body}>
                <div className={'container ' + styles.grid}>
                    {/* Topic jump links: a wrapping row on phones/tablets, a sticky column from 1024px. */}
                    <nav aria-label={c.navLabel} className={styles.nav}>
                        <ul className={styles.navList}>
                            {groups.map((g) => (
                                <li key={g.id}>
                                    <a href={'#faq-' + g.id} className={styles.navLink}>
                                        {g.title}
                                        <span className={styles.navCount}>{g.items.length}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.groups}>
                        {groups.map((g) => (
                            <section key={g.id} id={'faq-' + g.id} className={styles.group} aria-labelledby={'faq-' + g.id + '-title'}>
                                <h2 id={'faq-' + g.id + '-title'} className={'h2 ' + styles.groupTitle}>
                                    {g.title}
                                </h2>
                                <div className={styles.items}>
                                    {g.items.map((item) => (
                                        <div key={item.id} id={'q-' + item.id} className={styles.item}>
                                            <h3 className={styles.question}>{item.q}</h3>
                                            <Answer segments={item.a} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </section>

            <CtaBand chatQuery={c.chatQuery} title={c.ctaTitle} lead={c.ctaLead} />
        </>
    );
}
