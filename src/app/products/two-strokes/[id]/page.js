import styles from '../../four-strokes/[id]/page.module.css'; // Reuse 4-strokes styles
import Image from 'next/image';
import twoStokesData from '@/data/two-strokes.json';
import Link from 'next/link';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';

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

export default async function Page({ params }) {
    const { id } = await params;
    const product = twoStokesData.find((p) => p.id === id);

    if (!product) {
        return <div className={styles.container}>Product not found</div>;
    }

    const specs = [
        { label: 'Engine Type', value: product.tipeMesin },
        { label: 'Displacement', value: product.volume },
        { label: 'Bore x Stroke', value: product.diameter },
        { label: 'Max RPM', value: product.jangkauan },
        { label: 'Compression Ratio', value: product.kompresi },
        { label: 'Induction System', value: product.sistemInduksi },
        { label: 'Ignition System', value: product.pengapian },
        { label: 'Fuel Consumption', value: product.konsumsibb },
        { label: 'Gear Ratio', value: product.gigi },
        { label: 'Lubrication', value: product.pelumas },
        { label: 'Trim System', value: product.trim },
        { label: 'Starter System', value: product.starter },
        { label: 'Steering', value: product.kemudi },
        { label: 'Weight', value: product.berat },
        { label: 'Transom Height', value: product.transom },
    ].filter((spec) => spec.value);

    return (
        <div className={styles.container}>
            <Link href="/products/two-strokes" className={styles.backLink}>&larr; Back to 2 Strokes</Link>
            <div className={styles.content}>
                <Reveal className={styles.imageWrapper} amount={0.3}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={500}
                        className={styles.image}
                    />
                </Reveal>
                <Reveal as="div" className={styles.details} delay={0.1} amount={0.3}>
                    <h1 className={styles.title}>{product.name}</h1>
                    <p className={styles.subTitle}>{product.type}</p>

                    <StaggerGroup as="div" className={styles.specGrid} stagger={0.04} amount={0.1}>
                        {specs.map((spec) => (
                            <StaggerItem as="div" key={spec.label} className={styles.specItem}>
                                <span className={styles.label}>{spec.label}</span>
                                <span className={styles.value}>{spec.value}</span>
                            </StaggerItem>
                        ))}
                    </StaggerGroup>
                </Reveal>
            </div>
        </div>
    );
}
