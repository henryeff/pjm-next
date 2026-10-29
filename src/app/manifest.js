import { LOGO, SITE_NAME } from '@/lib/site';

// Web app manifest (/manifest.webmanifest): name, colours and square icons for home-screen installs.
export default function manifest() {
    return {
        name: `${SITE_NAME} – Dealer Resmi Yamaha Marine Padang`,
        short_name: 'PJM',
        description: 'Dealer resmi Yamaha Marine di Padang: mesin tempel Yamaha, suku cadang asli, oli Yamalube, dan servis.',
        lang: 'id',
        start_url: '/',
        display: 'browser',
        background_color: '#ffffff',
        theme_color: '#001e3d',
        icons: [
            { src: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: LOGO.url, sizes: `${LOGO.width}x${LOGO.height}`, type: 'image/png' },
        ],
    };
}
