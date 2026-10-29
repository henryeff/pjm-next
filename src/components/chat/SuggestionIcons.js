// Small line icons for the chat suggestion buttons (24×24 grid, stroke = currentColor).
// The opening-hours suggestion uses Clock from '@/components/ui/Icons' (same grid and stroke).
// Decorative only (aria-hidden): the button label carries the meaning.

function Svg({ size = 20, className, children }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            className={className}
        >
            {children}
        </svg>
    );
}

// Outboard motor: cowling, leg, cavitation plate and propeller.
export function Outboard(props) {
    return (
        <Svg {...props}>
            <path d="M7.5 3h8.5a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H8.5A3.5 3.5 0 0 1 5 6.5v-1A2.5 2.5 0 0 1 7.5 3Z" />
            <path d="M10 10v10.5" />
            <path d="M14 10v5" />
            <path d="M10 15h7" />
            <path d="M17.5 12.5v5" />
            <path d="M10 20.5h3" />
        </Svg>
    );
}

// Genuine parts: a cog.
export function Gear(props) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="6.5" />
            <circle cx="12" cy="12" r="2.5" />
            <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
            <path d="m5.3 5.3 2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
        </Svg>
    );
}

// Yamalube: an oil drop.
export function OilDrop(props) {
    return (
        <Svg {...props}>
            <path d="M12 3c3 3.8 6 7.3 6 11a6 6 0 0 1-12 0c0-3.7 3-7.2 6-11Z" />
            <path d="M9.5 14.5A2.5 2.5 0 0 0 12 17" />
        </Svg>
    );
}

// Workshop location: a map pin.
export function Pin(props) {
    return (
        <Svg {...props}>
            <path d="M19 10c0 5.5-7 11.5-7 11.5S5 15.5 5 10a7 7 0 0 1 14 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </Svg>
    );
}

// Contact: a phone handset.
export function Phone(props) {
    return (
        <Svg {...props}>
            <path d="M21 16.4v2.8a1.9 1.9 0 0 1-2.1 1.9 18.7 18.7 0 0 1-8.1-2.9 18.4 18.4 0 0 1-5.7-5.7A18.7 18.7 0 0 1 2.2 4.4 1.9 1.9 0 0 1 4.1 2.3h2.8a1.9 1.9 0 0 1 1.9 1.6c.1.9.4 1.8.7 2.6a1.9 1.9 0 0 1-.4 2L7.9 9.7a15 15 0 0 0 5.7 5.7l1.2-1.2a1.9 1.9 0 0 1 2-.4c.8.3 1.7.6 2.6.7a1.9 1.9 0 0 1 1.6 1.9Z" />
        </Svg>
    );
}
