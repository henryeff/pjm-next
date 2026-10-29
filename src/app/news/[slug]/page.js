import { notFound } from 'next/navigation';
import JsonLd from '@/components/Seo/JsonLd';
import ArticleBody, { articleHeadings, articleModels, articleWordCount } from '@/components/news/ArticleBody';
import NewsArticle from '@/components/news/NewsArticle';
import { CATEGORY_LABELS } from '@/components/news/newsUtils';
import {
    isArchivedNews,
    newsCategory,
    newsSchemaType,
    newsTopic,
    newsUpdatedISO,
    relatedNews,
} from '@/components/news/newsServer';
import { buildMetadata } from '@/lib/seo';
import { absUrl, article, breadcrumbs } from '@/lib/schema';
import { getNewsBySlug, newsDateISO, newsPath, newsStaticParams, productPath } from '@/lib/slugs';
import { SITE_NAME } from '@/lib/site';

// Every article is generated at build time from news.json; any other slug is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
    return newsStaticParams();
}

function itemOr404(slug) {
    const item = getNewsBySlug(slug);
    if (!item) notFound();
    return item;
}

/** A plain-text description (~160 characters) for meta tags. */
function describe(item) {
    const text = String(item.meta_description || item.excerpt || item.title || '').replace(/\s+/g, ' ').trim();
    return text.length <= 165 ? text : text.slice(0, 160).replace(/\s+\S*$/, '') + '…';
}

function heroImage(item) {
    if (!item.image) return undefined;
    const img = { url: item.image, alt: item.imageAlt || item.title };
    if (item.imageWidth && item.imageHeight) {
        img.width = item.imageWidth;
        img.height = item.imageHeight;
    }
    return [img];
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const item = itemOr404(slug);
    const published = newsDateISO(item);
    const updated = newsUpdatedISO(item);
    const category = newsCategory(item);

    return buildMetadata({
        title: item.meta_title || item.title,
        description: describe(item),
        path: newsPath(item),
        images: heroImage(item),
        type: 'article',
        article: {
            publishedTime: published || undefined,
            modifiedTime: updated || published || undefined,
            authors: [item.author || SITE_NAME],
            section: CATEGORY_LABELS[category].id,
            tags: Array.isArray(item.tags) ? item.tags : undefined,
        },
        keywords: Array.isArray(item.tags) ? item.tags : undefined,
    });
}

export default async function NewsArticlePage({ params }) {
    const { slug } = await params;
    const item = itemOr404(slug);
    const path = newsPath(item);
    const category = newsCategory(item);
    const published = newsDateISO(item);
    const updated = newsUpdatedISO(item);
    const words = articleWordCount(item.content);
    const lang = item.lang === 'en' ? 'en' : 'id';

    // JSON-LD: the article (NewsArticle for dated news, BlogPosting for guides) + the breadcrumb trail,
    // same labels as the visible crumb: Beranda › Berita › <title>.
    const articleNode = article(item, {
        type: newsSchemaType(item),
        headline: item.title,
        description: describe(item),
        inLanguage: lang === 'en' ? 'en' : 'id-ID',
        path,
    });
    if (updated) articleNode.dateModified = updated;
    articleNode.articleSection = CATEGORY_LABELS[category].id;
    articleNode.wordCount = words;
    if (item.image && item.imageWidth && item.imageHeight) {
        articleNode.image = [
            {
                '@type': 'ImageObject',
                url: absUrl(item.image),
                width: item.imageWidth,
                height: item.imageHeight,
                caption: item.imageAlt || item.title,
            },
        ];
    }
    // Engines compared in the article's tables: point at their Product nodes on the engine pages.
    const mentions = articleModels(item).map(({ series, product }) => ({
        '@type': 'Product',
        '@id': `${absUrl(productPath(series, product))}#product`,
        name: `Yamaha ${product.name}`,
        url: absUrl(productPath(series, product)),
    }));
    if (mentions.length) articleNode.mentions = mentions;

    // The visible H1 per UI language. Older English-language posts get their Indonesian headline
    // (meta_title) in the default Indonesian view, so the server-rendered H1 is Indonesian; the
    // English view keeps the original title. Indonesian articles use their title in both views.
    const heading = {
        id: lang === 'en' ? item.meta_title || item.title : item.title,
        en: item.title,
    };

    const crumbNode = breadcrumbs(
        [
            { name: 'Beranda', path: '/' },
            { name: 'Berita', path: '/news' },
            { name: heading.id, path },
        ],
        path
    );

    // Only what the client chrome renders (the body is rendered here, on the server, as children).
    const view = {
        slug: item.slug,
        title: item.title,
        heading,
        excerpt: item.excerpt || '',
        category,
        lang,
        author: item.author || SITE_NAME,
        date: published || '',
        updated: updated || '',
        image: item.image || '',
        imageAlt: item.imageAlt || item.title,
        imageWidth: Number(item.imageWidth) || 0,
        imageHeight: Number(item.imageHeight) || 0,
        readingMinutes: Math.max(1, Math.round(words / 200)),
        archived: isArchivedNews(item),
        topic: newsTopic(item),
        links: Array.isArray(item.links) ? item.links : [],
    };

    return (
        <>
            <JsonLd data={[articleNode, crumbNode]} />
            <NewsArticle item={view} headings={articleHeadings(item.content)} related={relatedNews(item, 3)}>
                <ArticleBody item={item} />
            </NewsArticle>
        </>
    );
}
