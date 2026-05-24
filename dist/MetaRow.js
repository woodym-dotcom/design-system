import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * MetaRow -- horizontal metadata display row (label-value pairs).
 *
 * DS-MIG P1-14. The missing layout primitive for displaying inline
 * metadata key-value pairs. Composes with Row and Text internally.
 *
 * Usage:
 *   <MetaRow
 *     items={[
 *       { label: 'Status', value: <Tag tone="success">Active</Tag> },
 *       { label: 'Created', value: '2024-01-15' },
 *       { label: 'Owner', value: 'Jane Doe' },
 *     ]}
 *   />
 *
 * Renders as a horizontal row of label-value pairs separated by a subtle
 * divider. Wraps on small screens.
 */
import * as React from 'react';
const SIZE_MAP = {
    sm: {
        label: 'var(--text-xs, 0.75rem)',
        value: 'var(--text-sm, 0.875rem)',
        gap: 'var(--space-3, 0.5rem)',
    },
    md: {
        label: 'var(--text-sm, 0.875rem)',
        value: 'var(--text-base, 0.875rem)',
        gap: 'var(--space-5, 1rem)',
    },
};
/**
 * MetaRow -- renders a horizontal strip of label: value pairs.
 */
export function MetaRow({ items, size = 'md', layout = 'inline', separator = true, className, }) {
    const sizeTokens = SIZE_MAP[size];
    const visibleItems = items.filter((item) => !item.hidden);
    return (_jsx("dl", { className: ['cc-meta-row', className].filter(Boolean).join(' '), style: {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: layout === 'stacked' ? 'flex-start' : 'center',
            gap: sizeTokens.gap,
            margin: 0,
            padding: 0,
        }, children: visibleItems.map((item, i) => (_jsxs(React.Fragment, { children: [separator && i > 0 && (_jsx("span", { className: "cc-meta-row__separator", "aria-hidden": "true", style: {
                        width: 1,
                        height: '1em',
                        background: 'var(--border-1)',
                        flexShrink: 0,
                        alignSelf: 'center',
                    } })), _jsxs("div", { className: "cc-meta-row__item", style: {
                        display: 'flex',
                        flexDirection: layout === 'stacked' ? 'column' : 'row',
                        alignItems: layout === 'stacked' ? 'flex-start' : 'center',
                        gap: layout === 'stacked' ? 'var(--space-1, 0.25rem)' : 'var(--space-2, 0.375rem)',
                    }, children: [_jsx("dt", { className: "cc-meta-row__label", style: {
                                margin: 0,
                                fontSize: sizeTokens.label,
                                fontWeight: 500,
                                color: 'var(--text-3)',
                                whiteSpace: 'nowrap',
                            }, children: item.label }), _jsx("dd", { className: "cc-meta-row__value", style: {
                                margin: 0,
                                fontSize: sizeTokens.value,
                                color: 'var(--text-1)',
                            }, children: item.value })] })] }, item.label))) }));
}
//# sourceMappingURL=MetaRow.js.map