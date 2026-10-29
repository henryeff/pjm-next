/**
 * Renders schema.org JSON-LD. Works in server and client components (no hooks).
 *
 *   <JsonLd data={product(p, 'two')} />                       one node
 *   <JsonLd data={[breadcrumbs(crumbs, path), itemList(...)]} />  several nodes → one @graph
 *
 * Build nodes with the helpers in '@/lib/schema'. '<' is escaped (<) so text can never
 * close the <script> early (the Next.js JSON-LD guidance).
 */
export default function JsonLd({ data, id }) {
    const nodes = (Array.isArray(data) ? data : [data]).filter(Boolean);
    if (nodes.length === 0) return null;

    const json =
        nodes.length === 1
            ? { '@context': 'https://schema.org', ...nodes[0] }
            : { '@context': 'https://schema.org', '@graph': nodes };

    return (
        <script
            type="application/ld+json"
            id={id}
            dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, '\\u003c') }}
        />
    );
}
