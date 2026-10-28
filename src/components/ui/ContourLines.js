import styles from './ContourLines.module.css';

/*
 * Bathymetric contour lines — the brand signature on navy surfaces that have no photo
 * (PageHero without an image, CtaBand, …). Generated once at module load; no dependencies.
 *
 * 11 lines across a 1200×600 field. Line i rests at y = 30 + 52i and is shaped by two sine waves,
 * sampled every 20px from x = -40 to 1240. Every 4th line is an "index contour", 1.6× stronger.
 * STATIC by design (motion budget; low-end Android) — never animate it.
 */
const LINES = Array.from({ length: 11 }, (_, i) => {
    const baseY = 30 + i * 52;
    const points = [];
    for (let x = -40; x <= 1240; x += 20) {
        const y = baseY + 28 * Math.sin(x / 180 + i * 0.45) + 12 * Math.sin(x / 70 + i * 1.3);
        points.push(x + ' ' + Math.round(y * 10) / 10);
    }
    return { d: 'M' + points.join('L'), index: i % 4 === 0 };
});

/**
 * Decorative (aria-hidden), absolutely positioned on the right of its parent, fading out toward the text.
 * The parent needs position: relative (and overflow: clip); put the content above it (z-index ≥ 1).
 * className: per-use positioning / tint — the line alpha is the --contour-alpha custom property.
 */
export default function ContourLines({ className }) {
    return (
        <span aria-hidden="true" className={className ? styles.root + ' ' + className : styles.root}>
            <svg
                className={styles.svg}
                viewBox="0 0 1200 600"
                preserveAspectRatio="xMaxYMid slice"
                focusable="false"
            >
                {LINES.map((line, i) => (
                    <path
                        key={i}
                        d={line.d}
                        className={line.index ? styles.index : undefined}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1}
                        vectorEffect="non-scaling-stroke"
                        strokeLinejoin="round"
                    />
                ))}
            </svg>
        </span>
    );
}
