// The FAQ, in both languages. ONE source for the visible page (FaqContent) and the FAQPage JSON-LD
// (page.js), so the structured data always matches the rendered text word for word.
//
// Server- and client-safe: no 'use client', no '@/lib/slugs' (it would bundle every JSON file into the
// client). Data-dependent bits (power ranges, guide URLs) arrive through `ctx`, computed in page.js.
//
// Facts come only from '@/lib/site' and STORES. Questions the owner has not answered (credit, delivery,
// warranty) get an honest "contact us on WhatsApp" answer — never invent terms.
//
// An answer is a list of segments: plain strings, or { text, href } links. faqPlainText() joins the
// texts, so the JSON-LD answer is exactly the visible sentence without the link markup.

import { BUSINESS, HOURS, PRICE_NOTE, SERVICE, waLink, WA_TEXT, WHATSAPP } from '@/lib/site';
import { MAIN_STORE, SERVICE_STORE } from '@/components/ui/stores';
import { seriesHref } from '@/lib/paths';

const pjm = MAIN_STORE; // Perkasa Jaya Marine, Jalan Imam Bonjol No. 27D
const ttj = SERVICE_STORE; // Toko Tunggal Jaya, Jalan M. Yamin SH No 144 — the workshop

// Lower-cases the first letter for use mid-sentence, but never a brand ('Yamaha genuine part replacement').
const lowerFirst = (s) => (/^Yamaha/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));

/** '2–200 PK' / '2–200 HP' from { min, max }, or ''. */
function range(r, unit) {
    return r && r.min && r.max ? `${r.min}–${r.max} ${unit}` : '';
}

/** A link segment, or plain text when the URL is unknown. */
const link = (text, href) => (href ? { text, href } : text);

/**
 * The FAQ groups for one language.
 * ctx: { ranges: { two: { min, max }, four: { min, max } }, guides: { choose, compare } } — guide hrefs may be null.
 */
export function faqGroups(lang = 'id', ctx = {}) {
    const l = lang === 'en' ? 'en' : 'id';
    const ranges = ctx.ranges || {};
    const guides = ctx.guides || {};
    const wa = WHATSAPP.display;
    const waGeneral = waLink(WA_TEXT.general[l]);
    const waPrice = waLink(WA_TEXT.price[l]());
    const waService = waLink(WA_TEXT.service[l]);
    const waParts = waLink(WA_TEXT.parts[l]);
    const examples = SERVICE.examples[l].map(lowerFirst);

    if (l === 'en') {
        const two = range(ranges.two, 'HP');
        const four = range(ranges.four, 'HP');
        return [
            {
                id: 'stores',
                title: 'Stores & contact',
                items: [
                    {
                        id: 'dealer',
                        q: 'Is Perkasa Jaya Marine an authorized Yamaha Marine dealer?',
                        a: [
                            `Yes. ${BUSINESS.name} is an authorized Yamaha Marine dealer in ${BUSINESS.city}, ${BUSINESS.region.en}. We sell Yamaha 2-stroke and 4-stroke outboards, Yamaha genuine parts and Yamalube oils, and do all types of Yamaha outboard servicing.`,
                        ],
                    },
                    {
                        id: 'location',
                        q: 'Where is Perkasa Jaya Marine?',
                        a: [
                            `We have two stores in ${BUSINESS.city}, ${BUSINESS.region.en}: ${pjm.name} at ${pjm.street} (phone `,
                            link(pjm.phone, pjm.tel),
                            `) and ${ttj.name} at ${ttj.street} (phone `,
                            link(ttj.phone, ttj.tel),
                            '). Full addresses and maps are on the ',
                            link('contact page', '/contact'),
                            '.',
                        ],
                    },
                    {
                        id: 'hours',
                        q: 'What are your opening hours?',
                        a: [`Both stores are open ${HOURS.text.en}.`],
                    },
                    {
                        id: 'sunday',
                        q: 'Are you open on Sunday?',
                        a: [`No, both stores are closed on Sunday. We are open ${HOURS.text.en}.`],
                    },
                    {
                        id: 'whatsapp',
                        q: "What is Perkasa Jaya Marine's WhatsApp number?",
                        a: [
                            'Our WhatsApp is ',
                            link(wa, waGeneral),
                            `, shared by both stores. You can also call ${pjm.name} on `,
                            link(pjm.phone, pjm.tel),
                            ` or ${ttj.name} on `,
                            link(ttj.phone, ttj.tel),
                            '.',
                        ],
                    },
                ],
            },
            {
                id: 'buying',
                title: 'Prices & buying',
                items: [
                    {
                        id: 'price',
                        q: 'How much does a Yamaha outboard cost?',
                        a: [
                            `We don't publish prices on the website. ${PRICE_NOTE.en}: send a WhatsApp message to `,
                            link(wa, waPrice),
                            ' with the model you are interested in, or call one of our stores.',
                        ],
                    },
                    {
                        id: 'models',
                        q: 'Which Yamaha outboard models do you sell?',
                        a: [
                            `We sell Yamaha 2-stroke${two ? ` (${two})` : ''} and 4-stroke${four ? ` (${four})` : ''} outboards. Every model and its specifications are on the `,
                            link('2-stroke', seriesHref('two')),
                            ' and ',
                            link('4-stroke', seriesHref('four')),
                            ' pages. In short, 2-strokes are lighter and simpler to maintain, while 4-strokes use less fuel and run smoother. See also ',
                            link('the difference between 2-stroke and 4-stroke', guides.compare),
                            '.',
                        ],
                    },
                    {
                        id: 'choose',
                        q: 'How do I choose the right horsepower for my boat?',
                        a: [
                            "Match the engine's power to the size and weight of the boat, the number of passengers and the load, and how you use it. Small, light boats generally need less horsepower; bigger or heavily loaded boats need more. Also check the transom's strength and the boat's maximum rated power. Read our ",
                            link('guide to choosing an outboard', guides.choose),
                            ', then ask our staff on WhatsApp for a model recommendation.',
                        ],
                    },
                    {
                        id: 'credit',
                        q: 'Can I buy on credit or in instalments?',
                        a: ['Please contact us on WhatsApp at ', link(wa, waGeneral), ' for information on payment and credit or instalment options.'],
                    },
                    {
                        id: 'delivery',
                        q: 'Can outboards and parts be sent outside Padang?',
                        a: ['Please contact us on WhatsApp at ', link(wa, waGeneral), ' for information on delivery to your area.'],
                    },
                ],
            },
            {
                id: 'service',
                title: 'Service, parts & oil',
                items: [
                    {
                        id: 'service',
                        q: 'Where can I get a Yamaha outboard serviced in Padang?',
                        a: [
                            `At the ${ttj.name} workshop, ${ttj.street}, ${ttj.locality}. We do all types of Yamaha outboard servicing, for example ${examples.slice(0, -1).join(', ')}, and ${examples[examples.length - 1]}. Call `,
                            link(ttj.phone, ttj.tel),
                            ' or WhatsApp ',
                            link(wa, waService),
                            '. More on the ',
                            link('service & workshop page', '/servis'),
                            '.',
                        ],
                    },
                    {
                        id: 'warranty',
                        q: 'What about the warranty on an outboard?',
                        a: [
                            'Please contact us on WhatsApp at ',
                            link(wa, waGeneral),
                            ' or call one of our stores for warranty information on the model you are interested in.',
                        ],
                    },
                    {
                        id: 'parts',
                        q: 'Do you have Yamaha genuine parts?',
                        a: [
                            'Yes, we sell Yamaha genuine parts for Yamaha outboards. To check price and availability, send your engine model and serial number — or the part number, if you have it — on WhatsApp to ',
                            link(wa, waParts),
                            '. See ',
                            link('how to order parts', '/parts'),
                            '.',
                        ],
                    },
                    {
                        id: 'oil',
                        q: 'Which oil is right for a Yamaha outboard?',
                        a: [
                            'We sell Yamalube, made specifically for Yamaha outboards: 2-stroke engine oil, 4-stroke engine oil (10W-40, API SJ) and SAE90 GL-4 and GL-5 gear oils. Part numbers and pack sizes are on the ',
                            link('Yamalube page', '/yamalube'),
                            '. To be sure which oil suits your engine, ask our staff.',
                        ],
                    },
                ],
            },
        ];
    }

    const two = range(ranges.two, 'PK');
    const four = range(ranges.four, 'PK');
    return [
        {
            id: 'stores',
            title: 'Toko & kontak',
            items: [
                {
                    id: 'dealer',
                    q: 'Apakah Perkasa Jaya Marine dealer resmi Yamaha Marine?',
                    a: [
                        `Ya. ${BUSINESS.name} adalah dealer resmi Yamaha Marine di ${BUSINESS.city}, ${BUSINESS.region.id}. Kami menjual mesin tempel Yamaha 2 tak dan 4 tak, suku cadang asli Yamaha dan oli Yamalube, serta melayani semua jenis servis mesin tempel Yamaha.`,
                    ],
                },
                {
                    id: 'location',
                    q: 'Di mana lokasi Perkasa Jaya Marine?',
                    a: [
                        `Kami punya dua toko di ${BUSINESS.city}, ${BUSINESS.region.id}: ${pjm.name} di ${pjm.street} (telepon `,
                        link(pjm.phone, pjm.tel),
                        `) dan ${ttj.name} di ${ttj.street} (telepon `,
                        link(ttj.phone, ttj.tel),
                        '). Alamat lengkap dan peta ada di halaman ',
                        link('Kontak', '/contact'),
                        '.',
                    ],
                },
                {
                    id: 'hours',
                    q: 'Jam berapa toko buka?',
                    a: [`Kedua toko buka ${HOURS.text.id}.`],
                },
                {
                    id: 'sunday',
                    q: 'Apakah toko buka hari Minggu?',
                    a: [`Tidak, kedua toko tutup pada hari Minggu. Kami buka ${HOURS.text.id}.`],
                },
                {
                    id: 'whatsapp',
                    q: 'Berapa nomor WhatsApp Perkasa Jaya Marine?',
                    a: [
                        'Nomor WhatsApp kami ',
                        link(wa, waGeneral),
                        `, satu nomor untuk kedua toko. Anda juga bisa menelepon ${pjm.name} di `,
                        link(pjm.phone, pjm.tel),
                        ` atau ${ttj.name} di `,
                        link(ttj.phone, ttj.tel),
                        '.',
                    ],
                },
            ],
        },
        {
            id: 'buying',
            title: 'Harga & pembelian',
            items: [
                {
                    id: 'price',
                    q: 'Berapa harga mesin tempel Yamaha?',
                    a: [
                        `Harga tidak kami cantumkan di situs. ${PRICE_NOTE.id}: kirim pesan WhatsApp ke `,
                        link(wa, waPrice),
                        ' dengan menyebutkan model yang Anda minati, atau telepon salah satu toko kami.',
                    ],
                },
                {
                    id: 'models',
                    q: 'Model mesin tempel Yamaha apa saja yang dijual?',
                    a: [
                        `Kami menjual mesin tempel Yamaha 2 tak${two ? ` (${two})` : ''} dan 4 tak${four ? ` (${four})` : ''}. Semua model beserta spesifikasinya ada di halaman `,
                        link('mesin tempel 2 tak', seriesHref('two')),
                        ' dan ',
                        link('mesin tempel 4 tak', seriesHref('four')),
                        '. Singkatnya, mesin 2 tak lebih ringan dan perawatannya sederhana, sedangkan mesin 4 tak lebih irit bahan bakar dan lebih halus. Baca juga ',
                        link('perbedaan mesin 2 tak dan 4 tak', guides.compare),
                        '.',
                    ],
                },
                {
                    id: 'choose',
                    q: 'Bagaimana memilih PK mesin tempel yang cocok untuk perahu saya?',
                    a: [
                        'Sesuaikan tenaga mesin dengan ukuran dan berat perahu, jumlah penumpang dan muatan, serta cara pemakaiannya. Perahu kecil yang ringan umumnya cukup dengan PK kecil, sedangkan perahu besar atau bermuatan berat butuh PK lebih besar. Periksa juga kekuatan transom dan batas tenaga maksimum perahu. Baca ',
                        link('panduan memilih mesin tempel', guides.choose),
                        ', lalu tanyakan rekomendasi model kepada staf kami lewat WhatsApp.',
                    ],
                },
                {
                    id: 'credit',
                    q: 'Apakah bisa beli secara kredit atau cicilan?',
                    a: ['Silakan hubungi kami lewat WhatsApp di ', link(wa, waGeneral), ' untuk informasi cara pembayaran dan pilihan kredit atau cicilan.'],
                },
                {
                    id: 'delivery',
                    q: 'Apakah mesin tempel dan suku cadang bisa dikirim ke luar Padang?',
                    a: ['Silakan hubungi kami lewat WhatsApp di ', link(wa, waGeneral), ' untuk informasi pengiriman ke daerah Anda.'],
                },
            ],
        },
        {
            id: 'service',
            title: 'Servis, suku cadang & oli',
            items: [
                {
                    id: 'service',
                    q: 'Di mana tempat servis mesin tempel Yamaha di Padang?',
                    a: [
                        `Di bengkel ${ttj.name}, ${ttj.street}, ${ttj.locality}. Kami melayani semua jenis servis mesin tempel Yamaha, misalnya ${examples.slice(0, -1).join(', ')}, serta ${examples[examples.length - 1]}. Telepon `,
                        link(ttj.phone, ttj.tel),
                        ' atau WhatsApp ',
                        link(wa, waService),
                        '. Info lengkap ada di halaman ',
                        link('Servis & Bengkel', '/servis'),
                        '.',
                    ],
                },
                {
                    id: 'warranty',
                    q: 'Bagaimana dengan garansi mesin tempel?',
                    a: [
                        'Silakan hubungi kami lewat WhatsApp di ',
                        link(wa, waGeneral),
                        ' atau telepon toko kami untuk informasi garansi model yang Anda minati.',
                    ],
                },
                {
                    id: 'parts',
                    q: 'Apakah tersedia suku cadang asli Yamaha?',
                    a: [
                        'Ya, kami menjual suku cadang asli Yamaha untuk mesin tempel Yamaha. Untuk cek harga dan ketersediaan, kirim model mesin dan nomor seri — atau nomor part bila ada — lewat WhatsApp ke ',
                        link(wa, waParts),
                        '. Lihat ',
                        link('cara memesan suku cadang', '/parts'),
                        '.',
                    ],
                },
                {
                    id: 'oil',
                    q: 'Oli apa yang cocok untuk mesin tempel Yamaha?',
                    a: [
                        'Kami menjual oli Yamalube yang dibuat khusus untuk mesin tempel Yamaha: oli mesin 2 tak, oli mesin 4 tak (10W-40, API SJ), serta oli gardan SAE90 GL-4 dan GL-5. Nomor part dan kemasannya ada di halaman ',
                        link('Oli Yamalube', '/yamalube'),
                        '. Untuk memastikan oli yang tepat bagi mesin Anda, tanyakan kepada staf kami.',
                    ],
                },
            ],
        },
    ];
}

/** The answer as plain text (what the visitor reads, without link markup). */
export function faqPlainText(segments) {
    return (segments || []).map((s) => (typeof s === 'string' ? s : s.text)).join('');
}

/** [{ q, a }] in plain text, for faq() in '@/lib/schema'. */
export function faqForSchema(lang = 'id', ctx = {}) {
    return faqGroups(lang, ctx).flatMap((g) => g.items.map((it) => ({ q: it.q, a: faqPlainText(it.a) })));
}
