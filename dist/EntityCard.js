import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * <EntityCard> — record-card primitive used for shareholders, officers,
 * branches, beneficial owners, and other entity lists inside detail panes.
 *
 * Density variants:
 *  - "standard" (default): padded card with primary + secondary metadata.
 *  - "compact": tighter row, secondary metadata behind a disclosure chevron.
 *               Use when the parent list might grow large (30-100 entries).
 *
 * For very large lists, wrap a parent <EntityCardList virtualised count={n}>
 * which lazy-renders rows above a configurable threshold (default 20). The
 * virtualisation is intentionally simple — a windowed slice on scroll, no
 * variable row heights — because compact rows are uniform.
 */
import * as React from 'react';
export function EntityCard({ title, subtitle, leading, trailing, metadata, onClick, density = 'standard', className, }) {
    const [open, setOpen] = React.useState(false);
    const hasMetadata = metadata !== undefined && metadata !== null;
    const isCompact = density === 'compact';
    const bodyId = React.useId();
    const classes = [
        'cc-entity-card',
        isCompact ? 'cc-entity-card--compact' : 'cc-entity-card--standard',
    ];
    if (onClick)
        classes.push('cc-entity-card--clickable');
    if (open)
        classes.push('is-open');
    if (className)
        classes.push(className);
    const headerContent = (_jsxs(_Fragment, { children: [leading ? (_jsx("span", { className: "cc-entity-card__leading", "aria-hidden": "true", children: leading })) : null, _jsxs("span", { className: "cc-entity-card__primary", children: [_jsx("span", { className: "cc-entity-card__title", children: title }), subtitle ? (_jsx("span", { className: "cc-entity-card__subtitle", children: subtitle })) : null] }), trailing ? (_jsx("span", { className: "cc-entity-card__trailing", children: trailing })) : null, isCompact && hasMetadata ? (_jsx("button", { type: "button", className: "cc-entity-card__disclosure", "aria-expanded": open, "aria-controls": bodyId, "aria-label": open ? 'Hide details' : 'Show details', onClick: (e) => {
                    e.stopPropagation();
                    setOpen((o) => !o);
                }, children: open ? '▾' : '▸' })) : null] }));
    return (_jsxs("article", { className: classes.join(' '), children: [onClick ? (_jsx("button", { type: "button", onClick: onClick, className: "cc-entity-card__header cc-entity-card__header--clickable", children: headerContent })) : (_jsx("div", { className: "cc-entity-card__header", children: headerContent })), hasMetadata && (!isCompact || open) ? (_jsx("div", { id: bodyId, className: "cc-entity-card__metadata", children: metadata })) : null] }));
}
const DEFAULT_VIRTUALISE_ABOVE = 20;
const DEFAULT_ROW_HEIGHT = 56;
const DEFAULT_WINDOW_SIZE = 50;
export function EntityCardList({ children, virtualiseAbove = DEFAULT_VIRTUALISE_ABOVE, rowHeight = DEFAULT_ROW_HEIGHT, windowSize = DEFAULT_WINDOW_SIZE, className, }) {
    const items = React.Children.toArray(children);
    const shouldVirtualise = virtualiseAbove > 0 && items.length > virtualiseAbove;
    const containerRef = React.useRef(null);
    const [startIndex, setStartIndex] = React.useState(0);
    React.useEffect(() => {
        if (!shouldVirtualise)
            return;
        const el = containerRef.current;
        if (!el)
            return;
        const onScroll = () => {
            const idx = Math.max(0, Math.floor(el.scrollTop / rowHeight));
            setStartIndex(idx);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, [shouldVirtualise, rowHeight]);
    const classes = ['cc-entity-card-list'];
    if (className)
        classes.push(className);
    if (!shouldVirtualise) {
        return _jsx("div", { className: classes.join(' '), children: items });
    }
    const endIndex = Math.min(items.length, startIndex + windowSize);
    const before = startIndex * rowHeight;
    const after = (items.length - endIndex) * rowHeight;
    return (_jsxs("div", { ref: containerRef, className: `${classes.join(' ')} cc-entity-card-list--virtualised`, style: { maxHeight: rowHeight * Math.min(windowSize, items.length) }, children: [before > 0 ? (_jsx("div", { "aria-hidden": "true", style: { height: before } })) : null, items.slice(startIndex, endIndex), after > 0 ? (_jsx("div", { "aria-hidden": "true", style: { height: after } })) : null] }));
}
//# sourceMappingURL=EntityCard.js.map