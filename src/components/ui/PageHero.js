'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Reveal, { EASE_OUT } from '@/components/motion/Reveal';
import Eyebrow from './Eyebrow';
import styles from './PageHero.module.css';

/**
 * Left-aligned page opener on navy (optionally over a photo with a scrim).
 *
 * size: 'compact' | 'default' | 'tall'
 * breadcrumbs: [{ label, href? }] — the last item is the current page.
 * children: the actions slot (buttons).
 *
 * Motion: the photo settles 1.06 → 1; the title slides up 16px but never fades (LCP-safe);
 * eyebrow / lead / actions rise in on mount.
 */
export default function PageHero({
    eyebrow,
    title,
    lead,
    image,
    imageAlt = '',
    imagePosition = '50% 50%',
    imagePositionMobile,
    breadcrumbs,
    size = 'default',
    titleAs = 'h1',
    children,
}) {
    const TitleTag = motion[titleAs] || motion.h1;
    const sizeClass = styles[size] || styles.default;
    const sectionClass = ['on-dark', styles.hero, sizeClass].join(' ');
    const posStyle = image ? { '--pos': imagePosition, '--pos-m': imagePositionMobile || imagePosition } : undefined;

    return (
        <section className={sectionClass} style={posStyle}>
            {image && (
                <>
                    <motion.div
                        className={styles.media}
                        initial={{ scale: 1.06 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.6, ease: EASE_OUT }}
                    >
                        <Image src={image} alt={imageAlt} fill priority sizes="100vw" className={styles.img} />
                    </motion.div>
                    <div className={styles.scrim} aria-hidden="true" />
                </>
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
