'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { HOURS, waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import { SERVICE_STORE } from '@/components/ui/stores';
import { seriesHref } from '@/lib/paths';
import Reveal from '@/components/motion/Reveal';
import ImageReveal from '@/components/motion/ImageReveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import StoreCards from '@/components/ui/StoreCards';
import CtaBand from '@/components/ui/CtaBand';
import RangeTile from '@/components/ui/RangeTile';
import PriceNote from '@/components/contact/PriceNote';
import { Chat, WhatsApp } from '@/components/ui/Icons';

// Indonesian first (the server-rendered language). What is sold: Yamaha genuine parts for Yamaha
// outboards. No part numbers, stock levels, lead times or shipping are claimed; the example parts are the
// ones pictured on this page and the home page, and availability is always "ask us".
const COPY = {
    id: {
        home: 'Beranda',
        crumb: 'Suku Cadang Asli',
        heroEyebrow: 'Yamaha Genuine Parts',
        heroTitle: 'Suku Cadang Asli Mesin Tempel Yamaha',
        heroLead:
            'Suku cadang asli Yamaha untuk mesin tempel Yamaha 2 tak dan 4 tak, dibuat dengan presisi agar pas dan awet. Kirim model mesin dan nomor seri lewat WhatsApp — kami bantu carikan part yang tepat.',
        heroAlt: 'Detail aluminium hasil mesin bubut dengan butiran air',
        whatsapp: 'Tanya lewat WhatsApp',
        whatsappLabel: `Tanya suku cadang lewat WhatsApp ${WHATSAPP.display}`,
        askPevita: 'Tanya Pevita',
        chatQuery: 'Saya mencari suku cadang asli Yamaha untuk mesin tempel saya.',
        availEyebrow: 'Yang tersedia',
        availTitle: 'Suku cadang asli untuk mesin tempel Yamaha',
        availP1: (two, four) => (
            <>
                Kami menjual suku cadang asli Yamaha (Yamaha Genuine Parts) untuk mesin tempel Yamaha, baik {two('2 tak')}{' '}
                maupun {four('4 tak')}. Suku cadang asli dibuat dengan presisi agar pas dengan mesin Anda, dan
                teruji daya tahannya.
            </>
        ),
        availP2:
            'Contohnya baling-baling, piston dan ring piston, busi, connecting rod (stang seher) dan roda gigi, serta komponen lain untuk servis berkala maupun perbaikan.',
        availP3:
            'Ketersediaan tergantung model mesin dan jenis part. Hubungi kami untuk harga dan ketersediaan — kami bantu memastikan part yang tepat untuk mesin Anda.',
        rangeAlt: 'Suku cadang asli Yamaha: kotak baling-baling, roda gigi dan connecting rod',
        rangeCaption: 'Suku Cadang Asli Yamaha',
        howEyebrow: 'Cara memesan',
        howTitle: 'Cara memesan suku cadang yang tepat',
        steps: [
            {
                title: 'Catat model mesin dan nomor seri',
                text: 'Keduanya tertera pada label identitas di mesin tempel Anda. Contoh model: E40GMH atau F115.',
            },
            {
                title: 'Siapkan nomor part atau foto',
                text: 'Bila ada, catat nomor part dari part lama atau buku manual. Foto part yang perlu diganti juga membantu.',
            },
            {
                title: 'Kirim lewat WhatsApp atau telepon',
                text: `WhatsApp ${WHATSAPP.display}, atau telepon salah satu toko kami.`,
            },
            {
                title: 'Kami konfirmasi harga dan ketersediaan',
                text: `Lalu ambil part Anda di salah satu dari dua toko kami di Padang (${HOURS.text.id}).`,
            },
        ],
        relEyebrow: 'Pemasangan & oli',
        relTitle: 'Butuh pemasangan atau oli?',
        relLead: `Penggantian suku cadang asli Yamaha termasuk layanan bengkel kami di ${SERVICE_STORE.name}. Untuk oli mesin dan oli gardan, pilih Yamalube.`,
        serviceTile: 'Servis & Bengkel',
        oilTile: 'Oli Yamalube',
        oilSub: 'Oli 2 tak, 4 tak dan oli gardan',
        visitEyebrow: 'Kunjungi kami',
        visitTitle: 'Dua toko di Padang',
        ctaTitle: 'Tidak yakin suku cadang mana yang Anda butuhkan?',
        ctaLead: 'Kirim model mesin dan nomor seri lewat WhatsApp, tanya Pevita, atau telepon salah satu toko kami.',
    },
    en: {
        home: 'Home',
        crumb: 'Genuine Parts',
        heroEyebrow: 'Yamaha Genuine Parts',
        heroTitle: 'Yamaha Outboard Genuine Parts',
        heroLead:
            'Yamaha genuine parts for Yamaha 2-stroke and 4-stroke outboards, precision-made to fit and to last. Send your engine model and serial number on WhatsApp — we will help you find the right part.',
        heroAlt: 'Close-up of machined aluminium with water droplets',
        whatsapp: 'Ask on WhatsApp',
        whatsappLabel: `Ask about parts on WhatsApp ${WHATSAPP.display}`,
        askPevita: 'Ask Pevita',
        chatQuery: "I'm looking for a Yamaha genuine part for my outboard.",
        availEyebrow: "What's available",
        availTitle: 'Genuine parts for Yamaha outboards',
        availP1: (two, four) => (
            <>
                We sell Yamaha genuine parts for Yamaha outboards, both {two('2-stroke')} and {four('4-stroke')}.
                Genuine parts are precision-made to fit your engine and tested for durability.
            </>
        ),
        availP2:
            'For example propellers, pistons and piston rings, spark plugs, connecting rods and gears, as well as other components for periodic maintenance and repairs.',
        availP3:
            'Availability depends on the engine model and the part. Contact us for price and availability — we will help make sure you get the right part for your engine.',
        rangeAlt: 'Yamaha genuine parts: propeller boxes, gears and connecting rods',
        rangeCaption: 'Yamaha Genuine Parts',
        howEyebrow: 'How to order',
        howTitle: 'How to get the right part',
        steps: [
            {
                title: 'Note your engine model and serial number',
                text: 'Both are on the identification label on your outboard. Example models: E40GMH or F115.',
            },
            {
                title: 'Have the part number or a photo ready',
                text: 'If you can, note the part number from the old part or the owner’s manual. A photo of the part to replace helps too.',
            },
            {
                title: 'Send it on WhatsApp or call',
                text: `WhatsApp ${WHATSAPP.display}, or call one of our stores.`,
            },
            {
                title: 'We confirm price and availability',
                text: `Then pick up your part at one of our two stores in Padang (${HOURS.text.en}).`,
            },
        ],
        relEyebrow: 'Fitting & oil',
        relTitle: 'Need it fitted, or need oil?',
        relLead: `Yamaha genuine part replacement is one of the services at our ${SERVICE_STORE.name} workshop. For engine and gear oil, choose Yamalube.`,
        serviceTile: 'Service & Workshop',
        oilTile: 'Yamalube Oil',
        oilSub: '2-stroke, 4-stroke and gear oils',
        visitEyebrow: 'Visit us',
        visitTitle: 'Two stores in Padang',
        ctaTitle: 'Not sure which part you need?',
        ctaLead: 'Send your engine model and serial number on WhatsApp, ask Pevita, or call one of our stores.',
    },
};

export default function PartsPage() {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const c = COPY[lang];
    const waParts = WA_TEXT.parts[lang];

    const seriesLink = (series) => (text) => (
        <Link href={seriesHref(series)} className={styles.inlineLink}>
            {text}
        </Link>
    );

    return (
        <>
            {/* Phones: the shared photo band puts the machined detail above the copy. Desktop: the strong scrim keeps
                the headline on the dark side of the metal. */}
            <PageHero
                image="/images/parts-hero-machined.jpg"
                imageAlt={c.heroAlt}
                imagePosition="50% 50%"
                imagePositionMobile="85% 50%"
                bandHeight="min(74vw, 320px)"
                scrim="strong"
                size="default"
                breadcrumbs={[{ label: c.home, href: '/' }, { label: c.crumb }]}
                eyebrow={c.heroEyebrow}
                title={c.heroTitle}
                lead={c.heroLead}
            >
                <a
                    href={waLink(waParts)}
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
                    {c.askPevita}
                </Link>
            </PageHero>

            {/* What's available: header left, copy right (stacked below 1024px), then the genuine parts pack
                shot across the full row. */}
            <section className="section" aria-labelledby="parts-avail-title">
                <div className={'container ' + styles.howGrid}>
                    <SectionHeader
                        id="parts-avail-title"
                        eyebrow={c.availEyebrow}
                        title={c.availTitle}
                        className={styles.howHeader}
                    />

                    <Reveal className={styles.availBody} delay={0.1}>
                        <p className={styles.availLead}>{c.availP1(seriesLink('two'), seriesLink('four'))}</p>
                        <p className={styles.availText}>{c.availP2}</p>
                        <p className={styles.availText}>{c.availP3}</p>
                    </Reveal>

                    {/* Pack shot on the white section, no card chrome: wide screens show the whole range at its
                        natural ratio; phones/tablets bleed to the screen edge and crop in on the propeller boxes,
                        gears and con-rod so the parts read at a usable size. */}
                    <figure className={styles.rangeFigure}>
                        <ImageReveal className={styles.range}>
                            <Image
                                src="/images/parts2.jpg"
                                alt={c.rangeAlt}
                                fill
                                sizes="(max-width: 640px) 170vw, (max-width: 1023px) 130vw, 1080px"
                                className={styles.rangeImg}
                            />
                        </ImageReveal>
                        <Reveal as="figcaption" className={'eyebrow eyebrow-plain ' + styles.caption} delay={0.2} y={8}>
                            {c.rangeCaption}
                        </Reveal>
                    </figure>
                </div>
            </section>

            {/* How to order: header left, numbered steps right (stacked below 1024px), then the price note. */}
            <section className="section section-alt" aria-labelledby="parts-how-title">
                <div className={'container ' + styles.howGrid}>
                    <SectionHeader
                        id="parts-how-title"
                        eyebrow={c.howEyebrow}
                        title={c.howTitle}
                        className={styles.howHeader}
                    />

                    {/* role="list" keeps list semantics in Safari once list-style is removed. */}
                    <StaggerGroup as="ol" role="list" className={styles.steps} stagger={0.1}>
                        {/* Index keys: the rows must survive a language switch after they've revealed. */}
                        {c.steps.map((step, i) => (
                            <StaggerItem as="li" key={i} className={styles.step} y={16}>
                                <span className={styles.stepNum} aria-hidden="true">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <div className={styles.stepBody}>
                                    <p className={styles.stepText}>{step.title}</p>
                                    <p className={styles.stepDesc}>{step.text}</p>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerGroup>

                    <Reveal className={styles.priceNote}>
                        <PriceNote waText={waParts} />
                    </Reveal>
                </div>
            </section>

            {/* Fitting & oil: into the workshop and Yamalube pages. */}
            <section className="section" aria-labelledby="parts-rel-title">
                <div className="container">
                    <SectionHeader id="parts-rel-title" eyebrow={c.relEyebrow} title={c.relTitle} lead={c.relLead} />
                    <StaggerGroup as="ul" className={styles.tiles}>
                        <StaggerItem as="li" className={styles.tile}>
                            <RangeTile
                                kind="photo"
                                src="/images/News/ganti-oli-corong.jpg"
                                objectPosition="50% 55%"
                                href="/servis"
                                title={c.serviceTile}
                                sub={SERVICE_STORE.name}
                                ratio="16 / 9"
                                sizes="(max-width: 767px) 100vw, 640px"
                            />
                        </StaggerItem>
                        <StaggerItem as="li" className={styles.tile}>
                            <RangeTile
                                kind="photo"
                                src="/images/yamalube.jpg"
                                objectPosition="78% 50%"
                                href="/yamalube"
                                title={c.oilTile}
                                sub={c.oilSub}
                                ratio="16 / 9"
                                sizes="(max-width: 767px) 130vw, 780px"
                            />
                        </StaggerItem>
                    </StaggerGroup>
                </div>
            </section>

            {/* Stores: grey, so the white sections above don't run straight into them. */}
            <section className="section section-alt" aria-labelledby="parts-visit-title">
                <div className="container">
                    <SectionHeader id="parts-visit-title" size="sm" eyebrow={c.visitEyebrow} title={c.visitTitle} />
                    <StoreCards tone="light" />
                </div>
            </section>

            <CtaBand chatQuery={c.chatQuery} title={c.ctaTitle} lead={c.ctaLead} waText={waParts} />
        </>
    );
}
