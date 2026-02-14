import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import fourStokesData from '@/data/four-strokes.json';

export default function FourStrokesPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>4 Strokes Outboards</h1>
            <p className={styles.intro}>Experience the pinnacle of marine engineering with Yamaha's 4-stroke lineup. Cleaner, Quieter, Stronger.</p>

            <div className={styles.grid}>
                {fourStokesData.map((product) => (
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
                            <Link href={`/products/four-strokes/${product.id}`} className={styles.detailsBtn}>View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
