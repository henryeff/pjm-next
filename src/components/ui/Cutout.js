import Image from 'next/image';
import styles from './Cutout.module.css';

// Source files cropped at an edge; the mask feathers the cut.
// ratio = the file's own width / height (so the mask lines up with the real image edges).
//   450pk.png (800×900): opaque along the top row, the right edge and the bottom.
//   f300pk.png (1651×2477): opaque along the top.
const CROPPED = {
    '/images/FourStrokes/450pk.png': {
        ratio: '800 / 900',
        mask: 'linear-gradient(to bottom, transparent 0%, #000 16%, #000 95%, transparent 100%), linear-gradient(to left, transparent 0%, #000 8%)',
    },
    '/images/FourStrokes/f300pk.png': {
        ratio: '1651 / 2477',
        mask: 'linear-gradient(to bottom, transparent 0%, #000 12%)',
    },
};

function ratioNumber(ratio) {
    const [w, h] = String(ratio).split('/').map((n) => Number(n.trim()));
    return w > 0 && h > 0 ? (w / h).toFixed(4) : '1';
}

/**
 * A product cut-out (transparent PNG) contained inside its positioned parent, on the light or dark stage.
 * Cropped source files get a feathered edge so the cut never reads as a hard line.
 *
 * className: goes on the root (absolute, inset 0, flex-centred) — pass the padding here, e.g. padding: 10%.
 * imgClassName: goes on the <img>.
 * sizes: the RENDERED width of the engine, not the box.
 * priority / fetchPriority: pass through to next/image for LCP use (never fade an LCP cut-out in from opacity 0).
 */
export default function Cutout({ src, alt = '', sizes, priority, fetchPriority, className, imgClassName }) {
    const rootClass = className ? styles.root + ' ' + className : styles.root;
    const crop = CROPPED[src];
    const image = (
        <Image
            fill
            src={src}
            alt={alt}
            sizes={sizes}
            priority={priority}
            fetchPriority={fetchPriority}
            className={imgClassName}
            style={{ objectFit: 'contain' }}
        />
    );

    if (!crop) {
        return <span className={rootClass}>{image}</span>;
    }

    return (
        <span className={rootClass}>
            <span
                className={styles.frame}
                style={{
                    aspectRatio: crop.ratio,
                    '--cut-ratio': ratioNumber(crop.ratio),
                    WebkitMaskImage: crop.mask,
                    maskImage: crop.mask,
                    WebkitMaskComposite: 'source-in',
                    maskComposite: 'intersect',
                }}
            >
                {image}
            </span>
        </span>
    );
}
