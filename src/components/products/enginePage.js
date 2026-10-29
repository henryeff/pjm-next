// Server-only building blocks for the engine detail routes (/products/{four,two}-strokes/[slug]).
// Imports '@/lib/slugs' (all engine JSON), so never import this file from a client component.
//
// <title>, meta description, the visible H1 / summary (ProductDetail) and the JSON-LD are all built
// with the same productUtils helpers, from the JSON spec fields only — they always agree.

import { notFound } from 'next/navigation';
import JsonLd from '@/components/Seo/JsonLd';
import {
    cylinderInfo,
    engineAlt,
    engineName,
    engineSummary,
    engineTitle,
    formatSpec,
    isEnduro,
    sameHpVariants,
    soldBy,
    specRows,
    volumeConsistent,
} from '@/components/ui/productUtils';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbs, product as productNode } from '@/lib/schema';
import { getProductEntry, normalizeSeries, productPath, SERIES } from '@/lib/slugs';
import { BUSINESS, PRICE_NOTE } from '@/lib/site';
import ProductDetail from './ProductDetail';
import { relatedModels } from './relatedModels';

const plain = (s) => String(s || '').replace(/ /g, ' ');

/** The entry for a series + slug, or a real 404 (notFound) for an unknown slug. */
function entryOr404(series, slug) {
    const entry = getProductEntry(series, slug);
    if (!entry) notFound();
    return entry;
}

/**
 * Meta description (Indonesian): 'Spesifikasi Yamaha E40GMH 40 PK, mesin tempel 2 tak Enduro: 2 silinder,
 * 669 cc, 65–71 kg. Dealer resmi Yamaha Marine di Padang — hubungi kami untuk harga dan ketersediaan.'
 * 'Enduro' only for 2-stroke codes starting with E (isEnduro).
 */
function engineDescription(p, key) {
    const strokes = SERIES[key].strokes;
    const cyl = cylinderInfo(p.tipeMesin);
    const facts = [];
    if (cyl) facts.push(cyl.vee ? cyl.vee : `${cyl.count} silinder`);
    if (/\d/.test(String(p.volume || '')) && volumeConsistent(p)) facts.push(formatSpec(p.volume));
    if (String(p.berat || '').trim()) facts.push(formatSpec(p.berat));
    const head = `Spesifikasi ${engineName(p, 'id')}, mesin tempel ${strokes} tak${isEnduro(p, key) ? ' Enduro' : ''}`;
    return plain(
        `${head}${facts.length ? ': ' + facts.join(', ') : ''}. ` +
            `${BUSINESS.role.id} di ${BUSINESS.city} — ${PRICE_NOTE.id.charAt(0).toLowerCase() + PRICE_NOTE.id.slice(1)}.`
    );
}

/** generateMetadata for an engine page. */
export function engineMetadata(series, slug) {
    const key = normalizeSeries(series);
    const { product: p } = entryOr404(key, slug);
    return buildMetadata({
        title: engineTitle(p, key, 'id'),
        description: engineDescription(p, key),
        path: productPath(key, p),
        // The engine itself is the better link preview for a model page.
        images: [{ url: p.image, alt: engineAlt(p, 'id') }],
    });
}

/** Breadcrumb trail, same labels as the visible crumb: Beranda › 2 Tak › E40GMH-40PK. */
function engineCrumbs(p, key) {
    return [
        { name: 'Beranda', path: '/' },
        { name: SERIES[key].short.id, path: SERIES[key].path },
        { name: p.name, path: productPath(key, p) },
    ];
}

/** The engine page body: Product + BreadcrumbList JSON-LD and the (client) ProductDetail. */
export function EngineDetail({ series, slug }) {
    const key = normalizeSeries(series);
    const { product: p, index, list } = entryOr404(key, slug);
    const path = productPath(key, p);

    const nodes = [
        productNode(p, key, {
            name: engineName(p, 'id'),
            description: plain(`${engineSummary(p, key, 'id')} ${soldBy('id')} ${PRICE_NOTE.id}.`),
            specs: specRows(p, 'id').map((row) => ({ name: row.label, value: plain(row.value) })),
        }),
        breadcrumbs(engineCrumbs(p, key), path),
    ];

    return (
        <>
            <JsonLd data={nodes} />
            <ProductDetail
                product={p}
                series={key}
                related={relatedModels(list, index)}
                variants={sameHpVariants(list, p)}
            />
        </>
    );
}
