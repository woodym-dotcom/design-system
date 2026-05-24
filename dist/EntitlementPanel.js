import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const TYPE_LABELS = {
    role: "Roles",
    permission: "Permissions",
    group: "Groups",
    scope: "Scopes",
};
const SOURCE_LABELS = {
    direct: "Direct",
    inherited: "Inherited",
    temporary: "Temporary",
};
const SOURCE_COLORS = {
    direct: "var(--accent-text)",
    inherited: "var(--info-text)",
    temporary: "var(--warning-text)",
};
function groupEntitlements(items, by) {
    const groups = new Map();
    for (const item of items) {
        const key = by === "type" ? item.type : item.source;
        const existing = groups.get(key) ?? [];
        existing.push(item);
        groups.set(key, existing);
    }
    return groups;
}
function formatExpiry(d) {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString();
}
export function EntitlementPanel({ recipient, entitlements, title, groupBy = "type", onEntitlementClick, className, }) {
    const classes = ["cc-entitlement-panel", className]
        .filter(Boolean)
        .join(" ");
    const heading = title ?? `${recipient}'s Entitlements`;
    const groups = groupEntitlements(entitlements, groupBy);
    const labelMap = groupBy === "type" ? TYPE_LABELS : SOURCE_LABELS;
    return (_jsxs("div", { className: classes, role: "region", "aria-label": heading, style: {
            display: "flex",
            flexDirection: "column",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius-2, 8px)",
            background: "var(--surface-1)",
        }, children: [_jsxs("header", { className: "cc-entitlement-panel__header", style: {
                    padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
                    borderBottom: "1px solid var(--border-1)",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "var(--space-3, 0.5rem)",
                }, children: [_jsx("h3", { className: "cc-entitlement-panel__title", style: { margin: 0, fontSize: "var(--text-base, 1rem)", fontWeight: 600 }, children: heading }), _jsxs("span", { className: "cc-entitlement-panel__count", style: {
                            fontSize: "var(--text-xs, 0.75rem)",
                            color: "var(--text-3)",
                        }, children: [entitlements.length, " entitlement", entitlements.length !== 1 ? "s" : ""] })] }), _jsx("div", { className: "cc-entitlement-panel__body", style: { padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)" }, children: Array.from(groups.entries()).map(([key, items]) => (_jsxs("section", { className: "cc-entitlement-panel__group", style: { marginBottom: "var(--space-4, 0.75rem)" }, children: [_jsx("h4", { className: "cc-entitlement-panel__group-label", style: {
                                margin: "0 0 var(--space-2, 0.375rem)",
                                fontSize: "var(--text-sm, 0.875rem)",
                                fontWeight: 600,
                                color: "var(--text-2)",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }, children: labelMap[key] ?? key }), _jsx("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-1, 0.25rem)" }, children: items.map((ent) => (_jsxs("li", { className: [
                                    "cc-entitlement-panel__item",
                                    `cc-entitlement-panel__item--${ent.source}`,
                                    onEntitlementClick ? "cc-entitlement-panel__item--clickable" : null,
                                ]
                                    .filter(Boolean)
                                    .join(" "), style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--space-2, 0.375rem)",
                                    padding: "var(--space-2, 0.375rem) var(--space-3, 0.5rem)",
                                    borderRadius: "var(--radius-1, 4px)",
                                    border: "1px solid var(--border-1)",
                                    cursor: onEntitlementClick ? "pointer" : "default",
                                    fontSize: "var(--text-sm, 0.875rem)",
                                }, onClick: onEntitlementClick ? () => onEntitlementClick(ent) : undefined, role: onEntitlementClick ? "button" : undefined, tabIndex: onEntitlementClick ? 0 : undefined, onKeyDown: onEntitlementClick
                                    ? (e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            onEntitlementClick(ent);
                                        }
                                    }
                                    : undefined, children: [_jsx("span", { className: "cc-entitlement-panel__source-dot", style: {
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: SOURCE_COLORS[ent.source],
                                            flexShrink: 0,
                                        }, "aria-hidden": "true" }), _jsx("span", { className: "cc-entitlement-panel__item-label", style: { flex: 1, fontWeight: 500 }, children: ent.label }), ent.inheritedFrom && (_jsxs("span", { className: "cc-entitlement-panel__inherited-from", style: { fontSize: "var(--text-xs, 0.75rem)", color: "var(--text-3)" }, children: ["via ", ent.inheritedFrom] })), ent.expiresAt && (_jsxs("span", { className: "cc-entitlement-panel__expiry", style: { fontSize: "var(--text-xs, 0.75rem)", color: "var(--warning-text)" }, children: ["expires ", formatExpiry(ent.expiresAt)] }))] }, ent.id))) })] }, key))) })] }));
}
//# sourceMappingURL=EntitlementPanel.js.map