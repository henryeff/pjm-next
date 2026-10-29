'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders one assistant reply as Markdown (GFM tables, lists, links). Its own module so the chat page
 * can load react-markdown + remark-gfm (~150 KB) lazily, after first paint, instead of in the /chat
 * route bundle. Links Pevita writes to other sites open in a new tab; site-relative links stay in place.
 */
const components = {
    a({ href = '', children, node: _node, ...rest }) {
        const external = /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?perkasajayamarine\.com/i.test(href);
        return (
            <a href={href} {...rest} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {children}
            </a>
        );
    },
};

export default function ChatMarkdown({ children }) {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {children}
        </ReactMarkdown>
    );
}
