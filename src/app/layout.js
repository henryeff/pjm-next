import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import "./globals.css";

import Providers from '@/components/Providers';

export const metadata = {
  title: "Perkasa Jaya Marine - Yamaha Outboard Specialist",
  description: "Your trusted partner for Yamaha Marine products in Padang.",
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
