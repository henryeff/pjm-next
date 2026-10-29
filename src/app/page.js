import HomeContent from './HomeContent';
import { buildMetadata } from '@/lib/seo';
import { productsOf } from '@/lib/slugs';
import { getHp, topModel } from '@/components/ui/productUtils';
import { latestNewsItems } from '@/components/news/newsServer';

// The PK range in the description comes from the catalogue data (today 4–450 PK), so it never goes stale.
const ALL_HP = hpRange([...productsOf('four'), ...productsOf('two')]);
const PK_RANGE = ALL_HP ? ` (${formatHpId(ALL_HP.min)}–${formatHpId(ALL_HP.max)} PK)` : '';

export const metadata = buildMetadata({
    title: 'Perkasa Jaya Marine – Dealer Resmi Mesin Tempel Yamaha di Padang',
    absoluteTitle: true,
    description: `Dealer resmi Yamaha Marine di Padang: mesin tempel Yamaha 2 tak & 4 tak${PK_RANGE}, suku cadang asli, oli Yamalube, dan semua jenis servis mesin tempel.`,
    path: '/',
});

/* ------------------------------------------------------------------ Data for the client sections
 * Everything below runs on the server only, so the engine JSON never ships in the home page's
 * client bundle: the lineup and the spotlight get just the fields they render (plus `slug`, which
 * the product links need).
 */

const SERIES_KEYS = ['four', 'two'];
const LINEUP_PICKS = 8;

/** An even spread of `count` models across the range, smallest to largest: indices round(i * (n - 1) / (count - 1)). */
function spread(list, count = LINEUP_PICKS) {
    const n = list.length;
    if (n <= count) return list;
    const seen = new Set();
    const out = [];
    for (let i = 0; i < count; i++) {
        const idx = Math.round((i * (n - 1)) / (count - 1));
        if (!seen.has(idx)) {
            seen.add(idx);
            out.push(list[idx]);
        }
    }
    return out;
}

const cardFields = ({ id, slug, name, image, tipeMesin }) => ({ id, slug, name, image, tipeMesin });

/** Indonesian decimal comma: 9.9 → '9,9'. */
function formatHpId(n) {
    return String(n).replace('.', ',');
}

/** { min, max } horsepower of a list of engines, from the model names (e.g. { min: 4, max: 200 }). */
function hpRange(list) {
    const values = list.map((p) => Number(getHp(p.name))).filter((n) => Number.isFinite(n) && n > 0);
    return values.length ? { min: Math.min(...values), max: Math.max(...values) } : null;
}

// Spotlight: the 4-stroke with the highest output, with the spec fields it can show.
const SPOTLIGHT_FIELDS = ['volume', 'diameter', 'jangkauan', 'berat', 'sistemInduksi'];

function spotlightProduct() {
    const top = topModel(productsOf('four'));
    if (!top) return null;
    const out = cardFields(top);
    for (const key of SPOTLIGHT_FIELDS) {
        if (top[key] && String(top[key]).trim()) out[key] = top[key];
    }
    return out;
}

export default function HomePage() {
    const lineup = {};
    const ranges = {};
    for (const key of SERIES_KEYS) {
        const list = productsOf(key);
        lineup[key] = { count: list.length, picks: spread(list).map(cardFields) };
        ranges[key] = { count: list.length, hp: hpRange(list) };
    }

    // The three newest posts, picked on the server so news.json stays out of the home page's client JS.
    return (
        <HomeContent lineup={lineup} spotlight={spotlightProduct()} ranges={ranges} news={latestNewsItems(3)} />
    );
}
