import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export function Toolbar({ variant = "default", mode = "default", actions, queuePosition, queueTotal, leading, trailing, selectedCount, onClear, meta, position = "bottom", className, ...rest }) {
    // ── Bulk mode (subsumes BulkBar) ─────────────────────────────────────────
    if (mode === "bulk") {
        const count = selectedCount ?? 0;
        if (count === 0)
            return null;
        return (_jsxs("div", { className: ["cc-bulkbar", `cc-bulkbar--${position}`, className]
                .filter(Boolean)
                .join(" "), role: "region", "aria-label": rest["aria-label"] ?? `${count} item${count === 1 ? "" : "s"} selected`, children: [_jsxs("div", { className: "cc-bulkbar__summary", children: [_jsxs("span", { className: "cc-bulkbar__count", children: [count, " selected"] }), meta && _jsx("span", { className: "cc-bulkbar__meta", children: meta }), onClear ? (_jsx("button", { type: "button", className: "cc-bulkbar__clear", onClick: onClear, children: "Clear" })) : null] }), _jsx("div", { className: "cc-bulkbar__actions", children: (actions ?? []).map((a) => {
                        const tone = a.tone ?? a.variant ?? "default";
                        return (_jsxs("button", { type: "button", className: `cc-bulkbar__action cc-bulkbar__action--${tone}`, onClick: a.onClick, disabled: a.disabled, children: [a.icon && (_jsx("span", { className: "cc-bulkbar__action-icon", "aria-hidden": "true", children: a.icon })), a.label] }, a.id));
                    }) })] }));
    }
    // ── Default toolbar mode ─────────────────────────────────────────────────
    const classes = ["cc-toolbar", `cc-toolbar--${variant}`, className]
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
//# sourceMappingURL=Toolbar.js.map