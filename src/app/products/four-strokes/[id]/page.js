import styles from './page.module.css';
import fourStokesData from '@/data/four-strokes.json';
import Link from 'next/link';
import ProductDetail from '@/components/products/ProductDetail';
import { relatedModels } from '@/components/products/relatedModels';

export async function generateStaticParams() {
    return fourStokesData.map((product) => ({
        id: product.id,
    }));
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = fourStokesData.find((p) => p.id === id);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: `${product.name} - Yamaha 4 Stroke`,
        description: `Spesifikasi Yamaha ${product.name}. Mesin Tempel 4 Tak. ${product.tipeMesin}. Beli di Perkasa Jaya Marine Padang.`,
        openGraph: {
            images: [product.image],
        },
    };
}

export default async function Page({ params }) {
    const { id } = await params;
    const index = fourStokesData.findIndex((p) => p.id === id);
    const product = index === -1 ? null : fourStokesData[index];

    if (!product) {
        return (
            <div className={styles.page}>
                <div className={'container ' + styles.notFound}>
                    <p>Product not found</p>
                    <Link href="/products/four-strokes" className="btn btn-link">&larr; Back to 4 Strokes</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <ProductDetail product={product} series="four" related={relatedModels(fourStokesData, index)} />
        </div>
    );
}
