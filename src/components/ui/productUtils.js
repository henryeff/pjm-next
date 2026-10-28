// Small helpers shared by product cards, listings and the home lineup.

/**
 * Horsepower from a model name, as a string ('9.9', '425'), or null.
 * 'FT9.9LMHL-9.9PK' → '9.9' (trailing "NN PK" wins); 'F425A' → '425' (leading digits after ≤2 letters).
 */
export function getHp(name) {
    if (!name) return null;
    let m = String(name).match(/(\d+(?:\.\d+)?)\s*PK\s*$/i);
    if (m) return m[1];
    m = String(name).match(/^[A-Z]{0,2}(\d+(?:\.\d+)?)/i);
    if (m) return m[1];
    return null;
}

/** Size class for filter chips: 'small' (≤25), 'mid' (<150), 'large' (≥150), or null. */
export function hpBucket(hp) {
    if (hp === null || hp === undefined || hp === '') return null;
    const n = Number(hp);
    if (Number.isNaN(n)) return null;
    if (n <= 25) return 'small';
    if (n < 150) return 'mid';
    return 'large';
}

/** Listing route for a series: 'two' → 2-stroke range, anything else → 4-stroke range. */
export function seriesPath(series) {
    return series === 'two' ? '/products/two-strokes' : '/products/four-strokes';
}
