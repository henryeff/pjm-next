// Small helpers shared by product cards, listings, the engine pages and the home lineup.
// Server- and client-safe (no 'use client', no data imports): the engine page.js files use the same
// helpers for <title>, meta description and JSON-LD as the client components use for the visible text,
// so the two always say the same thing. Every sentence is built ONLY from the JSON spec fields and the
// owner-confirmed business facts in '@/lib/site' (no imports of engine data here).

import { BUSINESS, SITE_NAME } from '@/lib/site';

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

/** 'two' for 'two' / 'two-strokes', anything else → 'four'. */
export function seriesKey(series) {
    return String(series || '').toLowerCase().startsWith('two') ? 'two' : 'four';
}

/** Listing route for a series: 'two' → 2-stroke range, anything else → 4-stroke range. */
export function seriesPath(series) {
    return seriesKey(series) === 'two' ? '/products/two-strokes' : '/products/four-strokes';
}

/* ---------------------------------------------------------------- Names, titles, alt text */

// A trailing '-NNPK' (power in PK) is set apart from the model code: 'F300BET/FL300BET-300PK'.
const SUFFIX_RE = /-(\d+(?:\.\d+)?PK)$/i;

/**
 * { main, suffix } — suffix keeps its '-' so main + suffix === name ('FT9.9LMHL' + '-9.9PK').
 * Names without the pattern ('F250', 'F300D') get an empty suffix.
 */
export function splitName(name) {
    const full = String(name ?? '');
    const m = full.match(SUFFIX_RE);
    if (!m) return { main: full, suffix: '' };
    return { main: full.slice(0, m.index), suffix: full.slice(m.index) };
}

/** The model code without the '-NNPK' suffix: 'E40GMH-40PK' → 'E40GMH'; 'F425A' → 'F425A'. */
export function modelCode(name) {
    return splitName(name).main;
}

/** Power unit: Indonesian buyers write 'PK', English 'HP'. */
export const HP_UNIT = { id: 'PK', en: 'HP' };

const langKey = (lang) => (lang === 'en' ? 'en' : 'id');

/** 'Mesin Tempel 2 Tak' / '2-Stroke Outboard' (title case, for titles and H1s). */
export const SERIES_NOUN = {
    four: { id: 'Mesin Tempel 4 Tak', en: '4-Stroke Outboard' },
    two: { id: 'Mesin Tempel 2 Tak', en: '2-Stroke Outboard' },
};

/** 'Yamaha E40GMH 40 PK' (id) / 'Yamaha E40GMH 40 HP' (en). The model code is never altered. */
export function engineName(product, lang = 'id') {
    const name = product && product.name;
    const hp = getHp(name);
    const code = modelCode(name);
    return hp ? `Yamaha ${code} ${hp} ${HP_UNIT[langKey(lang)]}` : `Yamaha ${code}`;
}

/** 'Yamaha E40GMH 40 PK – Mesin Tempel 2 Tak' (id) / 'Yamaha E40GMH 40 HP – 2-Stroke Outboard' (en). */
export function engineTitle(product, series, lang = 'id') {
    return `${engineName(product, lang)} – ${SERIES_NOUN[seriesKey(series)][langKey(lang)]}`;
}

/** Image alt text: 'Mesin tempel Yamaha E40GMH 40 PK' (id) / 'Yamaha E40GMH 40 HP outboard motor' (en). */
export function engineAlt(product, lang = 'id') {
    const l = langKey(lang);
    const name = engineName(product, l);
    return l === 'en' ? `${name} outboard motor` : `Mesin tempel ${name}`;
}

/**
 * Yamaha's Enduro label, only for 2-stroke codes that start with 'E' + a digit (E40GMH, E15DMH…).
 * 9.9GMHS, 15FMH, 150AET and 200AET are not labelled Enduro.
 */
export function isEnduro(product, series) {
    return seriesKey(series) === 'two' && /^E\d/i.test(String((product && product.name) || ''));
}

/** { min, max } power (numbers) across a list of products, or null. */
export function hpRange(list) {
    const values = (Array.isArray(list) ? list : [])
        .map((p) => Number(getHp(p && p.name)))
        .filter((n) => !Number.isNaN(n) && n > 0);
    if (values.length === 0) return null;
    return { min: Math.min(...values), max: Math.max(...values) };
}

/* ---------------------------------------------------------------- Spec values in words */

const hasText = (v) => v !== undefined && v !== null && String(v).trim() !== '';

/**
 * Cylinder layout from the engine-type field, or null:
 * '2-cylinder' / 'SOHC, 2 Silinder' → { count: 2 }; 'SOHC, In-Line 4' → { count: 4, inline: true };
 * '90 deg. V6' / '60° V6' → { count: 6, vee: 'V6' }.
 */
export function cylinderInfo(tipeMesin) {
    const s = String(tipeMesin || '');
    let m = s.match(/\bV(\d{1,2})\b/);
    if (m) return { count: Number(m[1]), vee: 'V' + m[1] };
    m = s.match(/in-?line\s*(\d{1,2})/i);
    if (m) return { count: Number(m[1]), inline: true };
    m = s.match(/(\d{1,2})[-\s]*(?:cylinder|silinder)/i);
    if (m) return { count: Number(m[1]), inline: /in-?line/i.test(s) };
    return null;
}

/**
 * false when the stated displacement contradicts bore × stroke × cylinders by more than 5% (a data
 * slip — e.g. a V6 listed with an inline-4's displacement). Generated sentences then leave the
 * displacement out rather than repeat it; the spec list still shows the stored value until the data
 * is corrected. true when it matches or can't be checked.
 */
export function volumeConsistent(product) {
    if (!product) return true;
    const stated = parseFloat(String(product.volume || '').replace(/[^\d.]/g, ''));
    const bs = String(product.diameter || '').match(/(\d+(?:\.\d+)?)\s*(?:mm)?\s*[x×]\s*(\d+(?:\.\d+)?)/i);
    const cyl = cylinderInfo(product.tipeMesin);
    if (!stated || !bs || !cyl || !cyl.count) return true;
    const bore = Number(bs[1]) / 10;
    const stroke = Number(bs[2]) / 10;
    const computed = cyl.count * (Math.PI / 4) * bore * bore * stroke;
    return Math.abs(computed - stated) / stated <= 0.05;
}

function cylinderPhrase(info, lang) {
    if (!info) return '';
    if (lang === 'en') {
        if (info.vee) return `a ${info.vee} engine`;
        if (info.count === 1) return 'a single-cylinder engine';
        return `${info.inline ? 'an inline' : 'a'} ${info.count}-cylinder engine`;
    }
    if (info.vee) return `mesin ${info.vee}`;
    return `${info.count} silinder${info.inline ? ' segaris' : ''}`;
}

/** Fuel/induction system in words, or '' when the value isn't one we can phrase safely. */
function inductionPhrase(value, lang) {
    const s = String(value || '').trim();
    const carb = s.match(/^(\d+)\s*Karburator(\s+dual throat)?$/i);
    if (carb) {
        const n = Number(carb[1]);
        if (lang === 'en') {
            const kind = carb[2] ? 'dual-throat carburetor' : 'carburetor';
            return `${n} ${kind}${n > 1 ? 's' : ''}`;
        }
        return `${n} karburator${carb[2] ? ' dual throat' : ''}`;
    }
    if (/^electronic fuel injection$/i.test(s)) {
        return lang === 'en' ? 'electronic fuel injection (EFI)' : 'injeksi bahan bakar elektronik (EFI)';
    }
    if (/^direct fuel injection$/i.test(s)) {
        return lang === 'en' ? 'direct fuel injection' : 'injeksi bahan bakar langsung';
    }
    return '';
}

/** Starter in words: 'Manual', 'Electric', or 'E40JMH: Manual, E40JW: Electric Starter'. */
function starterPhrase(value, lang) {
    const s = String(value || '').trim();
    if (/^manual$/i.test(s)) return lang === 'en' ? 'manual start' : 'starter manual';
    if (/^electric( starter)?$/i.test(s)) return lang === 'en' ? 'electric start' : 'starter elektrik';
    const both = s.match(/^(\S+):\s*Manual,\s*(\S+):\s*Electric(?: Starter)?$/i);
    if (both) {
        return lang === 'en'
            ? `manual start (${both[1]}) or electric start (${both[2]})`
            : `starter manual (${both[1]}) atau elektrik (${both[2]})`;
    }
    return '';
}

/** Steering in words, for the values we can phrase safely. */
function steeringPhrase(value, lang) {
    const s = String(value || '').trim();
    if (/^tongkat kemudi$/i.test(s)) return lang === 'en' ? 'tiller steering' : 'kemudi tongkat (tiller)';
    if (/^remote$/i.test(s)) return lang === 'en' ? 'remote steering' : 'kemudi remote';
    if (/^digital electronic control \(dec\)$/i.test(s)) {
        return lang === 'en' ? 'Digital Electronic Control (DEC)' : 'kendali elektronik digital (DEC)';
    }
    return '';
}

/** 'a, b and c' / 'a, b dan c'. */
function joinList(items, lang) {
    if (items.length <= 1) return items.join('');
    const and = lang === 'en' ? ' and ' : ' dan ';
    return items.slice(0, -1).join(', ') + and + items[items.length - 1];
}

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * A short descriptive paragraph for an engine page, generated ONLY from its spec fields:
 * series (2/4 tak), power, cylinders, displacement, weight, induction, starter, steering, fuel use.
 * Fields that are empty or can't be phrased safely are left out (the spec list shows them as-is).
 * Example (id): 'Yamaha E40GMH adalah mesin tempel 2 tak 40 PK dengan 2 silinder dan volume silinder
 * 669 cc. Spesifikasi utama: berat 65–71 kg, 1 karburator dual throat, starter manual, kemudi tongkat
 * (tiller) dan konsumsi BBM 20.0 l/h @ 5500 r/min.'
 */
export function engineSummary(product, series, lang = 'id') {
    if (!product) return '';
    const l = langKey(lang);
    const strokes = seriesKey(series) === 'two' ? 2 : 4;
    const code = modelCode(product.name);
    const hp = getHp(product.name);
    const cyl = cylinderPhrase(cylinderInfo(product.tipeMesin), l);
    const volume =
        /\d/.test(String(product.volume || '')) && volumeConsistent(product) ? formatSpec(product.volume) : '';

    let first;
    if (l === 'en') {
        // 'an 8 HP', 'an 85 HP', 'an 11 HP' / 'an 18 HP'; 'a' for every other power (and when it is unknown).
        const article = hp && /^(8|1[18](?!\d))/.test(hp) ? 'an' : 'a';
        first = `The Yamaha ${code} is ${article} ${hp ? hp + ' HP ' : ''}${strokes}-stroke outboard`;
        if (cyl) first += ` with ${cyl}`;
        if (volume) first += `${cyl ? ' and' : ' with'} a displacement of ${volume}`;
    } else {
        first = `Yamaha ${code} adalah mesin tempel ${strokes} tak${hp ? ' ' + hp + ' PK' : ''}`;
        if (cyl) first += ` dengan ${cyl}`;
        if (volume) first += `${cyl ? ' dan' : ' dengan'} volume silinder ${volume}`;
    }
    first += '.';

    const facts = [];
    if (hasText(product.berat)) facts.push(`${l === 'en' ? 'weight' : 'berat'} ${formatSpec(product.berat)}`);
    const induction = inductionPhrase(product.sistemInduksi, l);
    if (induction) facts.push(induction);
    const starter = starterPhrase(product.starter, l);
    if (starter) facts.push(starter);
    const steering = steeringPhrase(product.kemudi, l);
    if (steering) facts.push(steering);
    if (hasText(product.konsumsibb)) {
        facts.push(`${l === 'en' ? 'fuel consumption' : 'konsumsi BBM'} ${formatSpec(product.konsumsibb)}`);
    }

    const second = facts.length
        ? `${l === 'en' ? 'Key specifications' : 'Spesifikasi utama'}: ${joinList(facts, l)}.`
        : '';

    return [first, second].filter(Boolean).join(' ');
}

/**
 * 'Dijual oleh Perkasa Jaya Marine, dealer resmi Yamaha Marine di Padang, Sumatera Barat.' — closes the
 * engine summary (visible text and the Product JSON-LD description).
 */
export function soldBy(lang = 'id') {
    return langKey(lang) === 'en'
        ? `Sold by ${SITE_NAME}, an authorized Yamaha Marine dealer in ${BUSINESS.city}, ${BUSINESS.region.en}.`
        : `Dijual oleh ${SITE_NAME}, dealer resmi Yamaha Marine di ${BUSINESS.city}, ${BUSINESS.region.id}.`;
}

/**
 * Display-only wording of a spec VALUE in the page language (the data is never changed): Indonesian
 * pages get '2 silinder' for '2-cylinder', English pages 'carburetor' for 'Karburator', and so on.
 * Only unambiguous words are touched; everything else is shown as stored.
 */
export function localizeSpec(value, lang = 'id') {
    if (!hasText(value)) return '';
    let s = String(value).trim();
    // '90 deg. V6' → '90° V6' (both languages).
    s = s.replace(/(\d+)\s*deg\.?\s*/gi, '$1° ');
    if (langKey(lang) === 'en') {
        s = s
            .replace(/(\d+)\s+Karburator dual throat\b/gi, (m, n) => `${n} dual-throat carburetor${Number(n) > 1 ? 's' : ''}`)
            .replace(/(\d+)\s+Karburator\b/gi, (m, n) => `${n} carburetor${Number(n) > 1 ? 's' : ''}`)
            .replace(/\bKarburator\b/gi, 'carburetor')
            .replace(/(\d+)\s+Silinder\b/gi, '$1-cylinder')
            .replace(/^Tongkat Kemudi$/i, 'Tiller')
            .replace(/^Hidraulik$/i, 'Hydraulic');
    } else {
        s = s
            .replace(/(\d+)-cylinder\b/gi, '$1 silinder')
            .replace(/^Electric$/i, 'Elektrik')
            .replace(/\bElectric Starter\b/gi, 'Elektrik');
    }
    return s;
}

/** formatSpec + localizeSpec: the spec value as shown on the page in `lang`. */
export function displaySpec(value, lang = 'id') {
    return formatSpec(localizeSpec(value, lang));
}

/* ---------------------------------------------------------------- Spec keys */

/** Spec fields in display order (engine pages, JSON-LD, variant comparison). */
export const SPEC_KEYS = [
    'tipeMesin',
    'volume',
    'diameter',
    'jangkauan',
    'kompresi',
    'sistemInduksi',
    'pengapian',
    'konsumsibb',
    'gigi',
    'pelumas',
    'trim',
    'starter',
    'kemudi',
    'berat',
    'transom',
];

/** Spec labels per language. */
export const SPEC_LABELS = {
    id: {
        tipeMesin: 'Tipe Mesin',
        volume: 'Volume Silinder',
        diameter: 'Diameter x Langkah',
        jangkauan: 'Putaran Maks.',
        kompresi: 'Rasio Kompresi',
        sistemInduksi: 'Sistem Induksi',
        pengapian: 'Sistem Pengapian',
        konsumsibb: 'Konsumsi BBM',
        gigi: 'Rasio Gigi',
        pelumas: 'Pelumasan',
        trim: 'Sistem Trim',
        starter: 'Sistem Starter',
        kemudi: 'Kemudi',
        berat: 'Berat',
        transom: 'Tinggi Transom',
    },
    en: {
        tipeMesin: 'Engine Type',
        volume: 'Displacement',
        diameter: 'Bore x Stroke',
        jangkauan: 'Max RPM',
        kompresi: 'Compression Ratio',
        sistemInduksi: 'Induction System',
        pengapian: 'Ignition System',
        konsumsibb: 'Fuel Consumption',
        gigi: 'Gear Ratio',
        pelumas: 'Lubrication',
        trim: 'Trim System',
        starter: 'Starter System',
        kemudi: 'Steering',
        berat: 'Weight',
        transom: 'Transom Height',
    },
};

/** [{ key, label, value }] for the filled spec fields, labelled and worded in `lang`. */
export function specRows(product, lang = 'id') {
    const l = langKey(lang);
    if (!product) return [];
    return SPEC_KEYS.filter((k) => hasText(product[k])).map((k) => ({
        key: k,
        label: SPEC_LABELS[l][k],
        value: displaySpec(product[k], l),
    }));
}

/**
 * Same-power variants of a product within its series (e.g. E85AED vs E85AET), each with the spec
 * fields where it differs from `product`: [{ id, slug, name, diffs: [{ key, value }] }].
 * Computed from the data only — it states what the data says differs, nothing more.
 */
export function sameHpVariants(list, product) {
    if (!Array.isArray(list) || !product) return [];
    const hp = getHp(product.name);
    if (!hp) return [];
    const norm = (v) => String(v ?? '').trim().toLowerCase().replace(/\s+/g, '');
    return list
        .filter((p) => p && p.id !== product.id && getHp(p.name) === hp)
        .map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            diffs: SPEC_KEYS.filter((k) => norm(p[k]) !== norm(product[k])).map((k) => ({
                key: k,
                value: hasText(p[k]) ? String(p[k]).trim() : '',
            })),
        }));
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
