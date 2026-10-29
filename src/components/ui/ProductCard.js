'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Cutout from './Cutout';
import { ArrowRight } from './Icons';
import { productHref } from '@/lib/paths';
import { engineAlt, getHp, localizeSpec } from './productUtils';
import styles from './ProductCard.module.css';

const COPY = {
    id: { view: 'Lihat detail', unit: 'PK' },
    en: { view: 'View details', unit: 'HP' },
};

/**
 * Model code with safe line breaks: the only preferred break is after a "/"
 * (e.g. "F300BET/" + "FL300BET-300PK"), and the "-NNPK" suffix stays glued to
 * the inline arrow, so a code never splits mid-token on narrow phone cards.
 */
function ModelName({ name }) {
    const match = name.match(/^(.*?)(-\d+(?:\.\d+)?PK)$/i);
    const head = match ? match[1] : name;
    const suffix = match ? match[2] : '';
    const parts = head.split('/');

    return (
        <>
            {parts.map((part, i) => (
                <span key={i}>
                    {part}
                    {i < parts.length - 1 && <>/<wbr /></>}
                </span>
            ))}
            <span className={styles.suffix}>
                {suffix}
                {/* Phones: the footer row is hidden and this arrow marks the card as a link. */}
                <ArrowRight size={14} aria-hidden="true" className={styles.inlineArrow} />
            </span>
        </>
    );
}

/*
 * Image `sizes` for a card: the engine is drawn inside a square stage with 10% padding (80% of the
 * card) and the cut-outs are portrait (width ≈ 0.65–0.89 × height), so the rendered engine is about
 * 0.52–0.71 × the CARD width. Callers pass ~0.6 × their card width (the common 0.65 files fit; the few
 * wider files still get a candidate at least their displayed width on 2× screens).
 */

/**
 * One engine as a single link card: lit stage + big HP numeral + model code.
 * series: 'four' | 'two' (decides the detail URL). product: { name, image, tipeMesin, slug? } — the
 *   link uses product.slug (from '@/lib/slugs'), else the slugified model name (same result today).
 * Wrap it in a StaggerItem if you want an entrance — the card's own hover lift lives on the <a>.
 * sizes: the RENDERED ENGINE width (about 0.6 × the card width, see above), not the card.
 *   The default suits a 2-column phone / 4-column desktop grid.
 * priority / fetchPriority: pass to the first card(s) of a listing — their engine is the LCP image on
 *   phones and tablets. Off by default (Home's lineup is below the fold).
 */
export default function ProductCard({
    product,
    series = 'four',
    headingLevel = 'h3',
    sizes = '(max-width: 899px) 28vw, (max-width: 1199px) 15vw, 172px',
    priority = false,
    fetchPriority,
}) {
    const { language } = useLanguage();
    const lang = language === 'en' ? 'en' : 'id';
    const t = COPY[lang];
    const Heading = headingLevel;
    const hp = getHp(product.name);

    return (
        <Link href={productHref(series, product)} className={styles.card}>
            <div className={'stage-light floor-shadow ' + styles.stage}>
                <Cutout
                    src={product.image}
                    alt={engineAlt(product, lang)}
                    sizes={sizes}
                    priority={priority}
                    fetchPriority={fetchPriority}
                    className={styles.cutout}
                />
            </div>

            <div className={styles.body}>
                {hp && (
                    <p className={styles.hp}>
                        <span className={styles.hpNum}>{hp}</span>
                        <span className={styles.hpUnit}>{t.unit}</span>
                    </p>
                )}
                <Heading className={styles.model}>
                    <ModelName name={product.name} />
                </Heading>
                {product.tipeMesin && <p className={styles.type}>{localizeSpec(product.tipeMesin, lang)}</p>}

                <span className={styles.footer}>
                    <span className={styles.more}>{t.view}</span>
                    <ArrowRight size={16} className={styles.arrow} />
                </span>
            </div>
        </Link>
    );
}
