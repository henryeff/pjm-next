import NewsContent from './NewsContent';
import JsonLd from '@/components/Seo/JsonLd';
import { newsCards } from '@/components/news/newsServer';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbs, itemList } from '@/lib/schema';
import { newsHref } from '@/lib/paths';

export const metadata = buildMetadata({
    title: 'Berita & Panduan Mesin Tempel Yamaha',
    description:
        'Berita dan panduan mesin tempel Yamaha dari Perkasa Jaya Marine, Padang: cara memilih, 2 tak vs 4 tak, ganti oli Yamalube, dan tips perawatan.',
    path: '/news',
});

export default function NewsPage() {
    // Card fields only (no article bodies), newest first — the client page never bundles news.json.
    const items = newsCards();

    return (
        <>
            <JsonLd
                data={[
                    breadcrumbs(
                        [
                            { name: 'Beranda', path: '/' },
                            { name: 'Berita', path: '/news' },
                        ],
                        '/news'
                    ),
                    itemList(
                        items.map((item) => ({ name: item.title, path: newsHref(item), image: item.image })),
                        { name: 'Berita & Panduan Mesin Tempel Yamaha' }
                    ),
                ]}
            />
            <NewsContent items={items} />
        </>
    );
}
