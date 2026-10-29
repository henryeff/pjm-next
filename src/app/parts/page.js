import JsonLd from '@/components/Seo/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbs } from '@/lib/schema';
import PartsContent from './PartsContent';

const PATH = '/parts';

export const metadata = buildMetadata({
    title: 'Suku Cadang Asli Mesin Tempel Yamaha di Padang',
    description:
        'Suku cadang asli Yamaha untuk mesin tempel Yamaha di Padang. Kirim model mesin dan nomor seri lewat WhatsApp +62 878-8282-8232 untuk harga dan ketersediaan.',
    path: PATH,
});

export default function PartsPage() {
    return (
        <>
            <JsonLd data={breadcrumbs([{ name: 'Beranda', path: '/' }, { name: 'Suku Cadang Asli' }], PATH)} />
            <PartsContent />
        </>
    );
}
