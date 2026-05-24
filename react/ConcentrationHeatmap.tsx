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

function uniqueOrdered(arr: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of arr) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

function cellTone(
  value: number,
  thresholds: ConcentrationThresholds,
): { bg: string; text: string; border: string } {
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

export function ConcentrationHeatmap({
  cells,
  rows: rowsProp,
  columns: colsProp,
  thresholds = { warning: 50, critical: 80 },
  cellSize = 48,
  showValues = true,
  onCellClick,
  renderCell,
  ariaLabel,
  className,
}: ConcentrationHeatmapProps): React.ReactElement {
  const rows = rowsProp ?? uniqueOrdered(cells.map((c) => c.row));
  const cols = colsProp ?? uniqueOrdered(cells.map((c) => c.col));

  const cellMap = new Map<string, ConcentrationCell>();
  for (const c of cells) {
    cellMap.set(`${c.row}::${c.col}`, c);
  }

  const classes = ["cc-concentration-heatmap", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      role="grid"
      aria-label={ariaLabel ?? "Concentration heatmap"}
      style={{ overflowX: "auto" }}
    >
      <table
        className="cc-concentration-heatmap__table"
        style={{
          borderCollapse: "separate",
          borderSpacing: "2px",
        }}
      >
        <thead>
          <tr>
            <th
              className="cc-concentration-heatmap__corner"
              style={{
                width: cellSize,
                height: cellSize,
              }}
            />
            {cols.map((col) => (
              <th
                key={col}
                className="cc-concentration-heatmap__col-header"
                style={{
                  fontSize: "var(--text-xs, 0.75rem)",
                  fontWeight: 600,
                  textAlign: "center",
                  padding: "var(--space-1, 0.25rem)",
                  color: "var(--text-2)",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <th
                className="cc-concentration-heatmap__row-header"
                style={{
                  fontSize: "var(--text-xs, 0.75rem)",
                  fontWeight: 600,
                  textAlign: "right",
                  padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
                  color: "var(--text-2)",
                  whiteSpace: "nowrap",
                }}
              >
                {row}
              </th>
              {cols.map((col) => {
                const cell = cellMap.get(`${row}::${col}`);
                const value = cell?.value ?? 0;
                const tone = cellTone(value, thresholds);

                const defaultContent = showValues ? (
                  <span style={{ fontWeight: 600, fontSize: "var(--text-xs, 0.75rem)" }}>
                    {cell ? `${Math.round(value)}%` : ""}
                  </span>
                ) : null;

                return (
                  <td
                    key={col}
                    className="cc-concentration-heatmap__cell"
                    style={{
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
                    }}
                    onClick={
                      onCellClick && cell ? () => onCellClick(cell) : undefined
                    }
                    title={cell?.label ?? (cell ? `${row}: ${col} = ${value}%` : "")}
                    role={onCellClick && cell ? "button" : "gridcell"}
                    tabIndex={onCellClick && cell ? 0 : undefined}
                    onKeyDown={
                      onCellClick && cell
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onCellClick(cell);
                            }
                          }
                        : undefined
                    }
                  >
                    {renderCell && cell
                      ? renderCell(cell, defaultContent)
                      : defaultContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
