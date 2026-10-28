import { formatDate, isoDate, parseDate } from './newsUtils';

/** Red, rule-less eyebrow date. Renders a <time> when the date can be parsed, else the raw string. */
export default function NewsDate({ value, language, className }) {
    if (!value) return null;
    const cls = 'eyebrow eyebrow-plain' + (className ? ' ' + className : '');
    const date = parseDate(value);
    if (!date) return <span className={cls}>{value}</span>;
    return (
        <time className={cls} dateTime={isoDate(date)}>
            {formatDate(value, language)}
        </time>
    );
}
