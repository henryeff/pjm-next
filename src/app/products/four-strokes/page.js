import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import fourStokesData from '@/data/four-strokes.json';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';

export const metadata = {
    title: '4 Strokes - Mesin Tempel 4 Tak',
    description: 'Jual Mesin Tempel Yamaha 4 Tak (4-Strokes). Irit bahan bakar, ramah lingkungan, dan bertenaga. Yamaha 4-Stroke Outboards dealer.',
};

export default function FourStrokesPage() {
    return (
        <div className={styles.container}>
            <Reveal as="header" className={styles.pageHeader}>
                <span className={styles.kicker} aria-hidden="true" />
                <h1 className={styles.pageTitle}>4 Strokes Outboards</h1>
                <p className={styles.intro}>Experience the pinnacle of marine engineering with Yamaha's 4-stroke lineup. Cleaner, Quieter, Stronger.</p>
            </Reveal>

            <StaggerGroup className={styles.grid} stagger={0.08} amount={0.1}>
                {fourStokesData.map((product) => (
                    <StaggerItem key={product.id} className={styles.card}>
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
                                <svg className={styles.specIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M6 7h8l4 4v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                                    <path d="M9 11h4M9 14h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                                <span>{product.tipeMesin}</span>
                            </div>
                            <Link href={`/products/four-strokes/${product.id}`} className={styles.detailsBtn}>
                                <span>View Details</span>
                                <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>
                    </StaggerItem>
                ))}
            </StaggerGroup>
        </div>
    );
}
