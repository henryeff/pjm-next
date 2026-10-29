import { formatDate, isoDate, parseDate } from './newsUtils';

/**
 * Red, rule-less eyebrow date. Renders a <time> when the date can be parsed, else the raw string.
 * `prefix` (e.g. the category, 'Panduan') is shown before the date: 'PANDUAN · 20 FEBRUARI 2026'.
 */
export default function NewsDate({ value, language, className, prefix }) {
    if (!value && !prefix) return null;
    const cls = 'eyebrow eyebrow-plain' + (className ? ' ' + className : '');
    const date = parseDate(value);

    if (!prefix) {
        if (!date) return <span className={cls}>{value}</span>;
        return (
            <time className={cls} dateTime={isoDate(date)}>
                {formatDate(value, language)}
            </time>
        );
    }

    return (
        <span className={cls}>
            {prefix}
            {value && (
                <>
                    <span aria-hidden="true">·</span>
                    {date ? <time dateTime={isoDate(date)}>{formatDate(value, language)}</time> : value}
                </>
            )}
        </span>
    );
}
