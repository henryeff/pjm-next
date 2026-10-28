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

/**
 * Display-only tidy-up of a spec value (the data is never changed): en dash in numeric ranges and a
 * thin gap before a trailing unit. '5000-6000rpm' → '5000–6000 rpm'; '47-50kg' → '47–50 kg';
 * '212cc' → '212 cc'; '3.9l/h' → '3.9 l/h'.
 */
export function formatSpec(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .trim()
        .replace(/(\d)\s*-\s*(\d)/g, '$1–$2')
        .replace(/(\d)\s*(cc|rpm|kg|mm|l\/h)$/i, '$1 $2');
}

/** The highest-HP product in a list (first one wins a tie), or null for an empty list. */
export function topModel(list) {
    if (!Array.isArray(list) || list.length === 0) return null;
    const hpOf = (p) => {
        const n = Number(getHp(p && p.name));
        return Number.isNaN(n) ? 0 : n;
    };
    let best = list[0];
    let bestHp = hpOf(best);
    for (let i = 1; i < list.length; i++) {
        const hp = hpOf(list[i]);
        if (hp > bestHp) {
            best = list[i];
            bestHp = hp;
        }
    }
    return best;
}
