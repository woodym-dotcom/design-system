/**
 * Graph — unified data-visualization primitive (DS-SIMPLIFY 08).
 *
 * One component, eight `layout` variants:
 *   sparkline | tile | card | dashboard | heatmap | distribution | force* | hierarchical*
 *
 * (* force / hierarchical stub to "Coming in v1.1" — @xyflow/react is not a
 *    peer dep yet.)
 *
 * Timeseries layouts (sparkline/tile/card/dashboard) delegate to the existing
 * Recharts wrappers internally to preserve pixel parity with legacy components.
 * Heatmap and distribution are pure-SVG with no external dependency beyond React.
 *
 * @see Graph.types.ts for full prop / data-shape documentation.
 */
import * as React from "react";
import type {
  GraphProps,
  GraphLayout,
  TimeSeriesData,
  HeatmapData,
  DistributionData,
  DistributionBin,
  HeatmapCell,
} from "./Graph.types";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Derive uniform bins from raw samples. */
function autoBin(samples: number[], binCount: number): DistributionBin[] {
  if (samples.length === 0) return [];
  let min = Infinity;
  let max = -Infinity;
  for (const s of samples) {
    if (s < min) min = s;
    if (s > max) max = s;
  }
  if (min === max) {
    return [{ x0: min - 0.5, x1: max + 0.5, count: samples.length }];
  }
  const width = (max - min) / binCount;
  const bins: DistributionBin[] = Array.from({ length: binCount }, (_, i) => ({
    x0: min + i * width,
    x1: min + (i + 1) * width,
    count: 0,
  }));
  for (const s of samples) {
    const i = Math.min(Math.floor((s - min) / width), binCount - 1);
    bins[i].count++;
  }
  return bins;
}

/** Build sparkline SVG path from numeric values. */
function buildSparklinePath(
  values: readonly number[],
  w: number,
  h: number,
): { line: string; area: string; lastX: number; lastY: number } {
  const n = values.length;
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const span = max - min || 1;
  const pad = 1;
  const iw = w - pad * 2;
  const ih = h - pad * 2;
  const stepX = n > 1 ? iw / (n - 1) : 0;
  const pts = values.map((v, i) => ({
    x: pad + stepX * i,
    y: pad + ih - ((v - min) / span) * ih,
  }));
  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
  const area = pts.length
    ? `${line} L${pts[pts.length - 1].x.toFixed(2)},${(pad + ih).toFixed(2)} L${pts[0].x.toFixed(2)},${(pad + ih).toFixed(2)} Z`
    : "";
  const last = pts[pts.length - 1] ?? { x: 0, y: 0 };
  return { line, area, lastX: last.x, lastY: last.y };
}

// ---------------------------------------------------------------------------
// Loading overlay
// ---------------------------------------------------------------------------

function LoadingOverlay() {
  return (
    <div className="cc-graph__loading" aria-hidden="true" style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "color-mix(in oklch, var(--surface-0, #fff) 80%, transparent)",
      borderRadius: "inherit",
      zIndex: 1,
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" style={{ animation: "cc-graph-spin 1s linear infinite" }}>
        <style>{`@keyframes cc-graph-spin{to{transform:rotate(360deg)}}`}</style>
        <circle cx="12" cy="12" r="9" fill="none" stroke="var(--border-2,#ccc)" strokeWidth="2" />
        <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="var(--accent-1,#6366f1)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyPlaceholder({ children }: { children?: React.ReactNode }) {
  return (
    <div className="cc-graph__empty" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      minHeight: 80,
      fontSize: "var(--text-sm, 0.875rem)",
      color: "var(--text-3, #999)",
      border: "1px dashed var(--border-1, #e2e8f0)",
      borderRadius: 8,
    }}>
      {children ?? "No data available."}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SPARKLINE layout
// ---------------------------------------------------------------------------

const SPARKLINE_DIM: Record<string, { w: number; h: number }> = {
  xs: { w: 40, h: 10 },
  sm: { w: 56, h: 14 },
  md: { w: 80, h: 20 },
  lg: { w: 120, h: 28 },
};

function SparklineLayout({ data, size = "md", ariaLabel, loading }: {
  data: TimeSeriesData;
  size?: GraphProps["size"];
  ariaLabel: string;
  loading?: boolean;
}) {
  const values = data.values ?? [];
  const { w, h } = SPARKLINE_DIM[size] ?? SPARKLINE_DIM.md;

  if (loading) {
    return (
      <span className="cc-graph cc-graph--sparkline" role="img" aria-label={ariaLabel}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="cc-graph__svg">
          <rect x={0} y={0} width={w} height={h} rx={2} fill="var(--border-1,#e2e8f0)" opacity={0.5} />
        </svg>
      </span>
    );
  }

  if (values.length === 0) return null;

  if (values.length === 1) {
    return (
      <span className="cc-graph cc-graph--sparkline" role="img" aria-label={ariaLabel}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="cc-graph__svg">
          <circle cx={w / 2} cy={h / 2} r={2} className="cc-graph__dot" />
        </svg>
      </span>
    );
  }

  const { line, area, lastX, lastY } = buildSparklinePath(values, w, h);
  return (
    <span className="cc-graph cc-graph--sparkline" role="img" aria-label={ariaLabel}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="cc-graph__svg">
        <path d={area} className="cc-graph__area" />
        <path d={line} className="cc-graph__line" fill="none" />
        <circle cx={lastX} cy={lastY} r={1.6} className="cc-graph__dot" />
      </svg>
    </span>
  );
}

// ---------------------------------------------------------------------------
// TILE layout (KPI tile: big value + delta + sparkline)
// ---------------------------------------------------------------------------

function TileLayout({ data, size = "md", ariaLabel, loading, empty }: {
  data: TimeSeriesData;
  size?: GraphProps["size"];
  ariaLabel: string;
  loading?: boolean;
  empty?: React.ReactNode;
}) {
  const values = data.values ?? [];
  const hasData = values.length > 0 || data.kpiValue != null;

  return (
    <div
      className={`cc-graph cc-graph--tile cc-graph--${size}`}
      role="img"
      aria-label={ariaLabel}
      style={{ position: "relative", display: "inline-flex", flexDirection: "column", gap: 4 }}
    >
      {loading && <LoadingOverlay />}
      {!loading && !hasData ? (
        <EmptyPlaceholder>{empty}</EmptyPlaceholder>
      ) : (
        <>
          {data.kpiValue != null ? (
            <div className="cc-graph__kpi-value" style={{ fontSize: "var(--text-2xl, 1.5rem)", fontWeight: 700, lineHeight: 1 }}>
              {data.kpiValue}
            </div>
          ) : null}
          {data.kpiDelta != null ? (
            <div className="cc-graph__kpi-delta" style={{ fontSize: "var(--text-sm, 0.875rem)", color: "var(--text-2, #64748b)" }}>
              {data.kpiDelta}
            </div>
          ) : null}
          {values.length > 0 ? (
            <SparklineLayout data={data} size={size === "lg" ? "md" : "sm"} ariaLabel={`${ariaLabel} trend`} />
          ) : null}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CARD layout (metric card: recharts chart + title + series toggles)
// Delegates to MetricChartCard internals pattern but self-contained here.
// ---------------------------------------------------------------------------

const CARD_HEIGHT: Record<string, number> = { xs: 160, sm: 200, md: 260, lg: 340 };

const CHART_COLORS = [
  "var(--viz-1, var(--tier-core, #6366f1))",
  "var(--viz-2, var(--status-healthy, #22c55e))",
  "var(--viz-3, var(--status-warning, #f59e0b))",
  "var(--viz-4, var(--tier-domain, #3b82f6))",
];

function CardLayout({ data, size = "md", title, subtitle, ariaLabel, loading, empty, onClick }: {
  data: TimeSeriesData;
  size?: GraphProps["size"];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  ariaLabel: string;
  loading?: boolean;
  empty?: React.ReactNode;
  onClick?: GraphProps["onClick"];
}) {
  // Dynamic recharts import — optional peer dep
  const [Recharts, setRecharts] = React.useState<typeof import("recharts") | null>(null);
  React.useEffect(() => {
    import("recharts").then(setRecharts).catch(() => null);
  }, []);

  const hasData = data.points.length > 0;
  const height = CARD_HEIGHT[size] ?? CARD_HEIGHT.md;
  const xKey = data.xKey ?? "day";

  return (
    <section
      className={`cc-graph cc-graph--card cc-graph--${size}`}
      aria-label={ariaLabel}
      style={{ position: "relative" }}
    >
      {loading && <LoadingOverlay />}
      {(title || subtitle) ? (
        <header className="cc-graph__card-header" style={{ marginBottom: 8 }}>
          {title ? <h3 className="cc-graph__card-title" style={{ margin: 0, fontSize: "var(--text-base, 1rem)", fontWeight: 600 }}>{title}</h3> : null}
          {subtitle ? <p className="cc-graph__card-subtitle" style={{ margin: 0, fontSize: "var(--text-sm, 0.875rem)", color: "var(--text-2, #64748b)" }}>{subtitle}</p> : null}
        </header>
      ) : null}
      <div role="img" aria-label={ariaLabel} style={{ height, position: "relative" }}>
        {!hasData ? (
          <EmptyPlaceholder>{empty}</EmptyPlaceholder>
        ) : !Recharts ? (
          <EmptyPlaceholder>Loading chart…</EmptyPlaceholder>
        ) : (
          <Recharts.ResponsiveContainer width="100%" height="100%">
            <Recharts.LineChart
              data={data.points as Record<string, unknown>[]}
              margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
              onClick={(state) => { const s = state as Record<string, unknown>; if (s?.activePayload) onClick?.((s.activePayload as Array<{payload: unknown}>)[0]?.payload); }}
            >
              <Recharts.CartesianGrid stroke="var(--border-1,#e2e8f0)" vertical={false} />
              <Recharts.XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "var(--text-3,#94a3b8)" }} />
              <Recharts.YAxis tick={{ fontSize: 11, fill: "var(--text-3,#94a3b8)" }} width={40} />
              <Recharts.Tooltip
                contentStyle={{ background: "var(--surface-0,#fff)", border: "1px solid var(--border-1,#e2e8f0)", borderRadius: 8 }}
              />
              {(data.lines ?? []).map((key, i) => (
                <Recharts.Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} dot={false} isAnimationActive={false} />
              ))}
              {(data.bars ?? []).map((key, i) => (
                <Recharts.Bar key={key} dataKey={key} fill={CHART_COLORS[i % CHART_COLORS.length]} isAnimationActive={false} />
              ))}
            </Recharts.LineChart>
          </Recharts.ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// DASHBOARD layout — thin wrapper mirroring DashboardChartCard structure
// ---------------------------------------------------------------------------

const DASHBOARD_HEIGHT: Record<string, number> = { xs: 200, sm: 240, md: 280, lg: 360 };

function DashboardLayout({ data, size = "md", title, subtitle, ariaLabel, loading, empty, onClick }: {
  data: TimeSeriesData;
  size?: GraphProps["size"];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  ariaLabel: string;
  loading?: boolean;
  empty?: React.ReactNode;
  onClick?: GraphProps["onClick"];
}) {
  const [Recharts, setRecharts] = React.useState<typeof import("recharts") | null>(null);
  React.useEffect(() => {
    import("recharts").then(setRecharts).catch(() => null);
  }, []);

  const hasData = data.points.length > 0;
  const height = DASHBOARD_HEIGHT[size] ?? DASHBOARD_HEIGHT.md;
  const xKey = data.xKey ?? "day";
  const bars = data.bars ?? [];
  const lines = data.lines ?? [];

  const renderPlot = () => {
    if (!Recharts) return <EmptyPlaceholder>Loading chart…</EmptyPlaceholder>;
    const commonMargin = { top: 14, right: 8, left: 4, bottom: 8 };
    const axisTick = { fontSize: 10, fill: "var(--text-1,#0f172a)" };
    const gridColor = "var(--border-2,#cbd5e1)";
    const tooltipStyle = {
      background: "var(--surface-0,#fff)",
      border: "1px solid var(--border-1,#e2e8f0)",
      borderRadius: 12,
      color: "var(--text-1,#0f172a)",
    };

    return (
      <Recharts.ResponsiveContainer width="100%" height="100%">
        <Recharts.ComposedChart
          data={data.points as Record<string, unknown>[]}
          margin={commonMargin}
          onClick={(state) => { const s = state as Record<string, unknown>; if (s?.activePayload) onClick?.((s.activePayload as Array<{payload: unknown}>)[0]?.payload); }}
        >
          <Recharts.CartesianGrid stroke={gridColor} strokeOpacity={0.55} vertical={false} />
          <Recharts.XAxis dataKey={xKey} tick={axisTick} padding={{ left: 12, right: 12 }} />
          <Recharts.YAxis width={48} tick={axisTick} />
          <Recharts.Tooltip contentStyle={tooltipStyle} />
          {bars.map((key, i) => (
            <Recharts.Bar key={key} dataKey={key} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[6, 6, 0, 0]} isAnimationActive={false} />
          ))}
          {lines.map((key, i) => (
            <Recharts.Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[(i + bars.length) % CHART_COLORS.length]} strokeWidth={2} dot={false} isAnimationActive={false} />
          ))}
        </Recharts.ComposedChart>
      </Recharts.ResponsiveContainer>
    );
  };

  return (
    <figure className={`cc-graph cc-graph--dashboard cc-graph--${size}`} role="group" aria-label={ariaLabel} style={{ margin: 0, position: "relative" }}>
      {loading && <LoadingOverlay />}
      {(title || subtitle) ? (
        <figcaption className="cc-graph__dashboard-header" style={{ marginBottom: 12 }}>
          {title ? <h3 className="cc-graph__dashboard-title" style={{ margin: 0, fontSize: "var(--text-base, 1rem)", fontWeight: 600 }}>{title}</h3> : null}
          {subtitle ? <p className="cc-graph__dashboard-subtitle" style={{ margin: 0, fontSize: "var(--text-sm, 0.875rem)", color: "var(--text-2, #64748b)" }}>{subtitle}</p> : null}
        </figcaption>
      ) : null}
      <div role="img" aria-label={ariaLabel} style={{ height, position: "relative" }}>
        {!hasData ? <EmptyPlaceholder>{empty}</EmptyPlaceholder> : renderPlot()}
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// HEATMAP layout — pure SVG categorical matrix
// ---------------------------------------------------------------------------

function HeatmapLayout({ data, size = "md", title, ariaLabel, loading, empty, onClick }: {
  data: HeatmapData;
  size?: GraphProps["size"];
  title?: React.ReactNode;
  ariaLabel: string;
  loading?: boolean;
  empty?: React.ReactNode;
  onClick?: GraphProps["onClick"];
}) {
  const cellSize = size === "xs" ? 12 : size === "sm" ? 16 : size === "md" ? 20 : 28;
  const gap = 2;
  const labelPad = 52; // px for row labels
  const colPad = 20;   // px for col labels

  const cells = data.cells;
  const rows = data.rows ?? [...new Set(cells.map((c) => c.row))];
  const cols = data.cols ?? [...new Set(cells.map((c) => c.col))];

  const maxVal = Math.max(0, ...cells.map((c) => c.value));

  const lookup = new Map<string, number>();
  for (const c of cells) lookup.set(`${c.row}:${c.col}`, c.value);

  const svgW = labelPad + cols.length * (cellSize + gap);
  const svgH = colPad + rows.length * (cellSize + gap);

  return (
    <div className={`cc-graph cc-graph--heatmap cc-graph--${size}`} style={{ position: "relative" }}>
      {loading && <LoadingOverlay />}
      {title ? <div className="cc-graph__title" style={{ marginBottom: 8, fontWeight: 600 }}>{title}</div> : null}
      {cells.length === 0 ? (
        <EmptyPlaceholder>{empty}</EmptyPlaceholder>
      ) : (
        <svg
          role="img"
          aria-label={ariaLabel}
          width={svgW}
          height={svgH}
          style={{ overflow: "visible" }}
        >
          {/* Column labels */}
          {cols.map((col, ci) => (
            <text
              key={col}
              x={labelPad + ci * (cellSize + gap) + cellSize / 2}
              y={colPad - 4}
              textAnchor="middle"
              fontSize={10}
              fill="var(--text-2,#64748b)"
            >
              {col}
            </text>
          ))}
          {/* Row labels + cells */}
          {rows.map((row, ri) => (
            <g key={row}>
              <text
                x={labelPad - 4}
                y={colPad + ri * (cellSize + gap) + cellSize / 2 + 4}
                textAnchor="end"
                fontSize={10}
                fill="var(--text-2,#64748b)"
              >
                {row}
              </text>
              {cols.map((col, ci) => {
                const val = lookup.get(`${row}:${col}`) ?? 0;
                const intensity = maxVal > 0 ? val / maxVal : 0;
                return (
                  <rect
                    key={col}
                    x={labelPad + ci * (cellSize + gap)}
                    y={colPad + ri * (cellSize + gap)}
                    width={cellSize}
                    height={cellSize}
                    rx={3}
                    fill={val > 0
                      ? `color-mix(in srgb, var(--viz-1,#6366f1) ${Math.round(intensity * 100)}%, var(--surface-1,#f1f5f9))`
                      : "var(--border-1,#e2e8f0)"}
                    aria-label={`${row} × ${col}: ${val}`}
                    style={{ cursor: onClick ? "pointer" : undefined }}
                    onClick={onClick ? () => onClick({ row, col, value: val }) : undefined}
                  >
                    <title>{`${row} × ${col}: ${val}`}</title>
                  </rect>
                );
              })}
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DISTRIBUTION layout — pure SVG histogram
// ---------------------------------------------------------------------------

const DIST_HEIGHT: Record<string, number> = { xs: 80, sm: 120, md: 160, lg: 220 };

function DistributionLayout({ data, size = "md", title, ariaLabel, loading, empty, onClick }: {
  data: DistributionData;
  size?: GraphProps["size"];
  title?: React.ReactNode;
  ariaLabel: string;
  loading?: boolean;
  empty?: React.ReactNode;
  onClick?: GraphProps["onClick"];
}) {
  const h = DIST_HEIGHT[size] ?? DIST_HEIGHT.md;
  const w = 300;
  const binCount = data.binCount ?? 20;

  const bins: DistributionBin[] = React.useMemo(() => {
    if (data.bins && data.bins.length > 0) return data.bins;
    if (data.samples && data.samples.length > 0) return autoBin(data.samples, binCount);
    return [];
  }, [data.bins, data.samples, binCount]);

  if (!bins.length) {
    return (
      <div className={`cc-graph cc-graph--distribution cc-graph--${size}`}>
        {title ? <div className="cc-graph__title" style={{ marginBottom: 8, fontWeight: 600 }}>{title}</div> : null}
        <EmptyPlaceholder>{empty}</EmptyPlaceholder>
      </div>
    );
  }

  const maxCount = Math.max(...bins.map((b) => b.count));
  const barW = w / bins.length;
  const pad = 2;

  return (
    <div className={`cc-graph cc-graph--distribution cc-graph--${size}`} style={{ position: "relative" }}>
      {loading && <LoadingOverlay />}
      {title ? <div className="cc-graph__title" style={{ marginBottom: 8, fontWeight: 600 }}>{title}</div> : null}
      <svg
        role="img"
        aria-label={ariaLabel}
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height={h}
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        {bins.map((bin, i) => {
          const barH = maxCount > 0 ? (bin.count / maxCount) * (h - 4) : 0;
          const x = i * barW + pad;
          const y = h - barH;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={Math.max(0, barW - pad * 2)}
              height={barH}
              rx={2}
              fill="var(--viz-1, #6366f1)"
              opacity={0.8}
              style={{ cursor: onClick ? "pointer" : undefined }}
              onClick={onClick ? () => onClick(bin) : undefined}
            >
              <title>{`[${bin.x0.toFixed(1)}, ${bin.x1.toFixed(1)}): ${bin.count}`}</title>
            </rect>
          );
        })}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FORCE / HIERARCHICAL stubs
// ---------------------------------------------------------------------------

function NetworkStub({ layout, ariaLabel }: { layout: "force" | "hierarchical"; ariaLabel: string }) {
  const label = layout === "force" ? "Force network" : "Hierarchical tree";
  return (
    <div
      className={`cc-graph cc-graph--${layout} cc-graph--stub`}
      role="img"
      aria-label={ariaLabel}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 24,
        border: "1px dashed var(--border-1, #e2e8f0)",
        borderRadius: 12,
        color: "var(--text-3, #94a3b8)",
        fontSize: "var(--text-sm, 0.875rem)",
        minHeight: 120,
      }}
    >
      {/* Graph network icon placeholder */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="24" r="4" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10" y1="11" x2="14" y2="21" stroke="currentColor" strokeWidth="1.5" />
        <line x1="22" y1="11" x2="18" y2="21" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <div>
        <strong>{label}</strong> — coming in v1.1
      </div>
      <div style={{ fontSize: "var(--text-xs, 0.75rem)", opacity: 0.7 }}>
        Requires <code>@xyflow/react</code> (not yet a peer dep)
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Graph — unified data-visualization primitive.
 *
 * @example
 * // Sparkline
 * <Graph layout="sparkline" data={{ layout: "sparkline", values: [1,4,2,8] }} ariaLabel="Trend" />
 *
 * @example
 * // KPI tile
 * <Graph layout="tile" data={{ layout: "tile", kpiValue: "4,201", kpiDelta: "+12%", values: [1,4,2,8] }} ariaLabel="Revenue" />
 *
 * @example
 * // Heatmap
 * <Graph layout="heatmap" data={{ layout: "heatmap", cells: [{row:"Mon",col:"W1",value:3}] }} ariaLabel="Activity" />
 */
export function Graph({
  layout,
  size = "md",
  data,
  title,
  subtitle,
  legend: _legend,
  empty,
  loading,
  onClick,
  ariaLabel,
  source: _source,
}: GraphProps): React.ReactElement | null {
  // Type guard helpers
  const isTimeSeries = (
    d: typeof data,
    l: GraphLayout,
  ): d is import("./Graph.types").TimeSeriesData =>
    l === "sparkline" || l === "tile" || l === "card" || l === "dashboard";

  const isHeatmap = (d: typeof data): d is HeatmapData => d.layout === "heatmap";
  const isDistribution = (d: typeof data): d is DistributionData => d.layout === "distribution";

  switch (layout) {
    case "sparkline":
      if (!isTimeSeries(data, layout)) return null;
      return (
        <SparklineLayout
          data={data}
          size={size}
          ariaLabel={ariaLabel}
          loading={loading}
        />
      );

    case "tile":
      if (!isTimeSeries(data, layout)) return null;
      return (
        <TileLayout
          data={data}
          size={size}
          ariaLabel={ariaLabel}
          loading={loading}
          empty={empty}
        />
      );

    case "card":
      if (!isTimeSeries(data, layout)) return null;
      return (
        <CardLayout
          data={data}
          size={size}
          title={title}
          subtitle={subtitle}
          ariaLabel={ariaLabel}
          loading={loading}
          empty={empty}
          onClick={onClick}
        />
      );

    case "dashboard":
      if (!isTimeSeries(data, layout)) return null;
      return (
        <DashboardLayout
          data={data}
          size={size}
          title={title}
          subtitle={subtitle}
          ariaLabel={ariaLabel}
          loading={loading}
          empty={empty}
          onClick={onClick}
        />
      );

    case "heatmap":
      if (!isHeatmap(data)) return null;
      return (
        <HeatmapLayout
          data={data}
          size={size}
          title={title}
          ariaLabel={ariaLabel}
          loading={loading}
          empty={empty}
          onClick={onClick}
        />
      );

    case "distribution":
      if (!isDistribution(data)) return null;
      return (
        <DistributionLayout
          data={data}
          size={size}
          title={title}
          ariaLabel={ariaLabel}
          loading={loading}
          empty={empty}
          onClick={onClick}
        />
      );

    case "force":
    case "hierarchical":
      return <NetworkStub layout={layout} ariaLabel={ariaLabel} />;

    default:
      return null;
  }
}
