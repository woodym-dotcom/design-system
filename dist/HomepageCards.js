import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * @deprecated Use `<ModuleTemplate variant="home">` from `./ModuleTemplate`
 * (DS-SIMPLIFY 04). Will be removed in v1.0 (SIMPLIFY 14).
 */
import * as React from 'react';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
/**
 * Role-aware homepage cards. Renders a grid of cards, filtered to those
 * the viewer can see based on `viewerRoles`. Composes:
 *   - `<Skeleton>` for per-card loading state
 *   - `<EmptyState>` when no cards remain after role filtering
 *   - density modes via the shared --density-* tokens
 *
 * The DS doesn't know about your role model — pass a flat list of role
 * strings and a `roles` array per card; matching is set-intersection.
 */
export function HomepageCards({ viewerRoles, cards, loading = false, heading, subtitle, emptyState, columns = 3, className, }) {
    const visible = React.useMemo(() => {
        const viewer = new Set(viewerRoles);
        return cards
            .filter((c) => !c.roles || c.roles.length === 0 || c.roles.some((r) => viewer.has(r)))
            .slice()
            .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    }, [cards, viewerRoles]);
    return (_jsxs("section", { className: ['cc-homepage-cards', `cc-homepage-cards--cols-${columns}`, className]
            .filter(Boolean)
            .join(' '), children: [(heading || subtitle) && (_jsxs("header", { className: "cc-homepage-cards__header", children: [heading && _jsx("h2", { className: "cc-homepage-cards__heading", children: heading }), subtitle && _jsx("p", { className: "cc-homepage-cards__subtitle", children: subtitle })] })), visible.length === 0 && !loading ? (emptyState ? (_jsx(EmptyState, { title: emptyState.title, description: emptyState.description, action: emptyState.action, variant: "permissioned-out" })) : null) : (_jsx("ul", { className: "cc-homepage-cards__grid", role: "list", children: visible.map((c) => {
                    const inner = loading
                        ? (c.loadingSlot ?? (_jsxs(_Fragment, { children: [_jsx(Skeleton, { shape: "text", lines: 2 }), _jsx(Skeleton, { shape: "rect", height: 32, width: 120 })] })))
                        : c.render({ loading: false });
                    const body = (_jsxs(_Fragment, { children: [_jsxs("div", { className: "cc-homepage-cards__card-head", children: [c.icon && (_jsx("span", { "aria-hidden": "true", className: "cc-homepage-cards__icon", children: c.icon })), _jsxs("div", { className: "cc-homepage-cards__card-title-wrap", children: [_jsx("h3", { className: "cc-homepage-cards__card-title", children: c.title }), c.subtitle && _jsx("p", { className: "cc-homepage-cards__card-subtitle", children: c.subtitle })] })] }), _jsx("div", { className: "cc-homepage-cards__card-body", children: inner })] }));
                    const cardClass = 'cc-homepage-cards__card';
                    if (c.href) {
                        return (_jsx("li", { className: "cc-homepage-cards__cell", children: _jsx("a", { className: cardClass, href: c.href, onClick: c.onClick, children: body }) }, c.id));
                    }
                    if (c.onClick) {
                        return (_jsx("li", { className: "cc-homepage-cards__cell", children: _jsx("button", { type: "button", className: cardClass, onClick: c.onClick, children: body }) }, c.id));
                    }
                    return (_jsx("li", { className: "cc-homepage-cards__cell", children: _jsx("article", { className: cardClass, children: body }) }, c.id));
                }) }))] }));
}
//# sourceMappingURL=HomepageCards.js.map