import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Breadcrumb trail. Renders an ordered list of crumbs; the last item is
 * marked `aria-current="page"`. Long trails collapse the middle to an
 * ellipsis with the collapsed crumbs preserved in the DOM as an
 * expanded menu (CSS-driven).
 */
export function Breadcrumbs({ items, separator = '/', collapseAfter = 4, ariaLabel = 'Breadcrumb', className, }) {
    const normalised = items.map((it, i) => ({
        ...it,
        current: it.current ?? i === items.length - 1,
    }));
    const collapsed = collapseAfter > 0 && normalised.length > collapseAfter;
    const visibleItems = collapsed
        ? [normalised[0], { __collapsed: true, hidden: normalised.slice(1, -2) }, normalised[normalised.length - 2], normalised[normalised.length - 1]]
        : normalised;
    return (_jsx("nav", { "aria-label": ariaLabel, className: ['cc-breadcrumbs', className].filter(Boolean).join(' '), children: _jsx("ol", { className: "cc-breadcrumbs__list", children: visibleItems.map((item, i) => {
                const isLast = i === visibleItems.length - 1;
                if ('__collapsed' in item) {
                    return (_jsxs("li", { className: "cc-breadcrumbs__item cc-breadcrumbs__item--collapse", children: [_jsxs("details", { className: "cc-breadcrumbs__collapse", children: [_jsx("summary", { "aria-label": "Show hidden breadcrumbs", children: "\u2026" }), _jsx("ul", { className: "cc-breadcrumbs__hidden", children: item.hidden.map((h, j) => (_jsx("li", { children: h.href ? _jsx("a", { href: h.href, onClick: h.onClick, children: h.label }) : _jsx("span", { children: h.label }) }, j))) })] }), !isLast && _jsx("span", { className: "cc-breadcrumbs__sep", "aria-hidden": "true", children: separator })] }, "collapse"));
                }
                const crumb = item;
                return (_jsxs("li", { className: "cc-breadcrumbs__item", children: [crumb.href && !crumb.current ? (_jsxs("a", { className: "cc-breadcrumbs__link", href: crumb.href, onClick: crumb.onClick, children: [crumb.icon && _jsx("span", { className: "cc-breadcrumbs__icon", "aria-hidden": "true", children: crumb.icon }), crumb.label] })) : (_jsxs("span", { className: "cc-breadcrumbs__current", "aria-current": crumb.current ? 'page' : undefined, children: [crumb.icon && _jsx("span", { className: "cc-breadcrumbs__icon", "aria-hidden": "true", children: crumb.icon }), crumb.label] })), !isLast && _jsx("span", { className: "cc-breadcrumbs__sep", "aria-hidden": "true", children: separator })] }, i));
            }) }) }));
}
//# sourceMappingURL=Breadcrumbs.js.map