import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const DIRECTION_ARROWS = {
    outgoing: "→",
    incoming: "←",
    bidirectional: "↔",
};
function edgeTypeColor(type) {
    switch (type) {
        case "depends-on":
            return {
                bg: "var(--warning-light)",
                border: "var(--warning-border)",
                text: "var(--warning-text)",
            };
        case "provides":
            return {
                bg: "var(--success-light)",
                border: "var(--success-border)",
                text: "var(--success-text)",
            };
        case "consumes":
            return {
                bg: "var(--info-light, var(--accent-light))",
                border: "var(--info-border, var(--accent-border))",
                text: "var(--info-text, var(--accent-text))",
            };
        default:
            return {
                bg: "var(--surface-2)",
                border: "var(--border-1)",
                text: "var(--text-2)",
            };
    }
}
export function GraphEdgeChip({ source, target, edgeType, weight, direction = "outgoing", onClick, className, ...rest }) {
    const interactive = typeof onClick === "function";
    const colors = edgeTypeColor(edgeType);
    const arrow = DIRECTION_ARROWS[direction];
    const classes = [
        "cc-graph-edge-chip",
        `cc-graph-edge-chip--${edgeType}`,
        interactive ? "cc-graph-edge-chip--interactive" : null,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const style = {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1, 0.25rem)",
        padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
        borderRadius: "999px",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        fontSize: "var(--text-xs, 0.75rem)",
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: "nowrap",
        cursor: interactive ? "pointer" : "default",
    };
    const inner = (_jsxs(_Fragment, { children: [_jsx("span", { className: "cc-graph-edge-chip__source", children: source }), _jsx("span", { className: "cc-graph-edge-chip__arrow", "aria-hidden": "true", children: arrow }), _jsx("span", { className: "cc-graph-edge-chip__target", children: target }), _jsx("span", { className: "cc-graph-edge-chip__type", style: {
                    padding: "0 var(--space-1, 0.25rem)",
                    borderLeft: `1px solid ${colors.border}`,
                    marginLeft: "var(--space-1, 0.25rem)",
                }, children: edgeType }), weight !== undefined && (_jsxs("span", { className: "cc-graph-edge-chip__weight", style: {
                    fontWeight: 700,
                    fontSize: "var(--text-xs, 0.75rem)",
                }, children: [Math.round(weight * 100), "%"] }))] }));
    if (interactive) {
        return (_jsx("button", { type: "button", className: classes, onClick: onClick, "aria-label": rest["aria-label"] ?? `${source} ${edgeType} ${target}`, style: style, children: inner }));
    }
    return (_jsx("span", { className: classes, "aria-label": rest["aria-label"] ?? `${source} ${edgeType} ${target}`, style: style, children: inner }));
}
//# sourceMappingURL=GraphEdgeChip.js.map