// Server-safe helper (no 'use client'): the [id] pages call it to build the 'More models' rail.

/**
 * Up to `count` neighbouring models around list[index], in list (JSON) order, without the current one.
 * The window is centred on the current model where it can be (two before, two after) and slides
 * inward at the ends of the range, so the first and last models still get `count` neighbours.
 * Each item is trimmed to what a ProductCard needs: { id, name, image, tipeMesin }.
 */
export function relatedModels(list, index, count = 4) {
    if (!Array.isArray(list) || list.length === 0) return [];
    const start = Math.max(0, Math.min(index - 2, list.length - (count + 1)));
    return list
        .slice(start, start + count + 1)
        .filter((_, i) => start + i !== index)
        .slice(0, count)
        .map(({ id, name, image, tipeMesin }) => ({ id, name, image, tipeMesin }));
}
