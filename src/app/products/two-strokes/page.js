import styles from '../four-strokes/page.module.css'; // Reusing styles
import Link from 'next/link';
import Image from 'next/image';
import twoStrokesData from '@/data/two-strokes.json';

export default function TwoStrokesPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>2 Strokes Outboards</h1>
            <p className={styles.intro}>Proven reliability and easy maintenance. The choice of professionals for decades.</p>

            <div className={styles.grid}>
                {twoStrokesData.map((product) => (
                    <div key={product.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={300}
                                height={300}
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.content}>
                            <h2 className={styles.productName}>{product.name}</h2>
                            <div className={styles.specs}>
                                <span>{product.tipeMesin}</span>
                            </div>
                            <Link href={`/products/two-strokes/${product.id}`} className={styles.detailsBtn}>View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
