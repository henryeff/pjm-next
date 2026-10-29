// Server-safe helper (no 'use client'): the [slug] pages call it to build the 'More models' rail.

/** What a ProductCard needs from a product (keeps `slug`, so card links use the model-name URL). */
export const cardFields = ({ id, slug, name, image, tipeMesin }) => ({ id, slug, name, image, tipeMesin });

/**
 * Up to `count` neighbouring models around list[index], in list (JSON) order, without the current one.
 * The window is centred on the current model where it can be (two before, two after) and slides
 * inward at the ends of the range, so the first and last models still get `count` neighbours.
 * Pass the list from productsOf() ('@/lib/slugs'), so each item carries its `slug`.
 * Each item is trimmed to what a ProductCard needs: { id, slug, name, image, tipeMesin }.
 */
export function relatedModels(list, index, count = 4) {
    if (!Array.isArray(list) || list.length === 0) return [];
    const start = Math.max(0, Math.min(index - 2, list.length - (count + 1)));
    return list
        .slice(start, start + count + 1)
        .filter((_, i) => start + i !== index)
        .slice(0, count)
        .map(cardFields);
}
