import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tag } from "./Tag.js";
const DIRECTION_ARROWS = {
    outgoing: "→",
    incoming: "←",
    bidirectional: "↔",
};
function edgeTypeTone(type) {
    switch (type) {
        case "depends-on":
            return "warning";
        case "provides":
            return "success";
        case "consumes":
            return "info";
        default:
            return "neutral";
    }
}
export function GraphEdgeChip({ source, target, edgeType, weight, direction = "outgoing", onClick, className, ...rest }) {
    const arrow = DIRECTION_ARROWS[direction];
    const classes = [
        "cc-graph-edge-chip",
        `cc-graph-edge-chip--${edgeType}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs(Tag, { tone: edgeTypeTone(edgeType), onClick: onClick, "aria-label": rest["aria-label"] ?? `${source} ${edgeType} ${target}`, className: classes, children: [_jsx("span", { className: "cc-graph-edge-chip__source", children: source }), _jsx("span", { className: "cc-graph-edge-chip__arrow", "aria-hidden": "true", children: arrow }), _jsx("span", { className: "cc-graph-edge-chip__target", children: target }), _jsx("span", { className: "cc-graph-edge-chip__type", children: edgeType }), weight !== undefined && (_jsxs("span", { className: "cc-graph-edge-chip__weight", children: [Math.round(weight * 100), "%"] }))] }));
}
//# sourceMappingURL=GraphEdgeChip.js.map