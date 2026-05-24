/**
 * ConcentrationHeatmap — risk/vendor concentration grid.
 *
 * Extends the HeatmapChart concept with concentration-specific features:
 * threshold-based cell colouring, concentration score badges, and
 * configurable risk breakpoints.
 *
 * Usage:
 *   <ConcentrationHeatmap
 *     cells={[
 *       { row: 'Cloud', col: 'AWS', value: 72 },
 *       { row: 'Cloud', col: 'GCP', value: 18 },
 *       { row: 'Payments', col: 'Stripe', value: 95 },
 *     ]}
 *     thresholds={{ warning: 50, critical: 80 }}
 *   />
 */
import * as React from "react";
export interface ConcentrationCell {
    row: string;
    col: string;
    /** Concentration percentage 0..100. */
    value: number;
    /** Optional tooltip / label override. */
    label?: string;
}
export interface ConcentrationThresholds {
    /** Value at which the cell turns warning. Default: 50. */
    warning: number;
    /** Value at which the cell turns critical. Default: 80. */
    critical: number;
}
export interface ConcentrationHeatmapProps {
    cells: ConcentrationCell[];
    /** Row labels in display order. Inferred from cells if omitted. */
    rows?: string[];
    /** Column labels in display order. Inferred from cells if omitted. */
    columns?: string[];
    /** Threshold breakpoints. */
    thresholds?: ConcentrationThresholds;
    /** Cell size in px. Default: 48. */
    cellSize?: number;
    /** Show percentage values inside cells. Default: true. */
    showValues?: boolean;
    /** Called when a cell is clicked. */
    onCellClick?: (cell: ConcentrationCell) => void;
    /** Custom cell renderer. Receives the cell and default content. */
    renderCell?: (cell: ConcentrationCell, defaultContent: React.ReactNode) => React.ReactNode;
    /** Accessible label. */
    ariaLabel?: string;
    className?: string;
}
export declare function ConcentrationHeatmap({ cells, rows: rowsProp, columns: colsProp, thresholds, cellSize, showValues, onCellClick, renderCell, ariaLabel, className, }: ConcentrationHeatmapProps): React.ReactElement;
//# sourceMappingURL=ConcentrationHeatmap.d.ts.map