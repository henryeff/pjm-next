import styles from '../four-strokes/page.module.css'; // Reusing the 4-stroke listing styles
import { ListingPage, listingMetadata } from '@/components/products/listingPage';

export const metadata = listingMetadata('two');

export default function TwoStrokesPage() {
    return (
        <div className={styles.page}>
            <ListingPage series="two" />
        </div>
    );
}
