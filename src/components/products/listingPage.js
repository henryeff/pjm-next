// Server-only building blocks for the engine range listings (/products/four-strokes, /products/two-strokes).
// Imports '@/lib/slugs' (all engine + news JSON), so never import this file from a client component.

import JsonLd from '@/components/Seo/JsonLd';
import { engineName, hpRange, isEnduro } from '@/components/ui/productUtils';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbs, itemList } from '@/lib/schema';
import { allNews, newsPath, normalizeSeries, productPath, productsOf, SERIES } from '@/lib/slugs';
import { BUSINESS, PRICE_NOTE } from '@/lib/site';
import ProductGrid from './ProductGrid';
import { cardFields } from './relatedModels';

// Guides linked from the range intro, looked up by id (their URL follows the news slug, wherever it goes).
const GUIDE_IDS = ['2tak-vs-4tak-yamaha-2026-02-19', 'cara-memilih-mesin-tempel-2026-02-19'];

/** '9.9–450 PK' from the data, or ''. */
function rangeText(list) {
    const r = hpRange(list);
    return r ? `${r.min}–${r.max} PK` : '';
}

/** generateMetadata for a range listing: 'Mesin Tempel Yamaha 4 Tak 9.9–450 PK di Padang'. */
export function listingMetadata(series) {
    const key = normalizeSeries(series);
    const list = productsOf(key);
    const strokes = SERIES[key].strokes;
    const range = rangeText(list);
    const enduro = list.some((p) => isEnduro(p, key));
    const price = PRICE_NOTE.id.charAt(0).toLowerCase() + PRICE_NOTE.id.slice(1);
    return buildMetadata({
        title: `Mesin Tempel Yamaha ${strokes} Tak${range ? ' ' + range : ''} di ${BUSINESS.city}`,
        description:
            `${list.length} model mesin tempel Yamaha ${strokes} tak${range ? ' berdaya ' + range : ''}` +
            `${enduro ? ', termasuk seri Enduro,' : ''} lengkap dengan spesifikasi. ` +
            `${BUSINESS.role.id} di ${BUSINESS.city} — ${price}.`,
        path: SERIES[key].path,
    });
}

/** The listing body: BreadcrumbList + ItemList JSON-LD and the (client) ProductGrid. */
export function ListingPage({ series }) {
    const key = normalizeSeries(series);
    const list = productsOf(key);
    const news = allNews();
    const guides = GUIDE_IDS.map((id) => news.find((n) => n.id === id))
        .filter(Boolean)
        .map((n) => ({ href: newsPath(n), title: n.title }));

    const nodes = [
        // Same trail as the visible PageHero breadcrumb: Beranda › 4 Tak.
        breadcrumbs([{ name: 'Beranda', path: '/' }, { name: SERIES[key].short.id }], SERIES[key].path),
        itemList(
            list.map((p) => ({ name: engineName(p, 'id'), path: productPath(key, p), image: p.image })),
            { name: SERIES[key].label.id }
        ),
    ];

    return (
        <>
            <JsonLd data={nodes} />
            <ProductGrid products={list.map(cardFields)} series={key} guides={guides} />
        </>
    );
}
