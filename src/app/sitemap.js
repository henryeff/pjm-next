import { CONTENT_UPDATED, SITE_URL } from '@/lib/site';
import { allNews, allProducts, newsDateISO, newsPath } from '@/lib/slugs';
import { newsUpdatedISO } from '@/components/news/newsServer';

// Every indexable URL. lastModified comes from content, never the build time: news items use their
// own date, everything else the fixed CONTENT_UPDATED date in '@/lib/site' (bump it when pages change).
// /chat is not listed: it is noindex (a tool, with endless ?q= variants).
const STATIC_PATHS = [
    '/',
    '/products/four-strokes',
    '/products/two-strokes',
    '/servis',
    '/parts',
    '/yamalube',
    '/news',
    '/faq',
    '/about',
    '/contact',
];

const url = (path) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);

export default function sitemap() {
    const news = allNews();
    const latestNews = news.map(newsDateISO).filter(Boolean).sort().pop();

    const staticEntries = STATIC_PATHS.map((path) => ({
        url: url(path),
        // The news index changes when a newer article is published.
        lastModified: path === '/news' && latestNews && latestNews > CONTENT_UPDATED ? latestNews : CONTENT_UPDATED,
    }));

    const productEntries = allProducts().map(({ path, product }) => ({
        url: url(path),
        lastModified: CONTENT_UPDATED,
        ...(product.image ? { images: [url(product.image)] } : {}),
    }));

    const newsEntries = news.map((item) => ({
        url: url(newsPath(item)),
        // A rewritten article carries `updated` (same date as its JSON-LD dateModified).
        lastModified: newsUpdatedISO(item) || newsDateISO(item) || CONTENT_UPDATED,
        ...(item.image ? { images: [url(item.image)] } : {}),
    }));

    return [...staticEntries, ...productEntries, ...newsEntries];
}
