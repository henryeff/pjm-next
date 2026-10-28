import newsData from '@/data/news.json';

const MONTHS = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
};

/** "2026-02-19" or "12 December 2023" → local Date; anything else → null. */
export function parseDate(str) {
    if (!str) return null;
    const s = String(str).trim();
    let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    m = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (m) {
        const month = MONTHS[m[2].toLowerCase()];
        if (month !== undefined) return new Date(Number(m[3]), month, Number(m[1]));
    }
    return null;
}

const pad = (n) => String(n).padStart(2, '0');

/** Date → "YYYY-MM-DD" for <time dateTime>. */
export const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const FORMATTERS = {};

function getFormatter(language) {
    const locale = language === 'id' ? 'id-ID' : 'en-GB';
    if (!FORMATTERS[locale]) {
        FORMATTERS[locale] = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return FORMATTERS[locale];
}

/** "19 February 2026" / "19 Februari 2026"; falls back to the raw string when it can't be parsed. */
export function formatDate(str, language) {
    const d = parseDate(str);
    if (!d) return str || '';
    return getFormatter(language).format(d);
}

// Real dealership photos stay in natural colour; generic/stock imagery gets the navy duotone.
// Matched on the lower-cased file name, because the data mixes /images/News and /images/news paths.
const NATURAL_COLOUR = new Set(['fisherman.jpg', 'yamalube.jpg', 'f250h.jpg', 'bantuansumbar.jpg', 'garmin.jpg']);

/** True when a news image should get the navy duotone (i.e. it is not one of the real dealership photos). */
export function isDuotone(src) {
    const base = String(src || '').split('/').pop().toLowerCase();
    return !NATURAL_COLOUR.has(base);
}

/** Existing preview logic: cut to `maxLength` characters and add an ellipsis. */
export function getHighlight(text, maxLength = 150) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

// Newest first. Array#sort is stable, so same-day posts keep their file order; undated posts go last.
export const SORTED_NEWS = newsData
    .map((item, index) => ({ item, index, date: parseDate(item.date) }))
    .sort((a, b) => {
        if (!a.date && !b.date) return a.index - b.index;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date - a.date || a.index - b.index;
    })
    .map(({ item }) => item);
