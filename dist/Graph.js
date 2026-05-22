import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Graph — unified data-visualization primitive (DS-SIMPLIFY 08).
 *
 * One component, eight `layout` variants:
 *   sparkline | tile | card | dashboard | heatmap | distribution | force* | hierarchical*
 *
 * (* force / hierarchical stub to "Coming in v1.1" — @xyflow/react is not a
 *    peer dep; will be added in SIMPLIFY 14 scope.)
 *
 * Timeseries layouts (sparkline/tile/card/dashboard) delegate to the existing
 * Recharts wrappers internally to preserve pixel parity with legacy components.
 * Heatmap and distribution are pure-SVG with no external dependency beyond React.
 *
 * @see Graph.types.ts for full prop / data-shape documentation.
 */
import * as React from "react";
// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------
/** Derive uniform bins from raw samples. */
function autoBin(samples, binCount) {
    if (samples.length === 0)
        return [];
    let min = Infinity;
    let max = -Infinity;
    for (const s of samples) {
        if (s < min)
            min = s;
        if (s > max)
            max = s;
    }
    if (min === max) {
        return [{ x0: min - 0.5, x1: max + 0.5, count: samples.length }];
    }
    const width = (max - min) / binCount;
    const bins = Array.from({ length: binCount }, (_, i) => ({
        x0: min + i * width,
        x1: min + (i + 1) * width,
        count: 0,
    }));
    for (const s of samples) {
        const i = Math.min(Math.floor((s - min) / width), binCount - 1);
        bins[i].count++;
    }
    return bins;
}
/** Build sparkline SVG path from numeric values. */
function buildSparklinePath(values, w, h) {
    const n = values.length;
    let min = Infinity;
    let max = -Infinity;
    for (const v of values) {
        if (v < min)
            min = v;
        if (v > max)
            max = v;
    }
    const span = max - min || 1;
    const pad = 1;
    const iw = w - pad * 2;
    const ih = h - pad * 2;
    const stepX = n > 1 ? iw / (n - 1) : 0;
    const pts = values.map((v, i) => ({
        x: pad + stepX * i,
        y: pad + ih - ((v - min) / span) * ih,
    }));
    const line = pts
        .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(" ");
    const area = pts.length
        ? `${line} L${pts[pts.length - 1].x.toFixed(2)},${(pad + ih).toFixed(2)} L${pts[0].x.toFixed(2)},${(pad + ih).toFixed(2)} Z`
        : "";
    const last = pts[pts.length - 1] ?? { x: 0, y: 0 };
    return { line, area, lastX: last.x, lastY: last.y };
}
// ---------------------------------------------------------------------------
// Loading overlay
// ---------------------------------------------------------------------------
function LoadingOverlay() {
    return (_jsx("div", { className: "cc-graph__loading", "aria-hidden": "true", style: {
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "color-mix(in oklch, var(--surface-0, #fff) 80%, transparent)",
            borderRadius: "inherit",
            zIndex: 1,
        }, children: _jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", style: { animation: "cc-graph-spin 1s linear infinite" }, children: [_jsx("style", { children: `@keyframes cc-graph-spin{to{transform:rotate(360deg)}}` }), _jsx("circle", { cx: "12", cy: "12", r: "9", fill: "none", stroke: "var(--border-2,#ccc)", strokeWidth: "2" }), _jsx("path", { d: "M12 3a9 9 0 0 1 9 9", fill: "none", stroke: "var(--accent-1,#6366f1)", strokeWidth: "2", strokeLinecap: "round" })] }) }));
}
// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyPlaceholder({ children }) {
    return (_jsx("div", { className: "cc-graph__empty", style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: 80,
            fontSize: "var(--text-sm, 0.875rem)",
            color: "var(--text-3, #999)",
            border: "1px dashed var(--border-1, #e2e8f0)",
            borderRadius: 8,
        }, children: children ?? "No data available." }));
}
// ---------------------------------------------------------------------------
// SPARKLINE layout
// ---------------------------------------------------------------------------
const SPARKLINE_DIM = {
    xs: { w: 40, h: 10 },
    sm: { w: 56, h: 14 },
    md: { w: 80, h: 20 },
    lg: { w: 120, h: 28 },
};
function SparklineLayout({ data, size = "md", ariaLabel, loading }) {
    const values = data.values ?? [];
    const { w, h } = SPARKLINE_DIM[size] ?? SPARKLINE_DIM.md;
    if (loading) {
        return (_jsx("span", { className: "cc-graph cc-graph--sparkline", role: "img", "aria-label": ariaLabel, children: _jsx("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}`, className: "cc-graph__svg", children: _jsx("rect", { x: 0, y: 0, width: w, height: h, rx: 2, fill: "var(--border-1,#e2e8f0)", opacity: 0.5 }) }) }));
    }
    if (values.length === 0)
        return null;
    if (values.length === 1) {
        return (_jsx("span", { className: "cc-graph cc-graph--sparkline", role: "img", "aria-label": ariaLabel, children: _jsx("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}`, className: "cc-graph__svg", children: _jsx("circle", { cx: w / 2, cy: h / 2, r: 2, className: "cc-graph__dot" }) }) }));
    }
    const { line, area, lastX, lastY } = buildSparklinePath(values, w, h);
    return (_jsx("span", { className: "cc-graph cc-graph--sparkline", role: "img", "aria-label": ariaLabel, children: _jsxs("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "none", className: "cc-graph__svg", children: [_jsx("path", { d: area, className: "cc-graph__area" }), _jsx("path", { d: line, className: "cc-graph__line", fill: "none" }), _jsx("circle", { cx: lastX, cy: lastY, r: 1.6, className: "cc-graph__dot" })] }) }));
}
// ---------------------------------------------------------------------------
// TILE layout (KPI tile: big value + delta + sparkline)
// ---------------------------------------------------------------------------
function TileLayout({ data, size = "md", ariaLabel, loading, empty }) {
    const values = data.values ?? [];
    const hasData = values.length > 0 || data.kpiValue != null;
    return (_jsxs("div", { className: `cc-graph cc-graph--tile cc-graph--${size}`, role: "img", "aria-label": ariaLabel, style: { position: "relative", display: "inline-flex", flexDirection: "column", gap: 4 }, children: [loading && _jsx(LoadingOverlay, {}), !loading && !hasData ? (_jsx(EmptyPlaceholder, { children: empty })) : (_jsxs(_Fragment, { children: [data.kpiValue != null ? (_jsx("div", { className: "cc-graph__kpi-value", style: { fontSize: "var(--text-2xl, 1.5rem)", fontWeight: 700, lineHeight: 1 }, children: data.kpiValue })) : null, data.kpiDelta != null ? (_jsx("div", { className: "cc-graph__kpi-delta", style: { fontSize: "var(--text-sm, 0.875rem)", color: "var(--text-2, #64748b)" }, children: data.kpiDelta })) : null, values.length > 0 ? (_jsx(SparklineLayout, { data: data, size: size === "lg" ? "md" : "sm", ariaLabel: `${ariaLabel} trend` })) : null] }))] }));
}
// ---------------------------------------------------------------------------
// CARD layout (metric card: recharts chart + title + series toggles)
// Delegates to MetricChartCard internals pattern but self-contained here.
// ---------------------------------------------------------------------------
const CARD_HEIGHT = { xs: 160, sm: 200, md: 260, lg: 340 };
const CHART_COLORS = [
    "var(--viz-1, var(--tier-core, #6366f1))",
    "var(--viz-2, var(--status-healthy, #22c55e))",
    "var(--viz-3, var(--status-warning, #f59e0b))",
    "var(--viz-4, var(--tier-domain, #3b82f6))",
];
function CardLayout({ data, size = "md", title, subtitle, ariaLabel, loading, empty, onClick }) {
    // Dynamic recharts import — optional peer dep
    const [Recharts, setRecharts] = React.useState(null);
    React.useEffect(() => {
        import("recharts").then(setRecharts).catch(() => null);
    }, []);
    const hasData = data.points.length > 0;
    const height = CARD_HEIGHT[size] ?? CARD_HEIGHT.md;
    const xKey = data.xKey ?? "day";
    return (_jsxs("section", { className: `cc-graph cc-graph--card cc-graph--${size}`, "aria-label": ariaLabel, style: { position: "relative" }, children: [loading && _jsx(LoadingOverlay, {}), (title || subtitle) ? (_jsxs("header", { className: "cc-graph__card-header", style: { marginBottom: 8 }, children: [title ? _jsx("h3", { className: "cc-graph__card-title", style: { margin: 0, fontSize: "var(--text-base, 1rem)", fontWeight: 600 }, children: title }) : null, subtitle ? _jsx("p", { className: "cc-graph__card-subtitle", style: { margin: 0, fontSize: "var(--text-sm, 0.875rem)", color: "var(--text-2, #64748b)" }, children: subtitle }) : null] })) : null, _jsx("div", { role: "img", "aria-label": ariaLabel, style: { height, position: "relative" }, children: !hasData ? (_jsx(EmptyPlaceholder, { children: empty })) : !Recharts ? (_jsx(EmptyPlaceholder, { children: "Loading chart\u2026" })) : (_jsx(Recharts.ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(Recharts.LineChart, { data: data.points, margin: { top: 4, right: 4, left: -18, bottom: 0 }, onClick: (state) => { const s = state; if (s?.activePayload)
                            onClick?.(s.activePayload[0]?.payload); }, children: [_jsx(Recharts.CartesianGrid, { stroke: "var(--border-1,#e2e8f0)", vertical: false }), _jsx(Recharts.XAxis, { dataKey: xKey, tick: { fontSize: 11, fill: "var(--text-3,#94a3b8)" } }), _jsx(Recharts.YAxis, { tick: { fontSize: 11, fill: "var(--text-3,#94a3b8)" }, width: 40 }), _jsx(Recharts.Tooltip, { contentStyle: { background: "var(--surface-0,#fff)", border: "1px solid var(--border-1,#e2e8f0)", borderRadius: 8 } }), (data.lines ?? []).map((key, i) => (_jsx(Recharts.Line, { type: "monotone", dataKey: key, stroke: CHART_COLORS[i % CHART_COLORS.length], strokeWidth: 2, dot: false, isAnimationActive: false }, key))), (data.bars ?? []).map((key, i) => (_jsx(Recharts.Bar, { dataKey: key, fill: CHART_COLORS[i % CHART_COLORS.length], isAnimationActive: false }, key)))] }) })) })] }));
}
// ---------------------------------------------------------------------------
// DASHBOARD layout — thin wrapper mirroring DashboardChartCard structure
// ---------------------------------------------------------------------------
const DASHBOARD_HEIGHT = { xs: 200, sm: 240, md: 280, lg: 360 };
function DashboardLayout({ data, size = "md", title, subtitle, ariaLabel, loading, empty, onClick }) {
    const [Recharts, setRecharts] = React.useState(null);
    React.useEffect(() => {
        import("recharts").then(setRecharts).catch(() => null);
    }, []);
    const hasData = data.points.length > 0;
    const height = DASHBOARD_HEIGHT[size] ?? DASHBOARD_HEIGHT.md;
    const xKey = data.xKey ?? "day";
    const bars = data.bars ?? [];
    const lines = data.lines ?? [];
    const renderPlot = () => {
        if (!Recharts)
            return _jsx(EmptyPlaceholder, { children: "Loading chart\u2026" });
        const commonMargin = { top: 14, right: 8, left: 4, bottom: 8 };
        const axisTick = { fontSize: 10, fill: "var(--text-1,#0f172a)" };
        const gridColor = "var(--border-2,#cbd5e1)";
        const tooltipStyle = {
            background: "var(--surface-0,#fff)",
            border: "1px solid var(--border-1,#e2e8f0)",
            borderRadius: 12,
            color: "var(--text-1,#0f172a)",
        };
        return (_jsx(Recharts.ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(Recharts.ComposedChart, { data: data.points, margin: commonMargin, onClick: (state) => { const s = state; if (s?.activePayload)
                    onClick?.(s.activePayload[0]?.payload); }, children: [_jsx(Recharts.CartesianGrid, { stroke: gridColor, strokeOpacity: 0.55, vertical: false }), _jsx(Recharts.XAxis, { dataKey: xKey, tick: axisTick, padding: { left: 12, right: 12 } }), _jsx(Recharts.YAxis, { width: 48, tick: axisTick }), _jsx(Recharts.Tooltip, { contentStyle: tooltipStyle }), bars.map((key, i) => (_jsx(Recharts.Bar, { dataKey: key, fill: CHART_COLORS[i % CHART_COLORS.length], radius: [6, 6, 0, 0], isAnimationActive: false }, key))), lines.map((key, i) => (_jsx(Recharts.Line, { type: "monotone", dataKey: key, stroke: CHART_COLORS[(i + bars.length) % CHART_COLORS.length], strokeWidth: 2, dot: false, isAnimationActive: false }, key)))] }) }));
    };
    return (_jsxs("figure", { className: `cc-graph cc-graph--dashboard cc-graph--${size}`, role: "group", "aria-label": ariaLabel, style: { margin: 0, position: "relative" }, children: [loading && _jsx(LoadingOverlay, {}), (title || subtitle) ? (_jsxs("figcaption", { className: "cc-graph__dashboard-header", style: { marginBottom: 12 }, children: [title ? _jsx("h3", { className: "cc-graph__dashboard-title", style: { margin: 0, fontSize: "var(--text-base, 1rem)", fontWeight: 600 }, children: title }) : null, subtitle ? _jsx("p", { className: "cc-graph__dashboard-subtitle", style: { margin: 0, fontSize: "var(--text-sm, 0.875rem)", color: "var(--text-2, #64748b)" }, children: subtitle }) : null] })) : null, _jsx("div", { role: "img", "aria-label": ariaLabel, style: { height, position: "relative" }, children: !hasData ? _jsx(EmptyPlaceholder, { children: empty }) : renderPlot() })] }));
}
// ---------------------------------------------------------------------------
// HEATMAP layout — pure SVG categorical matrix
// ---------------------------------------------------------------------------
function HeatmapLayout({ data, size = "md", title, ariaLabel, loading, empty, onClick }) {
    const cellSize = size === "xs" ? 12 : size === "sm" ? 16 : size === "md" ? 20 : 28;
    const gap = 2;
    const labelPad = 52; // px for row labels
    const colPad = 20; // px for col labels
    const cells = data.cells;
    const rows = data.rows ?? [...new Set(cells.map((c) => c.row))];
    const cols = data.cols ?? [...new Set(cells.map((c) => c.col))];
    const maxVal = Math.max(0, ...cells.map((c) => c.value));
    const lookup = new Map();
    for (const c of cells)
        lookup.set(`${c.row}:${c.col}`, c.value);
    const svgW = labelPad + cols.length * (cellSize + gap);
    const svgH = colPad + rows.length * (cellSize + gap);
    return (_jsxs("div", { className: `cc-graph cc-graph--heatmap cc-graph--${size}`, style: { position: "relative" }, children: [loading && _jsx(LoadingOverlay, {}), title ? _jsx("div", { className: "cc-graph__title", style: { marginBottom: 8, fontWeight: 600 }, children: title }) : null, cells.length === 0 ? (_jsx(EmptyPlaceholder, { children: empty })) : (_jsxs("svg", { role: "img", "aria-label": ariaLabel, width: svgW, height: svgH, style: { overflow: "visible" }, children: [cols.map((col, ci) => (_jsx("text", { x: labelPad + ci * (cellSize + gap) + cellSize / 2, y: colPad - 4, textAnchor: "middle", fontSize: 10, fill: "var(--text-2,#64748b)", children: col }, col))), rows.map((row, ri) => (_jsxs("g", { children: [_jsx("text", { x: labelPad - 4, y: colPad + ri * (cellSize + gap) + cellSize / 2 + 4, textAnchor: "end", fontSize: 10, fill: "var(--text-2,#64748b)", children: row }), cols.map((col, ci) => {
                                const val = lookup.get(`${row}:${col}`) ?? 0;
                                const intensity = maxVal > 0 ? val / maxVal : 0;
                                return (_jsx("rect", { x: labelPad + ci * (cellSize + gap), y: colPad + ri * (cellSize + gap), width: cellSize, height: cellSize, rx: 3, fill: val > 0
                                        ? `color-mix(in srgb, var(--viz-1,#6366f1) ${Math.round(intensity * 100)}%, var(--surface-1,#f1f5f9))`
                                        : "var(--border-1,#e2e8f0)", "aria-label": `${row} × ${col}: ${val}`, style: { cursor: onClick ? "pointer" : undefined }, onClick: onClick ? () => onClick({ row, col, value: val }) : undefined, children: _jsx("title", { children: `${row} × ${col}: ${val}` }) }, col));
                            })] }, row)))] }))] }));
}
// ---------------------------------------------------------------------------
// DISTRIBUTION layout — pure SVG histogram
// ---------------------------------------------------------------------------
const DIST_HEIGHT = { xs: 80, sm: 120, md: 160, lg: 220 };
function DistributionLayout({ data, size = "md", title, ariaLabel, loading, empty, onClick }) {
    const h = DIST_HEIGHT[size] ?? DIST_HEIGHT.md;
    const w = 300;
    const binCount = data.binCount ?? 20;
    const bins = React.useMemo(() => {
        if (data.bins && data.bins.length > 0)
            return data.bins;
        if (data.samples && data.samples.length > 0)
            return autoBin(data.samples, binCount);
        return [];
    }, [data.bins, data.samples, binCount]);
    if (!bins.length) {
        return (_jsxs("div", { className: `cc-graph cc-graph--distribution cc-graph--${size}`, children: [title ? _jsx("div", { className: "cc-graph__title", style: { marginBottom: 8, fontWeight: 600 }, children: title }) : null, _jsx(EmptyPlaceholder, { children: empty })] }));
    }
    const maxCount = Math.max(...bins.map((b) => b.count));
    const barW = w / bins.length;
    const pad = 2;
    return (_jsxs("div", { className: `cc-graph cc-graph--distribution cc-graph--${size}`, style: { position: "relative" }, children: [loading && _jsx(LoadingOverlay, {}), title ? _jsx("div", { className: "cc-graph__title", style: { marginBottom: 8, fontWeight: 600 }, children: title }) : null, _jsx("svg", { role: "img", "aria-label": ariaLabel, viewBox: `0 0 ${w} ${h}`, width: "100%", height: h, preserveAspectRatio: "none", style: { display: "block" }, children: bins.map((bin, i) => {
                    const barH = maxCount > 0 ? (bin.count / maxCount) * (h - 4) : 0;
                    const x = i * barW + pad;
                    const y = h - barH;
                    return (_jsx("rect", { x: x, y: y, width: Math.max(0, barW - pad * 2), height: barH, rx: 2, fill: "var(--viz-1, #6366f1)", opacity: 0.8, style: { cursor: onClick ? "pointer" : undefined }, onClick: onClick ? () => onClick(bin) : undefined, children: _jsx("title", { children: `[${bin.x0.toFixed(1)}, ${bin.x1.toFixed(1)}): ${bin.count}` }) }, i));
                }) })] }));
}
// ---------------------------------------------------------------------------
// FORCE / HIERARCHICAL stubs
// ---------------------------------------------------------------------------
function NetworkStub({ layout, ariaLabel }) {
    const label = layout === "force" ? "Force network" : "Hierarchical tree";
    return (_jsxs("div", { className: `cc-graph cc-graph--${layout} cc-graph--stub`, role: "img", "aria-label": ariaLabel, style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 24,
            border: "1px dashed var(--border-1, #e2e8f0)",
            borderRadius: 12,
            color: "var(--text-3, #94a3b8)",
            fontSize: "var(--text-sm, 0.875rem)",
            minHeight: 120,
        }, children: [_jsxs("svg", { width: "32", height: "32", viewBox: "0 0 32 32", fill: "none", "aria-hidden": "true", children: [_jsx("circle", { cx: "8", cy: "8", r: "4", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("circle", { cx: "24", cy: "8", r: "4", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("circle", { cx: "16", cy: "24", r: "4", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("line", { x1: "12", y1: "8", x2: "20", y2: "8", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("line", { x1: "10", y1: "11", x2: "14", y2: "21", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("line", { x1: "22", y1: "11", x2: "18", y2: "21", stroke: "currentColor", strokeWidth: "1.5" })] }), _jsxs("div", { children: [_jsx("strong", { children: label }), " \u2014 coming in v1.1"] }), _jsxs("div", { style: { fontSize: "var(--text-xs, 0.75rem)", opacity: 0.7 }, children: ["Requires ", _jsx("code", { children: "@xyflow/react" }), " (not yet a peer dep)"] })] }));
}
// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
/**
 * Graph — unified data-visualization primitive.
 *
 * @example
 * // Sparkline
 * <Graph layout="sparkline" data={{ layout: "sparkline", values: [1,4,2,8] }} ariaLabel="Trend" />
 *
 * @example
 * // KPI tile
 * <Graph layout="tile" data={{ layout: "tile", kpiValue: "4,201", kpiDelta: "+12%", values: [1,4,2,8] }} ariaLabel="Revenue" />
 *
 * @example
 * // Heatmap
 * <Graph layout="heatmap" data={{ layout: "heatmap", cells: [{row:"Mon",col:"W1",value:3}] }} ariaLabel="Activity" />
 */
export function Graph({ layout, size = "md", data, title, subtitle, legend: _legend, empty, loading, onClick, ariaLabel, source: _source, }) {
    // Type guard helpers
    const isTimeSeries = (d, l) => l === "sparkline" || l === "tile" || l === "card" || l === "dashboard";
    const isHeatmap = (d) => d.layout === "heatmap";
    const isDistribution = (d) => d.layout === "distribution";
    switch (layout) {
        case "sparkline":
            if (!isTimeSeries(data, layout))
                return null;
            return (_jsx(SparklineLayout, { data: data, size: size, ariaLabel: ariaLabel, loading: loading }));
        case "tile":
            if (!isTimeSeries(data, layout))
                return null;
            return (_jsx(TileLayout, { data: data, size: size, ariaLabel: ariaLabel, loading: loading, empty: empty }));
        case "card":
            if (!isTimeSeries(data, layout))
                return null;
            return (_jsx(CardLayout, { data: data, size: size, title: title, subtitle: subtitle, ariaLabel: ariaLabel, loading: loading, empty: empty, onClick: onClick }));
        case "dashboard":
            if (!isTimeSeries(data, layout))
                return null;
            return (_jsx(DashboardLayout, { data: data, size: size, title: title, subtitle: subtitle, ariaLabel: ariaLabel, loading: loading, empty: empty, onClick: onClick }));
        case "heatmap":
            if (!isHeatmap(data))
                return null;
            return (_jsx(HeatmapLayout, { data: data, size: size, title: title, ariaLabel: ariaLabel, loading: loading, empty: empty, onClick: onClick }));
        case "distribution":
            if (!isDistribution(data))
                return null;
            return (_jsx(DistributionLayout, { data: data, size: size, title: title, ariaLabel: ariaLabel, loading: loading, empty: empty, onClick: onClick }));
        case "force":
        case "hierarchical":
            return _jsx(NetworkStub, { layout: layout, ariaLabel: ariaLabel });
        default:
            return null;
    }
}
//# sourceMappingURL=Graph.js.map