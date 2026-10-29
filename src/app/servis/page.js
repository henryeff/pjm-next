import JsonLd from '@/components/Seo/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbs, service } from '@/lib/schema';
import { allNews, newsPath } from '@/lib/slugs';
import ServisContent from './ServisContent';

const PATH = '/servis';

export const metadata = buildMetadata({
    title: 'Servis & Bengkel Mesin Tempel Yamaha di Padang',
    description:
        'Semua jenis servis mesin tempel Yamaha di bengkel Toko Tunggal Jaya, Jalan M. Yamin SH No 144, Padang. Senin–Sabtu 08.00–17.00 WIB. WhatsApp +62 878-8282-8232.',
    path: PATH,
});

// Maintenance guides linked from the page (looked up by id, so their URLs follow the news slugs).
const GUIDE_IDS = [
    '5-tips-merawat-mesin-tempel-2026-02-20',
    'panduan-ganti-oli-yamalube-2026-02-19',
    'mesin-tempel-yamaha-2026-02-19',
];

export default function ServisPage() {
    const news = allNews();
    const guides = GUIDE_IDS.map((id) => news.find((n) => n.id === id))
        .filter(Boolean)
        .map((n) => ({ href: newsPath(n), title: n.title }));

    return (
        <>
            {/* Same trail as the visible PageHero breadcrumb. The Service node shares its @id with the
                makesOffer on the Toko Tunggal Jaya Store in the layout's graph. */}
            <JsonLd data={[breadcrumbs([{ name: 'Beranda', path: '/' }, { name: 'Servis & Bengkel' }], PATH), service()]} />
            <ServisContent guides={guides} />
        </>
    );
}
