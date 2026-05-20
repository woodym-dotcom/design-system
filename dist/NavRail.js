import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * <NavRail> — text-label vertical navigation rail (G2 / NavRail extraction).
 *
 * Third nav primitive alongside cc-navrail (icon-only) and cc-sidebar (72px).
 * Extracted from cl-frontend/src/components/ModuleShell.tsx NavRail (lines 122–165).
 *
 * G2 contract:
 *  (a) Selected state legible in both light + dark via design tokens
 *      (cc-text-navrail__item.is-active → accent-soft bg, accent-text fg).
 *  (b) Each item is independently routable / deep-linkable (href required).
 *  (c) Navigation never collapses on selection (nav always visible).
 *
 * Router-agnostic: renders <a> tags by default. Consumers using a router
 * (React Router, TanStack Router, Next.js) pass a `renderItem` render-prop
 * that receives the item and active state and returns their router <Link>.
 * Wave 2 will switch cl-frontend's import to this component.
 */
import * as React from 'react';
/**
 * Compute which item wins the active state via pathname matching.
 *
 * Multi-select fix: when multiple items prefix-match the current pathname
 * (e.g. /vendors and /vendors/risks both match /vendors/risks/acme) we take
 * the item whose `to` path is the longest (most-specific) match. This means
 * at most one item can win from pathname matching — multi-select eliminated.
 *
 * Items that supply their own `isActive` boolean bypass this logic entirely
 * and are handled individually (consumer controls their own active state).
 */
function resolveActiveId(items, currentPathname) {
    if (currentPathname === undefined)
        return null;
    // Items with an explicit isActive override are consumer-controlled; skip here.
    const candidateItems = items.filter((item) => item.isActive === undefined);
    let bestId = null;
    let bestLength = -1;
    for (const item of candidateItems) {
        if (currentPathname === item.to ||
            currentPathname.startsWith(`${item.to}/`)) {
            if (item.to.length > bestLength) {
                bestLength = item.to.length;
                bestId = item.id;
            }
        }
    }
    return bestId;
}
export function NavRail({ items, footerItems, currentPathname, renderItem, ariaLabel = 'Modules', variant = 'expanded', className, }) {
    const navClasses = ['cc-text-navrail'];
    if (variant === 'compact')
        navClasses.push('cc-text-navrail--compact');
    if (className)
        navClasses.push(className);
    // Dedupe: footer items take precedence over main items with the same id.
    // This handles consumers that accidentally pass "Settings" in both groups —
    // only one entry renders, no double-Settings at the bottom of the rail.
    const footerIds = new Set((footerItems ?? []).map((f) => f.id));
    const mainItems = items.filter((item) => !footerIds.has(item.id));
    // Resolve at most one active item via pathname (multi-select bug fix).
    // Compute against the merged set so an active footer item wins where it
    // would otherwise match against a main-item prefix.
    const allItems = [...mainItems, ...(footerItems ?? [])];
    const pathnameActiveId = resolveActiveId(allItems, currentPathname);
    const renderOne = (item) => {
        const isActive = item.isActive !== undefined
            ? item.isActive
            : item.id === pathnameActiveId;
        const itemClass = [
            'cc-text-navrail__item',
            isActive ? 'is-active' : '',
        ]
            .filter(Boolean)
            .join(' ');
        if (renderItem) {
            return (_jsx(React.Fragment, { children: renderItem({ item, isActive, className: itemClass }) }, item.id));
        }
        // Compact mode shows the label as a native tooltip only — the visible
        // text is the first character/initial OR the supplied icon. This avoids
        // the "label + hover tooltip both show" duplication reported in NavRail
        // consumers.
        if (variant === 'compact') {
            return (_jsx("a", { href: item.to, className: itemClass, "aria-current": isActive ? 'page' : undefined, "aria-label": item.label, title: item.label, children: item.icon ? (_jsx("span", { className: "cc-text-navrail__icon", "aria-hidden": "true", children: item.icon })) : (_jsx("span", { "aria-hidden": "true", children: item.label.slice(0, 1).toUpperCase() })) }, item.id));
        }
        return (_jsxs("a", { href: item.to, className: itemClass, "aria-current": isActive ? 'page' : undefined, children: [item.icon ? (_jsx("span", { className: "cc-text-navrail__icon", "aria-hidden": "true", children: item.icon })) : null, _jsx("span", { className: "cc-text-navrail__label", children: item.label })] }, item.id));
    };
    return (_jsxs("nav", { "aria-label": ariaLabel, className: navClasses.join(' '), children: [_jsx("div", { className: "cc-text-navrail__group cc-text-navrail__group--main", children: mainItems.map(renderOne) }), footerItems && footerItems.length > 0 ? (_jsx("div", { className: "cc-text-navrail__group cc-text-navrail__group--footer", children: footerItems.map(renderOne) })) : null] }));
}
//# sourceMappingURL=NavRail.js.map