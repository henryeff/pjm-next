import styles from '../../four-strokes/[id]/page.module.css'; // Reuse 4-strokes styles
import Image from 'next/image';
import twoStokesData from '@/data/two-strokes.json';
import Link from 'next/link';

export async function generateStaticParams() {
    return twoStokesData.map((product) => ({
        id: product.id,
    }));
}

export default async function Page({ params }) {
    const { id } = await params;
    const product = twoStokesData.find((p) => p.id === id);

    if (!product) {
        return <div className={styles.container}>Product not found</div>;
    }

    return (
        <div className={styles.container}>
            <Link href="/products/two-strokes" className={styles.backLink}>&larr; Back to 2 Strokes</Link>
            <div className={styles.content}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={500}
                        className={styles.image}
                    />
                </div>
                <div className={styles.details}>
                    <h1 className={styles.title}>{product.name}</h1>
                    <p className={styles.subTitle}>{product.type}</p>

                    <div className={styles.specGrid}>
                        <SpecItem label="Engine Type" value={product.tipeMesin} />
                        <SpecItem label="Displacement" value={product.volume} />
                        <SpecItem label="Bore x Stroke" value={product.diameter} />
                        <SpecItem label="Max RPM" value={product.jangkauan} />
                        <SpecItem label="Compression Ratio" value={product.kompresi} />
                        <SpecItem label="Induction System" value={product.sistemInduksi} />
                        <SpecItem label="Ignition System" value={product.pengapian} />
                        <SpecItem label="Fuel Consumption" value={product.konsumsibb} />
                        <SpecItem label="Gear Ratio" value={product.gigi} />
                        <SpecItem label="Lubrication" value={product.pelumas} />
                        <SpecItem label="Trim System" value={product.trim} />
                        <SpecItem label="Starter System" value={product.starter} />
                        <SpecItem label="Steering" value={product.kemudi} />
                        <SpecItem label="Weight" value={product.berat} />
                        <SpecItem label="Transom Height" value={product.transom} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const SpecItem = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className={styles.specItem}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
        </div>
    )
}
