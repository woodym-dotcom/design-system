import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * MetadataChip — compressed housekeeping metadata cluster.
 *
 * @deprecated The inline badge sub-pattern is superseded by `Tag` with `variant="meta"` from
 * `@ds/core/react`. The full expand/inspect popover pattern has no direct Tag equivalent and will
 * be addressed separately. Cutover: DS-SIMPLIFY 14.
 *
 *
 * Collapses metadata noise (freshness, privacy badge, inspect link) into a
 * single "ⓘ" icon trigger. Tap/hover reveals the full cluster in an inline
 * expanded row (no position:fixed, stays in flow — viewport-safe).
 *
 * Accessibility:
 *  - The trigger button has aria-label="Show metadata" and aria-expanded.
 *  - The popover panel has role="region" with an accessible label.
 *  - Keyboard: Enter/Space toggles, Escape closes.
 *  - Touch target: the trigger is ≥ 44×44px via padding.
 */
import * as React from 'react';
function freshnessLabel(f) {
    return `${f.value}${f.unit}`;
}
function formatLastUpdated(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime()))
        return iso;
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d);
}
function stalenessLabel(s) {
    if (s === 'stale')
        return 'Stale';
    if (s === 'missing')
        return 'No data';
    return '';
}
function stalenessDotColor(s) {
    if (s === 'stale')
        return 'var(--status-warning, #eab308)';
    if (s === 'missing')
        return 'var(--text-3, #9ca3af)';
    return '';
}
const TONE_ICON = {
    default: 'ⓘ',
    'production-path': '⛓',
    'redaction-marker': '██',
};
export function MetadataChip({ freshness, privacy, inspectHref, inspectContent, lastUpdated, staleness, align = 'left', tone = 'default', className, }) {
    const [open, setOpen] = React.useState(false);
    const [inspectOpen, setInspectOpen] = React.useState(false);
    const triggerRef = React.useRef(null);
    const showDot = staleness && staleness !== 'fresh';
    // Close on Escape
    React.useEffect(() => {
        if (!open)
            return;
        const handler = (e) => {
            if (e.key === 'Escape') {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open]);
    const hasContent = !!(freshness || privacy || inspectHref || inspectContent || lastUpdated || staleness);
    const panelId = React.useId();
    return (_jsxs("span", { className: ['cc-metadata-chip', tone !== 'default' ? `cc-metadata-chip--${tone}` : '', className].filter(Boolean).join(' '), children: [_jsxs("button", { ref: triggerRef, type: "button", className: "cc-metadata-chip__trigger", "aria-label": open ? 'Hide metadata' : 'Show metadata', "aria-expanded": open, "aria-controls": hasContent ? panelId : undefined, onClick: () => setOpen((v) => !v), children: [showDot && (_jsx("span", { className: "cc-metadata-chip__staleness-dot", "aria-hidden": "true", style: { background: stalenessDotColor(staleness) } })), _jsx("span", { "aria-hidden": "true", className: "cc-metadata-chip__icon", children: TONE_ICON[tone] })] }), open && hasContent && (_jsxs("span", { id: panelId, role: "region", "aria-label": "Item metadata", className: [
                    'cc-metadata-chip__panel',
                    align === 'right' ? 'cc-metadata-chip__panel--right' : '',
                ].filter(Boolean).join(' '), children: [staleness && staleness !== 'fresh' && (_jsxs("span", { className: `cc-metadata-chip__item cc-metadata-chip__item--${staleness}`, children: [_jsx("span", { className: "cc-metadata-chip__label", children: "Status" }), _jsx("span", { className: `cc-metadata-chip__badge cc-metadata-chip__badge--${staleness}`, children: stalenessLabel(staleness) })] })), freshness && (_jsxs("span", { className: "cc-metadata-chip__item", children: [_jsx("span", { className: "cc-metadata-chip__label", children: "Freshness" }), _jsx("span", { className: "cc-metadata-chip__value", children: freshnessLabel(freshness) })] })), privacy && (_jsxs("span", { className: "cc-metadata-chip__item", children: [_jsx("span", { className: "cc-metadata-chip__label", children: "Privacy" }), _jsx("span", { className: `cc-metadata-chip__badge cc-metadata-chip__badge--${privacy}`, children: privacy })] })), lastUpdated && (_jsxs("span", { className: "cc-metadata-chip__item", children: [_jsx("span", { className: "cc-metadata-chip__label", children: "Updated" }), _jsx("span", { className: "cc-metadata-chip__value", children: formatLastUpdated(lastUpdated) })] })), inspectHref && (_jsx("span", { className: "cc-metadata-chip__item", children: _jsx("a", { href: inspectHref, className: "cc-metadata-chip__inspect", target: "_blank", rel: "noopener noreferrer", children: "Inspect \u2197" }) })), inspectContent && (_jsxs("span", { className: "cc-metadata-chip__item cc-metadata-chip__item--inspect-inline", children: [_jsx("button", { type: "button", className: "cc-metadata-chip__inspect", onClick: () => setInspectOpen((v) => !v), children: inspectOpen ? 'Hide inspect' : 'Inspect' }), inspectOpen && (_jsx("span", { className: "cc-metadata-chip__inspect-content", children: inspectContent }))] }))] }))] }));
}
//# sourceMappingURL=MetadataChip.js.map