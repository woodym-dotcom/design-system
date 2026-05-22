import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @deprecated Use `<Graph layout="card">` from `@ds/core/react/Graph` instead.
 * Will be removed in v1.0 (SIMPLIFY 14).
 */
import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, BarChart, Bar, ComposedChart, Rectangle } from 'recharts';
const axisTick = { fontSize: 11, fill: 'var(--text-3)' };
const tooltipContentStyle = {
    backgroundColor: 'var(--surface-0)',
    border: '1px solid var(--border-1)',
    borderRadius: 12,
    boxShadow: 'var(--shadow-2)',
    color: 'var(--text-1)',
};
const tooltipLabelStyle = { color: 'var(--text-1)', fontWeight: 600 };
const tooltipItemStyle = { color: 'var(--text-2)' };
const radiusTop = 6;
function useIsMobile(breakpoint = 767) {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
            return;
        const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
        const update = () => setIsMobile(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, [breakpoint]);
    return isMobile;
}
function formatSeriesValue(value, unit) {
    if (typeof value !== 'number' || Number.isNaN(value))
        return 'n/a';
    const formatted = Number.isInteger(value)
        ? new Intl.NumberFormat('en-GB').format(value)
        : new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 }).format(value);
    return unit ? `${formatted}${unit}` : formatted;
}
function isTopVisibleSeries(payload, series, hiddenKeys, currentKey) {
    const visibleBars = series.filter((item) => item.kind === 'bar' && !hiddenKeys.has(item.key));
    const currentIndex = visibleBars.findIndex((item) => item.key === currentKey);
    if (currentIndex === -1)
        return false;
    for (let index = currentIndex + 1; index < visibleBars.length; index += 1) {
        const nextValue = payload[visibleBars[index].key];
        if (typeof nextValue === 'number' && nextValue > 0)
            return false;
    }
    const currentValue = payload[currentKey];
    return typeof currentValue === 'number' && currentValue > 0;
}
export function MetricChartCard({ card, heightClassName = 'cc-chart-card__plot--compact', }) {
    const hasData = card.data.length > 0;
    const isMobile = useIsMobile();
    const xAxisKey = card.meta.axes?.x?.key ?? 'day';
    const series = card.meta.series ?? [];
    // Stable signature so the reset effect below only fires when the *contents*
    // of `series` (keys + defaults) change, not on every parent re-render.
    const seriesSignature = series
        .map((item) => `${item.key}:${item.defaultVisible === false ? 0 : 1}`)
        .join('|');
    const defaultHiddenKeys = useMemo(() => new Set(series.filter((item) => item.defaultVisible === false).map((item) => item.key)), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seriesSignature]);
    const [hiddenKeys, setHiddenKeys] = useState(defaultHiddenKeys);
    const [showInfo, setShowInfo] = useState(false);
    const [activePointKey, setActivePointKey] = useState(null);
    useEffect(() => {
        setHiddenKeys(new Set(defaultHiddenKeys));
    }, [defaultHiddenKeys]);
    const visibleSeries = useMemo(() => series.filter((item) => !hiddenKeys.has(item.key)), [series, hiddenKeys]);
    const visibleBarSeries = visibleSeries.filter((item) => item.kind === 'bar');
    const visibleLineSeries = visibleSeries.filter((item) => item.kind === 'line');
    const activePoint = useMemo(() => {
        if (!card.data.length)
            return null;
        if (!activePointKey)
            return card.data[card.data.length - 1];
        return (card.data.find((point) => String(point[xAxisKey]) === activePointKey) ?? null);
    }, [activePointKey, card.data, xAxisKey]);
    const chartKind = card.meta.chartKind ?? (visibleBarSeries.length && visibleLineSeries.length ? 'composed' : visibleLineSeries.length ? 'line' : 'bar');
    const toggleSeries = (key) => {
        setHiddenKeys((current) => {
            const next = new Set(current);
            if (next.has(key)) {
                next.delete(key);
            }
            else {
                next.add(key);
            }
            return next;
        });
    };
    const renderBars = () => visibleBarSeries.map((item) => (_jsx(Bar, { dataKey: item.key, stackId: item.stackId, isAnimationActive: false, fill: item.color, onClick: (state) => setActivePointKey(String(state?.payload?.[xAxisKey] ?? '')), shape: (props) => {
            const rectProps = props;
            const payload = rectProps.payload;
            const radius = item.stackId && isTopVisibleSeries(payload, series, hiddenKeys, item.key) ? [radiusTop, radiusTop, 0, 0] : item.stackId ? [0, 0, 0, 0] : [radiusTop, radiusTop, 0, 0];
            return _jsx(Rectangle, { ...rectProps, radius: radius });
        } }, item.key)));
    const renderLines = () => visibleLineSeries.map((item) => (_jsx(Line, { type: "monotone", dataKey: item.key, stroke: item.color, strokeWidth: 2.5, dot: false, activeDot: { r: 4 }, isAnimationActive: false }, item.key)));
    const chartBody = (() => {
        const common = {
            data: card.data,
            margin: { top: 4, right: 4, left: -18, bottom: 0 },
            onClick: (state) => {
                if (state?.activeLabel !== undefined)
                    setActivePointKey(String(state.activeLabel));
            },
        };
        if (chartKind === 'line') {
            return (_jsxs(LineChart, { ...common, children: [_jsx(CartesianGrid, { stroke: "var(--border-1)", vertical: false }), _jsx(XAxis, { dataKey: xAxisKey, tick: axisTick, axisLine: { stroke: 'var(--border-1)' }, tickLine: { stroke: 'var(--border-1)' }, unit: card.meta.axes?.x?.isDate ? undefined : card.meta.axes?.x?.unit }), _jsx(YAxis, { tick: axisTick, axisLine: { stroke: 'var(--border-1)' }, tickLine: { stroke: 'var(--border-1)' }, unit: card.meta.axes?.y?.unit, width: 44 }), _jsx(Tooltip, { contentStyle: tooltipContentStyle, labelStyle: tooltipLabelStyle, itemStyle: tooltipItemStyle, cursor: { stroke: 'var(--border-2)' } }), renderLines()] }));
        }
        if (chartKind === 'bar') {
            return (_jsxs(BarChart, { ...common, children: [_jsx(CartesianGrid, { stroke: "var(--border-1)", vertical: false }), _jsx(XAxis, { dataKey: xAxisKey, tick: axisTick, axisLine: { stroke: 'var(--border-1)' }, tickLine: { stroke: 'var(--border-1)' }, unit: card.meta.axes?.x?.isDate ? undefined : card.meta.axes?.x?.unit }), _jsx(YAxis, { tick: axisTick, axisLine: { stroke: 'var(--border-1)' }, tickLine: { stroke: 'var(--border-1)' }, unit: card.meta.axes?.y?.unit, width: 44 }), _jsx(Tooltip, { contentStyle: tooltipContentStyle, labelStyle: tooltipLabelStyle, itemStyle: tooltipItemStyle, cursor: { fill: 'color-mix(in oklch, var(--accent-1) 10%, transparent)' } }), renderBars()] }));
        }
        return (_jsxs(ComposedChart, { ...common, children: [_jsx(CartesianGrid, { stroke: "var(--border-1)", vertical: false }), _jsx(XAxis, { dataKey: xAxisKey, tick: axisTick, axisLine: { stroke: 'var(--border-1)' }, tickLine: { stroke: 'var(--border-1)' }, unit: card.meta.axes?.x?.isDate ? undefined : card.meta.axes?.x?.unit }), _jsx(YAxis, { tick: axisTick, axisLine: { stroke: 'var(--border-1)' }, tickLine: { stroke: 'var(--border-1)' }, unit: card.meta.axes?.y?.unit, width: 44 }), _jsx(Tooltip, { contentStyle: tooltipContentStyle, labelStyle: tooltipLabelStyle, itemStyle: tooltipItemStyle, cursor: { fill: 'color-mix(in oklch, var(--accent-1) 10%, transparent)' } }), renderBars(), renderLines()] }));
    })();
    return (_jsxs("section", { className: "cc-chart-card soft-card chart-card rounded-[20px] border border-[color:var(--border-1)] shadow-ds-1", children: [_jsxs("header", { className: "cc-chart-card__header chart-card-header", children: [_jsxs("div", { className: "cc-chart-card__title-wrap", children: [_jsxs("div", { className: "cc-chart-card__title-row", children: [_jsx("h3", { className: "cc-chart-card__title chart-card-title text-foreground", children: card.meta.title }), card.meta.info || card.meta.definition ? (_jsx("button", { type: "button", className: "cc-chart-card__info", "aria-expanded": showInfo, "aria-label": `About ${card.meta.title}`, onClick: () => setShowInfo((value) => !value), children: "i" })) : null] }), showInfo ? _jsx("p", { className: "cc-chart-card__description chart-card-description text-muted-foreground", children: card.meta.info ?? card.meta.definition }) : null] }), _jsxs("div", { className: "cc-chart-card__meta chart-card-meta text-muted-foreground", children: [_jsxs("div", { children: ["Source: ", card.meta.source] }), _jsx("div", { children: card.meta.freshness })] })] }), series.length ? (_jsx("div", { className: "cc-chart-card__toggles", "aria-label": `${card.meta.title} series`, children: series.map((item) => {
                    const isActive = !hiddenKeys.has(item.key);
                    return (_jsxs("button", { type: "button", className: `cc-chart-card__toggle${isActive ? ' is-active' : ''}`, onClick: () => toggleSeries(item.key), children: [_jsx("span", { className: "cc-chart-card__toggle-swatch", style: { backgroundColor: item.color }, "aria-hidden": "true" }), _jsx("span", { children: item.label })] }, item.key));
                }) })) : null, _jsx("div", { className: `cc-chart-card__plot ${heightClassName}`, children: hasData && visibleSeries.length ? (_jsx(ResponsiveContainer, { width: "100%", height: "100%", minWidth: 240, minHeight: 220, children: chartBody })) : (_jsx("div", { className: "cc-chart-card__empty flex h-full items-center justify-center rounded-[20px] border border-dashed border-[color:var(--border-1)] text-sm text-muted-foreground", children: "No data available yet." })) }), isMobile && activePoint && visibleSeries.length ? (_jsxs("div", { className: "cc-chart-card__detail", "aria-live": "polite", children: [_jsx("div", { className: "cc-chart-card__detail-label", children: String(activePoint[xAxisKey] ?? '') }), _jsx("div", { className: "cc-chart-card__detail-list", children: visibleSeries.map((item) => (_jsxs("div", { className: "cc-chart-card__detail-row", children: [_jsxs("span", { className: "cc-chart-card__detail-series", children: [_jsx("span", { className: "cc-chart-card__toggle-swatch", style: { backgroundColor: item.color }, "aria-hidden": "true" }), item.label] }), _jsx("strong", { children: formatSeriesValue(activePoint[item.key], item.unit ?? card.meta.axes?.y?.unit) })] }, item.key))) })] })) : null] }));
}
//# sourceMappingURL=MetricChartCard.js.map