// Site-wide business facts. Every value here was confirmed by the owner; do not add facts that
// are not (postal codes, coordinates, founding year, social profiles, credit/delivery/warranty
// terms, public-holiday hours). Server- and client-safe: no imports, no 'use client'.

export const SITE_URL = 'https://perkasajayamarine.com';
export const SITE_NAME = 'Perkasa Jaya Marine';

/** Fixed "content last changed" date for the sitemap. Bump it when page content changes. */
export const CONTENT_UPDATED = '2026-10-29';

/** Square logo (512×512 PNG) for structured data and the web manifest. */
export const LOGO = { url: '/images/logo-square.png', width: 512, height: 512 };

/** How the business describes itself (use these exact words). */
export const BUSINESS = {
    name: SITE_NAME,
    role: { id: 'Dealer Resmi Yamaha Marine', en: 'Authorized Yamaha Marine dealer' },
    city: 'Padang',
    // One spelling per language, everywhere (visible text, JSON-LD, chat).
    region: { id: 'Sumatera Barat', en: 'West Sumatra' },
    country: 'ID',
};

/** WhatsApp, shared by both stores. */
export const WHATSAPP = {
    display: '+62 878-8282-8232',
    e164: '+6287882828232',
    number: '6287882828232',
    url: 'https://wa.me/6287882828232',
};

/** wa.me link, optionally with a prefilled message. */
export function waLink(text) {
    const t = typeof text === 'string' ? text.trim() : '';
    return t ? WHATSAPP.url + '?text=' + encodeURIComponent(t) : WHATSAPP.url;
}

/** Prefilled WhatsApp messages. `price(model)` / `about(model)` take a model name. */
export const WA_TEXT = {
    general: {
        id: 'Halo Perkasa Jaya Marine, saya ingin bertanya.',
        en: 'Hello Perkasa Jaya Marine, I have a question.',
    },
    price: {
        id: (model) => `Halo Perkasa Jaya Marine, saya ingin menanyakan harga dan ketersediaan ${model || 'mesin tempel Yamaha'}.`,
        en: (model) => `Hello Perkasa Jaya Marine, I would like to ask about the price and availability of ${model || 'a Yamaha outboard'}.`,
    },
    service: {
        id: 'Halo Toko Tunggal Jaya, saya ingin bertanya tentang servis mesin tempel Yamaha.',
        en: 'Hello Toko Tunggal Jaya, I would like to ask about servicing my Yamaha outboard.',
    },
    parts: {
        id: 'Halo Perkasa Jaya Marine, saya ingin menanyakan suku cadang asli Yamaha.',
        en: 'Hello Perkasa Jaya Marine, I would like to ask about Yamaha genuine parts.',
    },
    oil: {
        id: 'Halo Perkasa Jaya Marine, saya ingin menanyakan oli Yamalube.',
        en: 'Hello Perkasa Jaya Marine, I would like to ask about Yamalube oil.',
    },
};

/** Opening hours: both stores, Monday–Saturday 08:00–17:00 WIB (UTC+7), closed Sunday. */
export const HOURS = {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '17:00',
    timeZone: 'Asia/Jakarta',
    utcOffset: '+07:00',
    // Full sentence-style line.
    text: { id: 'Senin–Sabtu, 08.00–17.00 WIB', en: 'Monday–Saturday, 08:00–17:00 WIB' },
    // Compact line for footers and cards.
    short: { id: 'Sen–Sab 08.00–17.00 WIB', en: 'Mon–Sat 08:00–17:00 WIB' },
    closed: { id: 'Minggu tutup', en: 'Closed on Sunday' },
    // Label for the hours line.
    label: { id: 'Jam buka', en: 'Opening hours' },
};

/** Prices are not published: say this wherever price comes up, with WhatsApp + call options. */
export const PRICE_NOTE = {
    id: 'Hubungi kami untuk harga dan ketersediaan',
    en: 'Contact us for price and availability',
};

/**
 * Servicing: all types of Yamaha Marine (outboard) servicing, done at Toko Tunggal Jaya.
 * `examples` are examples of "all types" — not a closed list. Do not add on-site/harbour service,
 * pickup, warranty terms, booking rules, certifications or staff claims.
 */
export const SERVICE = {
    storeId: 'tunggal-jaya',
    name: { id: 'Servis mesin tempel Yamaha', en: 'Yamaha outboard servicing' },
    summary: {
        id: 'Semua jenis servis mesin tempel Yamaha (Yamaha Marine) dikerjakan di bengkel Toko Tunggal Jaya, Padang.',
        en: 'All types of Yamaha Marine (outboard) servicing, done at the Toko Tunggal Jaya workshop in Padang.',
    },
    examples: {
        id: [
            'Servis berkala',
            'Perbaikan mesin',
            'Tune-up',
            'Ganti oli mesin dan oli gardan',
            'Penggantian suku cadang asli Yamaha',
        ],
        en: [
            'Periodic maintenance',
            'Engine repairs',
            'Tune-ups',
            'Engine oil and gear oil changes',
            'Yamaha genuine part replacement',
        ],
    },
};
