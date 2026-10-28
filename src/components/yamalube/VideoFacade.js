'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Play } from '@/components/ui/Icons';
import styles from './VideoFacade.module.css';

/**
 * Click-to-load YouTube embed. Until the visitor presses play, only a poster image and a button
 * render, so the page makes no third-party requests and has no empty box while the player loads.
 * After the click the iframe mounts in the same 16:9 box (autoplaying) and receives focus.
 *
 * poster: path under /public. posterClassName lets the caller art-direct the crop.
 */
export default function VideoFacade({
    videoId,
    title,
    ariaLabel,
    playLabel,
    poster,
    posterAlt = '',
    posterClassName,
    className,
}) {
    const [playing, setPlaying] = useState(false);
    const iframeRef = useRef(null);

    // The button unmounts on click; move focus to the player so keyboard users don't land on <body>.
    useEffect(() => {
        if (playing && iframeRef.current) {
            iframeRef.current.focus();
        }
    }, [playing]);

    const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

    return (
        <div className={[styles.frame, className].filter(Boolean).join(' ')}>
            {playing ? (
                <iframe
                    ref={iframeRef}
                    className={styles.iframe}
                    src={src}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <button
                    type="button"
                    className={styles.button}
                    aria-label={ariaLabel}
                    onClick={() => setPlaying(true)}
                >
                    {poster && (
                        <Image
                            src={poster}
                            alt={posterAlt}
                            fill
                            sizes="(min-width: 1024px) 960px, 100vw"
                            className={[styles.poster, posterClassName].filter(Boolean).join(' ')}
                        />
                    )}
                    <span className={styles.overlay} aria-hidden="true" />
                    <span className={styles.playIcon} aria-hidden="true">
                        <Play size={30} />
                    </span>
                    <span className={styles.label} aria-hidden="true">
                        {playLabel}
                    </span>
                </button>
            )}
        </div>
    );
}
