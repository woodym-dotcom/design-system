import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ── Helpers ─────────────────────────────────────────────────────────────────
function uniqueOrdered(arr) {
    const seen = new Set();
    const result = [];
    for (const item of arr) {
        if (!seen.has(item)) {
            seen.add(item);
            result.push(item);
        }
    }
    return result;
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
/** Simple 2-stop linear color interpolation via RGB. */
function interpolateColor(t) {
    // Green (low risk) to Red (high risk)
    const r = Math.round(lerp(76, 220, t));
    const g = Math.round(lerp(175, 76, t));
    const b = Math.round(lerp(80, 76, t));
    return `rgb(${r}, ${g}, ${b})`;
}
// ── Component ───────────────────────────────────────────────────────────────
export function HeatmapChart({ cells, rows: rowsProp, columns: colsProp, colorRange, ariaLabel = 'Heatmap chart', onCellClick, cellSize = 40, showValues = true, className, }) {
    const rowLabels = rowsProp ?? uniqueOrdered(cells.map((c) => c.row));
    const colLabels = colsProp ?? uniqueOrdered(cells.map((c) => c.col));
    // Build a lookup map
    const cellMap = new Map();
    for (const cell of cells) {
        cellMap.set(`${cell.row}::${cell.col}`, cell);
    }
    // Value range for normalization
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const cell of cells) {
        if (cell.value < minVal)
            minVal = cell.value;
        if (cell.value > maxVal)
            maxVal = cell.value;
    }
    const range = maxVal - minVal || 1;
    const labelWidth = 100;
    const labelHeight = 30;
    const svgWidth = labelWidth + colLabels.length * cellSize;
    const svgHeight = labelHeight + rowLabels.length * cellSize;
    const useCustomColors = colorRange && colorRange.length === 2;
    return (_jsx("div", { className: ['cc-heatmap-chart', className].filter(Boolean).join(' '), role: "img", "aria-label": ariaLabel, children: _jsxs("svg", { viewBox: `0 0 ${svgWidth} ${svgHeight}`, width: svgWidth, height: svgHeight, style: { display: 'block' }, children: [colLabels.map((col, ci) => (_jsx("text", { x: labelWidth + ci * cellSize + cellSize / 2, y: labelHeight - 6, textAnchor: "middle", fontSize: 11, fill: "var(--text-2, #666)", children: col }, `col-${ci}`))), rowLabels.map((row, ri) => (_jsxs("g", { children: [_jsx("text", { x: labelWidth - 8, y: labelHeight + ri * cellSize + cellSize / 2 + 4, textAnchor: "end", fontSize: 11, fill: "var(--text-2, #666)", children: row }), colLabels.map((col, ci) => {
                            const cell = cellMap.get(`${row}::${col}`);
                            const value = cell?.value ?? 0;
                            const t = (value - minVal) / range;
                            const fillColor = interpolateColor(t);
                            const x = labelWidth + ci * cellSize;
                            const y = labelHeight + ri * cellSize;
                            return (_jsxs("g", { children: [_jsx("rect", { x: x + 1, y: y + 1, width: cellSize - 2, height: cellSize - 2, rx: 3, fill: fillColor, opacity: 0.85, style: { cursor: onCellClick ? 'pointer' : 'default' }, onClick: onCellClick && cell ? () => onCellClick(cell) : undefined, children: _jsx("title", { children: cell?.label ?? `${row} / ${col}: ${value}` }) }), showValues && (_jsx("text", { x: x + cellSize / 2, y: y + cellSize / 2 + 4, textAnchor: "middle", fontSize: 10, fontWeight: 500, fill: t > 0.5 ? '#fff' : '#333', pointerEvents: "none", children: value }))] }, `cell-${ri}-${ci}`));
                        })] }, `row-${ri}`)))] }) }));
}
/** Alias -- MatrixChart is the same component with a different name. */
export const MatrixChart = HeatmapChart;
//# sourceMappingURL=HeatmapChart.js.map