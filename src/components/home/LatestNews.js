'use client';

import dynamic from 'next/dynamic';
import LatestNewsList from './LatestNews.list';

// Server-rendered like everything else; split into its own chunk so news.json is only downloaded when
// the home page does not pass `items`.
const LatestNewsFallback = dynamic(() => import('./LatestNews.fallback'));

/**
 * Home "News & guides" list: the three newest posts, each linking to its article page (/news/<slug>).
 *
 * Pass `items` from the server (`latestNewsItems()` in '@/components/news/newsServer':
 * [{ id, slug, title, date, category }]) to keep news.json out of the home page's client JS.
 * Without `items` it falls back to reading news.json itself (lazily loaded).
 */
export default function LatestNews({ items, titleId = 'home-news-title' }) {
    if (Array.isArray(items)) return <LatestNewsList items={items} titleId={titleId} />;
    return <LatestNewsFallback titleId={titleId} />;
}
