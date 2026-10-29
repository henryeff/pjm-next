import JsonLd from '@/components/Seo/JsonLd';
import { STORES } from '@/components/ui/stores';
import { buildMetadata } from '@/lib/seo';
import { absUrl, breadcrumbs, ORG_ID, storeId, WEBSITE_ID } from '@/lib/schema';
import ContactContent from './ContactContent';

const PATH = '/contact';

export const metadata = buildMetadata({
    title: 'Alamat & Kontak Dealer Yamaha Marine di Padang',
    description:
        'Alamat, telepon, WhatsApp dan jam buka Perkasa Jaya Marine (Jalan Imam Bonjol No. 27D) dan Toko Tunggal Jaya (Jalan M. Yamin SH No 144), Padang.',
    path: PATH,
});

export default function ContactPage() {
    const url = absUrl(PATH);
    // The two Store nodes themselves are site-wide (root layout); this page points at them.
    const contactPage = {
        '@type': 'ContactPage',
        '@id': `${url}#webpage`,
        url,
        name: 'Alamat & Kontak Perkasa Jaya Marine',
        inLanguage: 'id-ID',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': ORG_ID },
        mainEntity: STORES.map((s) => ({ '@id': storeId(s.id) })),
    };

    return (
        <>
            <JsonLd data={[breadcrumbs([{ name: 'Beranda', path: '/' }, { name: 'Kontak' }], PATH), contactPage]} />
            <ContactContent />
        </>
    );
}
