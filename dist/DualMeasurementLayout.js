import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CB_BAND_COLOR = {
    closed: "var(--success-light, #dcfce7)",
    open: "var(--error-light, #fef2f2)",
    "half-open": "var(--warning-light, #fefce8)",
};
export function DualMeasurementLayout({ continuous, continuousLabel, discrete, discreteLabel, direction = "horizontal", ratio = [1, 1], title, variant = "default", topRight, topRightLabel, bottomRight, bottomRightLabel, circuitBreakerBands, className, }) {
    const classes = [
        "cc-dual-measurement",
        `cc-dual-measurement--${direction}`,
        variant !== "default" ? `cc-dual-measurement--${variant}` : null,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const isHorizontal = direction === "horizontal";
    return (_jsxs("div", { className: classes, style: {
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3, 0.5rem)",
        }, children: [title && (_jsx("h3", { className: "cc-dual-measurement__title", style: {
                    margin: 0,
                    fontSize: "var(--text-lg, 1.125rem)",
                    fontWeight: 600,
                }, children: title })), circuitBreakerBands && circuitBreakerBands.length > 0 && (_jsx("div", { className: "cc-dual-measurement__cb-bands", role: "group", "aria-label": "Circuit breaker status", children: circuitBreakerBands.map((band) => (_jsxs("div", { className: `cc-dual-measurement__cb-band cc-dual-measurement__cb-band--${band.state}`, style: {
                        padding: "var(--space-2, 0.375rem) var(--space-3, 0.5rem)",
                        borderRadius: "var(--radius-1, 4px)",
                        background: CB_BAND_COLOR[band.state] ?? "var(--surface-2)",
                        fontSize: "var(--text-sm, 0.875rem)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2, 0.375rem)",
                    }, children: [_jsxs("span", { style: { fontWeight: 600 }, children: [band.label, ": ", band.state] }), band.detail && _jsx("span", { children: band.detail })] }, band.id))) })), variant === "horizon-stack" ? (_jsx("div", { className: "cc-dual-measurement__horizon-grid", style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridTemplateRows: "1fr 1fr",
                    gap: "var(--space-4, 0.75rem)",
                }, children: [
                    { content: continuous, label: continuousLabel ?? "Top-left", cls: "continuous" },
                    { content: topRight, label: topRightLabel ?? "Top-right", cls: "top-right" },
                    { content: discrete, label: discreteLabel ?? "Bottom-left", cls: "discrete" },
                    { content: bottomRight, label: bottomRightLabel ?? "Bottom-right", cls: "bottom-right" },
                ].map((pane) => (_jsxs("section", { className: `cc-dual-measurement__pane cc-dual-measurement__pane--${pane.cls}`, "aria-label": pane.label, style: {
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-2, 0.375rem)",
                        padding: "var(--space-4, 0.75rem)",
                        borderRadius: "var(--radius-2, 8px)",
                        border: "1px solid var(--border-1)",
                        background: "var(--surface-1)",
                        minWidth: 0,
                    }, children: [_jsx("h4", { className: "cc-dual-measurement__pane-label", style: {
                                margin: 0,
                                fontSize: "var(--text-sm, 0.875rem)",
                                fontWeight: 600,
                                color: "var(--text-2)",
                            }, children: pane.label }), _jsx("div", { className: "cc-dual-measurement__pane-content", children: pane.content })] }, pane.cls))) })) : (_jsxs("div", { className: "cc-dual-measurement__panes", style: {
                    display: "flex",
                    flexDirection: isHorizontal ? "row" : "column",
                    gap: "var(--space-4, 0.75rem)",
                }, children: [_jsxs("section", { className: "cc-dual-measurement__pane cc-dual-measurement__pane--continuous", "aria-label": continuousLabel ?? "Continuous measurement", style: {
                            flex: `${ratio[0]} 1 0%`,
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--space-2, 0.375rem)",
                            padding: "var(--space-4, 0.75rem)",
                            borderRadius: "var(--radius-2, 8px)",
                            border: "1px solid var(--border-1)",
                            background: "var(--surface-1)",
                            minWidth: 0,
                        }, children: [continuousLabel && (_jsx("h4", { className: "cc-dual-measurement__pane-label", style: {
                                    margin: 0,
                                    fontSize: "var(--text-sm, 0.875rem)",
                                    fontWeight: 600,
                                    color: "var(--text-2)",
                                }, children: continuousLabel })), _jsx("div", { className: "cc-dual-measurement__pane-content", children: continuous })] }), _jsxs("section", { className: "cc-dual-measurement__pane cc-dual-measurement__pane--discrete", "aria-label": discreteLabel ?? "Discrete measurement", style: {
                            flex: `${ratio[1]} 1 0%`,
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--space-2, 0.375rem)",
                            padding: "var(--space-4, 0.75rem)",
                            borderRadius: "var(--radius-2, 8px)",
                            border: "1px solid var(--border-1)",
                            background: "var(--surface-1)",
                            minWidth: 0,
                        }, children: [discreteLabel && (_jsx("h4", { className: "cc-dual-measurement__pane-label", style: {
                                    margin: 0,
                                    fontSize: "var(--text-sm, 0.875rem)",
                                    fontWeight: 600,
                                    color: "var(--text-2)",
                                }, children: discreteLabel })), _jsx("div", { className: "cc-dual-measurement__pane-content", children: discrete })] })] }))] }));
}
//# sourceMappingURL=DualMeasurementLayout.js.map