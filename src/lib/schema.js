// schema.org builders. Each returns ONE node without '@context'; render them with
// <JsonLd data={node | [nodes]} /> from '@/components/Seo/JsonLd'.
// Facts come from '@/lib/site' and STORES only — never add values the owner has not confirmed
// (no postalCode, geo, priceRange, ratings, prices/offers, foundingDate, sameAs).

import { STORES } from '@/components/ui/stores';
import { HOURS, LOGO, SERVICE, SITE_NAME, SITE_URL, WHATSAPP } from './site';
import { DEFAULT_OG_IMAGE } from './seo';
import { newsDateISO, newsPath, normalizeSeries, productPath, SERIES } from './slugs';

/* ---------------------------------------------------------------- ids + helpers */

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;
export const SERVICE_ID = `${SITE_URL}/servis#service`;
export const storeId = (id) => `${SITE_URL}/#store-${id}`;

/** '/about' → 'https://perkasajayamarine.com/about'; absolute URLs pass through. */
export function absUrl(path) {
    if (!path) return SITE_URL + '/';
    if (/^https?:\/\//i.test(path)) return path;
    return SITE_URL + (path.startsWith('/') ? path : '/' + path);
}

const YAMAHA = { '@type': 'Brand', name: 'Yamaha' };

/** A reference to the Organization that still carries its name (for publisher/author/seller). */
const orgRef = () => ({ '@type': 'Organization', '@id': ORG_ID, name: SITE_NAME, url: SITE_URL + '/' });

const has = (v) => v !== undefined && v !== null && String(v).trim() !== '';

function postalAddress(store) {
    return {
        '@type': 'PostalAddress',
        streetAddress: store.street,
        addressLocality: store.locality,
        addressRegion: store.region.id,
        addressCountry: store.country,
    };
}

function openingHours() {
    return [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: HOURS.days.map((d) => `https://schema.org/${d}`),
            opens: HOURS.opens,
            closes: HOURS.closes,
        },
    ];
}

function whatsappContact() {
    return {
        '@type': 'ContactPoint',
        name: 'WhatsApp',
        contactType: 'customer service',
        telephone: WHATSAPP.e164,
        url: WHATSAPP.url,
    };
}

/* ---------------------------------------------------------------- site-wide */

/** The business. Rendered site-wide by the root layout. */
export function organization() {
    return {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: SITE_NAME,
        url: SITE_URL + '/',
        logo: {
            '@type': 'ImageObject',
            '@id': LOGO_ID,
            url: absUrl(LOGO.url),
            contentUrl: absUrl(LOGO.url),
            width: LOGO.width,
            height: LOGO.height,
            caption: SITE_NAME,
        },
        image: { '@id': LOGO_ID },
        description:
            'Dealer resmi Yamaha Marine di Padang, Sumatera Barat. Menjual mesin tempel Yamaha 2 tak dan 4 tak, suku cadang asli Yamaha dan oli Yamalube, serta melayani semua jenis servis mesin tempel Yamaha di Toko Tunggal Jaya.',
        knowsAbout: ['Mesin tempel Yamaha', 'Yamaha Marine', 'Suku cadang asli Yamaha', 'Oli Yamalube', 'Servis mesin tempel Yamaha'],
        contactPoint: [whatsappContact()],
        subOrganization: STORES.map((s) => ({ '@id': storeId(s.id) })),
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Produk dan layanan Yamaha Marine',
            itemListElement: [
                { '@type': 'OfferCatalog', name: SERIES.four.label.id, url: absUrl(SERIES.four.path) },
                { '@type': 'OfferCatalog', name: SERIES.two.label.id, url: absUrl(SERIES.two.path) },
                { '@type': 'OfferCatalog', name: 'Suku cadang asli Yamaha', url: absUrl('/parts') },
                { '@type': 'OfferCatalog', name: 'Oli Yamalube', url: absUrl('/yamalube') },
                { '@type': 'Offer', itemOffered: { '@id': SERVICE_ID } },
            ],
        },
    };
}

/** The website. Rendered site-wide by the root layout. */
export function website() {
    return {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL + '/',
        name: SITE_NAME,
        inLanguage: 'id-ID',
        publisher: { '@id': ORG_ID },
    };
}

/** The workshop service offered at Toko Tunggal Jaya (also usable on /servis). */
export function service({ description } = {}) {
    const store = STORES.find((s) => s.id === SERVICE.storeId) || STORES[0];
    return {
        '@type': 'Service',
        '@id': SERVICE_ID,
        name: SERVICE.name.id,
        serviceType: 'Servis mesin tempel (outboard) Yamaha',
        description:
            description ||
            `${SERVICE.summary.id} Contoh: ${SERVICE.examples.id.map((s) => s.charAt(0).toLowerCase() + s.slice(1)).join(', ')}.`,
        brand: YAMAHA,
        provider: { '@type': 'Store', '@id': storeId(store.id), name: store.name },
        url: absUrl('/servis'),
    };
}

/** One physical store as a Store node. */
export function store(s) {
    const node = {
        '@type': 'Store',
        '@id': storeId(s.id),
        name: s.name,
        url: absUrl(s.servicing ? '/servis' : '/contact'),
        image: absUrl(LOGO.url),
        telephone: s.phone,
        address: postalAddress(s),
        openingHoursSpecification: openingHours(),
        contactPoint: whatsappContact(),
        hasMap: s.mapsUrl,
        parentOrganization: { '@id': ORG_ID },
    };
    if (s.servicing) {
        node.makesOffer = { '@type': 'Offer', itemOffered: service() };
    }
    return node;
}

/** Both stores (Toko Tunggal Jaya with the servicing offer). Rendered site-wide. */
export function stores() {
    return STORES.map(store);
}

/* ---------------------------------------------------------------- per page */

/**
 * BreadcrumbList. items: [{ name, path }] — also accepts the PageHero shape [{ label, href }].
 * The last item may omit its path; pass `currentPath` for it.
 */
export function breadcrumbs(items, currentPath) {
    const list = (items || []).filter(Boolean);
    return {
        '@type': 'BreadcrumbList',
        itemListElement: list.map((it, i) => {
            const path = it.path ?? it.href ?? (i === list.length - 1 ? currentPath : undefined);
            const el = { '@type': 'ListItem', position: i + 1, name: it.name ?? it.label };
            if (path) el.item = absUrl(path);
            return el;
        }),
    };
}

/** ItemList for listing pages. items: [{ name, path, image? }]. */
export function itemList(items, { name } = {}) {
    const list = (items || []).filter(Boolean);
    const node = {
        '@type': 'ItemList',
        numberOfItems: list.length,
        itemListElement: list.map((it, i) => {
            const el = { '@type': 'ListItem', position: i + 1, url: absUrl(it.path ?? it.href ?? it.url), name: it.name };
            if (it.image) el.image = absUrl(it.image);
            return el;
        }),
    };
    if (name) node.name = name;
    return node;
}

// Spec labels as shown on the Indonesian product page.
const SPEC_LABELS_ID = [
    ['tipeMesin', 'Tipe mesin'],
    ['volume', 'Volume silinder'],
    ['diameter', 'Diameter x langkah'],
    ['jangkauan', 'Putaran maksimum'],
    ['kompresi', 'Rasio kompresi'],
    ['sistemInduksi', 'Sistem induksi'],
    ['pengapian', 'Sistem pengapian'],
    ['konsumsibb', 'Konsumsi BBM'],
    ['gigi', 'Rasio gigi'],
    ['pelumas', 'Pelumasan'],
    ['trim', 'Sistem trim'],
    ['starter', 'Sistem starter'],
    ['kemudi', 'Kemudi'],
    ['berat', 'Berat'],
    ['transom', 'Tinggi transom'],
];

/** 'E40GMH-40PK' → { code: 'E40GMH', hp: '40' }; 'F425A' → { code: 'F425A', hp: '425' }. */
export function modelParts(name) {
    const full = String(name || '').trim();
    const m = full.match(/^(.*?)-(\d+(?:\.\d+)?)\s*PK$/i);
    if (m) return { code: m[1], hp: m[2] };
    const lead = full.match(/^[A-Z]{0,2}(\d+(?:\.\d+)?)/i);
    return { code: full, hp: lead ? lead[1] : null };
}

/**
 * Product node for an engine page. No offers/price (prices are not published).
 * options: { name?, description?, specs?: [{ name, value }] } to override the defaults.
 */
export function product(p, series, options = {}) {
    const key = normalizeSeries(series);
    const { code, hp } = modelParts(p.name);
    const url = absUrl(productPath(key, p));
    const strokes = SERIES[key].strokes;

    const props = [];
    if (hp) props.push({ '@type': 'PropertyValue', name: 'Daya', value: Number(hp), unitText: 'PK' });
    const specs =
        options.specs ||
        SPEC_LABELS_ID.filter(([k]) => has(p[k])).map(([k, label]) => ({ name: label, value: String(p[k]).trim() }));
    // Some 2-stroke rows in the source data hold a trim value in the starter field (e.g. 'Hidraulik',
    // 'Power Trim Tilt'). They still show in the visible spec table until the owner confirms them, but
    // structured data only repeats starter values that are plausibly a starter type.
    const plausible = (s) => !/starter/i.test(s.name) || /manual|electric|elektrik|listrik/i.test(s.value);
    specs.filter(plausible).forEach((s) => props.push({ '@type': 'PropertyValue', name: s.name, value: s.value }));

    const facts = [`${strokes} tak`, hp ? `${hp} PK` : null, has(p.tipeMesin) ? p.tipeMesin : null, has(p.volume) ? p.volume : null]
        .filter(Boolean)
        .join(', ');

    const node = {
        '@type': 'Product',
        '@id': `${url}#product`,
        name: options.name || `Yamaha ${p.name}`,
        description:
            options.description ||
            `Mesin tempel Yamaha ${p.name} (${facts}). Dijual oleh ${SITE_NAME}, dealer resmi Yamaha Marine di Padang. Hubungi kami untuk harga dan ketersediaan.`,
        url,
        brand: YAMAHA,
        model: code,
        mpn: code,
        sku: code,
        category: `${SERIES[key].label.id} (outboard)`,
        additionalProperty: props,
    };
    if (p.image) node.image = absUrl(p.image);
    return node;
}

/** 'BlogPosting' for guides (items with tags/slug), 'NewsArticle' for dated news items. */
export function articleType(item) {
    return item && (item.tags || item.meta_title) ? 'BlogPosting' : 'NewsArticle';
}

/**
 * NewsArticle / BlogPosting for /news/[slug].
 * options: { type?, headline?, description?, inLanguage?, path? }
 */
export function article(item, options = {}) {
    const url = absUrl(options.path || newsPath(item));
    const iso = newsDateISO(item);
    const node = {
        '@type': options.type || articleType(item),
        '@id': `${url}#article`,
        headline: String(options.headline || item.title || '').slice(0, 110),
        description: options.description || item.meta_description || item.excerpt || undefined,
        image: [absUrl(item.image || DEFAULT_OG_IMAGE.url)],
        url,
        mainEntityOfPage: url,
        author: orgRef(),
        publisher: {
            ...orgRef(),
            logo: { '@type': 'ImageObject', url: absUrl(LOGO.url), width: LOGO.width, height: LOGO.height },
        },
        isPartOf: { '@id': WEBSITE_ID },
    };
    if (iso) {
        node.datePublished = iso;
        node.dateModified = iso;
    }
    if (options.inLanguage) node.inLanguage = options.inLanguage;
    if (Array.isArray(item.tags) && item.tags.length) node.keywords = item.tags.join(', ');
    if (!node.description) delete node.description;
    return node;
}

/** FAQPage. qas: [{ q, a }] or [{ question, answer }] — plain-text answers. */
export function faq(qas) {
    return {
        '@type': 'FAQPage',
        mainEntity: (qas || []).filter(Boolean).map((qa) => ({
            '@type': 'Question',
            name: qa.q ?? qa.question,
            acceptedAnswer: { '@type': 'Answer', text: qa.a ?? qa.answer },
        })),
    };
}
