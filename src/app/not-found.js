import NotFoundContent from '@/components/layout/NotFoundContent';

// Real 404 status (Next sets it). noindex; the title replaces the layout default.
export const metadata = {
    title: 'Halaman tidak ditemukan',
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return <NotFoundContent />;
}
