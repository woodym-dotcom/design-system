import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
function legacyTitleClass() {
    return "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground";
}
function legacySubtitleSuffix(subtitle) {
    return subtitle ? (_jsxs("span", { className: "ml-2 text-muted-foreground/70", children: ["\u00B7 ", subtitle] })) : null;
}
export function Card({ title, subtitle, actions, footer, padded, className, children, ...rest }) {
    // Legacy path: no new prop has been supplied → render the original DOM
    // so existing callers see no visual / structural change.
    const usesNew = actions !== undefined || footer !== undefined || padded !== undefined;
    if (!usesNew) {
        return (_jsxs("div", { ...rest, className: [
                "card-base",
                "rounded-2xl",
                "border",
                "border-[color:var(--border-1)]",
                "p-4",
                className,
            ]
                .filter(Boolean)
                .join(" "), children: [title ? (_jsxs("div", { className: legacyTitleClass(), children: [title, legacySubtitleSuffix(subtitle)] })) : null, children] }));
    }
    const flush = padded === false;
    const cls = [
        "cc-card",
        flush ? "cc-card--flush" : null,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const hasHeader = title != null || subtitle != null || actions != null;
    return (_jsxs("section", { ...rest, className: cls, children: [hasHeader ? (_jsxs("header", { className: "cc-card__header", children: [_jsxs("div", { className: "cc-card__copy", children: [title != null ? _jsx("h3", { className: "cc-card__title", children: title }) : null, subtitle != null ? (_jsx("p", { className: "cc-card__subtitle", children: subtitle })) : null] }), actions != null ? (_jsx("div", { className: "cc-card__actions", children: actions })) : null] })) : null, _jsx("div", { className: "cc-card__body", children: children }), footer != null ? (_jsx("div", { className: "cc-card__footer", children: footer })) : null] }));
}
//# sourceMappingURL=Card.js.map