// URL slugs and lookups for engines and news. Server- and client-safe (data is bundled JSON).
//
// Engines live at /products/{four-strokes|two-strokes}/{slug}, where the slug is the model name
// ('E40GMH-40PK' → 'e40gmh-40pk'). Old numeric URLs (/products/two-strokes/8) redirect permanently
// to the slug (next.config.mjs, built from the same JSON with the same helper).
// News and guides live at /news/{slug} (the item's own `slug` field, else its title).

import fourStrokesData from '@/data/four-strokes.json';
import twoStrokesData from '@/data/two-strokes.json';
import newsData from '@/data/news.json';
import { buildSlugMap, newsSlugText, productSlugText, slugify, SERIES_PATHS } from './slugify.mjs';

export { slugify };

/* ---------------------------------------------------------------- Engines */

const RAW = { four: fourStrokesData, two: twoStrokesData };

export const SERIES = {
    four: {
        key: 'four',
        path: SERIES_PATHS.four,
        strokes: 4,
        label: { id: 'Mesin Tempel Yamaha 4 Tak', en: 'Yamaha 4-Stroke Outboards' },
        short: { id: '4 Tak', en: '4-Stroke' },
    },
    two: {
        key: 'two',
        path: SERIES_PATHS.two,
        strokes: 2,
        label: { id: 'Mesin Tempel Yamaha 2 Tak', en: 'Yamaha 2-Stroke Outboards' },
        short: { id: '2 Tak', en: '2-Stroke' },
    },
};

/** 'four' | 'two' from 'four' | 'two' | 'four-strokes' | 'two-strokes'; anything else → 'four'. */
export function normalizeSeries(series) {
    const s = String(series || '').toLowerCase();
    return s === 'two' || s.startsWith('two') ? 'two' : 'four';
}

// Each product gets its `slug` once, at module load. Data objects are copied, never mutated.
const SLUG_MAPS = {};
const LISTS = {};
for (const key of Object.keys(RAW)) {
    SLUG_MAPS[key] = buildSlugMap(RAW[key], productSlugText);
    LISTS[key] = RAW[key].map((p) => ({ ...p, slug: SLUG_MAPS[key].get(String(p.id)) }));
}

/** All products of a series, in JSON order, each with a `slug` field. */
export function productsOf(series) {
    return LISTS[normalizeSeries(series)];
}

/**
 * The slug of a product. Products from productsOf()/getProduct() already carry `.slug`; for a raw
 * JSON object pass its series so a de-duplicated slug resolves correctly.
 */
export function productSlug(product, series) {
    if (!product) return '';
    if (product.slug) return product.slug;
    if (series) {
        const s = SLUG_MAPS[normalizeSeries(series)].get(String(product.id));
        if (s) return s;
    }
    return slugify(product.name);
}

/** '/products/two-strokes/e40gmh-40pk' */
export function productPath(series, product) {
    const key = normalizeSeries(series);
    return `${SERIES[key].path}/${productSlug(product, key)}`;
}

/** { product, index, list } for a slug, or null. `index` is the position in the series list. */
export function getProductEntry(series, slug) {
    const list = productsOf(series);
    const index = list.findIndex((p) => p.slug === slug);
    return index === -1 ? null : { product: list[index], index, list };
}

/** The product (with `slug`) for a series + slug, or null. */
export function getProduct(series, slug) {
    const entry = getProductEntry(series, slug);
    return entry ? entry.product : null;
}

/** Every engine: [{ series: 'four'|'two', product, slug, path, index }] (4-strokes first). */
export function allProducts() {
    const out = [];
    for (const key of ['four', 'two']) {
        LISTS[key].forEach((product, index) => {
            out.push({ series: key, product, slug: product.slug, path: productPath(key, product), index });
        });
    }
    return out;
}

/** For generateStaticParams in /products/<series>/[slug]: [{ slug }]. */
export function productStaticParams(series) {
    return productsOf(series).map((p) => ({ slug: p.slug }));
}

/* ---------------------------------------------------------------- News */

const MONTHS = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    januari: 0, februari: 1, maret: 2, mei: 4, juni: 5, juli: 6, agustus: 7, oktober: 9, desember: 11,
};

/** '2026-02-19' or '12 December 2023' → { y, m, d } (m is 1-based), or null. Time-zone free. */
function parseParts(str) {
    if (!str) return null;
    const s = String(str).trim();
    let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
    m = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (m) {
        const month = MONTHS[m[2].toLowerCase()];
        if (month !== undefined) return { y: Number(m[3]), m: month + 1, d: Number(m[1]) };
    }
    return null;
}

const pad = (n) => String(n).padStart(2, '0');

/** News item date as 'YYYY-MM-DD' (for <time dateTime>, JSON-LD and the sitemap), or null. */
export function newsDateISO(item) {
    const p = parseParts(item && item.date);
    return p ? `${p.y}-${pad(p.m)}-${pad(p.d)}` : null;
}

const NEWS_SLUGS = buildSlugMap(newsData, newsSlugText);

/** The URL slug of a news item: its own `slug` field, else slugified title (de-duplicated). */
export function newsSlug(item) {
    if (!item) return '';
    return NEWS_SLUGS.get(String(item.id)) || slugify(newsSlugText(item));
}

/** '/news/<slug>' */
export function newsPath(item) {
    return `/news/${newsSlug(item)}`;
}

// Newest first; same-day items keep file order; undated items go last.
const SORTED_NEWS = newsData
    .map((item, index) => ({ item: { ...item, slug: NEWS_SLUGS.get(String(item.id)) }, index, iso: newsDateISO(item) }))
    .sort((a, b) => {
        if (!a.iso && !b.iso) return a.index - b.index;
        if (!a.iso) return 1;
        if (!b.iso) return -1;
        return a.iso < b.iso ? 1 : a.iso > b.iso ? -1 : a.index - b.index;
    })
    .map(({ item }) => item);

/** All news/guides, newest first, each with its URL `slug` set. */
export function allNews() {
    return SORTED_NEWS;
}

/** The news item for a URL slug (with `slug` set), or null. */
export function getNewsBySlug(slug) {
    return SORTED_NEWS.find((n) => n.slug === slug) || null;
}

/** For generateStaticParams in /news/[slug]: [{ slug }]. */
export function newsStaticParams() {
    return SORTED_NEWS.map((n) => ({ slug: n.slug }));
}
