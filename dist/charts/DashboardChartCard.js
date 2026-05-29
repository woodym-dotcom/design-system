import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * @deprecated Use `<Graph layout="dashboard">` from `@ds/core/react/Graph` instead.
 *
 *
 * <DashboardChartCard> — promoted Recharts chart tile for the Malbot dashboard.
 *
 * Promoted from apps/dashboard/client/src/components/ChartCard.tsx.
 * Lives in ds-core so the cc-chart-frame grid row fix and legend
 * letter-spacing regression are applied centrally and can't drift.
 *
 * New features added at promotion time:
 *  - `caption`         — plain-English explanation rendered below the title.
 *  - `legend`          — 'inline' (default) | 'below' | 'none'.
 *  - `clampDomain`     — clamps y-axis: { yMin?, yMax? } (e.g. non-negative power).
 *  - `expand`          — single Expand action; consolidates the old Zoom/Details split.
 *  - `fullWidth`       — (internal) chart takes full container width; default true.
 *  - Letter-spacing regression fixed: legend wrapper no longer inherits
 *    tracking-[0.18em] from parent scopes (legendWrapperStyle resets it).
 *  - cc-chart-frame grid row fix applied unconditionally at component level.
 *
 * PeerDeps: react ≥ 18, recharts ≥ 3.
 */
import * as React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, ComposedChart, Bar, Legend, ReferenceLine, ReferenceArea, Scatter, ScatterChart, } from 'recharts';
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CHART_COLORS = [
    'var(--viz-1, var(--tier-core))',
    'var(--viz-2, var(--status-healthy))',
    'var(--viz-3, var(--status-warning))',
    'var(--viz-4, var(--tier-domain))',
];
const AXIS_COLOR = 'var(--text-1)';
const GRID_COLOR = 'var(--border-2)';
const TOOLTIP_STYLE = {
    background: 'var(--surface-0)',
    border: '1px solid var(--border-1)',
    borderRadius: 12,
    color: 'var(--text-1)',
    boxShadow: 'var(--shadow-2)',
};
const TOOLTIP_LABEL_STYLE = { color: 'var(--text-1)', fontWeight: 600 };
// Fix: reset letterSpacing so the Recharts legend wrapper doesn't inherit
// tracking-[0.18em] or other letter-spacing values from parent CSS scopes.
const LEGEND_WRAPPER_STYLE = {
    color: 'var(--text-1)',
    letterSpacing: 'normal',
    fontSize: 'var(--text-xs, 0.75rem)',
};
const LABEL_MAP = {
    costSma7: 'Cost 7-day avg',
    costSma28: 'Cost 28-day avg',
    tokensSma7: 'Tokens 7-day avg',
    tokensSma28: 'Tokens 28-day avg',
    messagesPerResolvedTopic: 'Messages / resolved topic',
    messagesPerResolvedTopicSma7: 'Messages/topic 7-day avg',
    totalOpen: 'Open todo backlog',
    topicsCreated: 'Topics created (below axis)',
    topicsRaised: 'Topics raised',
    topicsRaisedSigned: 'Topics raised (below axis)',
    estimatedFtp: 'Estimated FTP',
    ftpSma7: 'FTP 7-day avg',
    ftpSma28: 'FTP 28-day avg',
    ftpReference: 'Reference FTP',
    trainingLoad: 'Daily load',
    restDay: 'Rest day marker',
    loadSma7: 'Load 7-day avg',
    loadSma28: 'Load 28-day avg',
    atl: 'Fatigue (ATL)',
    ctl: 'Fitness (CTL)',
    tsb: 'Form (TSB)',
    bestPower90d: 'Best 90 days (W)',
    bestPowerAllTime: 'All-time best (W)',
    restingHr: 'Resting HR',
    restingHrSma7: '7-day avg',
    baseline: '90-day median',
    deep: 'Deep',
    light: 'Light',
    rem: 'REM',
    awake: 'Awake',
    spo2: 'SpO2 (%)',
    respirationSleeping: 'Respiration asleep',
    respirationWaking: 'Respiration awake',
    moderate: 'Moderate min',
    vigorous: 'Vigorous min',
    total: 'WHO-weighted total',
    steps: 'Steps',
    floors: 'Floors',
    stepsSma7: 'Steps 7-day avg',
    weightKg: 'Weight (kg)',
    weightKgSma7: 'Weight 7-day avg',
    decouplingPct: 'Decoupling %',
    aerobic: 'Aerobic TE',
    anaerobic: 'Anaerobic TE',
    z1: 'Z1', z2: 'Z2', z3: 'Z3', z4: 'Z4', z5: 'Z5', z6: 'Z6', z7: 'Z7',
};
// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------
function legendFormatter(value) {
    return LABEL_MAP[value] ?? value.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}
function axisNumber(value) {
    const abs = Math.abs(value);
    if (abs >= 1_000_000)
        return `${Number((value / 1_000_000).toFixed(1))}M`;
    if (abs >= 1_000)
        return `${Number((value / 1_000).toFixed(1))}k`;
    return String(value);
}
function numericValue(value) {
    if (typeof value === 'number' && Number.isFinite(value))
        return value;
    if (typeof value === 'string' && value.trim()) {
        const n = Number(value);
        return Number.isFinite(n) ? n : null;
    }
    return null;
}
function dayTick(value, mobile) {
    if (!value)
        return '';
    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime()))
        return value;
    return new Intl.DateTimeFormat('en-GB', {
        ...(mobile ? { day: 'numeric', month: 'numeric' } : { day: 'numeric', month: 'short' }),
        timeZone: 'UTC',
    }).format(date);
}
function toneColour(tone) {
    if (tone === 'good')
        return 'var(--status-healthy)';
    if (tone === 'bad')
        return 'var(--status-warning)';
    return 'var(--text-2)';
}
function niceDomain(data, bars, lines, clamp) {
    if (!data.length || (!bars.length && !lines.length))
        return [0, 1];
    let min = bars.length ? 0 : Number.POSITIVE_INFINITY;
    let max = bars.length ? 0 : Number.NEGATIVE_INFINITY;
    for (const point of data) {
        let positiveStack = 0;
        let negativeStack = 0;
        for (const key of bars) {
            const v = numericValue(point[key]) ?? 0;
            if (v >= 0)
                positiveStack += v;
            else
                negativeStack += v;
        }
        min = Math.min(min, negativeStack);
        max = Math.max(max, positiveStack);
        for (const key of lines) {
            const v = numericValue(point[key]);
            if (v === null)
                continue;
            min = Math.min(min, v);
            max = Math.max(max, v);
        }
    }
    if (!Number.isFinite(min) || !Number.isFinite(max))
        return [0, 1];
    if (min === max) {
        const pad = Math.max(1, Math.abs(max) * 0.1);
        const rawMin = min - pad;
        const rawMax = max + pad;
        return [
            clamp?.yMin !== undefined ? Math.max(clamp.yMin, Math.floor(rawMin)) : Math.floor(rawMin),
            clamp?.yMax !== undefined ? Math.min(clamp.yMax, Math.ceil(rawMax)) : Math.ceil(rawMax),
        ];
    }
    const range = max - min;
    const pad = range * 0.08;
    const lower = bars.length ? (min < 0 ? min - pad : 0) : min - pad;
    const rawMin = Math.floor(lower);
    const rawMax = Math.ceil(max + pad);
    return [
        clamp?.yMin !== undefined ? Math.max(clamp.yMin, rawMin) : rawMin,
        clamp?.yMax !== undefined ? Math.min(clamp.yMax, rawMax) : rawMax,
    ];
}
// ---------------------------------------------------------------------------
// useIsMobile hook
// ---------------------------------------------------------------------------
function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(() => typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(max-width: 640px)').matches
        : false);
    React.useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
            return;
        const media = window.matchMedia('(max-width: 640px)');
        const update = () => setIsMobile(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);
    return isMobile;
}
// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function ScreenReaderTable({ title, rows, keys, }) {
    if (!rows || rows.length === 0 || keys.length === 0)
        return null;
    const allKeys = ['day', ...keys.filter((k) => k !== 'day')];
    return (_jsxs("table", { className: "sr-only", role: "table", "aria-label": `${title} underlying data`, children: [_jsx("thead", { children: _jsx("tr", { children: allKeys.map((k) => _jsx("th", { children: legendFormatter(k) }, k)) }) }), _jsx("tbody", { children: rows.map((row, i) => (_jsx("tr", { children: allKeys.map((k) => (_jsx("td", { children: row[k] == null ? '' : String(row[k]) }, k))) }, i))) })] }));
}
function renderReferences(refs) {
    if (!refs || refs.length === 0)
        return null;
    return refs.map((ref, i) => ref.kind === 'line' ? (_jsx(ReferenceLine, { y: ref.y, stroke: toneColour(ref.tone), strokeDasharray: "4 3", strokeOpacity: 0.7, label: { value: ref.label ?? '', position: 'insideBottomRight', fill: toneColour(ref.tone), fontSize: 10 } }, `ref-${i}`)) : (_jsx(ReferenceArea, { y1: ref.y1, y2: ref.y2, fill: toneColour(ref.tone), fillOpacity: 0.08, stroke: "none" }, `ref-${i}`)));
}
function HeatmapGrid({ data, ariaLabel, }) {
    const points = data;
    const maxLoad = Math.max(0, ...points.map((p) => Number(p['load'] ?? 0)).filter(Number.isFinite));
    const columns = [];
    let current = null;
    for (const point of points) {
        const day = String(point['day'] ?? '');
        if (!day)
            continue;
        const weekday = Number(point['weekday'] ?? 0);
        const date = new Date(`${day}T00:00:00Z`);
        const adjusted = new Date(date);
        adjusted.setUTCDate(adjusted.getUTCDate() - ((weekday + 6) % 7));
        const weekKey = adjusted.toISOString().slice(0, 10);
        if (!current || current.key !== weekKey) {
            current = { key: weekKey, cells: [] };
            columns.push(current);
        }
        current.cells.push(point);
    }
    const cellSize = 12;
    const gap = 2;
    return (_jsx("div", { role: "img", "aria-label": ariaLabel, style: { display: 'flex', flexWrap: 'wrap', gap, padding: '8px 0' }, children: columns.map((col) => (_jsx("div", { style: { display: 'grid', gridTemplateRows: `repeat(7, ${cellSize}px)`, gap }, children: [1, 2, 3, 4, 5, 6, 0].map((dayOfWeek) => {
                const cell = col.cells.find((c) => Number(c['weekday']) === dayOfWeek);
                const load = cell ? Number(cell['load'] ?? 0) : 0;
                const intensity = maxLoad > 0 ? Math.min(1, load / maxLoad) : 0;
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const background = load > 0
                    ? `color-mix(in srgb, var(--viz-1, var(--tier-core)) ${Math.round(intensity * 100)}%, transparent)`
                    : isWeekend
                        ? 'color-mix(in srgb, var(--border-2) 50%, transparent)'
                        : 'var(--border-2)';
                return (_jsx("div", { title: cell ? `${cell['day']}: load ${cell['load']}` : '', style: { width: cellSize, height: cellSize, background, borderRadius: 2 } }, `${col.key}-${dayOfWeek}`));
            }) }, col.key))) }));
}
// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function DashboardChartCard({ card, kind, bars = [], lines = [], rightLines = [], xKey = 'day', references, tableRows, headline, caption, legend: legendProp = 'inline', clampDomain, expand, }) {
    const mobile = useIsMobile();
    const hasData = card.data.length > 0;
    // Caption disclosure: on mobile the caption is hidden by default to claw
    // back vertical space; tapping the info trigger reveals it. On desktop the
    // CSS overrides keep the caption block visible regardless of state and the
    // trigger is hidden, so this state is a no-op there.
    const [captionOpen, setCaptionOpen] = React.useState(false);
    const captionId = `${card.meta.id}-caption`;
    const height = mobile ? 230 : 280;
    const axisWidth = mobile ? 42 : 52;
    const yDomain = React.useMemo(() => niceDomain(card.data, bars, lines, clampDomain), [card.data, bars, lines, clampDomain]);
    const series = [...bars, ...lines];
    const targetTicks = mobile ? 4 : 6;
    const tickEvery = Math.max(0, Math.ceil(card.data.length / targetTicks) - 1);
    const isDateAxis = xKey === 'day';
    const xTickFormatter = (v) => isDateAxis ? dayTick(String(v), mobile) : String(v);
    const xLabelFormatter = (v) => isDateAxis ? dayTick(String(v), false) : String(v);
    // Whether to show the inline Recharts <Legend> (desktop-only when legend='inline').
    const showInlineLegend = legendProp === 'inline' && !mobile;
    // Whether to show the custom below-chart strip.
    const showBelowLegend = legendProp === 'below' || (legendProp === 'inline' && mobile);
    // Date-axis labels: enforce a minimum gap that prevents overlap on dense
    // series. "10 Mar" is ~32px at 10px font; "1" (logXLine) is ~6px. The gap
    // applies after the interval filter, so it's a safety net rather than the
    // primary spacer.
    const xMinTickGap = isDateAxis ? (mobile ? 30 : 42) : (mobile ? 8 : 14);
    const renderCommonAxes = () => (_jsxs(_Fragment, { children: [_jsx(CartesianGrid, { stroke: GRID_COLOR, strokeOpacity: 0.55, vertical: false }), _jsx(XAxis, { dataKey: xKey, interval: tickEvery, minTickGap: xMinTickGap, allowDuplicatedCategory: false, tickFormatter: xTickFormatter, tick: { fontSize: mobile ? 9 : 10, fill: AXIS_COLOR }, height: mobile ? 28 : 30, tickMargin: mobile ? 5 : 6, padding: { left: 12, right: 12 } }), _jsx(YAxis, { width: axisWidth, domain: yDomain, tickFormatter: (v) => axisNumber(Number(v)), tick: { fontSize: mobile ? 9 : 10, fill: AXIS_COLOR }, axisLine: { stroke: GRID_COLOR }, tickLine: { stroke: GRID_COLOR } }), _jsx(Tooltip, { contentStyle: TOOLTIP_STYLE, labelStyle: TOOLTIP_LABEL_STYLE, itemStyle: { color: 'var(--text-1)' }, labelFormatter: xLabelFormatter, formatter: (value, name) => [value, legendFormatter(String(name))] }), showInlineLegend && (_jsx(Legend, { wrapperStyle: LEGEND_WRAPPER_STYLE, formatter: (value) => (_jsx("span", { style: LEGEND_WRAPPER_STYLE, children: legendFormatter(String(value)) })) })), renderReferences(references)] }));
    const renderPlot = () => {
        if (kind === 'bar' || kind === 'hStackedBar') {
            const layout = kind === 'hStackedBar' ? 'vertical' : 'horizontal';
            return (_jsxs(ComposedChart, { data: card.data, layout: layout, margin: { top: 14, right: 8, left: 4, bottom: 8 }, children: [renderCommonAxes(), bars.map((key, index) => {
                        const isTop = bars.length === 1 || index === bars.length - 1;
                        return (_jsx(Bar, { dataKey: key, name: legendFormatter(key), stackId: bars.length > 1 ? 'a' : undefined, fill: CHART_COLORS[index % CHART_COLORS.length], radius: isTop ? [6, 6, 0, 0] : [0, 0, 0, 0], isAnimationActive: false }, key));
                    }), lines.map((key, index) => (_jsx(Line, { yAxisId: 0, type: "monotone", dataKey: key, name: legendFormatter(key), stroke: CHART_COLORS[(index + bars.length) % CHART_COLORS.length], strokeWidth: 2, dot: false, isAnimationActive: false }, key)))] }));
        }
        if (kind === 'dualAxis') {
            return (_jsxs(ComposedChart, { data: card.data, margin: { top: 14, right: 8, left: 4, bottom: 8 }, children: [_jsx(CartesianGrid, { stroke: GRID_COLOR, strokeOpacity: 0.55, vertical: false }), _jsx(XAxis, { dataKey: xKey, interval: tickEvery, minTickGap: xMinTickGap, allowDuplicatedCategory: false, tickFormatter: xTickFormatter, tick: { fontSize: mobile ? 9 : 10, fill: AXIS_COLOR }, height: mobile ? 28 : 30, tickMargin: mobile ? 5 : 6, padding: { left: 12, right: 12 } }), _jsx(YAxis, { yAxisId: "left", width: axisWidth, domain: yDomain, tickFormatter: (v) => axisNumber(Number(v)), tick: { fontSize: mobile ? 9 : 10, fill: AXIS_COLOR }, axisLine: { stroke: GRID_COLOR }, tickLine: { stroke: GRID_COLOR } }), _jsx(YAxis, { yAxisId: "right", orientation: "right", tick: { fontSize: mobile ? 9 : 10, fill: AXIS_COLOR }, width: axisWidth }), _jsx(Tooltip, { contentStyle: TOOLTIP_STYLE, labelStyle: TOOLTIP_LABEL_STYLE, itemStyle: { color: 'var(--text-1)' }, labelFormatter: xLabelFormatter, formatter: (value, name) => [value, legendFormatter(String(name))] }), showInlineLegend && (_jsx(Legend, { wrapperStyle: LEGEND_WRAPPER_STYLE, formatter: (value) => _jsx("span", { style: LEGEND_WRAPPER_STYLE, children: legendFormatter(String(value)) }) })), renderReferences(references), lines.map((key, index) => (_jsx(Line, { yAxisId: "left", type: "monotone", dataKey: key, name: legendFormatter(key), stroke: CHART_COLORS[index % CHART_COLORS.length], strokeWidth: 2, dot: false, isAnimationActive: false, connectNulls: true }, key))), rightLines.map((key, index) => (_jsx(Line, { yAxisId: "right", type: "monotone", dataKey: key, name: legendFormatter(key), stroke: CHART_COLORS[(index + lines.length) % CHART_COLORS.length], strokeWidth: 2, strokeDasharray: "4 2", dot: false, isAnimationActive: false, connectNulls: true }, key)))] }));
        }
        if (kind === 'scatter') {
            return (_jsxs(ScatterChart, { margin: { top: 14, right: 8, left: 4, bottom: 8 }, children: [renderCommonAxes(), lines.map((key, index) => (_jsx(Scatter, { name: legendFormatter(key), data: card.data, dataKey: key, fill: CHART_COLORS[index % CHART_COLORS.length] }, key)))] }));
        }
        if (kind === 'logXLine') {
            return (_jsxs(LineChart, { data: card.data, margin: { top: 14, right: 8, left: 4, bottom: 8 }, children: [renderCommonAxes(), lines.map((key, index) => (_jsx(Line, { type: "monotone", dataKey: key, name: legendFormatter(key), stroke: CHART_COLORS[index % CHART_COLORS.length], strokeWidth: 2, dot: true, connectNulls: true, isAnimationActive: false }, key)))] }));
        }
        // Default: line chart
        return (_jsxs(LineChart, { data: card.data, margin: { top: 14, right: 8, left: 4, bottom: 8 }, children: [renderCommonAxes(), lines.map((key, index) => (_jsx(Line, { type: "monotone", dataKey: key, name: legendFormatter(key), stroke: CHART_COLORS[index % CHART_COLORS.length], strokeWidth: 2, dot: false, isAnimationActive: false, connectNulls: true }, key)))] }));
    };
    const seriesSummary = series.length ? series.map(legendFormatter).join(', ') : '';
    const deferredReason = card.deferred?.reason;
    const chartAriaLabel = deferredReason
        ? `${card.meta.title} chart · deferred: ${deferredReason}`
        : hasData
            ? `${card.meta.title} chart · ${card.data.length} data points${seriesSummary ? ` · series: ${seriesSummary}` : ''}`
            : `${card.meta.title} chart · no data yet`;
    const noDataPlaceholder = (_jsx("div", { style: { height }, className: "cc-dashboard-chart__empty", role: "note", children: "No data available yet." }));
    return (_jsxs("figure", { className: "chart-shell cc-dashboard-chart", role: "group", "aria-label": chartAriaLabel, children: [_jsxs("div", { className: "chart-heading mb-3", children: [_jsxs("div", { className: "cc-dashboard-chart__title-wrap", "data-caption-open": captionOpen ? 'true' : 'false', children: [_jsxs("div", { className: "cc-dashboard-chart__title-row", children: [_jsx("h3", { className: "cc-dashboard-chart__title t-h3", children: card.meta.title }), caption && (_jsx("button", { type: "button", className: "cc-dashboard-chart__caption-toggle", "aria-controls": captionId, "aria-expanded": captionOpen, "aria-label": `About ${card.meta.title}`, onClick: () => setCaptionOpen((open) => !open), children: _jsx("span", { "aria-hidden": "true", children: "\u24D8" }) }))] }), caption && (_jsx("p", { id: captionId, className: "cc-dashboard-chart__caption t-caption", children: caption }))] }), expand ? (_jsx("div", { className: "chart-actions", children: _jsx("button", { type: "button", className: "chart-zoom-toggle", onClick: expand.onClick, "aria-label": `${card.meta.title} expand`, children: "Expand" }) })) : null] }), headline ? _jsx("div", { className: "chart-headline", style: { marginBottom: 8 }, children: headline }) : null, deferredReason ? (_jsxs("div", { style: { height: 100 }, className: "cc-dashboard-chart__empty cc-dashboard-chart__empty--deferred", role: "note", children: [_jsx("strong", { children: "Deferred:" }), " ", deferredReason] })) : kind === 'heatmap' ? (hasData ? (_jsx(HeatmapGrid, { data: card.data, ariaLabel: chartAriaLabel })) : noDataPlaceholder) : hasData ? (_jsxs("div", { className: "cc-chart-frame", style: {
                    '--chart-plot-min-width': '100%',
                    '--chart-height': `${height}px`,
                }, children: [_jsx("div", { className: "cc-chart-frame__scroll", role: "img", "aria-label": `${card.meta.title} fitted dashboard history`, children: _jsx("div", { className: "cc-chart-frame__plot", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: renderPlot() }) }) }), showBelowLegend && series.length > 0 ? (_jsx("div", { className: "cc-chart-frame__legend", role: "list", "aria-label": `${card.meta.title} series`, children: series.map((key, index) => (_jsxs("span", { role: "listitem", className: "cc-chart-frame__legend-item", children: [_jsx("span", { className: "cc-chart-frame__legend-swatch", style: { background: CHART_COLORS[index % CHART_COLORS.length] } }), legendFormatter(key)] }, key))) })) : null] })) : noDataPlaceholder, _jsx(ScreenReaderTable, { title: card.meta.title, rows: tableRows ?? card.data, keys: [...bars, ...lines, ...rightLines] })] }));
}
//# sourceMappingURL=DashboardChartCard.js.map