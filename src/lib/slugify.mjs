// Pure slug helpers, shared by the app (src/lib/slugs.js) and next.config.mjs (legacy redirects).
// Plain ESM with no imports, so Node can load it from next.config.mjs as-is.

/** 'E40JMH/JW-40PK' → 'e40jmh-jw-40pk'; '9.9GMHS-9.9PK' → '9-9gmhs-9-9pk'. */
export function slugify(input) {
    return String(input ?? '')
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Map of String(item.id) → unique slug for one list. The first item keeps the plain slug; a later
 * item whose slug is taken gets '-<id>' appended (stable, because ids never change).
 */
export function buildSlugMap(list, getText) {
    const map = new Map();
    const used = new Set();
    for (const item of list || []) {
        const base = slugify(getText(item)) || slugify(item.id) || 'item';
        let slug = base;
        if (used.has(slug)) slug = `${base}-${slugify(item.id)}`;
        let n = 2;
        while (used.has(slug)) slug = `${base}-${n++}`;
        used.add(slug);
        map.set(String(item.id), slug);
    }
    return map;
}

/** Product model name → slug text (the series list decides uniqueness via buildSlugMap). */
export const productSlugText = (product) => (product && product.name) || '';

/** News item → slug text: its own `slug` field wins, else the title. */
export const newsSlugText = (item) => (item && (item.slug || item.title)) || '';

export const SERIES_PATHS = {
    four: '/products/four-strokes',
    two: '/products/two-strokes',
};

/**
 * Permanent redirects from the old numeric product URLs (/products/two-strokes/8) to the slugs.
 * `data` = { four: [...four-strokes.json], two: [...two-strokes.json] }.
 */
export function legacyProductRedirects(data) {
    const out = [];
    for (const series of Object.keys(SERIES_PATHS)) {
        const list = data[series] || [];
        const map = buildSlugMap(list, productSlugText);
        for (const p of list) {
            const slug = map.get(String(p.id));
            if (!slug || slug === String(p.id)) continue;
            out.push({
                source: `${SERIES_PATHS[series]}/${p.id}`,
                destination: `${SERIES_PATHS[series]}/${slug}`,
                permanent: true,
            });
        }
    }
    return out;
}
