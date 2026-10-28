'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Reveal, { EASE_OUT } from '@/components/motion/Reveal';
import ContourLines from './ContourLines';
import Eyebrow from './Eyebrow';
import styles from './PageHero.module.css';

/**
 * Left-aligned page opener on navy (optionally over a photo with a scrim).
 *
 * size: 'compact' | 'default' | 'tall'
 * breadcrumbs: [{ label, href? }] — the last item is the current page.
 * children: the actions slot (buttons).
 *
 * image / imageAlt / imagePosition / imagePositionMobile: the background photo (LCP, priority).
 * imagePositionTablet: optional object-position for 768-1023px (portrait tablets), when neither the
 *   desktop nor the phone position frames the subject clear of the text there. Defaults to imagePosition.
 *   Phones (≤767px): a photo hero becomes a "photo band" — the photo sits across the top, fades into the
 *   navy, and the text starts below it, so type is never laid over the photo on phones. No scrim there.
 * bandHeight: phone band height (CSS length or px number). Default min(72vw, 320px).
 * scrim: 'default' | 'strong' — ≥768px only. 'strong' (--scrim-left-strong) for bright photos that
 *   leave the text column on light areas.
 * figure: ReactNode for a right-hand media slot (product listing heroes: an engine Cutout on the
 *   navy). ≥1024px only, decorative (aria-hidden); the content column narrows beside it.
 * No image: the bathymetric ContourLines signature fills the right of the navy.
 *
 * Motion: the photo settles 1.06 → 1; the title slides up 16px but never fades (LCP-safe);
 * eyebrow / lead / actions rise in on mount. The figure slot is static — animate inside it with a
 * transform-only entrance if it holds the LCP image.
 */
export default function PageHero({
    eyebrow,
    title,
    lead,
    image,
    imageAlt = '',
    imagePosition = '50% 50%',
    imagePositionMobile,
    imagePositionTablet,
    bandHeight,
    scrim = 'default',
    figure,
    breadcrumbs,
    size = 'default',
    titleAs = 'h1',
    children,
}) {
    const TitleTag = motion[titleAs] || motion.h1;
    const sizeClass = styles[size] || styles.default;
    const sectionClass = [
        'on-dark',
        styles.hero,
        sizeClass,
        image ? styles.hasImage : '',
        image && scrim === 'strong' ? styles.scrimStrong : '',
        figure ? styles.hasFigure : '',
    ]
        .filter(Boolean)
        .join(' ');

    let heroStyle;
    if (image) {
        heroStyle = {
            '--pos': imagePosition,
            '--pos-t': imagePositionTablet || imagePosition,
            '--pos-m': imagePositionMobile || imagePosition,
        };
        if (bandHeight !== undefined && bandHeight !== null && bandHeight !== '') {
            heroStyle['--band-h'] = typeof bandHeight === 'number' ? bandHeight + 'px' : bandHeight;
        }
    }

    return (
        <section className={sectionClass} style={heroStyle}>
            {image ? (
                <>
                    <motion.div
                        className={styles.media}
                        initial={{ scale: 1.06 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.6, ease: EASE_OUT }}
                    >
                        <Image
                            src={image}
                            alt={imageAlt}
                            fill
                            priority
                            sizes="(max-width: 767px) 180vw, 100vw"
                            className={styles.img}
                        />
                    </motion.div>
                    <div className={styles.scrim} aria-hidden="true" />
                </>
            ) : (
                <ContourLines />
            )}

            {figure && (
                <div className={styles.figure} aria-hidden="true">
                    {figure}
                </div>
            )}

            <div className={'container ' + styles.inner}>
                <div className={styles.content}>
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
                            <ol>
                                {breadcrumbs.map((crumb, i) => {
                                    const isLast = i === breadcrumbs.length - 1;
                                    return (
                                        <li key={(crumb.href || '') + i}>
                                            {crumb.href && !isLast ? (
                                                <Link href={crumb.href}>{crumb.label}</Link>
                                            ) : (
                                                <span aria-current={isLast ? 'page' : undefined}>{crumb.label}</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ol>
                        </nav>
                    )}

                    {eyebrow && (
                        <Reveal immediate delay={0.05} y={12}>
                            <Eyebrow immediate>{eyebrow}</Eyebrow>
                        </Reveal>
                    )}

                    <TitleTag
                        className={'h1 ' + styles.title}
                        initial={{ y: 16 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, ease: EASE_OUT }}
                    >
                        {title}
                    </TitleTag>

                    {lead && (
                        <Reveal immediate delay={0.15}>
                            <p className={styles.lead}>{lead}</p>
                        </Reveal>
                    )}

                    {children && (
                        <Reveal immediate delay={0.25} className={styles.actions}>
                            {children}
                        </Reveal>
                    )}
                </div>
            </div>
        </section>
    );
}
