'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal from '@/components/motion/Reveal';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import StoreCards from '@/components/ui/StoreCards';
import { STORES } from '@/components/ui/stores';
import { Chat, Phone, Mail, Send } from '@/components/ui/Icons';

const EMAIL = 'harry@pjmcv.com';

// Page-only labels; the rest comes from translations[language].contact.
const COPY = {
    en: {
        chat: 'Chat with Pevita',
        call: 'Call {name}',
        storesTitle: 'Our stores',
        formEyebrow: 'Write to us',
    },
    id: {
        chat: 'Chat dengan Pevita',
        call: 'Telepon {name}',
        storesTitle: 'Toko kami',
        formEyebrow: 'Tulis pesan',
    },
};

// Opens the visitor's email client with the message pre-filled (unchanged behaviour).
function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    const subject = `New Message from ${name} (${email})`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
}

export default function ContactPage() {
    const { language } = useLanguage();
    const t = translations[language].contact;
    const c = COPY[language] || COPY.en;
    // The asterisk pointed at the old submit button; as a lead it reads as a stray footnote mark.
    const mailNote = t.mailNote.replace(/^\*\s*/, '');
    const heroBtn = 'btn btn-lg btn-block-sm ' + styles.heroBtn;

    return (
        <>
            <PageHero size="default" eyebrow={t.contactInfo} title={t.title} lead={t.intro}>
                {/* The two call buttons wrap as a pair, so a store is never split onto its own row. */}
                <div className={styles.heroActions}>
                    <Link href="/chat" className={heroBtn + ' btn-primary'}>
                        <Chat />
                        {c.chat}
                    </Link>
                    <div className={styles.callGroup}>
                        {STORES.map((store) => (
                            <a key={store.id} href={store.tel} className={heroBtn + ' btn-ghost'}>
                                <Phone />
                                {c.call.replace('{name}', store.name)}
                            </a>
                        ))}
                    </div>
                </div>
            </PageHero>

            <section className="section" aria-labelledby="contact-stores-title">
                <div className="container">
                    <SectionHeader id="contact-stores-title" eyebrow={t.address} title={c.storesTitle} />
                    <StoreCards tone="light" showMap />
                </div>
            </section>

            <section className="section section-alt" aria-labelledby="contact-form-title">
                <div className={'container ' + styles.formGrid}>
                    <div className={styles.formAside}>
                        <SectionHeader
                            id="contact-form-title"
                            className={styles.formHeader}
                            eyebrow={c.formEyebrow}
                            title={t.sendMsgTitle}
                            lead={mailNote}
                        />
                        <Reveal delay={0.1}>
                            <a href={'mailto:' + EMAIL} className={styles.mailLink}>
                                <Mail size={20} />
                                {EMAIL}
                            </a>
                        </Reveal>
                    </div>

                    <Reveal delay={0.1} className={styles.formCard}>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label htmlFor="contact-name" className={styles.label}>
                                        {t.name}
                                    </label>
                                    <input
                                        type="text"
                                        id="contact-name"
                                        name="name"
                                        autoComplete="name"
                                        className={styles.input}
                                        required
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="contact-email" className={styles.label}>
                                        {t.email}
                                    </label>
                                    <input
                                        type="email"
                                        id="contact-email"
                                        name="email"
                                        autoComplete="email"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="contact-message" className={styles.label}>
                                    {t.message}
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    rows={6}
                                    className={styles.textarea}
                                    required
                                />
                            </div>

                            <div className={styles.submitRow}>
                                <button type="submit" className="btn btn-primary btn-lg btn-block-sm">
                                    {t.sendBtn}
                                    <Send className="btn-arrow" />
                                </button>
                            </div>
                        </form>
                    </Reveal>
                </div>
            </section>
        </>
    );
}
