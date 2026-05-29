import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Description — semantic <dl>-based description-list primitive.
 *
 * Subsumes DetailRow, DetailSection, DetailMetric, and MetaRow into a single
 * web-standard description-list with composable parts and a `kind` discriminator:
 *
 *   - kind="row"     → label/value row inside a parent <dl> (was DetailRow).
 *   - kind="section" → collapsible section with optional summary chevron
 *                      (was DetailSection).
 *   - kind="metric"  → label + headline value, optional drill-down detail
 *                      (was DetailMetric).
 *   - kind="meta"    → horizontal strip of label/value pairs with separators
 *                      (was MetaRow).
 *   - kind="list"    → wrapper <dl> that hosts row children (default).
 *
 * Drill-down hygiene: empty rows hide by default (no "No items yet" carcasses);
 * pass `showEmpty` to keep alignment slots in editable forms.
 */
import * as React from 'react';
export function DescriptionTerm({ className, children, ...rest }) {
    return (_jsx("dt", { className: ['cc-detail-row__label', className].filter(Boolean).join(' '), ...rest, children: children }));
}
export function DescriptionValue({ className, children, ...rest }) {
    return (_jsx("dd", { className: ['cc-detail-row__value', className].filter(Boolean).join(' '), ...rest, children: children }));
}
// ── Implementations ────────────────────────────────────────────────────────
const EMPTY_VALUES = new Set([undefined, null, '']);
function RowBody({ label, children, showEmpty = false, className }) {
    if (!showEmpty && EMPTY_VALUES.has(children))
        return null;
    const classes = ['cc-detail-row'];
    if (className)
        classes.push(className);
    return (_jsxs("div", { className: classes.join(' '), children: [_jsx("dt", { className: "cc-detail-row__label", children: label }), _jsx("dd", { className: "cc-detail-row__value", children: children })] }));
}
function SectionBody({ title, summary, children, empty = false, defaultOpen = false, headingLevel = 3, className, }) {
    const [open, setOpen] = React.useState(defaultOpen);
    if (empty)
        return null;
    const Heading = `h${headingLevel}`;
    const hasSummary = summary !== undefined && summary !== null;
    const classes = ['cc-detail-section'];
    if (hasSummary)
        classes.push('cc-detail-section--collapsible');
    if (open || !hasSummary)
        classes.push('is-open');
    if (className)
        classes.push(className);
    const bodyId = React.useId();
    return (_jsxs("section", { className: classes.join(' '), children: [_jsxs("header", { className: "cc-detail-section__header", children: [_jsx(Heading, { className: "cc-detail-section__title", children: title }), hasSummary ? (_jsxs("button", { type: "button", className: "cc-detail-section__toggle", "aria-expanded": open, "aria-controls": bodyId, onClick: () => setOpen((o) => !o), children: [_jsx("span", { className: "cc-detail-section__summary", children: summary }), _jsx("span", { className: "cc-detail-section__chevron", "aria-hidden": "true", children: open ? '▾' : '▸' })] })) : null] }), open || !hasSummary ? (_jsx("div", { id: bodyId, className: "cc-detail-section__body", children: children })) : null] }));
}
function MetricBody({ label, value, detail, caption, className, }) {
    const [open, setOpen] = React.useState(false);
    const bodyId = React.useId();
    const classes = ['cc-detail-metric'];
    if (className)
        classes.push(className);
    if (detail)
        classes.push('cc-detail-metric--drill');
    if (open)
        classes.push('is-open');
    const hasDetail = detail !== undefined && detail !== null;
    return (_jsxs("div", { className: classes.join(' '), children: [_jsxs("button", { type: "button", className: "cc-detail-metric__header", "aria-expanded": hasDetail ? open : undefined, "aria-controls": hasDetail ? bodyId : undefined, onClick: hasDetail ? () => setOpen((o) => !o) : undefined, disabled: !hasDetail, children: [_jsx("span", { className: "cc-detail-metric__label", children: label }), _jsx("span", { className: "cc-detail-metric__value", children: value }), caption ? (_jsx("span", { className: "cc-detail-metric__caption", children: caption })) : null, hasDetail ? (_jsx("span", { className: "cc-detail-metric__chevron", "aria-hidden": "true", children: open ? '▾' : '▸' })) : null] }), hasDetail && open ? (_jsx("div", { id: bodyId, className: "cc-detail-metric__body", children: detail })) : null] }));
}
const META_SIZE_MAP = {
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
function MetaBody({ items, size = 'md', layout = 'inline', separator = true, className, }) {
    const sizeTokens = META_SIZE_MAP[size];
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
// ── Discriminated Description component ─────────────────────────────────────
/**
 * Description — unified description-list primitive. Use the `kind` prop to
 * pick the surface; see the file header for the list of kinds.
 */
export function Description(props) {
    const kind = props.kind ?? 'list';
    switch (kind) {
        case 'row':
            return _jsx(RowBody, { ...props });
        case 'section':
            return _jsx(SectionBody, { ...props });
        case 'metric':
            return _jsx(MetricBody, { ...props });
        case 'meta':
            return _jsx(MetaBody, { ...props });
        case 'list':
        default: {
            const { className, children } = props;
            return (_jsx("dl", { className: ['cc-description', className].filter(Boolean).join(' '), children: children }));
        }
    }
}
//# sourceMappingURL=Description.js.map