// Page metadata helper. Every page.js / generateMetadata builds its metadata with buildMetadata(),
// because a page-level `openGraph` replaces the layout's whole openGraph object in Next.js — the
// helper restates siteName, locale and images every time and points og:url + canonical at the page.

import { SITE_NAME } from './site';

/** The 1200×630 site link-preview card (WhatsApp, Facebook, X, LinkedIn). */
export const DEFAULT_OG_IMAGE = {
    url: '/images/og-image.jpg',
    width: 1200,
    height: 630,
    type: 'image/jpeg',
    alt: 'Perkasa Jaya Marine — Dealer Resmi Yamaha Marine di Padang: mesin tempel, suku cadang asli dan Yamalube',
};

export const DEFAULT_TITLE = 'Perkasa Jaya Marine – Dealer Resmi Mesin Tempel Yamaha di Padang';
export const DEFAULT_DESCRIPTION =
    'Dealer resmi Yamaha Marine di Padang: mesin tempel Yamaha 2 tak & 4 tak, suku cadang asli, oli Yamalube, dan semua jenis servis mesin tempel Yamaha.';

/** '/about/' → '/about'; 'about' → '/about'; drops ?query and #hash. */
export function normalizePath(path) {
    let p = String(path || '/').split('#')[0].split('?')[0].trim();
    if (!p.startsWith('/')) p = '/' + p;
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p || '/';
}

function normalizeImages(images) {
    const list = (Array.isArray(images) ? images : [images])
        .filter(Boolean)
        .map((img) => (typeof img === 'string' ? { url: img } : img))
        .filter((img) => img && img.url);
    return list.length ? list : [DEFAULT_OG_IMAGE];
}

/**
 * Next.js metadata for one page.
 *
 *   title         Page title WITHOUT the brand; the layout template adds ' | Perkasa Jaya Marine'.
 *   absoluteTitle true → title is used as-is (home page). A title that already contains
 *                 'Perkasa Jaya Marine' is always used as-is (no doubled brand).
 *   description   Unique, Indonesian-first, ~150 characters.
 *   path          The page's own path ('/servis'); becomes the canonical and og:url.
 *   images        string | { url, width?, height?, alt? } | array. Default: the site card.
 *   type          'website' (default) | 'article'.
 *   article       For type 'article': { publishedTime, modifiedTime, authors, section, tags }.
 *   noindex       true → robots noindex, follow (also drops googleBot extras from the layout).
 *   keywords      Optional array of keywords.
 */
export function buildMetadata({
    title,
    description = DEFAULT_DESCRIPTION,
    path = '/',
    images,
    type = 'website',
    article,
    noindex = false,
    absoluteTitle = false,
    keywords,
} = {}) {
    const canonical = normalizePath(path);
    const isAbsolute = Boolean(title) && (absoluteTitle || title.includes(SITE_NAME));
    const fullTitle = !title ? DEFAULT_TITLE : isAbsolute ? title : `${title} | ${SITE_NAME}`;
    const ogImages = normalizeImages(images);

    const openGraph = {
        type,
        url: canonical,
        title: fullTitle,
        description,
        siteName: SITE_NAME,
        locale: 'id_ID',
        images: ogImages,
    };
    if (type === 'article' && article) {
        const { publishedTime, modifiedTime, authors, section, tags } = article;
        if (publishedTime) openGraph.publishedTime = publishedTime;
        if (modifiedTime) openGraph.modifiedTime = modifiedTime;
        if (authors) openGraph.authors = authors;
        if (section) openGraph.section = section;
        if (tags) openGraph.tags = tags;
    }

    const metadata = {
        description,
        alternates: { canonical },
        openGraph,
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: ogImages.map((img) => (img.alt ? { url: img.url, alt: img.alt } : img.url)),
        },
    };

    if (title) metadata.title = isAbsolute ? { absolute: title } : title;
    if (keywords) metadata.keywords = keywords;
    if (noindex) {
        metadata.robots = { index: false, follow: true, googleBot: { index: false, follow: true } };
    }
    return metadata;
}
