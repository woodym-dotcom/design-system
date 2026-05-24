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

// ── Types ───────────────────────────────────────────────────────────────────

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

// ── Helpers ─────────────────────────────────────────────────────────────────

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

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Simple 2-stop linear color interpolation via RGB. */
function interpolateColor(t: number): string {
  // Green (low risk) to Red (high risk)
  const r = Math.round(lerp(76, 220, t));
  const g = Math.round(lerp(175, 76, t));
  const b = Math.round(lerp(80, 76, t));
  return `rgb(${r}, ${g}, ${b})`;
}

// ── Component ───────────────────────────────────────────────────────────────

export function HeatmapChart({
  cells,
  rows: rowsProp,
  columns: colsProp,
  colorRange,
  ariaLabel = 'Heatmap chart',
  onCellClick,
  cellSize = 40,
  showValues = true,
  className,
}: HeatmapChartProps): React.ReactElement {
  const rowLabels = rowsProp ?? uniqueOrdered(cells.map((c) => c.row));
  const colLabels = colsProp ?? uniqueOrdered(cells.map((c) => c.col));

  // Build a lookup map
  const cellMap = new Map<string, HeatmapCell>();
  for (const cell of cells) {
    cellMap.set(`${cell.row}::${cell.col}`, cell);
  }

  // Value range for normalization
  let minVal = Infinity;
  let maxVal = -Infinity;
  for (const cell of cells) {
    if (cell.value < minVal) minVal = cell.value;
    if (cell.value > maxVal) maxVal = cell.value;
  }
  const range = maxVal - minVal || 1;

  const labelWidth = 100;
  const labelHeight = 30;
  const svgWidth = labelWidth + colLabels.length * cellSize;
  const svgHeight = labelHeight + rowLabels.length * cellSize;

  const useCustomColors = colorRange && colorRange.length === 2;

  return (
    <div
      className={['cc-heatmap-chart', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width={svgWidth}
        height={svgHeight}
        style={{ display: 'block' }}
      >
        {/* Column headers */}
        {colLabels.map((col, ci) => (
          <text
            key={`col-${ci}`}
            x={labelWidth + ci * cellSize + cellSize / 2}
            y={labelHeight - 6}
            textAnchor="middle"
            fontSize={11}
            fill="var(--text-2, #666)"
          >
            {col}
          </text>
        ))}

        {/* Row headers + cells */}
        {rowLabels.map((row, ri) => (
          <g key={`row-${ri}`}>
            <text
              x={labelWidth - 8}
              y={labelHeight + ri * cellSize + cellSize / 2 + 4}
              textAnchor="end"
              fontSize={11}
              fill="var(--text-2, #666)"
            >
              {row}
            </text>

            {colLabels.map((col, ci) => {
              const cell = cellMap.get(`${row}::${col}`);
              const value = cell?.value ?? 0;
              const t = (value - minVal) / range;
              const fillColor = interpolateColor(t);
              const x = labelWidth + ci * cellSize;
              const y = labelHeight + ri * cellSize;

              return (
                <g key={`cell-${ri}-${ci}`}>
                  <rect
                    x={x + 1}
                    y={y + 1}
                    width={cellSize - 2}
                    height={cellSize - 2}
                    rx={3}
                    fill={fillColor}
                    opacity={0.85}
                    style={{ cursor: onCellClick ? 'pointer' : 'default' }}
                    onClick={onCellClick && cell ? () => onCellClick(cell) : undefined}
                  >
                    <title>{cell?.label ?? `${row} / ${col}: ${value}`}</title>
                  </rect>
                  {showValues && (
                    <text
                      x={x + cellSize / 2}
                      y={y + cellSize / 2 + 4}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={500}
                      fill={t > 0.5 ? '#fff' : '#333'}
                      pointerEvents="none"
                    >
                      {value}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Alias -- MatrixChart is the same component with a different name. */
export const MatrixChart = HeatmapChart;
