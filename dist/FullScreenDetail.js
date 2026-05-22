import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Breadcrumbs } from "./Breadcrumbs.js";
import { Tabs } from "./Tabs.js";
/**
 * @deprecated Since DS-SIMPLIFY 01. Use `<Overlay placement="fullscreen">`
 *   instead. Removed at v1.0 (DS-SIMPLIFY 14).
 */
export function FullScreenDetail({ breadcrumbs, title, eyebrow, actions, headerMeta, tabs, children, bottomBar, onClose, className, }) {
    return (_jsxs("div", { className: ["cc-fsd", className].filter(Boolean).join(" "), children: [_jsxs("header", { className: "cc-fsd__header", children: [_jsxs("div", { className: "cc-fsd__crumbs-row", children: [_jsx(Breadcrumbs, { items: breadcrumbs }), onClose ? (_jsx("button", { type: "button", className: "cc-fsd__close", "aria-label": "Close", onClick: onClose, children: "\u00D7" })) : null] }), eyebrow ? _jsx("div", { className: "cc-fsd__eyebrow", children: eyebrow }) : null, _jsxs("div", { className: "cc-fsd__title-row", children: [_jsx("h1", { className: "cc-fsd__title", children: title }), actions ? _jsx("div", { className: "cc-fsd__actions", children: actions }) : null] }), headerMeta ? _jsx("div", { className: "cc-fsd__meta", children: headerMeta }) : null, tabs ? (_jsx("div", { className: "cc-fsd__tabs", children: _jsx(Tabs, { items: tabs.items, value: tabs.value, onChange: tabs.onChange }) })) : null] }), _jsx("div", { className: "cc-fsd__body", children: children }), bottomBar ? (_jsx("div", { className: "cc-fsd__bottom-bar", children: bottomBar })) : null] }));
}
//# sourceMappingURL=FullScreenDetail.js.map