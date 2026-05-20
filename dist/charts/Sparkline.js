import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DIMENSIONS = {
    sm: { w: 56, h: 14 },
    md: { w: 80, h: 20 },
    lg: { w: 120, h: 28 },
};
function buildPath(values, width, height) {
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
    // 1px padding so strokes are not clipped at the edges.
    const pad = 1;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;
    const stepX = n > 1 ? innerW / (n - 1) : 0;
    const pts = values.map((v, i) => ({
        x: pad + stepX * i,
        y: pad + innerH - ((v - min) / span) * innerH,
    }));
    const line = pts
        .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(" ");
    const area = pts.length
        ? `${line} L${pts[pts.length - 1].x.toFixed(2)},${(pad + innerH).toFixed(2)} L${pts[0].x.toFixed(2)},${(pad + innerH).toFixed(2)} Z`
        : "";
    const last = pts[pts.length - 1] ?? { x: 0, y: 0 };
    return { line, area, lastX: last.x, lastY: last.y };
}
export function Sparkline({ values, data, tone = "accent", size = "md", showArea = true, showLastDot = true, ariaLabel, "aria-label": ariaLabelAttr, label, className, }) {
    const series = values ?? data ?? [];
    if (series.length === 0)
        return null;
    const { w, h } = DIMENSIONS[size];
    const cls = [
        "cc-sparkline",
        `cc-sparkline--${tone}`,
        `cc-sparkline--${size}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const accessibleLabel = ariaLabelAttr ?? ariaLabel ?? `Trend: ${series.length} points`;
    if (series.length === 1) {
        return (_jsxs("span", { className: cls, children: [_jsx("svg", { role: "img", "aria-label": accessibleLabel, viewBox: `0 0 ${w} ${h}`, width: w, height: h, preserveAspectRatio: "none", className: "cc-sparkline__svg", children: _jsx("circle", { cx: w / 2, cy: h / 2, r: 2, className: "cc-sparkline__dot" }) }), label != null ? _jsx("span", { className: "cc-sparkline__label", children: label }) : null] }));
    }
    const { line, area, lastX, lastY } = buildPath(series, w, h);
    return (_jsxs("span", { className: cls, children: [_jsxs("svg", { role: "img", "aria-label": accessibleLabel, viewBox: `0 0 ${w} ${h}`, width: w, height: h, preserveAspectRatio: "none", className: "cc-sparkline__svg", children: [showArea ? _jsx("path", { d: area, className: "cc-sparkline__area" }) : null, _jsx("path", { d: line, className: "cc-sparkline__line", fill: "none" }), showLastDot ? (_jsx("circle", { cx: lastX, cy: lastY, r: 1.6, className: "cc-sparkline__dot" })) : null] }), label != null ? _jsx("span", { className: "cc-sparkline__label", children: label }) : null] }));
}
//# sourceMappingURL=Sparkline.js.map