import styles from './page.module.css';
import { EngineDetail, engineMetadata } from '@/components/products/enginePage';
import { productStaticParams } from '@/lib/slugs';

// Every engine is generated at build time from four-strokes.json; any other slug is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
    return productStaticParams('four');
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    return engineMetadata('four', slug);
}

export default async function Page({ params }) {
    const { slug } = await params;
    return (
        <div className={styles.page}>
            <EngineDetail series="four" slug={slug} />
        </div>
    );
}
