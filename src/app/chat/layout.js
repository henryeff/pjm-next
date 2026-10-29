import { buildMetadata } from '@/lib/seo';

// /chat is a tool, not content: noindex (follow), and a canonical of /chat so the ~34 internally
// linked /chat?q=… variants collapse into one URL. It is kept out of the sitemap (src/app/sitemap.js)
// but not blocked in robots.txt, so crawlers can see the noindex. page.js is a client component and
// cannot export metadata, hence this layout.
export const metadata = buildMetadata({
    title: 'Chat dengan Pevita – Asisten Virtual Perkasa Jaya Marine',
    description:
        'Tanya Pevita, asisten virtual Perkasa Jaya Marine, tentang mesin tempel Yamaha, suku cadang asli, oli Yamalube, servis, jam buka dan lokasi toko di Padang.',
    path: '/chat',
    noindex: true,
});

export default function ChatLayout({ children }) {
    return children;
}
