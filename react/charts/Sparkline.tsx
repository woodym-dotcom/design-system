/**
 * Sparkline — pure-SVG inline trend chart.
 *
 * No chart library dependency — the SVG path is computed from `values`
 * directly. Sizes are fixed canvases (sm/md/lg) and the path scales to fill
 * via `preserveAspectRatio="none"` so two sparklines next to each other
 * share a visual baseline irrespective of their domain.
 *
 * Empty values renders nothing. A single value renders a single dot.
 */
import * as React from "react";

export type SparklineTone =
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "muted"
  | "neutral";
export type SparklineSize = "sm" | "md" | "lg";

export interface SparklineProps {
  /** Y-axis values. */
  values?: readonly number[];
  /** Alias for `values`. If both supplied, `values` wins. */
  data?: readonly number[];
  /** Tone. Defaults to "accent". */
  tone?: SparklineTone;
  /** Canvas size. Defaults to "md". */
  size?: SparklineSize;
  /** Fill under the line. Defaults to true. */
  showArea?: boolean;
  /** Show a dot at the last value. Defaults to true. */
  showLastDot?: boolean;
  /** Accessible label. */
  ariaLabel?: string;
  "aria-label"?: string;
  /** Optional label text rendered after the SVG. */
  label?: React.ReactNode;
  className?: string;
}

const DIMENSIONS: Record<SparklineSize, { w: number; h: number }> = {
  sm: { w: 56, h: 14 },
  md: { w: 80, h: 20 },
  lg: { w: 120, h: 28 },
};

function buildPath(
  values: readonly number[],
  width: number,
  height: number,
): { line: string; area: string; lastX: number; lastY: number } {
  const n = values.length;
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const span = max - min || 1;
  // 1px padding so strokes are not clipped at the edges.
  const pad = 1;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const stepX = n > 1 ? innerW / (n - 1) : 0;

  const pts: Array<{ x: number; y: number }> = values.map((v, i) => ({
    x: pad + stepX * i,
    y: pad + innerH - ((v - min) / span) * innerH,
  }));

  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
  const area = pts.length
    ? `${line} L${pts[pts.length - 1].x.toFixed(2)},${(pad + innerH).toFixed(
        2,
      )} L${pts[0].x.toFixed(2)},${(pad + innerH).toFixed(2)} Z`
    : "";
  const last = pts[pts.length - 1] ?? { x: 0, y: 0 };
  return { line, area, lastX: last.x, lastY: last.y };
}

export function Sparkline({
  values,
  data,
  tone = "accent",
  size = "md",
  showArea = true,
  showLastDot = true,
  ariaLabel,
  "aria-label": ariaLabelAttr,
  label,
  className,
}: SparklineProps): React.ReactElement | null {
  const series = values ?? data ?? [];
  if (series.length === 0) return null;
  const { w, h } = DIMENSIONS[size];
  const cls = [
    "cc-sparkline",
    `cc-sparkline--${tone}`,
    `cc-sparkline--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const accessibleLabel =
    ariaLabelAttr ?? ariaLabel ?? `Trend: ${series.length} points`;

  if (series.length === 1) {
    return (
      <span className={cls}>
        <svg
          role="img"
          aria-label={accessibleLabel}
          viewBox={`0 0 ${w} ${h}`}
          width={w}
          height={h}
          preserveAspectRatio="none"
          className="cc-sparkline__svg"
        >
          <circle
            cx={w / 2}
            cy={h / 2}
            r={2}
            className="cc-sparkline__dot"
          />
        </svg>
        {label != null ? <span className="cc-sparkline__label">{label}</span> : null}
      </span>
    );
  }

  const { line, area, lastX, lastY } = buildPath(series, w, h);

  return (
    <span className={cls}>
      <svg
        role="img"
        aria-label={accessibleLabel}
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        preserveAspectRatio="none"
        className="cc-sparkline__svg"
      >
        {showArea ? <path d={area} className="cc-sparkline__area" /> : null}
        <path d={line} className="cc-sparkline__line" fill="none" />
        {showLastDot ? (
          <circle
            cx={lastX}
            cy={lastY}
            r={1.6}
            className="cc-sparkline__dot"
          />
        ) : null}
      </svg>
      {label != null ? <span className="cc-sparkline__label">{label}</span> : null}
    </span>
  );
}
