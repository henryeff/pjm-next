'use client';

import { useEffect, useRef, useState } from 'react';
import { Pin } from '@/components/ui/Icons';
import styles from './MapFacade.module.css';

/**
 * Click-to-load Google Map for one store. Until the visitor asks for it, only a light placeholder
 * renders (store name, street and a "show map" button), so the page loads no Google Maps JavaScript
 * (each embed pulls a few hundred KiB of third-party script). After the click the iframe mounts in the
 * same box and receives focus. Keep a plain "Directions" / Google Maps link elsewhere on the page.
 *
 * src: the store's maps embed URL. title: iframe title. name / address: placeholder text.
 * showLabel: visible button text. ariaLabel: the button's accessible name (include the store name).
 * note: optional small line under the button (e.g. "Loads Google Maps").
 * tone: 'light' (steel placeholder on white/grey sections) | 'dark' (on navy).
 */
export default function MapFacade({ src, title, name, address, showLabel, ariaLabel, note, tone = 'light', className }) {
    const [active, setActive] = useState(false);
    const iframeRef = useRef(null);

    // The button unmounts on click; move focus to the map so keyboard users don't land on <body>.
    useEffect(() => {
        if (active && iframeRef.current) iframeRef.current.focus();
    }, [active]);

    const frameClass = [styles.frame, tone === 'dark' ? styles.dark : styles.light, className].filter(Boolean).join(' ');

    return (
        <div className={frameClass}>
            {active ? (
                <iframe
                    ref={iframeRef}
                    className={styles.iframe}
                    src={src}
                    title={title}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            ) : (
                <button type="button" className={styles.button} aria-label={ariaLabel} onClick={() => setActive(true)}>
                    <span className={styles.grid} aria-hidden="true" />
                    <span className={styles.pin} aria-hidden="true">
                        <Pin size={24} />
                    </span>
                    <span className={styles.name} aria-hidden="true">
                        {name}
                    </span>
                    {address && (
                        <span className={styles.address} aria-hidden="true">
                            {address}
                        </span>
                    )}
                    <span className={'btn btn-sm ' + styles.cta} aria-hidden="true">
                        {showLabel}
                    </span>
                    {note && (
                        <span className={styles.note} aria-hidden="true">
                            {note}
                        </span>
                    )}
                </button>
            )}
        </div>
    );
}
