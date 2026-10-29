import JsonLd from '@/components/Seo/JsonLd';
import { hpRange } from '@/components/ui/productUtils';
import { buildMetadata } from '@/lib/seo';
import { absUrl, breadcrumbs, ORG_ID, WEBSITE_ID } from '@/lib/schema';
import { allNews, newsPath, productsOf } from '@/lib/slugs';
import AboutContent from './AboutContent';

const PATH = '/about';

export const metadata = buildMetadata({
    title: 'Tentang Perkasa Jaya Marine – Dealer Resmi Yamaha Marine Padang',
    description:
        'Profil Perkasa Jaya Marine, dealer resmi Yamaha Marine di Padang: mesin tempel Yamaha 2 tak & 4 tak, suku cadang asli, oli Yamalube, dan bengkel servis.',
    path: PATH,
});

// The 2021 Pemprov Sumbar outboard project (news id 2), cited in the story.
const PEMPROV_NEWS_ID = '2';

export default function AboutPage() {
    const two = productsOf('two');
    const four = productsOf('four');
    const pemprov = allNews().find((n) => String(n.id) === PEMPROV_NEWS_ID);

    const ranges = {
        two: { ...hpRange(two), count: two.length },
        four: { ...hpRange(four), count: four.length },
    };

    const url = absUrl(PATH);
    const aboutPage = {
        '@type': 'AboutPage',
        '@id': `${url}#webpage`,
        url,
        name: 'Tentang Perkasa Jaya Marine',
        inLanguage: 'id-ID',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': ORG_ID },
        mainEntity: { '@id': ORG_ID },
    };

    return (
        <>
            <JsonLd data={[breadcrumbs([{ name: 'Beranda', path: '/' }, { name: 'Tentang Kami' }], PATH), aboutPage]} />
            <AboutContent ranges={ranges} pemprovHref={pemprov ? newsPath(pemprov) : null} />
        </>
    );
}
