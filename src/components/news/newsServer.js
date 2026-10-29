// Server-only news helpers for the /news routes and the home page. Imports '@/lib/slugs' (which bundles
// every engine and news JSON), so never import this file from a client component — pass the small
// objects these helpers return as props instead.

import { allNews, newsDateISO } from '@/lib/slugs';
import { CONTENT_UPDATED } from '@/lib/site';

/** 'berita' (dated dealership news) | 'panduan' (how-to guide). Guides carry tags in the data. */
export function newsCategory(item) {
    if (item && (item.category === 'berita' || item.category === 'panduan')) return item.category;
    return item && Array.isArray(item.tags) ? 'panduan' : 'berita';
}

/** schema.org type: BlogPosting for guides, NewsArticle for dated news. */
export function newsSchemaType(item) {
    return newsCategory(item) === 'panduan' ? 'BlogPosting' : 'NewsArticle';
}

/** The fields a news card / list row needs (keeps the client props small: no article bodies). */
export function newsCardFields(item) {
    return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        date: newsDateISO(item) || item.date || '',
        excerpt: item.excerpt || '',
        image: item.image,
        imageAlt: item.imageAlt || item.title,
        category: newsCategory(item),
    };
}

/** All news + guides as card fields, newest first. */
export function newsCards() {
    return allNews().map(newsCardFields);
}

/**
 * The newest `count` items for the home page's LatestNews list: [{ id, slug, title, date, category }].
 * Home: `<LatestNews items={latestNewsItems()} />` keeps news.json out of the home client bundle.
 */
export function latestNewsItems(count = 3) {
    return allNews()
        .slice(0, count)
        .map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            date: newsDateISO(item) || item.date || '',
            category: newsCategory(item),
        }));
}

/**
 * Up to `count` other items for an article's "related" row: same category first (newest first), then
 * the rest. Returns card fields.
 */
export function relatedNews(item, count = 3) {
    const others = allNews().filter((n) => n.slug !== item.slug);
    const category = newsCategory(item);
    const same = others.filter((n) => newsCategory(n) === category);
    const rest = others.filter((n) => newsCategory(n) !== category);
    return [...same, ...rest].slice(0, count).map(newsCardFields);
}

/**
 * True for dated news published more than a year before the site's content date (CONTENT_UPDATED, a fixed
 * date, so server and client agree). Such pages get a "this is an older story" note.
 */
export function isArchivedNews(item) {
    if (newsCategory(item) !== 'berita') return false;
    const iso = newsDateISO(item);
    if (!iso) return false;
    const [y, m, d] = CONTENT_UPDATED.split('-');
    const cutoff = `${Number(y) - 1}-${m}-${d}`;
    return iso < cutoff;
}

/** The article's "updated" date as 'YYYY-MM-DD' when it is later than the published date, else null. */
export function newsUpdatedISO(item) {
    const updated = item && /^\d{4}-\d{2}-\d{2}$/.test(String(item.updated || '')) ? item.updated : null;
    const published = newsDateISO(item);
    return updated && (!published || updated > published) ? updated : null;
}

/** WhatsApp / call-to-action topic of an article: general | price | service | parts | oil. */
export function newsTopic(item) {
    const topic = item && item.cta;
    return ['general', 'price', 'service', 'parts', 'oil'].includes(topic) ? topic : 'general';
}
