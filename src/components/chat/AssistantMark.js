import { Chat } from '@/components/ui/Icons';
import styles from './AssistantMark.module.css';

/**
 * Pevita's identity: a navy disc with a thin red inner ring and a white chat glyph.
 * It stands in for the company logo inside the chat, so the logo appears only once (in the navbar).
 *
 * size:   diameter in px (the glyph is 45% of it).
 * ring:   adds an outer 3px white border, so the mark separates from a navy band.
 * status: adds the green "online" dot at bottom-right.
 *
 * Decorative (aria-hidden): the name next to it, or the message it leads, carries the meaning.
 */
export default function AssistantMark({ size = 44, ring = false, status = false, className }) {
    const cls = [styles.mark, ring ? styles.ring : '', className || ''].filter(Boolean).join(' ');
    const glyph = Math.round(size * 0.45);

    return (
        <span className={cls} style={{ width: size, height: size }} aria-hidden="true">
            {/* Small glyphs get a slightly heavier stroke so they don't go hairline-thin. */}
            <Chat size={glyph} strokeWidth={size <= 36 ? 2.2 : 1.8} className={styles.glyph} />
            {status && <span className={styles.status} />}
        </span>
    );
}
