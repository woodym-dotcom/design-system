import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * <FilterBar> — active filter chip bar with empty-state enforcement (G10).
 *
 * Contract:
 *  - When no chips are active, renders a .cc-filter-bar__empty span so the
 *    bar never appears blank. The empty-state copy defaults to "Showing all".
 *  - Selected chips use aria-pressed="true" which drives the token-based
 *    selected colour (no hard-coded colours); legible in both light + dark.
 *  - Each chip has an accessible remove button.
 *
 * Layout modes (added by RW lift):
 *  - "horizontal" (default): flat chip row — backward-compatible.
 *  - "sidebar": sticky 220px left rail; options rendered as grouped pill chips
 *    with "All X" first per group and count badges.
 *  - "responsive": "sidebar" at or above `collapsedAt` px, "horizontal" below.
 */
import * as React from 'react';
// ---------------------------------------------------------------------------
// Horizontal layout (original)
// ---------------------------------------------------------------------------
function HorizontalFilterBar({ options, activeIds, onToggle, onRemove, emptyLabel, ariaLabel, className, }) {
    const handleRemove = onRemove ?? onToggle;
    const activeSet = new Set(activeIds);
    const activeChips = options.filter((opt) => activeSet.has(opt.id));
    const isEmpty = activeChips.length === 0;
    const classes = ['cc-filter-bar'];
    if (className)
        classes.push(className);
    return (_jsxs("div", { className: classes.join(' '), role: "group", "aria-label": ariaLabel, children: [options.map((opt) => {
                const isPressed = activeSet.has(opt.id);
                return (_jsx("button", { type: "button", className: "cc-chip cc-chip--button", "aria-pressed": isPressed, onClick: () => onToggle(opt.id), children: opt.label }, opt.id));
            }), !isEmpty ? (_jsx("div", { className: "cc-filter-bar__chips", role: "list", "aria-label": "Active filters", children: activeChips.map((chip) => (_jsxs("span", { className: "cc-filter-bar__chip", role: "listitem", children: [chip.label, _jsx("button", { type: "button", className: "cc-filter-bar__chip-remove", onClick: () => handleRemove(chip.id), "aria-label": `Remove ${chip.label}`, children: "\u00D7" })] }, chip.id))) })) : null, isEmpty ? (_jsx("span", { className: "cc-filter-bar__empty", children: emptyLabel })) : null] }));
}
function groupOptions(options) {
    const ungrouped = [];
    const map = new Map();
    for (const opt of options) {
        if (!opt.group) {
            ungrouped.push(opt);
        }
        else {
            if (!map.has(opt.group))
                map.set(opt.group, []);
            map.get(opt.group).push(opt);
        }
    }
    const groups = [];
    if (ungrouped.length > 0)
        groups.push({ label: '', options: ungrouped });
    for (const [label, opts] of map) {
        groups.push({ label, options: opts });
    }
    return groups;
}
/** Special sentinel id representing "All" within a group. */
const ALL_ID_PREFIX = '__all__';
function SidebarFilterBar({ options, activeIds, onToggle, ariaLabel, className, }) {
    const activeSet = new Set(activeIds);
    const groups = groupOptions(options);
    const handleAllClick = (groupOptions) => {
        // Deactivate all chips in this group.
        for (const opt of groupOptions) {
            if (activeSet.has(opt.id))
                onToggle(opt.id);
        }
    };
    const classes = ['cc-filter-bar cc-filter-bar--sidebar'];
    if (className)
        classes.push(className);
    return (_jsx("nav", { className: classes.join(' '), "aria-label": ariaLabel, children: groups.map((group, gi) => {
            const groupActiveCount = group.options.filter((o) => activeSet.has(o.id)).length;
            const allActive = groupActiveCount === 0;
            const allId = `${ALL_ID_PREFIX}${gi}`;
            return (_jsxs("div", { className: "cc-filter-bar__group", children: [group.label && (_jsx("p", { className: "cc-filter-bar__group-label", children: group.label })), _jsxs("button", { type: "button", className: "cc-chip cc-chip--button cc-filter-bar__sidebar-chip", "aria-pressed": allActive, onClick: () => handleAllClick(group.options), children: ["All ", group.label || 'items'] }, allId), group.options.map((opt) => {
                        const isPressed = activeSet.has(opt.id);
                        return (_jsxs("button", { type: "button", className: "cc-chip cc-chip--button cc-filter-bar__sidebar-chip", "aria-pressed": isPressed, onClick: () => onToggle(opt.id), children: [opt.label, opt.count !== undefined && opt.count > 0 && (_jsx("span", { className: "cc-filter-bar__count-badge", "aria-label": `${opt.count} items`, children: opt.count }))] }, opt.id));
                    })] }, gi));
        }) }));
}
// ---------------------------------------------------------------------------
// Responsive wrapper
// ---------------------------------------------------------------------------
function useWindowWidth() {
    const [width, setWidth] = React.useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));
    React.useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return width;
}
// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------
export function FilterBar({ options, activeIds, onToggle, onRemove, emptyLabel = 'Showing all', ariaLabel = 'Filters', className, layout = 'horizontal', collapsedAt = 768, }) {
    const windowWidth = useWindowWidth();
    const effectiveLayout = layout === 'responsive'
        ? windowWidth >= collapsedAt
            ? 'sidebar'
            : 'horizontal'
        : layout;
    if (effectiveLayout === 'sidebar') {
        return (_jsx(SidebarFilterBar, { options: options, activeIds: activeIds, onToggle: onToggle, ariaLabel: ariaLabel, className: className }));
    }
    return (_jsx(HorizontalFilterBar, { options: options, activeIds: activeIds, onToggle: onToggle, onRemove: onRemove, emptyLabel: emptyLabel, ariaLabel: ariaLabel, className: className }));
}
//# sourceMappingURL=FilterBar.js.map