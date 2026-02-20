export default function LocalBusiness() {
  const json = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Perkasa Jaya Marine",
    "url": "https://perkasajayamarine.com",
    "logo": "https://perkasajayamarine.com/images/logo.png",
    "telephone": "+62 751 36628",
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "Jalan M. Yamin SH No 144",
        "addressLocality": "Padang",
        "addressRegion": "Sumatera Barat",
        "postalCode": "",
        "addressCountry": "ID"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "Jalan Imam Bonjol No. 27D",
        "addressLocality": "Padang",
        "addressRegion": "Sumatera Barat",
        "postalCode": "",
        "addressCountry": "ID"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
