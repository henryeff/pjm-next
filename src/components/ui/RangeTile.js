import Image from 'next/image';
import Link from 'next/link';
import Cutout from './Cutout';
import { ArrowRight } from './Icons';
import styles from './RangeTile.module.css';

/**
 * The ONE anatomy for every "go to a product area" link (Home, About): media on top, a white label
 * below with the title + red arrow and an optional one-line sub. Same border, radius and hover lift
 * as ProductCard. No scrim and never any text over the media.
 *
 * kind: 'photo' (cover-cropped photograph) | 'engine' (cut-out on the light stage, feathered if cropped)
 * ratio: the media box aspect ratio, e.g. '4 / 3' (default), '16 / 9', '1 / 1'.
 * headingAs: the title element ('h3' by default).
 *
 * sizes — pass the RENDERED width of the image, not the tile width:
 *   - kind 'photo' is cover-cropped, so a wide photo renders wider than its tile. A 1920×850 photo
 *     renders about 1.7× the tile width in a 4:3 box, about 1.27× in 16:9 and about 2.26× in 1:1.
 *     e.g. a half-width 4:3 tile on desktop → '(max-width: 767px) 170vw, 85vw' (capped by the container).
 *   - kind 'engine' renders inside 10% padding, so about 0.8× the tile width at most.
 */
export default function RangeTile({
    href,
    title,
    sub,
    src,
    kind = 'photo',
    objectPosition = '50% 50%',
    sizes,
    ratio = '4 / 3',
    headingAs = 'h3',
}) {
    const Heading = headingAs;
    const isEngine = kind === 'engine';
    const mediaClass = isEngine ? styles.media + ' stage-light floor-shadow' : styles.media;

    return (
        <Link href={href} className={styles.tile}>
            <span className={mediaClass} style={{ '--tile-ratio': ratio }}>
                {src &&
                    (isEngine ? (
                        <Cutout src={src} sizes={sizes} className={styles.cutout} />
                    ) : (
                        <Image src={src} alt="" fill sizes={sizes} className={styles.img} style={{ objectPosition }} />
                    ))}
            </span>
            <span className={styles.label}>
                <Heading className={styles.title}>
                    {title}
                    <ArrowRight size={20} className={styles.arrow} />
                </Heading>
                {sub && <span className={styles.sub}>{sub}</span>}
            </span>
        </Link>
    );
}
