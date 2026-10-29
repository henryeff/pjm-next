'use client';

// Fallback data for LatestNews when the home page does not pass `items`. It imports news.json, so
// LatestNews loads this module lazily (next/dynamic): once the home page passes
// `items={latestNewsItems()}` (from '@/components/news/newsServer'), this chunk is never downloaded.

import newsData from '@/data/news.json';
import { isoDate, parseDate } from '@/components/news/newsUtils';
import LatestNewsList from './LatestNews.list';

const COUNT = 3;

// Newest first (Array#sort is stable, so same-day posts keep their file order); undated posts go last.
const ITEMS = newsData
    .map((item, index) => ({ item, index, date: parseDate(item.date) }))
    .sort((a, b) => {
        if (!a.date && !b.date) return a.index - b.index;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date - a.date || a.index - b.index;
    })
    .slice(0, COUNT)
    .map(({ item, date }) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        date: date ? isoDate(date) : item.date || '',
        category: item.category || (Array.isArray(item.tags) ? 'panduan' : 'berita'),
    }));

export default function LatestNewsFallback({ titleId }) {
    return <LatestNewsList items={ITEMS} titleId={titleId} />;
}
