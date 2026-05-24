import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const STATUS_COLORS = {
    healthy: "var(--success-text)",
    degraded: "var(--warning-text)",
    down: "var(--error-text)",
    unknown: "var(--text-4)",
};
/**
 * Simple layered layout: assign each node a layer based on longest
 * incoming path, then space within each layer.
 */
function layoutNodes(nodes, edges, nodeWidth, nodeHeight, hGap, vGap) {
    // Build adjacency
    const incoming = new Map();
    for (const n of nodes)
        incoming.set(n.id, new Set());
    for (const e of edges) {
        incoming.get(e.target)?.add(e.source);
    }
    // Assign layers (topological depth)
    const layers = new Map();
    function depth(id, visited) {
        if (layers.has(id))
            return layers.get(id);
        if (visited.has(id))
            return 0; // cycle guard
        visited.add(id);
        const parents = incoming.get(id) ?? new Set();
        const d = parents.size === 0
            ? 0
            : Math.max(...Array.from(parents).map((p) => depth(p, visited))) + 1;
        layers.set(id, d);
        return d;
    }
    for (const n of nodes)
        depth(n.id, new Set());
    // Group by layer
    const layerGroups = new Map();
    for (const n of nodes) {
        const l = layers.get(n.id) ?? 0;
        const group = layerGroups.get(l) ?? [];
        group.push(n);
        layerGroups.set(l, group);
    }
    const positioned = [];
    for (const [layer, group] of layerGroups.entries()) {
        group.forEach((node, idx) => {
            positioned.push({
                ...node,
                x: idx * (nodeWidth + hGap) + hGap / 2,
                y: layer * (nodeHeight + vGap) + vGap / 2,
            });
        });
    }
    return positioned;
}
export function DependencyGraphPane({ nodes, edges, title, onNodeClick, selectedNodeId, nodeWidth = 140, nodeHeight = 40, hGap = 60, vGap = 80, className, }) {
    const positioned = layoutNodes(nodes, edges, nodeWidth, nodeHeight, hGap, vGap);
    const posMap = new Map();
    for (const p of positioned)
        posMap.set(p.id, p);
    // Compute SVG viewBox
    const maxX = Math.max(...positioned.map((p) => p.x + nodeWidth), nodeWidth + hGap);
    const maxY = Math.max(...positioned.map((p) => p.y + nodeHeight), nodeHeight + vGap);
    const svgWidth = maxX + hGap;
    const svgHeight = maxY + vGap / 2;
    const classes = ["cc-dependency-graph-pane", className]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { className: classes, role: "img", "aria-label": title ?? "Dependency graph", style: {
            display: "flex",
            flexDirection: "column",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius-2, 8px)",
            background: "var(--surface-1)",
            overflow: "auto",
        }, children: [title && (_jsx("header", { className: "cc-dependency-graph-pane__header", style: {
                    padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
                    borderBottom: "1px solid var(--border-1)",
                    fontWeight: 600,
                    fontSize: "var(--text-base, 1rem)",
                }, children: title })), _jsxs("svg", { className: "cc-dependency-graph-pane__svg", viewBox: `0 0 ${svgWidth} ${svgHeight}`, width: svgWidth, height: svgHeight, style: { display: "block" }, children: [edges.map((edge, i) => {
                        const src = posMap.get(edge.source);
                        const tgt = posMap.get(edge.target);
                        if (!src || !tgt)
                            return null;
                        const x1 = src.x + nodeWidth / 2;
                        const y1 = src.y + nodeHeight;
                        const x2 = tgt.x + nodeWidth / 2;
                        const y2 = tgt.y;
                        return (_jsxs("g", { children: [_jsx("line", { x1: x1, y1: y1, x2: x2, y2: y2, stroke: "var(--border-1)", strokeWidth: 1.5, strokeDasharray: edge.style === "dashed" ? "4 3" : undefined, markerEnd: "url(#dep-arrow)" }), edge.label && (_jsx("text", { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 4, textAnchor: "middle", fontSize: 10, fill: "var(--text-3)", children: edge.label }))] }, `edge-${i}`));
                    }), _jsx("defs", { children: _jsx("marker", { id: "dep-arrow", viewBox: "0 0 10 10", refX: 10, refY: 5, markerWidth: 8, markerHeight: 8, orient: "auto-start-reverse", children: _jsx("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "var(--border-1)" }) }) }), positioned.map((node) => {
                        const isSelected = node.id === selectedNodeId;
                        return (_jsxs("g", { className: `cc-dependency-graph-pane__node${isSelected ? " cc-dependency-graph-pane__node--selected" : ""}`, style: { cursor: onNodeClick ? "pointer" : "default" }, onClick: onNodeClick ? () => onNodeClick(node) : undefined, tabIndex: onNodeClick ? 0 : undefined, role: onNodeClick ? "button" : undefined, onKeyDown: onNodeClick
                                ? (e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onNodeClick(node);
                                    }
                                }
                                : undefined, children: [_jsx("rect", { x: node.x, y: node.y, width: nodeWidth, height: nodeHeight, rx: 6, fill: isSelected ? "var(--accent-light)" : "var(--surface-2)", stroke: isSelected ? "var(--accent-border)" : "var(--border-1)", strokeWidth: isSelected ? 2 : 1 }), node.status && (_jsx("circle", { cx: node.x + 12, cy: node.y + nodeHeight / 2, r: 4, fill: STATUS_COLORS[node.status] })), _jsx("text", { x: node.x + (node.status ? 22 : 8), y: node.y + nodeHeight / 2 + 4, fontSize: 12, fill: "var(--text-1)", fontWeight: 500, children: node.label })] }, node.id));
                    })] })] }));
}
//# sourceMappingURL=DependencyGraphPane.js.map