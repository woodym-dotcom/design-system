import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function KpiTile({ label, value, delta }) {
    return (_jsxs("div", { className: "cc-kpi-tile", children: [_jsx("p", { className: "cc-kpi-tile__label", children: label }), _jsx("div", { className: "cc-kpi-tile__value", children: value }), delta !== undefined ? (_jsx("div", { className: "cc-kpi-tile__delta", children: delta })) : null] }));
}
// ── Component ─────────────────────────────────────────────────────────────────
export function MonitoringPage({ kpis = [], chartSections = [], emptyState, className, }) {
    const classes = ['cc-monitoring-page'];
    if (className)
        classes.push(className);
    const hasContent = kpis.length > 0 || chartSections.length > 0;
    if (!hasContent) {
        return (_jsx("div", { className: classes.join(' '), children: _jsx("div", { className: "cc-monitoring-page__empty", children: emptyState ?? 'No monitoring data available.' }) }));
    }
    return (_jsxs("div", { className: classes.join(' '), children: [kpis.length > 0 ? (_jsx("div", { className: "cc-monitoring-page__kpi-row", children: kpis.map((kpi, i) => (_jsx(KpiTile, { ...kpi }, i))) })) : null, chartSections.map((section, i) => (_jsxs("div", { className: "cc-monitoring-page__chart-section", children: [_jsx("h3", { className: "cc-monitoring-page__chart-heading", children: section.heading }), section.render()] }, i)))] }));
}
//# sourceMappingURL=MonitoringPage.js.map