import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Card — generic surface shell for dashboard tiles, content cards, and
 * entity-list record cards (variant="entity").
 *
 * The classic API (title + subtitle + children) renders the legacy
 * `card-base` utility chrome and is preserved byte-for-byte so existing
 * consumers see no DOM change.
 *
 * When any of `actions`, `footer`, or `padded` are supplied, the new
 * BEM structure (<section class="cc-card">) is used:
 *   - cc-card__header (with copy + actions)
 *   - cc-card__body
 *   - cc-card__footer
 * Pass `padded={false}` to remove body padding via cc-card--flush.
 *
 * Pass `variant="entity"` to render a record-card with leading/trailing
 * slots, metadata, and optional compact density (chevron-disclosed metadata).
 *
 * Styles use @ds/core tokens exclusively — no hardcoded values.
 */
import * as React from "react";
function legacyTitleClass() {
    return "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground";
}
function legacySubtitleSuffix(subtitle) {
    return subtitle ? (_jsxs("span", { className: "ml-2 text-muted-foreground/70", children: ["\u00B7 ", subtitle] })) : null;
}
export function Card({ variant = "default", title, subtitle, actions, footer, padded, leading, trailing, metadata, density = "standard", onClick, className, children, ...rest }) {
    // ── Entity variant: record-card with leading / trailing / metadata. ────────
    if (variant === "entity") {
        return (_jsx(EntityCardBody, { title: title, subtitle: subtitle, leading: leading, trailing: trailing, metadata: metadata, density: density, onClick: onClick, className: className }));
    }
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
function EntityCardBody({ title, subtitle, leading, trailing, metadata, density, onClick, className, }) {
    const [open, setOpen] = React.useState(false);
    const hasMetadata = metadata !== undefined && metadata !== null;
    const isCompact = density === "compact";
    const bodyId = React.useId();
    const classes = [
        "cc-entity-card",
        isCompact ? "cc-entity-card--compact" : "cc-entity-card--standard",
    ];
    if (onClick)
        classes.push("cc-entity-card--clickable");
    if (open)
        classes.push("is-open");
    if (className)
        classes.push(className);
    const headerContent = (_jsxs(_Fragment, { children: [leading ? (_jsx("span", { className: "cc-entity-card__leading", "aria-hidden": "true", children: leading })) : null, _jsxs("span", { className: "cc-entity-card__primary", children: [_jsx("span", { className: "cc-entity-card__title", children: title }), subtitle ? (_jsx("span", { className: "cc-entity-card__subtitle", children: subtitle })) : null] }), trailing ? (_jsx("span", { className: "cc-entity-card__trailing", children: trailing })) : null, isCompact && hasMetadata ? (_jsx("button", { type: "button", className: "cc-entity-card__disclosure", "aria-expanded": open, "aria-controls": bodyId, "aria-label": open ? "Hide details" : "Show details", onClick: (e) => {
                    e.stopPropagation();
                    setOpen((o) => !o);
                }, children: open ? "▾" : "▸" })) : null] }));
    return (_jsxs("article", { className: classes.join(" "), children: [onClick ? (_jsx("button", { type: "button", onClick: onClick, className: "cc-entity-card__header cc-entity-card__header--clickable", children: headerContent })) : (_jsx("div", { className: "cc-entity-card__header", children: headerContent })), hasMetadata && (!isCompact || open) ? (_jsx("div", { id: bodyId, className: "cc-entity-card__metadata", children: metadata })) : null] }));
}
//# sourceMappingURL=Card.js.map