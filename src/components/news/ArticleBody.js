// Server-rendered article body for /news/[slug]. Imports '@/lib/slugs' (engine JSON for the model tables),
// so it must only be used from server code (the page passes the rendered body to the client chrome as
// children).
//
// CONTENT FORMAT (news.json `content`) — a small, safe subset, never injected as raw HTML:
//   - one block per line; blank lines are ignored (spacing comes from CSS)
//   - '## Heading' / '### Heading'          → <h2>/<h3> with an id (the table of contents links to h2s)
//   - '<ul><li>…</li></ul>' on one line      → bullet list ('<ol>…</ol>' → numbered list)
//   - '{{tabel-model:<key>}}'                → spec table of the engines in item.models[key]
//   - any other line                         → <p>
//   - inline: <strong>, <em>, and <a href="…"> where href is an internal path ('/servis', '/news/…'),
//     '#anchor', 'wa:<topic>' (WhatsApp with a prefilled message: general|price|service|parts|oil),
//     'tel:<storeId>' or an https:// URL. Every other tag is dropped and its text kept.
// Specs in the model tables are read from the engine JSON at build time, so they never go stale.

import Link from 'next/link';
import { STORES } from '@/components/ui/stores';
import {
    cylinderInfo,
    displaySpec,
    formatSpec,
    getHp,
    modelCode,
    volumeConsistent,
} from '@/components/ui/productUtils';
import { slugify } from '@/lib/slugify.mjs';
import { getProduct, normalizeSeries, productPath } from '@/lib/slugs';
import { waLink, WA_TEXT } from '@/lib/site';
import styles from './ArticleBody.module.css';

const stripTags = (s) => String(s || '').replace(/<[^>]*>/g, '');

const TABLE_RE = /^\{\{\s*tabel-model(?::([\w-]+))?\s*\}\}$/i;
const HEADING_RE = /^(#{2,3})\s+(.+)$/;
const INLINE_RE = /<(strong|b|em|i)>([\s\S]*?)<\/\1>|<a\s+href="([^"]*)"\s*>([\s\S]*?)<\/a>/gi;

/* ---------------------------------------------------------------- parsing */

function uniqueId(base, used) {
    let id = base || 'bagian';
    let n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    return id;
}

/** content → [{ type: 'h2'|'h3'|'p'|'ul'|'ol'|'table', … }] */
export function parseContent(content) {
    const blocks = [];
    const used = new Set();
    for (const raw of String(content || '').split('\n')) {
        const line = raw.trim();
        if (!line) continue;

        let m = line.match(HEADING_RE);
        if (m) {
            const text = stripTags(m[2]).trim();
            blocks.push({ type: m[1].length === 2 ? 'h2' : 'h3', text, id: uniqueId(slugify(text), used) });
            continue;
        }

        m = line.match(TABLE_RE);
        if (m) {
            blocks.push({ type: 'table', key: m[1] || null });
            continue;
        }

        if (/<li>/i.test(line)) {
            const items = [...line.matchAll(/<li>([\s\S]*?)<\/li>/gi)].map((x) => x[1]);
            blocks.push({ type: /<ol[\s>]/i.test(line) ? 'ol' : 'ul', items });
            continue;
        }

        blocks.push({ type: 'p', html: line });
    }
    return blocks;
}

/** The h2 headings, for the table of contents: [{ id, text }]. */
export function articleHeadings(content) {
    return parseContent(content)
        .filter((b) => b.type === 'h2')
        .map(({ id, text }) => ({ id, text }));
}

/** Plain-text word count of the content (markers and tags removed). */
export function articleWordCount(content) {
    const text = stripTags(String(content || '').replace(/\{\{[^}]*\}\}/g, ' ').replace(/^#{2,3}\s+/gm, ''));
    return text.split(/\s+/).filter(Boolean).length;
}

/* ---------------------------------------------------------------- links */

function waTextFor(topic) {
    const entry = WA_TEXT[topic] || WA_TEXT.general;
    return typeof entry.id === 'function' ? entry.id() : entry.id;
}

/** { kind: 'internal'|'anchor'|'external'|'tel', href } for an allowed href, else null. */
function resolveHref(href) {
    const h = String(href || '').trim();
    if (h.startsWith('/') && !h.startsWith('//')) return { kind: 'internal', href: h };
    if (h.startsWith('#')) return { kind: 'anchor', href: h };

    let m = h.match(/^wa:([a-z]+)$/i);
    if (m) return { kind: 'external', href: waLink(waTextFor(m[1].toLowerCase())) };

    m = h.match(/^tel:([a-z][\w-]*)$/i);
    if (m) {
        const store = STORES.find((s) => s.id === m[1]);
        return store ? { kind: 'tel', href: store.tel } : null;
    }
    if (/^tel:\+?[\d\s-]+$/.test(h)) return { kind: 'tel', href: h.replace(/[\s-]/g, '') };
    if (/^https:\/\/[^\s"<>]+$/i.test(h)) return { kind: 'external', href: h };
    return null;
}

function renderLink(href, text, key) {
    const target = resolveHref(href);
    if (!target) return text;
    if (target.kind === 'internal') {
        return (
            <Link key={key} href={target.href} prefetch={target.href.startsWith('/chat') ? false : undefined}>
                {text}
            </Link>
        );
    }
    if (target.kind === 'external') {
        return (
            <a key={key} href={target.href} target="_blank" rel="noopener noreferrer">
                {text}
            </a>
        );
    }
    return (
        <a key={key} href={target.href}>
            {text}
        </a>
    );
}

/** Inline text with <strong>/<em>/<a> rendered as elements; every other tag is stripped. */
function renderInline(text, keyPrefix) {
    const out = [];
    let last = 0;
    let i = 0;
    for (const m of String(text).matchAll(INLINE_RE)) {
        if (m.index > last) out.push(stripTags(text.slice(last, m.index)));
        const key = `${keyPrefix}-${i++}`;
        if (m[1]) {
            const Tag = /^(strong|b)$/i.test(m[1]) ? 'strong' : 'em';
            out.push(<Tag key={key}>{renderInline(m[2], key)}</Tag>);
        } else {
            out.push(renderLink(m[3], stripTags(m[4]), key));
        }
        last = m.index + m[0].length;
    }
    if (last < text.length) out.push(stripTags(text.slice(last)));
    return out;
}

/* ---------------------------------------------------------------- model table */

const DASH = '–';

/** 'two/e40gmh-40pk' or { series, slug } → { series, product } | null. */
function resolveModel(ref) {
    let series;
    let slug;
    if (typeof ref === 'string') {
        [series, slug] = ref.split('/');
    } else if (ref) {
        ({ series, slug } = ref);
    }
    if (!slug) return null;
    const key = normalizeSeries(series);
    const product = getProduct(key, slug);
    return product ? { series: key, product } : null;
}

/** Every engine an article's tables mention: [{ series, product }] (for JSON-LD `mentions`). */
export function articleModels(item) {
    const groups = Array.isArray(item && item.models) ? item.models : [];
    const seen = new Set();
    const out = [];
    for (const group of groups) {
        for (const ref of group.items || []) {
            const entry = resolveModel(ref);
            if (!entry) continue;
            const id = `${entry.series}/${entry.product.slug}`;
            if (seen.has(id)) continue;
            seen.add(id);
            out.push(entry);
        }
    }
    return out;
}

function cylinders(p) {
    const info = cylinderInfo(p.tipeMesin);
    if (info && info.vee) return info.vee;
    if (info && info.count) return `${info.count} silinder`;
    return displaySpec(p.tipeMesin, 'id') || DASH;
}

/** Displacement — left out ('–') when it contradicts bore × stroke (a known data slip). */
function volume(p) {
    if (!/\d/.test(String(p.volume || '')) || !volumeConsistent(p)) return DASH;
    return formatSpec(p.volume);
}

function ModelTable({ group }) {
    const rows = (group.items || []).map(resolveModel).filter(Boolean);
    if (rows.length === 0) return null;
    const caption = group.caption || 'Perbandingan model mesin tempel Yamaha';

    return (
        <figure className={styles.tableFigure}>
            {/* Focusable + labelled so keyboard users can scroll the table sideways on phones. */}
            <div className={styles.tableScroll} role="region" aria-label={caption} tabIndex={0}>
                <table className={styles.table}>
                    <caption className={styles.caption}>{caption}</caption>
                    <thead>
                        <tr>
                            <th scope="col">Model</th>
                            <th scope="col">Jenis</th>
                            <th scope="col">Daya</th>
                            <th scope="col">Silinder</th>
                            <th scope="col">Volume silinder</th>
                            <th scope="col">Berat</th>
                            <th scope="col">Konsumsi BBM</th>
                            <th scope="col">Starter</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(({ series, product: p }) => {
                            const hp = getHp(p.name);
                            return (
                                <tr key={`${series}-${p.slug}`}>
                                    <th scope="row">
                                        <Link href={productPath(series, p)}>{modelCode(p.name)}</Link>
                                    </th>
                                    <td>{series === 'two' ? '2 tak' : '4 tak'}</td>
                                    <td>{hp ? `${hp.replace('.', ',')} PK` : DASH}</td>
                                    <td>{cylinders(p)}</td>
                                    <td>{volume(p)}</td>
                                    <td>{String(p.berat || '').trim() ? formatSpec(p.berat) : DASH}</td>
                                    <td>{String(p.konsumsibb || '').trim() ? formatSpec(p.konsumsibb) : DASH}</td>
                                    <td>{displaySpec(p.starter, 'id') || DASH}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <figcaption className={styles.note}>
                Sumber: data spesifikasi di halaman tiap model. Konsumsi BBM adalah angka spesifikasi, bukan pemakaian
                harian; pemakaian nyata tergantung beban, bentuk lambung, putaran mesin, dan kondisi laut. Tanda
                {' ' + DASH} berarti data belum tersedia.
            </figcaption>
        </figure>
    );
}

/* ---------------------------------------------------------------- body */

/** The rendered article content (server component). */
export default function ArticleBody({ item }) {
    const blocks = parseContent(item && item.content);
    const groups = Array.isArray(item && item.models) ? item.models : [];
    const groupFor = (key) => (key ? groups.find((g) => g.key === key) : groups[0]) || null;

    return blocks.map((block, idx) => {
        switch (block.type) {
            case 'h2':
                return (
                    <h2 key={idx} id={block.id}>
                        {block.text}
                    </h2>
                );
            case 'h3':
                return (
                    <h3 key={idx} id={block.id}>
                        {block.text}
                    </h3>
                );
            case 'ul':
            case 'ol': {
                const List = block.type;
                return (
                    <List key={idx}>
                        {block.items.map((it, j) => (
                            <li key={j}>{renderInline(it, `${idx}-${j}`)}</li>
                        ))}
                    </List>
                );
            }
            case 'table': {
                const group = groupFor(block.key);
                return group ? <ModelTable key={idx} group={group} /> : null;
            }
            default:
                return <p key={idx}>{renderInline(block.html, String(idx))}</p>;
        }
    });
}
