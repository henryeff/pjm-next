import { SITE_URL } from '@/lib/site';

// Everyone may crawl everything except the API. AI search and assistant crawlers are named
// explicitly so the intent is clear (a named group replaces '*' for that bot, so it repeats the rules).
const AI_CRAWLERS = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-SearchBot',
    'Claude-User',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
];

export default function robots() {
    return {
        rules: [
            { userAgent: '*', allow: '/', disallow: '/api/' },
            { userAgent: AI_CRAWLERS, allow: '/', disallow: '/api/' },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
