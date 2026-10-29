'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { HOURS, SERVICE, waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import { SERVICE_STORE } from '@/components/ui/stores';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import RangeTile from '@/components/ui/RangeTile';
import CtaBand from '@/components/ui/CtaBand';
import MapFacade from '@/components/contact/MapFacade';
import PriceNote from '@/components/contact/PriceNote';
import { ArrowRight, Clock, ExternalLink, Phone, Pin, WhatsApp, Wrench } from '@/components/ui/Icons';

// Indonesian first (the server-rendered language). Facts come from '@/lib/site' and SERVICE_STORE only:
// all types of Yamaha Marine servicing, at Toko Tunggal Jaya. No on-site/harbour service, pickup,
// warranty, booking rules or certifications are claimed.
const store = SERVICE_STORE;

const COPY = {
    id: {
        home: 'Beranda',
        crumb: 'Servis & Bengkel',
        eyebrow: 'Servis & bengkel · ' + store.name,
        title: 'Servis Mesin Tempel Yamaha di Padang',
        lead: `${SERVICE.summary.id} Buka ${HOURS.text.id}.`,
        heroWa: 'WhatsApp',
        heroWaLabel: `Tanya servis lewat WhatsApp ${WHATSAPP.display}`,
        heroCall: `Telepon ${store.name}`,
        heroCallLabel: `Telepon ${store.name}, ${store.phone}`,
        servicesEyebrow: 'Layanan servis',
        servicesTitle: 'Semua jenis servis mesin tempel Yamaha',
        servicesLead:
            'Mulai dari servis berkala hingga perbaikan, semua jenis servis mesin tempel Yamaha dikerjakan di bengkel ' +
            store.name +
            '. Contohnya:',
        servicesListLabel: 'Contoh jenis servis',
        servicesMore:
            'Servis yang Anda butuhkan tidak ada di daftar ini? Tanyakan saja — kami melayani semua jenis servis mesin tempel Yamaha.',
        costTitle: 'Biaya & waktu pengerjaan',
        costText: `Hubungi kami lewat WhatsApp atau telepon ${store.name} untuk menanyakan biaya servis dan perkiraan lama pengerjaan. Sebutkan model mesin dan keluhannya.`,
        whereEyebrow: 'Lokasi bengkel',
        whereTitle: `Bengkel servis di ${store.name}`,
        whereLead: `Untuk servis, silakan datang ke ${store.name}. Kedua toko kami bisa dihubungi lewat nomor WhatsApp yang sama.`,
        address: 'Alamat',
        phone: 'Telepon',
        whatsapp: 'WhatsApp',
        hours: 'Jam buka',
        directions: 'Petunjuk arah (Google Maps)',
        mapShow: 'Tampilkan peta',
        mapShowLabel: `Tampilkan peta ${store.name}`,
        mapNote: 'Peta dimuat dari Google Maps',
        mapTitle: `Peta: ${store.name}`,
        stepsEyebrow: 'Cara servis',
        stepsTitle: 'Servis dalam tiga langkah',
        steps: [
            {
                title: 'Hubungi kami',
                text: `Kirim WhatsApp ke ${WHATSAPP.display} atau telepon ${store.name} di ${store.phone}.`,
            },
            {
                title: 'Sebutkan mesin dan keluhannya',
                text: 'Model mesin tempel (misalnya E40GMH atau F115), nomor seri bila ada, serta servis yang dibutuhkan atau keluhan yang Anda alami. Foto atau video singkat juga membantu.',
            },
            {
                title: 'Datang ke bengkel',
                text: `${store.name}, ${store.street}, ${store.city.id}. ${HOURS.text.id}. ${HOURS.closed.id}.`,
            },
        ],
        partsEyebrow: 'Suku cadang & oli',
        partsTitle: 'Suku cadang asli Yamaha dan oli Yamalube',
        partsLead:
            'Suku cadang asli Yamaha dibuat dengan presisi agar pas dan awet di mesin tempel Yamaha, sedangkan oli Yamalube diformulasikan khusus untuk mesin tempel Yamaha. Keduanya tersedia di toko kami di Padang.',
        partsTile: 'Suku Cadang Asli Yamaha',
        partsSub: 'Kirim model dan nomor seri lewat WhatsApp',
        oilTile: 'Oli Yamalube',
        oilSub: 'Oli 2 tak, 4 tak dan oli gardan',
        guidesTitle: 'Panduan perawatan',
        faq: 'Pertanyaan lain? Lihat tanya jawab (FAQ)',
        chatQuery: 'Saya ingin bertanya tentang servis mesin tempel Yamaha.',
        ctaTitle: 'Mesin tempel Anda perlu diservis?',
        ctaLead: `Kirim pesan WhatsApp atau telepon ${store.name}, lalu ceritakan model mesin dan keluhannya. Staf kami siap membantu.`,
    },
    en: {
        home: 'Home',
        crumb: 'Service & Workshop',
        eyebrow: 'Service & workshop · ' + store.name,
        title: 'Yamaha Outboard Service in Padang',
        lead: `${SERVICE.summary.en} Open ${HOURS.text.en}.`,
        heroWa: 'WhatsApp',
        heroWaLabel: `Ask about servicing on WhatsApp ${WHATSAPP.display}`,
        heroCall: `Call ${store.name}`,
        heroCallLabel: `Call ${store.name}, ${store.phone}`,
        servicesEyebrow: 'Service',
        servicesTitle: 'All types of Yamaha outboard servicing',
        servicesLead:
            'From periodic maintenance to repairs, every type of Yamaha outboard servicing is done at the ' +
            store.name +
            ' workshop. For example:',
        servicesListLabel: 'Examples of service types',
        servicesMore:
            "Don't see the service you need? Just ask — we handle all types of Yamaha outboard servicing.",
        costTitle: 'Cost & turnaround',
        costText: `Message us on WhatsApp or call ${store.name} for the service cost and an estimate of how long the work takes. Tell us your engine model and the problem.`,
        whereEyebrow: 'Workshop location',
        whereTitle: `The service workshop at ${store.name}`,
        whereLead: `For servicing, come to ${store.name}. Both our stores share the same WhatsApp number.`,
        address: 'Address',
        phone: 'Phone',
        whatsapp: 'WhatsApp',
        hours: 'Opening hours',
        directions: 'Directions (Google Maps)',
        mapShow: 'Show map',
        mapShowLabel: `Show map of ${store.name}`,
        mapNote: 'Loads Google Maps',
        mapTitle: `Map: ${store.name}`,
        stepsEyebrow: 'How it works',
        stepsTitle: 'Service in three steps',
        steps: [
            {
                title: 'Contact us',
                text: `Send a WhatsApp message to ${WHATSAPP.display} or call ${store.name} on ${store.phone}.`,
            },
            {
                title: 'Tell us the engine and the problem',
                text: 'Your outboard model (for example E40GMH or F115), the serial number if you have it, and the service you need or the problem you have. A photo or a short video helps too.',
            },
            {
                title: 'Come to the workshop',
                text: `${store.name}, ${store.street}, ${store.city.en}. ${HOURS.text.en}. ${HOURS.closed.en}.`,
            },
        ],
        partsEyebrow: 'Parts & oil',
        partsTitle: 'Yamaha genuine parts and Yamalube oil',
        partsLead:
            'Yamaha genuine parts are precision-made to fit Yamaha outboards and last, and Yamalube oil is formulated specifically for Yamaha outboards. We sell both at our stores in Padang.',
        partsTile: 'Yamaha Genuine Parts',
        partsSub: 'Send your model and serial number on WhatsApp',
        oilTile: 'Yamalube Oil',
        oilSub: '2-stroke, 4-stroke and gear oils',
        guidesTitle: 'Maintenance guides',
        faq: 'More questions? See the FAQ',
        chatQuery: 'I have a question about servicing my Yamaha outboard.',
        ctaTitle: 'Does your outboard need a service?',
        ctaLead: `Send a WhatsApp message or call ${store.name}. Tell us the engine model and the problem, and our staff will help.`,
    },
};

export default function ServisContent({ guides = [] }) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const c = COPY[lang];
    const examples = SERVICE.examples[lang];
    const waService = waLink(WA_TEXT.service[lang]);

    return (
        <>
            {/* Phones: the shared photo band puts the funnel and wrench above the copy. Desktop: the strong
                scrim keeps the headline on the dark side of the photo. */}
            <PageHero
                image="/images/News/ganti-oli-corong.jpg"
                imagePosition="62% 50%"
                imagePositionTablet="70% 50%"
                imagePositionMobile="50% 40%"
                scrim="strong"
                size="default"
                breadcrumbs={[{ label: c.home, href: '/' }, { label: c.crumb }]}
                eyebrow={c.eyebrow}
                title={c.title}
                lead={c.lead}
            >
                <a
                    href={waService}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg btn-block-sm"
                    aria-label={c.heroWaLabel}
                >
                    <WhatsApp />
                    {c.heroWa}
                </a>
                <a href={store.tel} className="btn btn-ghost btn-lg btn-block-sm" aria-label={c.heroCallLabel}>
                    <Phone />
                    {c.heroCall}
                </a>
            </PageHero>

            {/* Services: header left, the examples as a numbered rail right; the cost note below. */}
            <section className="section" aria-labelledby="servis-services-title">
                <div className={'container ' + styles.servicesGrid}>
                    <SectionHeader
                        id="servis-services-title"
                        className={styles.servicesHeader}
                        eyebrow={c.servicesEyebrow}
                        title={c.servicesTitle}
                        lead={c.servicesLead}
                    />

                    <div className={styles.servicesBody}>
                        {/* role="list" keeps list semantics in Safari once list-style is removed. */}
                        <StaggerGroup as="ul" role="list" aria-label={c.servicesListLabel} className={styles.services} stagger={0.08}>
                            {/* Index keys: the rows must survive a language switch after they've revealed. */}
                            {examples.map((item, i) => (
                                <StaggerItem as="li" key={i} className={styles.service} y={16}>
                                    <span className={styles.serviceIcon} aria-hidden="true">
                                        <Wrench size={18} />
                                    </span>
                                    <span className={styles.serviceText}>{item}</span>
                                </StaggerItem>
                            ))}
                        </StaggerGroup>
                        <Reveal as="p" className={styles.servicesMore} delay={0.1}>
                            {c.servicesMore}
                        </Reveal>
                    </div>

                    <Reveal className={styles.cost}>
                        <PriceNote
                            title={c.costTitle}
                            text={c.costText}
                            waText={WA_TEXT.service[lang]}
                            stores={[store]}
                        />
                    </Reveal>
                </div>
            </section>

            {/* Where: the workshop's details next to a click-to-load map. */}
            <section className="section section-alt" aria-labelledby="servis-where-title">
                <div className="container">
                    <SectionHeader id="servis-where-title" eyebrow={c.whereEyebrow} title={c.whereTitle} lead={c.whereLead} />

                    <div className={styles.whereGrid}>
                        <Reveal className={styles.storeCard}>
                            <p className={styles.storeName}>
                                <span className={styles.storePin} aria-hidden="true">
                                    <Pin size={20} />
                                </span>
                                {store.name}
                            </p>
                            <dl className={styles.details}>
                                <div className={styles.detail}>
                                    <dt>{c.address}</dt>
                                    <dd>
                                        <address className={styles.address}>
                                            {store.street}
                                            <br />
                                            {store.city[lang]}
                                        </address>
                                    </dd>
                                </div>
                                <div className={styles.detail}>
                                    <dt>{c.phone}</dt>
                                    <dd>
                                        <a href={store.tel} className={styles.detailLink}>
                                            <Phone size={16} />
                                            {store.phone}
                                        </a>
                                    </dd>
                                </div>
                                <div className={styles.detail}>
                                    <dt>{c.whatsapp}</dt>
                                    <dd>
                                        <a
                                            href={waService}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.detailLink}
                                        >
                                            <WhatsApp size={16} />
                                            {WHATSAPP.display}
                                        </a>
                                    </dd>
                                </div>
                                <div className={styles.detail}>
                                    <dt>{c.hours}</dt>
                                    <dd className={styles.hours}>
                                        <Clock size={16} />
                                        <span>
                                            {HOURS.text[lang]}
                                            <span className={styles.closed}>{HOURS.closed[lang]}</span>
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                            <a
                                href={store.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={'btn btn-link ' + styles.directions}
                            >
                                {c.directions}
                                <ExternalLink className="btn-arrow" />
                            </a>
                        </Reveal>

                        <Reveal delay={0.1} className={styles.mapCell}>
                            <MapFacade
                                src={store.mapEmbed}
                                title={c.mapTitle}
                                name={store.name}
                                address={`${store.street}, ${store.locality}`}
                                showLabel={c.mapShow}
                                ariaLabel={c.mapShowLabel}
                                note={c.mapNote}
                                className={styles.map}
                            />
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Steps: three numbered cards. */}
            <section className="section" aria-labelledby="servis-steps-title">
                <div className="container">
                    <SectionHeader id="servis-steps-title" eyebrow={c.stepsEyebrow} title={c.stepsTitle} />
                    <StaggerGroup as="ol" role="list" className={styles.steps} stagger={0.1}>
                        {c.steps.map((step, i) => (
                            <StaggerItem as="li" key={i} className={styles.step} y={16}>
                                <span className={styles.stepNum} aria-hidden="true">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepText}>{step.text}</p>
                            </StaggerItem>
                        ))}
                    </StaggerGroup>
                </div>
            </section>

            {/* Genuine parts + Yamalube, then the maintenance guides. */}
            <section className="section section-alt" aria-labelledby="servis-parts-title">
                <div className="container">
                    <SectionHeader id="servis-parts-title" eyebrow={c.partsEyebrow} title={c.partsTitle} lead={c.partsLead} />

                    <StaggerGroup as="ul" className={styles.tiles}>
                        <StaggerItem as="li" className={styles.tile}>
                            <RangeTile
                                kind="photo"
                                src="/images/parts2.jpg"
                                objectPosition="40% 50%"
                                href="/parts"
                                title={c.partsTile}
                                sub={c.partsSub}
                                ratio="16 / 9"
                                sizes="(max-width: 767px) 130vw, 780px"
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

                    <div className={styles.more}>
                        {guides.length > 0 && (
                            <Reveal className={styles.guides}>
                                <h3 className={styles.guidesTitle}>{c.guidesTitle}</h3>
                                <ul className={styles.guideList}>
                                    {guides.map((g) => (
                                        <li key={g.href}>
                                            <Link href={g.href} className={styles.guideLink}>
                                                {g.title}
                                                <ArrowRight size={16} className={styles.guideArrow} />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                        )}
                        <Reveal delay={0.1}>
                            <Link href="/faq" className="btn btn-link">
                                {c.faq}
                                <ArrowRight className="btn-arrow" />
                            </Link>
                        </Reveal>
                    </div>
                </div>
            </section>

            <CtaBand chatQuery={c.chatQuery} title={c.ctaTitle} lead={c.ctaLead} waText={WA_TEXT.service[lang]} />
        </>
    );
}
