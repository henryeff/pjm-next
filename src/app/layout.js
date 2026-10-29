import Navbar from '@/components/layout/Navbar';
import Script from 'next/script';
import { Montserrat } from 'next/font/google';
import Footer from '@/components/layout/Footer';
import "./globals.css";

import Providers from '@/components/Providers';
import JsonLd from '@/components/Seo/JsonLd';
import { organization, stores, website } from '@/lib/schema';
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, DEFAULT_TITLE } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';

// Variable Montserrat (no weight list = full 100–900 axis), so 300 and 800 are real cuts.
const montserrat = Montserrat({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });

// Site defaults. Every page sets its own title, description, canonical and openGraph through
// buildMetadata() in '@/lib/seo' — so no canonical and no og:url here (pages would inherit them).
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'mesin tempel Yamaha',
    'dealer resmi Yamaha Marine',
    'mesin tempel Padang',
    'suku cadang asli Yamaha',
    'oli Yamalube',
    'servis mesin tempel',
    'bengkel mesin tempel Padang',
    'Yamaha outboard',
    'Perkasa Jaya Marine',
    'Toko Tunggal Jaya',
    'Padang',
    'Sumatera Barat',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    alternateLocale: ['en_US'],
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: '#001e3d',
};

// No-JS safety net: below-the-fold reveals start hidden (opacity 0 / clip-path) until they scroll
// into view. Without JavaScript they would never show, so show them. (Above-the-fold content never
// starts hidden — see components/motion/Reveal.js.)
const NOSCRIPT_CSS =
  '[style*="opacity:0;"],[style$="opacity:0"]{opacity:1!important;transform:none!important}' +
  '[style*="inset(0% 0% 100% 0%)"]{clip-path:none!important}';

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={montserrat.variable}>
      <head>
        <noscript>
          <style>{NOSCRIPT_CSS}</style>
        </noscript>
        {/* Organization + WebSite + both Stores (site-wide structured data). */}
        <JsonLd data={[organization(), website(), ...stores()]} />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main id="main" style={{ minHeight: 'calc(100svh - var(--nav-h))' }}>
            {children}
          </main>
          <Footer />
        </Providers>

        {/* Google Analytics — lazyOnload: fetched after the page has loaded, during idle time, so it
            never competes with the LCP image or hydration (and is not preloaded in <head>). */}
        <Script strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-1LQ6YR0ST1" />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1LQ6YR0ST1');
          `}
        </Script>
      </body>
    </html>
  );
}
