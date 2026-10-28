import styles from '../../four-strokes/[id]/page.module.css'; // Reuse 4-strokes styles
import twoStokesData from '@/data/two-strokes.json';
import Link from 'next/link';
import ProductDetail from '@/components/products/ProductDetail';

export async function generateStaticParams() {
    return twoStokesData.map((product) => ({
        id: product.id,
    }));
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = twoStokesData.find((p) => p.id === id);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: `${product.name} - Yamaha 2 Stroke`,
        description: `Spesifikasi Yamaha ${product.name}. Mesin Tempel 2 Tak (Enduro). ${product.tipeMesin}. Tangguh dan Handal. Beli di Perkasa Jaya Marine Padang.`,
        openGraph: {
            images: [product.image],
        },
    };
}

// Neighbours in JSON order, trimmed to what the prev / next cards show.
const pick = (p) => (p ? { id: p.id, name: p.name, image: p.image } : null);

export default async function Page({ params }) {
    const { id } = await params;
    const index = twoStokesData.findIndex((p) => p.id === id);
    const product = index === -1 ? null : twoStokesData[index];

    if (!product) {
        return (
            <div className={styles.page}>
                <div className={'container ' + styles.notFound}>
                    <p>Product not found</p>
                    <Link href="/products/two-strokes" className="btn btn-link">&larr; Back to 2 Strokes</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <ProductDetail
                product={product}
                series="two"
                prev={pick(twoStokesData[index - 1])}
                next={pick(twoStokesData[index + 1])}
            />
        </div>
    );
}
