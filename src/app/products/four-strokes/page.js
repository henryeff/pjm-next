import styles from './page.module.css';
import { ListingPage, listingMetadata } from '@/components/products/listingPage';

export const metadata = listingMetadata('four');

export default function FourStrokesPage() {
    return (
        <div className={styles.page}>
            <ListingPage series="four" />
        </div>
    );
}
