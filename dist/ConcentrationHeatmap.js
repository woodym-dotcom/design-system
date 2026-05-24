import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
function cellTone(value, thresholds) {
    if (value >= thresholds.critical) {
        return {
            bg: "var(--error-light)",
            text: "var(--error-text)",
            border: "var(--error-border)",
        };
    }
    if (value >= thresholds.warning) {
        return {
            bg: "var(--warning-light)",
            text: "var(--warning-text)",
            border: "var(--warning-border)",
        };
    }
    return {
        bg: "var(--success-light)",
        text: "var(--success-text)",
        border: "var(--success-border)",
    };
}
export function ConcentrationHeatmap({ cells, rows: rowsProp, columns: colsProp, thresholds = { warning: 50, critical: 80 }, cellSize = 48, showValues = true, onCellClick, renderCell, ariaLabel, className, }) {
    const rows = rowsProp ?? uniqueOrdered(cells.map((c) => c.row));
    const cols = colsProp ?? uniqueOrdered(cells.map((c) => c.col));
    const cellMap = new Map();
    for (const c of cells) {
        cellMap.set(`${c.row}::${c.col}`, c);
    }
    const classes = ["cc-concentration-heatmap", className]
        .filter(Boolean)
        .join(" ");
    return (_jsx("div", { className: classes, role: "grid", "aria-label": ariaLabel ?? "Concentration heatmap", style: { overflowX: "auto" }, children: _jsxs("table", { className: "cc-concentration-heatmap__table", style: {
                borderCollapse: "separate",
                borderSpacing: "2px",
            }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "cc-concentration-heatmap__corner", style: {
                                    width: cellSize,
                                    height: cellSize,
                                } }), cols.map((col) => (_jsx("th", { className: "cc-concentration-heatmap__col-header", style: {
                                    fontSize: "var(--text-xs, 0.75rem)",
                                    fontWeight: 600,
                                    textAlign: "center",
                                    padding: "var(--space-1, 0.25rem)",
                                    color: "var(--text-2)",
                                }, children: col }, col)))] }) }), _jsx("tbody", { children: rows.map((row) => (_jsxs("tr", { children: [_jsx("th", { className: "cc-concentration-heatmap__row-header", style: {
                                    fontSize: "var(--text-xs, 0.75rem)",
                                    fontWeight: 600,
                                    textAlign: "right",
                                    padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
                                    color: "var(--text-2)",
                                    whiteSpace: "nowrap",
                                }, children: row }), cols.map((col) => {
                                const cell = cellMap.get(`${row}::${col}`);
                                const value = cell?.value ?? 0;
                                const tone = cellTone(value, thresholds);
                                const defaultContent = showValues ? (_jsx("span", { style: { fontWeight: 600, fontSize: "var(--text-xs, 0.75rem)" }, children: cell ? `${Math.round(value)}%` : "" })) : null;
                                return (_jsx("td", { className: "cc-concentration-heatmap__cell", style: {
                                        width: cellSize,
                                        height: cellSize,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                        background: cell ? tone.bg : "var(--surface-2)",
                                        color: cell ? tone.text : "var(--text-4)",
                                        border: `1px solid ${cell ? tone.border : "var(--border-1)"}`,
                                        borderRadius: "var(--radius-1, 4px)",
                                        cursor: onCellClick && cell ? "pointer" : "default",
                                        padding: 0,
                                    }, onClick: onCellClick && cell ? () => onCellClick(cell) : undefined, title: cell?.label ?? (cell ? `${row}: ${col} = ${value}%` : ""), role: onCellClick && cell ? "button" : "gridcell", tabIndex: onCellClick && cell ? 0 : undefined, onKeyDown: onCellClick && cell
                                        ? (e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                onCellClick(cell);
                                            }
                                        }
                                        : undefined, children: renderCell && cell
                                        ? renderCell(cell, defaultContent)
                                        : defaultContent }, col));
                            })] }, row))) })] }) }));
}
//# sourceMappingURL=ConcentrationHeatmap.js.map