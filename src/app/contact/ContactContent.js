'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { HOURS, PRICE_NOTE, waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import { MAIN_STORE, SERVICE_STORE, STORES } from '@/components/ui/stores';
import Reveal from '@/components/motion/Reveal';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import StoreCards from '@/components/ui/StoreCards';
import MapFacade from '@/components/contact/MapFacade';
import { ArrowRight, Chat, Clock, Mail, Phone, Send, WhatsApp, Wrench } from '@/components/ui/Icons';

// The store email as published in stores.js (both stores list the same address).
const EMAIL = MAIN_STORE.email;
// Both stores share one fax number; list each distinct number once.
const FAXES = [...new Set(STORES.map((s) => s.fax).filter(Boolean))];

// Indonesian first (the server-rendered language); the form labels come from translations.contact.
const COPY = {
    id: {
        home: 'Beranda',
        crumb: 'Kontak',
        eyebrow: 'Hubungi kami',
        title: 'Alamat & Kontak Dealer Yamaha Marine di Padang',
        lead: `Dua toko di Padang, buka ${HOURS.text.id}. Kirim WhatsApp, telepon, atau datang langsung ke toko kami.`,
        whatsapp: 'WhatsApp',
        whatsappLabel: `Chat lewat WhatsApp ${WHATSAPP.display}`,
        call: 'Telepon {name}',
        callLabel: 'Telepon {name}, {phone}',
        quickLabel: 'Kontak cepat',
        quick: {
            whatsapp: 'WhatsApp',
            whatsappNote: 'Satu nomor untuk kedua toko',
            hours: 'Jam buka',
            service: 'Servis & bengkel',
            price: 'Harga & ketersediaan',
            priceNote: 'Tanya lewat WhatsApp atau telepon toko',
        },
        storesEyebrow: 'Alamat',
        storesTitle: 'Toko kami',
        storesLead: `Dua toko di Padang. Servis dan bengkel mesin tempel Yamaha ada di ${SERVICE_STORE.name}.`,
        mapsTitle: 'Peta lokasi',
        mapShow: 'Tampilkan peta',
        mapShowLabel: 'Tampilkan peta {name}',
        mapNote: 'Peta dimuat dari Google Maps',
        mapTitle: 'Peta: {name}',
        formEyebrow: 'Tulis pesan',
        fax: 'Fax',
        chat: 'Atau tanya Pevita, asisten virtual kami',
    },
    en: {
        home: 'Home',
        crumb: 'Contact',
        eyebrow: 'Contact us',
        title: 'Address & Contact: Yamaha Marine Dealer in Padang',
        lead: `Two stores in Padang, open ${HOURS.text.en}. Send a WhatsApp message, call, or visit us in person.`,
        whatsapp: 'WhatsApp',
        whatsappLabel: `Chat on WhatsApp ${WHATSAPP.display}`,
        call: 'Call {name}',
        callLabel: 'Call {name}, {phone}',
        quickLabel: 'Quick contact',
        quick: {
            whatsapp: 'WhatsApp',
            whatsappNote: 'One number for both stores',
            hours: 'Opening hours',
            service: 'Service & workshop',
            price: 'Price & availability',
            priceNote: 'Ask on WhatsApp or call a store',
        },
        storesEyebrow: 'Address',
        storesTitle: 'Our stores',
        storesLead: `Two stores in Padang. Yamaha outboard servicing and the workshop are at ${SERVICE_STORE.name}.`,
        mapsTitle: 'Location maps',
        mapShow: 'Show map',
        mapShowLabel: 'Show map of {name}',
        mapNote: 'Loads Google Maps',
        mapTitle: 'Map: {name}',
        formEyebrow: 'Write to us',
        fax: 'Fax',
        chat: 'Or ask Pevita, our virtual assistant',
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
    const lang = language === 'en' ? 'en' : 'id';
    const t = translations[lang].contact;
    const c = COPY[lang];
    const q = c.quick;
    const waHref = waLink(WA_TEXT.general[lang]);
    // The asterisk pointed at the old submit button; as a lead it reads as a stray footnote mark.
    const mailNote = t.mailNote.replace(/^\*\s*/, '');
    const heroBtn = 'btn btn-lg btn-block-sm ' + styles.heroBtn;

    return (
        <>
            {/* Compact: one sentence and three actions don't need a tall navy block. No image, so PageHero
                draws ContourLines. */}
            <PageHero
                size="compact"
                breadcrumbs={[{ label: c.home, href: '/' }, { label: c.crumb }]}
                eyebrow={c.eyebrow}
                title={c.title}
                lead={c.lead}
            >
                {/* The two call buttons wrap as a pair, so a store is never split onto its own row. */}
                <div className={styles.heroActions}>
                    <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={heroBtn + ' btn-primary'}
                        aria-label={c.whatsappLabel}
                    >
                        <WhatsApp />
                        {c.whatsapp}
                    </a>
                    <div className={styles.callGroup}>
                        {STORES.map((store) => (
                            <a
                                key={store.id}
                                href={store.tel}
                                className={heroBtn + ' btn-ghost'}
                                aria-label={c.callLabel.replace('{name}', store.name).replace('{phone}', store.phone)}
                            >
                                <Phone />
                                {c.call.replace('{name}', store.name)}
                            </a>
                        ))}
                    </div>
                </div>
            </PageHero>

            {/* Quick contact: the answers most visitors came for, static so they are in the first paint. */}
            <section className={styles.quick} aria-label={c.quickLabel}>
                <div className="container">
                    <dl className={styles.quickGrid}>
                        <div className={styles.quickItem}>
                            <dt className={styles.quickLabel}>
                                <WhatsApp size={18} />
                                {q.whatsapp}
                            </dt>
                            <dd className={styles.quickValue}>
                                <a href={waHref} target="_blank" rel="noopener noreferrer" className={styles.quickLink}>
                                    {WHATSAPP.display}
                                </a>
                            </dd>
                            <dd className={styles.quickNote}>{q.whatsappNote}</dd>
                        </div>
                        <div className={styles.quickItem}>
                            <dt className={styles.quickLabel}>
                                <Clock size={18} />
                                {q.hours}
                            </dt>
                            <dd className={styles.quickValue}>{HOURS.text[lang]}</dd>
                            <dd className={styles.quickNote}>{HOURS.closed[lang]}</dd>
                        </div>
                        <div className={styles.quickItem}>
                            <dt className={styles.quickLabel}>
                                <Wrench size={18} />
                                {q.service}
                            </dt>
                            <dd className={styles.quickValue}>
                                <Link href="/servis" className={styles.quickLink}>
                                    {SERVICE_STORE.name}
                                </Link>
                            </dd>
                            <dd className={styles.quickNote}>
                                {SERVICE_STORE.street}, {SERVICE_STORE.locality}
                            </dd>
                        </div>
                        <div className={styles.quickItem}>
                            <dt className={styles.quickLabel}>
                                <Chat size={18} />
                                {q.price}
                            </dt>
                            <dd className={styles.quickValue}>{PRICE_NOTE[lang]}</dd>
                            <dd className={styles.quickNote}>{q.priceNote}</dd>
                        </div>
                    </dl>
                </div>
            </section>

            <section className={'section ' + styles.storesSection} aria-labelledby="contact-stores-title">
                <div className="container">
                    <SectionHeader
                        id="contact-stores-title"
                        eyebrow={c.storesEyebrow}
                        title={c.storesTitle}
                        lead={c.storesLead}
                    />
                    <StoreCards tone="light" />

                    {/* Maps load only on request: two Google Maps embeds would pull a few hundred KiB of
                        third-party script on every visit. Each card above keeps its "Directions" link. */}
                    <h3 className={styles.mapsTitle}>{c.mapsTitle}</h3>
                    <div className={styles.maps}>
                        {STORES.map((store) => (
                            <Reveal key={store.id} className={styles.mapCell}>
                                <MapFacade
                                    src={store.mapEmbed}
                                    title={c.mapTitle.replace('{name}', store.name)}
                                    name={store.name}
                                    address={`${store.street}, ${store.locality}`}
                                    showLabel={c.mapShow}
                                    ariaLabel={c.mapShowLabel.replace('{name}', store.name)}
                                    note={c.mapNote}
                                />
                            </Reveal>
                        ))}
                    </div>
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
                        <Reveal delay={0.1} className={styles.asideLinks}>
                            <a href={'mailto:' + EMAIL} className={styles.mailLink}>
                                <Mail size={20} />
                                {EMAIL}
                            </a>
                            {FAXES.map((fax) => (
                                <p key={fax} className={styles.fax}>
                                    {c.fax} {fax}
                                </p>
                            ))}
                            <Link href="/chat" prefetch={false} className={'btn btn-link ' + styles.chatLink}>
                                {c.chat}
                                <ArrowRight className="btn-arrow" />
                            </Link>
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
