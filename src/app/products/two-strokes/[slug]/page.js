import styles from '../../four-strokes/[slug]/page.module.css'; // Reuse the 4-stroke engine page styles
import { EngineDetail, engineMetadata } from '@/components/products/enginePage';
import { productStaticParams } from '@/lib/slugs';

// Every engine is generated at build time from two-strokes.json; any other slug is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
    return productStaticParams('two');
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    return engineMetadata('two', slug);
}

export default async function Page({ params }) {
    const { slug } = await params;
    return (
        <div className={styles.page}>
            <EngineDetail series="two" slug={slug} />
        </div>
    );
}
