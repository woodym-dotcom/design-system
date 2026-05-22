import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Stack — vertical flex container with token-driven gap and optional dividers.
 *
 * Gap values map to --space-* tokens (4pt grid).
 * Divider renders <hr> between children using --border-1 token.
 */
import * as React from 'react';
const GAP_MAP = {
    none: '0',
    xs: 'var(--space-2)', // 6px
    sm: 'var(--space-3)', // 8px
    md: 'var(--space-5)', // 16px
    lg: 'var(--space-6)', // 24px
    xl: 'var(--space-7)', // 32px
};
const ALIGN_MAP = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
};
export function Stack({ gap = 'md', align = 'stretch', divider = false, as: Tag = 'div', className, style, children, }) {
    const childArray = React.Children.toArray(children).filter(Boolean);
    const content = divider
        ? childArray.flatMap((child, i) => i < childArray.length - 1
            ? [
                child,
                _jsx("hr", { style: {
                        border: 'none',
                        borderTop: '1px solid var(--border-1)',
                        margin: 0,
                    } }, `divider-${i}`),
            ]
            : [child])
        : childArray;
    const rootStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: GAP_MAP[gap],
        alignItems: ALIGN_MAP[align],
        ...style,
    };
    return (_jsx(Tag, { className: className, style: rootStyle, children: content }));
}
//# sourceMappingURL=Stack.js.map