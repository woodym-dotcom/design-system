import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CB_TONE = {
    closed: "var(--success-text, #16a34a)",
    open: "var(--error-text, #dc2626)",
    "half-open": "var(--warning-text, #ca8a04)",
};
export function CommanderView({ list, detail, timeline, ratios = [1, 2, 1], minPaneWidth = 200, title, circuitBreaker, vendorLanes, className, ...rest }) {
    const classes = ["cc-commander-view", className].filter(Boolean).join(" ");
    return (_jsxs("div", { role: "region", "aria-label": rest["aria-label"] ?? title ?? "Commander view", className: classes, style: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
        }, children: [(title || circuitBreaker) && (_jsxs("header", { className: "cc-commander-view__header", style: {
                    padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
                    borderBottom: "1px solid var(--border-1)",
                    fontWeight: 600,
                    fontSize: "var(--text-lg, 1.125rem)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3, 0.5rem)",
                }, children: [title && _jsx("span", { children: title }), circuitBreaker && (_jsxs("span", { className: `cc-commander-view__cb cc-commander-view__cb--${circuitBreaker.state}`, "aria-label": `Circuit breaker: ${circuitBreaker.label ?? circuitBreaker.state}`, style: {
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "var(--text-sm, 0.875rem)",
                            fontWeight: 500,
                            color: CB_TONE[circuitBreaker.state],
                        }, children: [_jsx("span", { "aria-hidden": "true", style: {
                                    display: "inline-block",
                                    width: "0.5rem",
                                    height: "0.5rem",
                                    borderRadius: "50%",
                                    background: CB_TONE[circuitBreaker.state],
                                } }), circuitBreaker.label ?? circuitBreaker.state] }))] })), circuitBreaker && circuitBreaker.state !== "closed" && circuitBreaker.detail && (_jsx("div", { className: "cc-commander-view__cb-detail", role: "alert", style: {
                    padding: "var(--space-2, 0.375rem) var(--space-4, 0.75rem)",
                    borderBottom: "1px solid var(--border-1)",
                    fontSize: "var(--text-sm, 0.875rem)",
                    background: "var(--surface-2, #f5f5f5)",
                }, children: circuitBreaker.detail })), _jsxs("div", { className: "cc-commander-view__panes", style: {
                    display: "flex",
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                }, children: [_jsx("div", { className: "cc-commander-view__pane cc-commander-view__pane--list", style: {
                            flex: `${ratios[0]} 1 0%`,
                            minWidth: `${minPaneWidth}px`,
                            borderRight: "1px solid var(--border-1)",
                            overflowY: "auto",
                        }, children: list }), _jsx("div", { className: "cc-commander-view__pane cc-commander-view__pane--detail", style: {
                            flex: `${ratios[1]} 1 0%`,
                            minWidth: `${minPaneWidth}px`,
                            borderRight: "1px solid var(--border-1)",
                            overflowY: "auto",
                        }, children: detail }), _jsx("div", { className: "cc-commander-view__pane cc-commander-view__pane--timeline", style: {
                            flex: `${ratios[2]} 1 0%`,
                            minWidth: `${minPaneWidth}px`,
                            borderRight: vendorLanes && vendorLanes.length > 0 ? "1px solid var(--border-1)" : undefined,
                            overflowY: "auto",
                        }, children: timeline }), vendorLanes && vendorLanes.map((lane) => (_jsxs("div", { className: "cc-commander-view__pane cc-commander-view__pane--vendor-lane", "aria-label": lane.label, style: {
                            flex: "1 1 0%",
                            minWidth: `${minPaneWidth}px`,
                            borderRight: "1px solid var(--border-1)",
                            overflowY: "auto",
                        }, children: [_jsx("div", { style: {
                                    padding: "var(--space-2, 0.375rem) var(--space-3, 0.5rem)",
                                    fontWeight: 600,
                                    fontSize: "var(--text-sm, 0.875rem)",
                                    borderBottom: "1px solid var(--border-1)",
                                }, children: lane.label }), lane.content] }, lane.id)))] })] }));
}
//# sourceMappingURL=CommanderView.js.map