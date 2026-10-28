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

const NBSP = ' ';

/**
 * Display-only tidy-up of a spec value (the data is never changed). Number and unit are joined by a
 * no-break space, so a line can only break between a value and its qualifier:
 *   - en dash in numeric ranges:   '5000-6000rpm'       → '5000–6000 rpm'
 *   - bore × stroke, one unit:     '96.0 mm x 96.0 mm'  → '96.0 × 96.0 mm';  '81mm x 88.9mm' → '81 × 88.9 mm'
 *   - number + unit anywhere:      '212cc' → '212 cc';  '11.5 L/h' → '11.5 l/h'
 *   - fuel at engine speed:        '2.2l/h @5000r/min'  → '2.2 l/h @ 5000 r/min'
 * (The gaps between number and unit, inside 'a × b' and after '@' are U+00A0.)
 */
export function formatSpec(value) {
    if (value === null || value === undefined) return '';
    return (
        String(value)
            .trim()
            // Numeric ranges: en dash.
            .replace(/(\d)\s*-\s*(\d)/g, '$1–$2')
            // Bore × stroke: one multiplication sign and one trailing unit.
            .replace(
                /^(\d+(?:\.\d+)?)\s*(?:mm)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*mm$/i,
                '$1' + NBSP + '×' + NBSP + '$2' + NBSP + 'mm'
            )
            // Number + unit anywhere: a no-break space between them; 'L/h' → 'l/h'.
            .replace(/(\d)\s*(cc|rpm|kg|mm|l\/h)\b/gi, (m, d, unit) => {
                const u = unit.toLowerCase() === 'l/h' ? 'l/h' : unit;
                return d + NBSP + u;
            })
            // '@5000r/min' → '@ 5000 r/min': a normal space before the '@', no-break after it.
            .replace(/\s*@\s*(\d+)\s*r\/min/gi, ' @' + NBSP + '$1' + NBSP + 'r/min')
    );
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
