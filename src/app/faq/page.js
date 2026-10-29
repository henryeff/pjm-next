import JsonLd from '@/components/Seo/JsonLd';
import { hpRange } from '@/components/ui/productUtils';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbs, faq } from '@/lib/schema';
import { allNews, newsPath, productsOf } from '@/lib/slugs';
import FaqContent from './FaqContent';
import { faqForSchema } from './faqData';

const PATH = '/faq';

export const metadata = buildMetadata({
    title: 'Tanya Jawab (FAQ) Mesin Tempel Yamaha di Padang',
    description:
        'Tanya jawab Perkasa Jaya Marine: lokasi, jam buka, WhatsApp, cara tanya harga, servis, mesin tempel Yamaha 2 tak & 4 tak, suku cadang asli dan oli Yamalube.',
    path: PATH,
});

// Guides the answers link to, looked up by id (their URLs follow the news slugs).
const GUIDES = { choose: 'cara-memilih-mesin-tempel-2026-02-19', compare: '2tak-vs-4tak-yamaha-2026-02-19' };

/** Data-dependent bits of the answers, computed on the server so the client never bundles the JSON. */
function faqContext() {
    const news = allNews();
    const href = (id) => {
        const item = news.find((n) => n.id === id);
        return item ? newsPath(item) : null;
    };
    return {
        ranges: { two: hpRange(productsOf('two')), four: hpRange(productsOf('four')) },
        guides: { choose: href(GUIDES.choose), compare: href(GUIDES.compare) },
    };
}

export default function FaqPage() {
    const ctx = faqContext();

    return (
        <>
            {/* FAQPage answers are the Indonesian text exactly as rendered (the server-rendered language). */}
            <JsonLd data={[breadcrumbs([{ name: 'Beranda', path: '/' }, { name: 'Tanya Jawab (FAQ)' }], PATH), faq(faqForSchema('id', ctx))]} />
            <FaqContent ctx={ctx} />
        </>
    );
}
