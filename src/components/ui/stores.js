// Single source of truth for the two physical stores (visible pages, JSON-LD, chat).
// Facts only, as confirmed by the owner. Do not add postal codes, coordinates, ratings, public-holiday
// hours or anything else that has not been confirmed. Order matters: other code uses STORES[0] / [1].

import { BUSINESS, HOURS, SERVICE, WHATSAPP } from '@/lib/site';

// One region spelling per language, everywhere: 'Sumatera Barat' (ID) / 'West Sumatra' (EN).
const CITY = {
    en: `${BUSINESS.city}, ${BUSINESS.region.en}`,
    id: `${BUSINESS.city}, ${BUSINESS.region.id}`,
};

const mapsSearch = (query) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);

export const STORES = [
    {
        id: 'tunggal-jaya',
        name: 'Toko Tunggal Jaya',
        street: 'Jalan M. Yamin SH No 144',
        locality: BUSINESS.city,
        region: BUSINESS.region,
        country: BUSINESS.country,
        city: CITY,
        phone: '+62 751 36628',
        tel: 'tel:+6275136628',
        fax: '+62 751 26179',
        email: 'harry@pjmcv.com',
        hours: HOURS,
        whatsapp: WHATSAPP,
        // The workshop (bengkel): all types of Yamaha Marine servicing happen here.
        servicing: true,
        services: SERVICE.examples,
        role: {
            id: 'Toko & bengkel servis mesin tempel Yamaha',
            en: 'Store & Yamaha outboard service workshop',
        },
        mapsUrl: mapsSearch('Tunggal jaya (Mesin Tempel Yamaha) Padang'),
        mapEmbed:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.2682573356733!2d100.35342067552749!3d-0.951420006059945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b94a495d8d3d%3A0x2b0f9201758b4d0a!2sTunggal%20jaya%20(Mesin%20Tempel%20Yamaha)!5e0!3m2!1sen!2sus!4v1715839884194!5m2!1sen!2sus',
    },
    {
        id: 'perkasa-jaya-marine',
        name: 'Perkasa Jaya Marine',
        street: 'Jalan Imam Bonjol No. 27D',
        locality: BUSINESS.city,
        region: BUSINESS.region,
        country: BUSINESS.country,
        city: CITY,
        phone: '+62 751 840010',
        tel: 'tel:+62751840010',
        fax: '+62 751 26179',
        email: 'harry@pjmcv.com',
        hours: HOURS,
        whatsapp: WHATSAPP,
        servicing: false,
        services: null,
        role: {
            id: 'Toko',
            en: 'Store',
        },
        mapsUrl: mapsSearch('CV. PERKASA JAYA MARINE Padang'),
        mapEmbed:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.6318303022213!2d100.36156940017027!3d-0.9553872098235918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b94565e985ed%3A0xf32c9c76b6fb39c1!2sCV.%20PERKASA%20JAYA%20MARINE!5e0!3m2!1sen!2sus!4v1715840042078!5m2!1sen!2sus',
    },
];

export const MAIN_STORE = STORES[1];

/** The store with the workshop (Toko Tunggal Jaya). */
export const SERVICE_STORE = STORES.find((s) => s.servicing) || STORES[0];

export { HOURS, WHATSAPP };
