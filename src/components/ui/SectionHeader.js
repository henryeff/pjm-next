import Link from 'next/link';
import Reveal from '@/components/motion/Reveal';
import Eyebrow from './Eyebrow';
import { ArrowRight } from './Icons';
import styles from './SectionHeader.module.css';

/**
 * Section opener: eyebrow + h2 (+ lead) on the left, optional "see all" link on the right.
 * Inherits colour, so it works on light sections and inside `.on-dark`.
 *
 * action: { label, href }
 * size: 'default' | 'sm' — 'sm' is a smaller h2 and tighter margin for utility sections
 *   (stores, latest news, the home 2-up). Still eyebrow + h2.
 */
export default function SectionHeader({
    eyebrow,
    title,
    lead,
    action,
    align = 'left',
    titleAs = 'h2',
    id,
    size = 'default',
    className,
}) {
    const TitleTag = titleAs;
    const rootClass = [
        styles.header,
        align === 'center' ? styles.center : '',
        size === 'sm' ? styles.sm : '',
        className || '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <header className={rootClass}>
            <Reveal className={styles.text}>
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                {title && (
                    <TitleTag id={id} className={'h2 ' + styles.title}>
                        {title}
                    </TitleTag>
                )}
                {lead && <p className={'lead ' + styles.lead}>{lead}</p>}
            </Reveal>
            {action && action.href && (
                <Reveal className={styles.action} delay={0.1}>
                    <Link href={action.href} className="btn btn-link">
                        {action.label}
                        <ArrowRight className="btn-arrow" />
                    </Link>
                </Reveal>
            )}
        </header>
    );
}
