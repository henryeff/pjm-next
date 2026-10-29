// Data-free URL helpers, safe for client components (no JSON is bundled). Server code can use
// '@/lib/slugs' instead, which also looks products/news up.
//
// Pass products that already carry `.slug` (from productsOf()/getProduct() in '@/lib/slugs' — keep
// `slug` when trimming product objects for client props). Without `.slug` the model name is slugified,
// which matches as long as no two models in a series share a slug (true for the current data).

import { newsSlugText, SERIES_PATHS, slugify } from './slugify.mjs';

const seriesKey = (series) => (String(series || '').toLowerCase().startsWith('two') ? 'two' : 'four');

/** '/products/two-strokes' or '/products/four-strokes'. */
export function seriesHref(series) {
    return SERIES_PATHS[seriesKey(series)];
}

/** '/products/two-strokes/e40gmh-40pk' */
export function productHref(series, product) {
    const slug = (product && product.slug) || slugify(product && product.name);
    return `${seriesHref(series)}/${slug}`;
}

/** '/news/<slug>' — pass items from allNews()/getNewsBySlug() (they carry `.slug`). */
export function newsHref(item) {
    return `/news/${(item && item.slug) || slugify(newsSlugText(item))}`;
}
