import m from './motion.module.css';
import { cssMotionVars } from './cssMotion';

const LINE_WRAP_STYLE = { display: 'block', overflow: 'hidden', paddingBottom: '0.06em' };

/**
 * Headline that rises line by line from behind a mask, from the first paint (CSS keyframes, no JS).
 * Opacity is never animated and the text is in the server HTML, so it is LCP- and crawler-safe.
 * Only the home hero uses it. Reduced motion: no animation (motion.module.css).
 * Server-safe: no hooks, no 'use client'.
 */
export default function LineReveal({ lines = [], as = 'h1', className, delay = 0.15, stagger = 0.08 }) {
    const Tag = as;

    return (
        <Tag className={className}>
            {lines.map((line, i) => (
                <span key={i} style={LINE_WRAP_STYLE}>
                    <span className={m.line} style={cssMotionVars({ delay: delay + i * stagger })}>
                        {line}
                    </span>{' '}
                </span>
            ))}
        </Tag>
    );
}
