import styles from './page.module.css';
import fourStokesData from '@/data/four-strokes.json';
import ProductGrid from '@/components/products/ProductGrid';

export const metadata = {
    title: '4 Strokes - Mesin Tempel 4 Tak',
    description: 'Jual Mesin Tempel Yamaha 4 Tak (4-Strokes). Irit bahan bakar, ramah lingkungan, dan bertenaga. Yamaha 4-Stroke Outboards dealer.',
};

// Only what the cards need goes to the client.
const products = fourStokesData.map(({ id, name, image, tipeMesin }) => ({ id, name, image, tipeMesin }));

export default function FourStrokesPage() {
    return (
        <div className={styles.page}>
            <ProductGrid products={products} series="four" />
        </div>
    );
}
