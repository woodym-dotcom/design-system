/**
 * HeatmapChart / MatrixChart -- risk + compliance matrix visualization.
 *
 * DS-MIG P1-04. Extends the existing Graph primitive's layout system with
 * a standalone heatmap component for cases where the full Graph primitive
 * is heavier than needed.
 *
 * For full Graph usage (sparklines, tiles, cards, distribution, etc.),
 * use `<Graph layout="heatmap" ...>` instead.
 *
 * HeatmapChart is the focused, lightweight alternative for consumers
 * that only need a matrix/heatmap and don't want the Graph bundle.
 */
import * as React from 'react';
export interface HeatmapCell {
    /** Row label / y-axis value. */
    row: string;
    /** Column label / x-axis value. */
    col: string;
    /** Numeric value for color intensity. */
    value: number;
    /** Optional tooltip label override. */
    label?: string;
}
export interface HeatmapChartProps {
    cells: HeatmapCell[];
    /** Row labels in display order. Inferred from cells if omitted. */
    rows?: string[];
    /** Column labels in display order. Inferred from cells if omitted. */
    columns?: string[];
    /** Color scale endpoints. Default: ['var(--success-light)', 'var(--error-light)']. */
    colorRange?: [string, string];
    /** Accessible label. */
    ariaLabel?: string;
    /** Cell click handler. */
    onCellClick?: (cell: HeatmapCell) => void;
    /** Cell size in px. Default: 40. */
    cellSize?: number;
    /** Show value labels inside cells. Default: true. */
    showValues?: boolean;
    className?: string;
}
/** Alias for compliance/risk matrix use cases. */
export type MatrixChartProps = HeatmapChartProps;
export declare function HeatmapChart({ cells, rows: rowsProp, columns: colsProp, colorRange, ariaLabel, onCellClick, cellSize, showValues, className, }: HeatmapChartProps): React.ReactElement;
/** Alias -- MatrixChart is the same component with a different name. */
export declare const MatrixChart: typeof HeatmapChart;
//# sourceMappingURL=HeatmapChart.d.ts.map