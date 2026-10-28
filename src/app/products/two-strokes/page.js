import styles from '../four-strokes/page.module.css'; // Reusing styles
import twoStrokesData from '@/data/two-strokes.json';
import ProductGrid from '@/components/products/ProductGrid';

export const metadata = {
    title: '2 Strokes - Mesin Tempel 2 Tak',
    description: 'Jual Mesin Tempel Yamaha 2 Tak (2-Strokes). Tangguh, mudah perawatan, dan terpercaya. Yamaha Enduro series available.',
};

// Only what the cards need goes to the client.
const products = twoStrokesData.map(({ id, name, image, tipeMesin }) => ({ id, name, image, tipeMesin }));

export default function TwoStrokesPage() {
    return (
        <div className={styles.page}>
            <ProductGrid products={products} series="two" />
        </div>
    );
}
