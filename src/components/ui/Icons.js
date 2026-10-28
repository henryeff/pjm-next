// Line icons on a 24×24 grid. Stroke = currentColor, so they take the text colour of their parent.
// All icons are decorative (aria-hidden); give the surrounding link/button its own accessible text.

function Svg({ className, size = 20, filled = false, children, ...rest }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            className={className}
            {...rest}
        >
            {children}
        </svg>
    );
}

export function ArrowRight(props) {
    return (
        <Svg {...props}>
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </Svg>
    );
}

export function ArrowLeft(props) {
    return (
        <Svg {...props}>
            <path d="M19 12H5" />
            <path d="m11 6-6 6 6 6" />
        </Svg>
    );
}

export function ChevronDown(props) {
    return (
        <Svg {...props}>
            <path d="m6 9 6 6 6-6" />
        </Svg>
    );
}

export function Phone(props) {
    return (
        <Svg {...props}>
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
        </Svg>
    );
}

export function Pin(props) {
    return (
        <Svg {...props}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </Svg>
    );
}

export function Mail(props) {
    return (
        <Svg {...props}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3.5 7 8.5 6 8.5-6" />
        </Svg>
    );
}

export function Chat(props) {
    return (
        <Svg {...props}>
            <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 20.5l1.6-5A8.4 8.4 0 1 1 21 11.5Z" />
            <path d="M8.5 11.5h.01" />
            <path d="M12.5 11.5h.01" />
            <path d="M16.5 11.5h.01" />
        </Svg>
    );
}

export function ExternalLink(props) {
    return (
        <Svg {...props}>
            <path d="M14 4h6v6" />
            <path d="M20 4 10.5 13.5" />
            <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
        </Svg>
    );
}

export function Play(props) {
    return (
        <Svg filled {...props}>
            <path d="M7 4.8v14.4a.8.8 0 0 0 1.2.7l11.6-7.2a.8.8 0 0 0 0-1.4L8.2 4.1A.8.8 0 0 0 7 4.8Z" />
        </Svg>
    );
}

export function Pause(props) {
    return (
        <Svg {...props}>
            <rect x="6" y="4.5" width="3.5" height="15" rx="1" />
            <rect x="14.5" y="4.5" width="3.5" height="15" rx="1" />
        </Svg>
    );
}

export function Close(props) {
    return (
        <Svg {...props}>
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
        </Svg>
    );
}

export function Check(props) {
    return (
        <Svg {...props}>
            <path d="m5 12.5 4.5 4.5L19 7.5" />
        </Svg>
    );
}

export function Send(props) {
    return (
        <Svg {...props}>
            <path d="M21 3 10.5 13.5" />
            <path d="M21 3 14.5 21l-4-7.5L3 9.5 21 3Z" />
        </Svg>
    );
}
