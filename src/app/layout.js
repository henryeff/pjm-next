import Navbar from '@/components/layout/Navbar';
import Script from 'next/script';
import { Montserrat } from 'next/font/google';
import Footer from '@/components/layout/Footer';
import "./globals.css";

import Providers from '@/components/Providers';
import LocalBusiness from '@/components/Seo/LocalBusiness';

// Variable Montserrat (no weight list = full 100–900 axis), so 300 and 800 are real cuts.
const montserrat = Montserrat({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });

export const metadata = {
  metadataBase: new URL('https://perkasajayamarine.com'),
  title: {
    default: "Perkasa Jaya Marine - Yamaha Marine Dealer Padang (Dealer Resmi)",
    template: "%s | Perkasa Jaya Marine",
  },
  description: "Authorized Yamaha Outboard Dealer in Padang, West Sumatra. Jual Mesin Tempel Yamaha, Suku Cadang Asli, dan Yamalube. Service Center & Spareparts Terlengkap.",
  keywords: ['Yamaha', 'Outboard', 'Marine', 'Mesin Tempel', 'Suku Cadang', 'Spare Parts', 'Yamalube', 'Padang', 'Sumatera Barat', 'Indonesia', 'Perkasa Jaya Marine', 'Toko Tunggal Jaya', 'Jual Mesin Tempel', 'Bengkel Yamaha Marine'],
  authors: [{ name: 'Perkasa Jaya Marine' }],
  creator: 'Perkasa Jaya Marine',
  publisher: 'Perkasa Jaya Marine',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    alternateLocale: 'en_US',
    url: 'https://perkasajayamarine.com',
    title: 'Perkasa Jaya Marine - Yamaha Marine Dealer Padang',
    description: 'Distributor Resmi Yamaha Marine di Padang. Jual Mesin Tempel, Sparepart, dan Service. Authorized Dealer for Yamaha Outboards in West Sumatra.',
    siteName: 'Perkasa Jaya Marine',
    images: [
      {
        url: '/images/logo.png', // Using logo as fallback for now
        width: 800,
        height: 600,
        alt: 'Perkasa Jaya Marine Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perkasa Jaya Marine - Authorized Yamaha Marine Dealer',
    description: 'Authorized Yamaha Marine Dealer in Padang, West Sumatra.',
    images: ['/images/logo.png'],
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        {/* Google Analytics - load afterInteractive for quicker capture */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-1LQ6YR0ST1"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());

            gtag('config', 'G-1LQ6YR0ST1');
          `}
        </Script>

        {/* LocalBusiness JSON-LD component */}
        <LocalBusiness />
      </head>
      <body>
        <Providers>
          <a href="#main" className="skip-link">Skip to content</a>
          <Navbar />
          <main id="main" style={{ minHeight: 'calc(100svh - var(--nav-h))' }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
