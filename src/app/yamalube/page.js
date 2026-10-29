import JsonLd from '@/components/Seo/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbs } from '@/lib/schema';
import { allNews, newsPath } from '@/lib/slugs';
import YamalubeContent from './YamalubeContent';

const PATH = '/yamalube';

export const metadata = buildMetadata({
    title: 'Oli Yamalube Mesin Tempel: 2 Tak, 4 Tak & Oli Gardan',
    description:
        'Oli Yamalube untuk mesin tempel Yamaha: oli 2 tak, oli 4 tak 10W-40 dan oli gardan SAE90 GL-4/GL-5, dengan nomor part dan kemasan. Dijual di Padang.',
    path: PATH,
});

// The oil-change guide linked from the intro (looked up by id, so its URL follows the news slug).
const OIL_GUIDE_ID = 'panduan-ganti-oli-yamalube-2026-02-19';

export default function YamalubePage() {
    const guide = allNews().find((n) => n.id === OIL_GUIDE_ID);

    return (
        <>
            <JsonLd data={breadcrumbs([{ name: 'Beranda', path: '/' }, { name: 'Oli Yamalube' }], PATH)} />
            <YamalubeContent oilGuideHref={guide ? newsPath(guide) : null} />
        </>
    );
}
