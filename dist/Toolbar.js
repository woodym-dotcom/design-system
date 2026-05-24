import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Toolbar({ variant = "default", actions, queuePosition, queueTotal, leading, trailing, className, ...rest }) {
    const classes = [
        "cc-toolbar",
        `cc-toolbar--${variant}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { role: "toolbar", "aria-label": rest["aria-label"] ?? "Actions", className: classes, style: {
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3, 0.5rem)",
            padding: "var(--space-2, 0.375rem) var(--space-4, 0.75rem)",
            borderBottom: "1px solid var(--border-1)",
            background: "var(--surface-1)",
        }, children: [leading && _jsx("div", { className: "cc-toolbar__leading", children: leading }), variant === "queue-position" && queuePosition !== undefined && (_jsxs("span", { className: "cc-toolbar__queue-position", "aria-label": `Queue position ${queuePosition}${queueTotal ? ` of ${queueTotal}` : ""}`, style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "var(--text-sm, 0.875rem)",
                    fontWeight: 600,
                    color: "var(--text-2)",
                    padding: "var(--space-1, 0.25rem) var(--space-3, 0.5rem)",
                    borderRadius: "var(--radius-1, 4px)",
                    background: "var(--surface-2, #f5f5f5)",
                }, children: ["#", queuePosition, queueTotal !== undefined && (_jsxs("span", { style: { fontWeight: 400 }, children: ["/ ", queueTotal] }))] })), actions && actions.length > 0 && (_jsx("div", { className: "cc-toolbar__actions", style: { display: "flex", gap: "var(--space-2, 0.375rem)", marginLeft: "auto" }, children: actions.map((action) => {
                    const btnVariant = action.variant ?? "ghost";
                    return (_jsxs("button", { type: "button", className: `cc-btn cc-btn--${btnVariant} cc-btn--sm`, onClick: action.onClick, disabled: action.disabled, children: [action.icon && _jsx("span", { className: "cc-btn__icon", "aria-hidden": "true", children: action.icon }), action.label] }, action.id));
                }) })), trailing && _jsx("div", { className: "cc-toolbar__trailing", style: { marginLeft: actions ? undefined : "auto" }, children: trailing })] }));
}
/** Alias for backward-compat naming. */
export const PrimaryActionBar = Toolbar;
//# sourceMappingURL=Toolbar.js.map