'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { HOURS, PRICE_NOTE, waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import { MAIN_STORE, SERVICE_STORE } from '@/components/ui/stores';
import { seriesHref } from '@/lib/paths';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import KickerLine from '@/components/motion/KickerLine';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import Eyebrow from '@/components/ui/Eyebrow';
import StoreCards from '@/components/ui/StoreCards';
import CtaBand from '@/components/ui/CtaBand';
import RangeTile from '@/components/ui/RangeTile';

// Indonesian first (the server-rendered language). Every statement comes from the owner-confirmed facts
// ('@/lib/site', STORES), the catalogue data (ranges, passed in from page.js) or the site's own news
// (the 2021 Pemprov Sumbar project). No founding year, staff, certification or "water vehicles" claims.
const pjm = MAIN_STORE; // Perkasa Jaya Marine, Jalan Imam Bonjol No. 27D
const ttj = SERVICE_STORE; // Toko Tunggal Jaya, Jalan M. Yamin SH No 144 — the workshop

const rangeText = (r, unit) => (r && r.min && r.max ? `${r.min}–${r.max} ${unit}` : '');

/** ' (16 model, 2–200 PK)' from the catalogue data, or '' when there is nothing to say. */
function rangeNote(r, word, unit) {
    const parts = [r && r.count ? `${r.count} ${word}` : '', rangeText(r, unit)].filter(Boolean);
    return parts.length ? ` (${parts.join(', ')})` : '';
}

const COPY = {
    id: {
        home: 'Beranda',
        crumb: 'Tentang Kami',
        eyebrow: 'Tentang Perkasa Jaya Marine',
        title: 'Dealer Resmi Yamaha Marine di Padang',
        lead: 'Perkasa Jaya Marine menjual mesin tempel Yamaha 2 tak dan 4 tak, suku cadang asli Yamaha dan oli Yamalube, serta melayani semua jenis servis mesin tempel Yamaha — dari dua toko di Padang, Sumatera Barat.',
        storyEyebrow: 'Profil kami',
        storyTitle: 'Dealer Resmi Yamaha Marine 3S',
        pillars: [
            { key: 'Sales', text: 'Penjualan mesin tempel Yamaha 2 tak & 4 tak' },
            { key: 'Service', text: 'Semua jenis servis mesin tempel Yamaha' },
            { key: 'Spare parts', text: 'Suku cadang asli Yamaha & oli Yamalube' },
        ],
        p1: 'Perkasa Jaya Marine adalah dealer resmi Yamaha Marine di Padang, Sumatera Barat. Sebagai dealer 3S (sales, service, spare parts), kami melayani penjualan mesin tempel Yamaha, servis, serta penyediaan suku cadang dan oli untuk mesin tempel Yamaha.',
        p2: (r, links) => (
            <>
                Kami menjual mesin tempel Yamaha {links.two('2 tak')}
                {rangeNote(r.two, 'model', 'PK')} dan {links.four('4 tak')}
                {rangeNote(r.four, 'model', 'PK')}, lengkap dengan spesifikasinya
                di situs ini, serta suku cadang asli Yamaha dan oli Yamalube yang dibuat khusus untuk mesin tempel Yamaha.
            </>
        ),
        p3: (links) => (
            <>
                Kami punya dua toko di Padang: {pjm.name} di {pjm.street} dan {ttj.name} di {ttj.street}. Semua jenis
                servis mesin tempel Yamaha dikerjakan di {links.service(`bengkel ${ttj.name}`)}. Kedua toko buka{' '}
                {HOURS.text.id} dan bisa dihubungi lewat WhatsApp {links.wa(WHATSAPP.display)}.
            </>
        ),
        p4: 'Pada 2021, Perkasa Jaya Marine turut mendukung distribusi dan layanan purna jual 234 unit mesin tempel Yamaha 15 PK, bantuan Pemprov Sumatera Barat untuk nelayan.',
        p4Link: 'Baca beritanya',
        p5: 'Misi kami sederhana: mengutamakan kepuasan pelanggan dan membangun hubungan jangka panjang, bukan sekadar menjual produk.',
        factsEyebrow: 'Fakta singkat',
        factsTitle: 'Sekilas Perkasa Jaya Marine',
        facts: {
            status: 'Status',
            statusValue: 'Dealer Resmi Yamaha Marine',
            products: 'Produk',
            productsValue: 'Mesin tempel Yamaha 2 tak & 4 tak, suku cadang asli Yamaha, oli Yamalube',
            service: 'Servis',
            serviceValue: (store) => <>Semua jenis servis mesin tempel Yamaha di bengkel {store}</>,
            stores: 'Toko',
            hours: 'Jam buka',
            whatsapp: 'WhatsApp',
            whatsappNote: 'untuk kedua toko',
            price: 'Harga',
        },
        offerEyebrow: 'Produk & servis',
        offerTitle: 'Yang kami tawarkan',
        outboards: 'Mesin Tempel Yamaha',
        service: 'Servis & Bengkel',
        parts: 'Suku Cadang Asli',
        yamalube: 'Oli Yamalube',
        quote: 'Petualangan Anda bersama Yamaha dimulai di sini: kepuasan pelanggan bukan sekadar tujuan, melainkan janji kami.',
        signoff: 'Perkasa Jaya Marine · Dealer Resmi Yamaha Marine',
        visitEyebrow: 'Kunjungi kami',
        visitTitle: 'Dua toko di Padang',
    },
    en: {
        home: 'Home',
        crumb: 'About',
        eyebrow: 'About Perkasa Jaya Marine',
        title: 'Authorized Yamaha Marine Dealer in Padang',
        lead: 'Perkasa Jaya Marine sells Yamaha 2-stroke and 4-stroke outboards, Yamaha genuine parts and Yamalube oil, and does all types of Yamaha outboard servicing — from two stores in Padang, West Sumatra.',
        storyEyebrow: 'Who we are',
        storyTitle: 'Authorized Yamaha Marine 3S dealer',
        pillars: [
            { key: 'Sales', text: 'Yamaha 2-stroke & 4-stroke outboards' },
            { key: 'Service', text: 'All types of Yamaha outboard servicing' },
            { key: 'Spare parts', text: 'Yamaha genuine parts & Yamalube oil' },
        ],
        p1: 'Perkasa Jaya Marine is an authorized Yamaha Marine dealer in Padang, West Sumatra. As a 3S dealer — sales, service and spare parts — we help you buy a Yamaha outboard, keep it serviced, and supply the parts and oil it needs.',
        p2: (r, links) => (
            <>
                We sell Yamaha {links.two('2-stroke')}
                {rangeNote(r.two, 'models', 'HP')} and {links.four('4-stroke')}
                {rangeNote(r.four, 'models', 'HP')} outboards, each with full
                specifications on this site, plus Yamaha genuine parts and Yamalube oil made specifically for Yamaha
                outboards.
            </>
        ),
        p3: (links) => (
            <>
                We have two stores in Padang: {pjm.name} at {pjm.street} and {ttj.name} at {ttj.street}. All types of
                Yamaha outboard servicing are done at the {links.service(`${ttj.name} workshop`)}. Both stores are open{' '}
                {HOURS.text.en} and share one WhatsApp number, {links.wa(WHATSAPP.display)}.
            </>
        ),
        p4: 'In 2021, Perkasa Jaya Marine supported the distribution and after-sales service of 234 Yamaha 15 HP outboards that the West Sumatra provincial government provided to local fishermen.',
        p4Link: 'Read the story',
        p5: 'Our mission is simple: put customer satisfaction first and build long-term relationships, not just sell products.',
        factsEyebrow: 'Quick facts',
        factsTitle: 'Perkasa Jaya Marine at a glance',
        facts: {
            status: 'Status',
            statusValue: 'Authorized Yamaha Marine dealer',
            products: 'Products',
            productsValue: 'Yamaha 2-stroke & 4-stroke outboards, Yamaha genuine parts, Yamalube oil',
            service: 'Service',
            serviceValue: (store) => <>All types of Yamaha outboard servicing, at the {store} workshop</>,
            stores: 'Stores',
            hours: 'Opening hours',
            whatsapp: 'WhatsApp',
            whatsappNote: 'for both stores',
            price: 'Prices',
        },
        offerEyebrow: 'Products & service',
        offerTitle: 'What we offer',
        outboards: 'Yamaha Outboards',
        service: 'Service & Workshop',
        parts: 'Genuine Parts',
        yamalube: 'Yamalube Oil',
        quote: "Your adventure with Yamaha starts here: customer satisfaction isn't just a goal, it's our promise.",
        signoff: 'Perkasa Jaya Marine · Authorized Yamaha Marine dealer',
        visitEyebrow: 'Visit us',
        visitTitle: 'Two stores in Padang',
    },
};

// Photo tiles are cover-cropped (1920×850 in a 4:3 box ≈ 1.7× the tile width).
const PHOTO_SIZES = '(max-width: 639px) 170vw, (max-width: 1099px) 85vw, 500px';

export default function AboutPage({ ranges = { two: {}, four: {} }, pemprovHref = null }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const nav = translations[lang].navbar;
    const c = COPY[lang];
    const f = c.facts;
    const waHref = waLink(WA_TEXT.general[lang]);

    const links = {
        two: (text) => (
            <Link href={seriesHref('two')} className={styles.inlineLink}>
                {text}
            </Link>
        ),
        four: (text) => (
            <Link href={seriesHref('four')} className={styles.inlineLink}>
                {text}
            </Link>
        ),
        service: (text) => (
            <Link href="/servis" className={styles.inlineLink}>
                {text}
            </Link>
        ),
        wa: (text) => (
            <a href={waHref} target="_blank" rel="noopener noreferrer" className={styles.inlineLink + ' ' + styles.num}>
                {text}
            </a>
        ),
    };

    const story = [
        c.p1,
        c.p2(ranges, links),
        c.p3(links),
        <>
            {c.p4}
            {pemprovHref && (
                <>
                    {' '}
                    <Link href={pemprovHref} className={styles.inlineLink}>
                        {c.p4Link}
                    </Link>
                </>
            )}
        </>,
        c.p5,
    ];

    return (
        <>
            {/* Phones: photo band (headland and boats in frame) with the copy on solid navy below it. */}
            <PageHero
                image="/images/about-coast.jpg"
                imagePosition="50% 45%"
                imagePositionMobile="85% 45%"
                size="default"
                breadcrumbs={[{ label: c.home, href: '/' }, { label: c.crumb }]}
                eyebrow={c.eyebrow}
                title={c.title}
                lead={c.lead}
            />

            {/* Story: sticky 3S summary on the left, the dealer's story on the right */}
            <section className={'section ' + styles.story} aria-labelledby="about-story-title">
                <div className={'container ' + styles.storyGrid}>
                    <div className={styles.storyAside}>
                        <Reveal>
                            <Eyebrow>{c.storyEyebrow}</Eyebrow>
                            <h2 id="about-story-title" className={'h2 ' + styles.storyTitle}>
                                {c.storyTitle}
                            </h2>
                        </Reveal>

                        <StaggerGroup as="ul" className={styles.pillars} stagger={0.1} delayChildren={0.1}>
                            {/* Index keys: the items must survive a language switch after they've revealed. */}
                            {c.pillars.map((pillar, i) => (
                                <StaggerItem as="li" key={i} className={styles.pillar} y={12}>
                                    <KickerLine className={styles.pillarRule} delay={0.15 + i * 0.1} />
                                    <span>
                                        <span className={styles.pillarKey}>{pillar.key}</span>
                                        {pillar.text}
                                    </span>
                                </StaggerItem>
                            ))}
                        </StaggerGroup>
                    </div>

                    {/* Opening paragraph set as a lead; the closing mission paragraph carries a red rule. */}
                    <StaggerGroup className={styles.storyBody} stagger={0.1} amount={0.1}>
                        {story.map((text, i) => {
                            let paragraphClass = styles.paragraph;
                            if (i === 0) paragraphClass += ' ' + styles.storyLead;
                            if (i === story.length - 1) paragraphClass += ' ' + styles.mission;

                            return (
                                <StaggerItem as="p" key={i} className={paragraphClass}>
                                    {text}
                                </StaggerItem>
                            );
                        })}
                    </StaggerGroup>
                </div>
            </section>

            {/* Quick facts: one definition list that people and AI assistants can quote as-is. */}
            <section className="section section-alt" aria-labelledby="about-facts-title">
                <div className="container">
                    <SectionHeader id="about-facts-title" eyebrow={c.factsEyebrow} title={c.factsTitle} />
                    <Reveal className={styles.factsCard}>
                        <dl className={styles.facts}>
                            <div className={styles.fact}>
                                <dt>{f.status}</dt>
                                <dd>{f.statusValue}</dd>
                            </div>
                            <div className={styles.fact}>
                                <dt>{f.products}</dt>
                                <dd>{f.productsValue}</dd>
                            </div>
                            <div className={styles.fact}>
                                <dt>{f.service}</dt>
                                <dd>
                                    {f.serviceValue(
                                        <Link href="/servis" className={styles.inlineLink}>
                                            {ttj.name}
                                        </Link>
                                    )}
                                </dd>
                            </div>
                            <div className={styles.fact}>
                                <dt>{f.stores}</dt>
                                <dd>
                                    <ul className={styles.factStores}>
                                        {[pjm, ttj].map((s) => (
                                            <li key={s.id}>
                                                <strong>{s.name}</strong> — {s.street}, {s.locality} ·{' '}
                                                <a href={s.tel} className={styles.inlineLink + ' ' + styles.num}>
                                                    {s.phone}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                            <div className={styles.fact}>
                                <dt>{f.hours}</dt>
                                <dd>
                                    {HOURS.text[lang]} · {HOURS.closed[lang]}
                                </dd>
                            </div>
                            <div className={styles.fact}>
                                <dt>{f.whatsapp}</dt>
                                <dd>
                                    {links.wa(WHATSAPP.display)} ({f.whatsappNote})
                                </dd>
                            </div>
                            <div className={styles.fact}>
                                <dt>{f.price}</dt>
                                <dd>{PRICE_NOTE[lang]}</dd>
                            </div>
                        </dl>
                    </Reveal>
                </div>
            </section>

            {/* What we offer: the shared RangeTile anatomy (media on top, label below) into each area */}
            <section className="section" aria-labelledby="about-offer-title">
                <div className="container">
                    <SectionHeader id="about-offer-title" eyebrow={c.offerEyebrow} title={c.offerTitle} />

                    <StaggerGroup as="ul" className={styles.offer}>
                        <StaggerItem as="li" className={styles.offerItem}>
                            <RangeTile
                                kind="engine"
                                src="/images/FourStrokes/150pk.png"
                                href="/products/four-strokes"
                                title={c.outboards}
                                sub={nav.fourStrokes + ' · ' + nav.twoStrokes}
                                sizes="(max-width: 639px) 80vw, (max-width: 1099px) 40vw, 240px"
                            />
                        </StaggerItem>
                        <StaggerItem as="li" className={styles.offerItem}>
                            <RangeTile
                                kind="photo"
                                src="/images/News/ganti-oli-corong.jpg"
                                objectPosition="50% 55%"
                                href="/servis"
                                title={c.service}
                                sub={ttj.name}
                                sizes="(max-width: 639px) 120vw, (max-width: 1099px) 60vw, 340px"
                            />
                        </StaggerItem>
                        <StaggerItem as="li" className={styles.offerItem}>
                            <RangeTile
                                kind="photo"
                                src="/images/parts2.jpg"
                                objectPosition="40% 50%"
                                href="/parts"
                                title={c.parts}
                                sizes={PHOTO_SIZES}
                            />
                        </StaggerItem>
                        <StaggerItem as="li" className={styles.offerItem}>
                            <RangeTile
                                kind="photo"
                                src="/images/yamalube.jpg"
                                objectPosition="78% 50%"
                                href="/yamalube"
                                title={c.yamalube}
                                sizes={PHOTO_SIZES}
                            />
                        </StaggerItem>
                    </StaggerGroup>
                </div>
            </section>

            {/* Quote band: the dealer's promise, set large on deep navy */}
            <section className={'section section-deep on-dark ' + styles.quoteBand}>
                <Reveal className={'container ' + styles.quoteInner}>
                    <span className={styles.quoteMark} aria-hidden="true">
                        &ldquo;
                    </span>
                    <blockquote className={styles.quote}>
                        <p>{c.quote}</p>
                    </blockquote>
                    <Eyebrow as="p" className={styles.signoff}>
                        {c.signoff}
                    </Eyebrow>
                </Reveal>
            </section>

            {/* Stores */}
            <section className="section" aria-labelledby="about-visit-title">
                <div className="container">
                    <SectionHeader id="about-visit-title" size="sm" eyebrow={c.visitEyebrow} title={c.visitTitle} />
                    <StoreCards tone="light" />
                </div>
            </section>

            <CtaBand />
        </>
    );
}
