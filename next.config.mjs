import { readFileSync } from 'node:fs';
import { legacyProductRedirects } from './src/lib/slugify.mjs';

const readJson = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));

// Old numeric engine URLs (/products/two-strokes/8) → model-name slugs (/products/two-strokes/e40gmh-40pk).
// Built from the same JSON and the same slug helper as the app (src/lib/slugs.js).
const productRedirects = legacyProductRedirects({
  four: readJson('./src/data/four-strokes.json'),
  two: readJson('./src/data/two-strokes.json'),
});

const WEEK = 60 * 60 * 24 * 7;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    // Optimised images stay cached for a week (Next 16's default is 4 hours).
    minimumCacheTTL: WEEK,
  },

  async redirects() {
    return [
      ...productRedirects,
      // There is no /products hub page: send it to the 4-stroke range (temporary, so a hub can come later).
      { source: '/products', destination: '/products/four-strokes', permanent: false },
    ];
  },

  async headers() {
    return [
      {
        // Files in public/images: browsers may reuse them for a week, then revalidate in the background.
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: `public, max-age=${WEEK}, stale-while-revalidate=86400` }],
      },
    ];
  },
};

export default nextConfig;
