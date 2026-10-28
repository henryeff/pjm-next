import KickerLine from '@/components/motion/KickerLine';

/**
 * Small uppercase label with an animated red rule that draws in.
 * For a static label (no motion) use the plain `.eyebrow` class instead.
 */
export default function Eyebrow({ children, as = 'span', className, immediate = false }) {
    const Tag = as;
    return (
        <Tag className={'eyebrow eyebrow-plain ' + (className || '')}>
            <KickerLine immediate={immediate} />
            {children}
        </Tag>
    );
}
