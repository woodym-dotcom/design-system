/**
 * <DashboardChartCard> — promoted Recharts chart tile for the Malbot dashboard.
 *
 * Promoted from apps/dashboard/client/src/components/ChartCard.tsx.
 * Lives in ds-core so the cc-chart-frame grid row fix and legend
 * letter-spacing regression are applied centrally and can't drift.
 *
 * New features added at promotion time:
 *  - `caption`         — plain-English explanation rendered below the title.
 *  - `legend`          — 'inline' (default) | 'below' | 'none'.
 *  - `clampDomain`     — clamps y-axis: { yMin?, yMax? } (e.g. non-negative power).
 *  - `expand`          — single Expand action; consolidates the old Zoom/Details split.
 *  - `fullWidth`       — (internal) chart takes full container width; default true.
 *  - Letter-spacing regression fixed: legend wrapper no longer inherits
 *    tracking-[0.18em] from parent scopes (legendWrapperStyle resets it).
 *  - cc-chart-frame grid row fix applied unconditionally at component level.
 *
 * PeerDeps: react ≥ 18, recharts ≥ 3.
 */
import * as React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  Bar,
  Legend,
  ReferenceLine,
  ReferenceArea,
  Scatter,
  ScatterChart,
} from 'recharts';

// ---------------------------------------------------------------------------
// Types (self-contained — not coupled to any server codegen)
// ---------------------------------------------------------------------------

export interface DashboardChartMeta {
  id: string;
  title: string;
  source: string;
  freshness: string;
  definition: string;
}

export type DashboardSeriesPoint = Record<string, string | number | null | undefined>;

export interface DashboardChartCardData {
  meta: DashboardChartMeta;
  summary: Record<string, string | number | null>;
  data: DashboardSeriesPoint[];
  /** Optional deferred reason — renders a placeholder instead of the chart. */
  deferred?: { reason: string };
}

export type DashboardChartKind =
  | 'bar'
  | 'line'
  | 'heatmap'
  | 'scatter'
  | 'hStackedBar'
  | 'dualAxis'
  | 'logXLine';

export type DashboardChartReference =
  | { kind: 'line'; y: number; label?: string; tone?: 'good' | 'neutral' | 'bad' }
  | { kind: 'band'; y1: number; y2: number; tone?: 'good' | 'neutral' | 'bad' };

export interface DashboardChartCardProps {
  /** Chart data envelope. */
  card: DashboardChartCardData;
  /** Chart variant. */
  kind: DashboardChartKind;
  /** Bar series keys. */
  bars?: string[];
  /** Line series keys. */
  lines?: string[];
  /** Right-axis line series (dualAxis only). */
  rightLines?: string[];
  /** Override the x-axis dataKey (default: 'day'). */
  xKey?: string;
  /** Horizontal reference lines/bands. */
  references?: DashboardChartReference[];
  /** Screen-reader table rows. */
  tableRows?: Array<Record<string, string | number | null | undefined>>;
  /** Headline element (latest value + Delta) above chart. */
  headline?: React.ReactNode;
  /**
   * Plain-English caption explaining what the chart shows.
   * Rendered as a single line below the title, before the chart.
   */
  caption?: string;
  /**
   * Legend placement.
   *  - 'inline' (default): Recharts <Legend> rendered inside the chart on
   *    desktop; mobile uses the custom below-chart legend strip.
   *  - 'below': always renders the custom strip below the chart.
   *  - 'none': no legend.
   */
  legend?: 'inline' | 'below' | 'none';
  /**
   * Clamp the y-axis domain to the given bounds.
   * Useful for metrics like power or calories that should never go below 0.
   */
  clampDomain?: { yMin?: number; yMax?: number };
  /**
   * Expand action. When provided, renders a single "Expand" button that
   * replaces the old Zoom / Details split.
   */
  expand?: { onClick: () => void };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHART_COLORS = [
  'var(--viz-1, var(--tier-core))',
  'var(--viz-2, var(--status-healthy))',
  'var(--viz-3, var(--status-warning))',
  'var(--viz-4, var(--tier-domain))',
];

const AXIS_COLOR = 'var(--text-1)';
const GRID_COLOR = 'var(--border-2)';

const TOOLTIP_STYLE = {
  background: 'var(--surface-0)',
  border: '1px solid var(--border-1)',
  borderRadius: 12,
  color: 'var(--text-1)',
  boxShadow: 'var(--shadow-2)',
};

const TOOLTIP_LABEL_STYLE = { color: 'var(--text-1)', fontWeight: 600 };

// Fix: reset letterSpacing so the Recharts legend wrapper doesn't inherit
// tracking-[0.18em] or other letter-spacing values from parent CSS scopes.
const LEGEND_WRAPPER_STYLE: React.CSSProperties = {
  color: 'var(--text-1)',
  letterSpacing: 'normal',
  fontSize: 'var(--text-xs, 0.75rem)',
};

const LABEL_MAP: Record<string, string> = {
  costSma7: 'Cost 7-day avg',
  costSma28: 'Cost 28-day avg',
  tokensSma7: 'Tokens 7-day avg',
  tokensSma28: 'Tokens 28-day avg',
  messagesPerResolvedTopic: 'Messages / resolved topic',
  messagesPerResolvedTopicSma7: 'Messages/topic 7-day avg',
  totalOpen: 'Open todo backlog',
  topicsCreated: 'Topics created (below axis)',
  topicsRaised: 'Topics raised',
  topicsRaisedSigned: 'Topics raised (below axis)',
  estimatedFtp: 'Estimated FTP',
  ftpSma7: 'FTP 7-day avg',
  ftpSma28: 'FTP 28-day avg',
  ftpReference: 'Reference FTP',
  trainingLoad: 'Daily load',
  restDay: 'Rest day marker',
  loadSma7: 'Load 7-day avg',
  loadSma28: 'Load 28-day avg',
  atl: 'Fatigue (ATL)',
  ctl: 'Fitness (CTL)',
  tsb: 'Form (TSB)',
  bestPower90d: 'Best 90 days (W)',
  bestPowerAllTime: 'All-time best (W)',
  restingHr: 'Resting HR',
  restingHrSma7: '7-day avg',
  baseline: '90-day median',
  deep: 'Deep',
  light: 'Light',
  rem: 'REM',
  awake: 'Awake',
  spo2: 'SpO2 (%)',
  respirationSleeping: 'Respiration asleep',
  respirationWaking: 'Respiration awake',
  moderate: 'Moderate min',
  vigorous: 'Vigorous min',
  total: 'WHO-weighted total',
  steps: 'Steps',
  floors: 'Floors',
  stepsSma7: 'Steps 7-day avg',
  weightKg: 'Weight (kg)',
  weightKgSma7: 'Weight 7-day avg',
  decouplingPct: 'Decoupling %',
  aerobic: 'Aerobic TE',
  anaerobic: 'Anaerobic TE',
  z1: 'Z1', z2: 'Z2', z3: 'Z3', z4: 'Z4', z5: 'Z5', z6: 'Z6', z7: 'Z7',
};

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

function legendFormatter(value: string): string {
  return LABEL_MAP[value] ?? value.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}

function axisNumber(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${Number((value / 1_000_000).toFixed(1))}M`;
  if (abs >= 1_000) return `${Number((value / 1_000).toFixed(1))}k`;
  return String(value);
}

function numericValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function dayTick(value: string, mobile: boolean): string {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB', {
    ...(mobile ? { day: 'numeric', month: 'numeric' } : { day: 'numeric', month: 'short' }),
    timeZone: 'UTC',
  }).format(date);
}

function toneColour(tone?: 'good' | 'neutral' | 'bad'): string {
  if (tone === 'good') return 'var(--status-healthy)';
  if (tone === 'bad') return 'var(--status-warning)';
  return 'var(--text-2)';
}

type ChartDomain = [number, number];

function niceDomain(
  data: DashboardSeriesPoint[],
  bars: string[],
  lines: string[],
  clamp?: { yMin?: number; yMax?: number },
): ChartDomain {
  if (!data.length || (!bars.length && !lines.length)) return [0, 1];
  let min = bars.length ? 0 : Number.POSITIVE_INFINITY;
  let max = bars.length ? 0 : Number.NEGATIVE_INFINITY;

  for (const point of data) {
    let positiveStack = 0;
    let negativeStack = 0;
    for (const key of bars) {
      const v = numericValue(point[key]) ?? 0;
      if (v >= 0) positiveStack += v;
      else negativeStack += v;
    }
    min = Math.min(min, negativeStack);
    max = Math.max(max, positiveStack);
    for (const key of lines) {
      const v = numericValue(point[key]);
      if (v === null) continue;
      min = Math.min(min, v);
      max = Math.max(max, v);
    }
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];

  if (min === max) {
    const pad = Math.max(1, Math.abs(max) * 0.1);
    const rawMin = min - pad;
    const rawMax = max + pad;
    return [
      clamp?.yMin !== undefined ? Math.max(clamp.yMin, Math.floor(rawMin)) : Math.floor(rawMin),
      clamp?.yMax !== undefined ? Math.min(clamp.yMax, Math.ceil(rawMax)) : Math.ceil(rawMax),
    ];
  }

  const range = max - min;
  const pad = range * 0.08;
  const lower = bars.length ? (min < 0 ? min - pad : 0) : min - pad;
  const rawMin = Math.floor(lower);
  const rawMax = Math.ceil(max + pad);
  return [
    clamp?.yMin !== undefined ? Math.max(clamp.yMin, rawMin) : rawMin,
    clamp?.yMax !== undefined ? Math.min(clamp.yMax, rawMax) : rawMax,
  ];
}

// ---------------------------------------------------------------------------
// useIsMobile hook
// ---------------------------------------------------------------------------

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-width: 640px)').matches
      : false,
  );
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return isMobile;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ScreenReaderTable({
  title,
  rows,
  keys,
}: {
  title: string;
  rows: DashboardChartCardProps['tableRows'];
  keys: string[];
}) {
  if (!rows || rows.length === 0 || keys.length === 0) return null;
  const allKeys = ['day', ...keys.filter((k) => k !== 'day')];
  return (
    <table className="sr-only" role="table" aria-label={`${title} underlying data`}>
      <thead>
        <tr>{allKeys.map((k) => <th key={k}>{legendFormatter(k)}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {allKeys.map((k) => (
              <td key={k}>{row[k] == null ? '' : String(row[k])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderReferences(refs: DashboardChartReference[] | undefined): React.ReactNode {
  if (!refs || refs.length === 0) return null;
  return refs.map((ref, i) =>
    ref.kind === 'line' ? (
      <ReferenceLine
        key={`ref-${i}`}
        y={ref.y}
        stroke={toneColour(ref.tone)}
        strokeDasharray="4 3"
        strokeOpacity={0.7}
        label={{ value: ref.label ?? '', position: 'insideBottomRight', fill: toneColour(ref.tone), fontSize: 10 }}
      />
    ) : (
      <ReferenceArea
        key={`ref-${i}`}
        y1={ref.y1}
        y2={ref.y2}
        fill={toneColour(ref.tone)}
        fillOpacity={0.08}
        stroke="none"
      />
    ),
  );
}

function HeatmapGrid({
  data,
  ariaLabel,
}: {
  data: DashboardSeriesPoint[];
  ariaLabel: string;
}) {
  const points = data as Array<Record<string, unknown>>;
  const maxLoad = Math.max(0, ...points.map((p) => Number(p['load'] ?? 0)).filter(Number.isFinite));
  const columns: Array<{ key: string; cells: Array<Record<string, unknown>> }> = [];
  let current: { key: string; cells: Array<Record<string, unknown>> } | null = null;
  for (const point of points) {
    const day = String(point['day'] ?? '');
    if (!day) continue;
    const weekday = Number(point['weekday'] ?? 0);
    const date = new Date(`${day}T00:00:00Z`);
    const adjusted = new Date(date);
    adjusted.setUTCDate(adjusted.getUTCDate() - ((weekday + 6) % 7));
    const weekKey = adjusted.toISOString().slice(0, 10);
    if (!current || current.key !== weekKey) {
      current = { key: weekKey, cells: [] };
      columns.push(current);
    }
    current.cells.push(point);
  }
  const cellSize = 12;
  const gap = 2;
  return (
    <div role="img" aria-label={ariaLabel} style={{ display: 'flex', flexWrap: 'wrap', gap, padding: '8px 0' }}>
      {columns.map((col) => (
        <div key={col.key} style={{ display: 'grid', gridTemplateRows: `repeat(7, ${cellSize}px)`, gap }}>
          {[1, 2, 3, 4, 5, 6, 0].map((dayOfWeek) => {
            const cell = col.cells.find((c) => Number(c['weekday']) === dayOfWeek);
            const load = cell ? Number(cell['load'] ?? 0) : 0;
            const intensity = maxLoad > 0 ? Math.min(1, load / maxLoad) : 0;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const background = load > 0
              ? `color-mix(in srgb, var(--viz-1, var(--tier-core)) ${Math.round(intensity * 100)}%, transparent)`
              : isWeekend
                ? 'color-mix(in srgb, var(--border-2) 50%, transparent)'
                : 'var(--border-2)';
            return (
              <div
                key={`${col.key}-${dayOfWeek}`}
                title={cell ? `${cell['day']}: load ${cell['load']}` : ''}
                style={{ width: cellSize, height: cellSize, background, borderRadius: 2 }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DashboardChartCard({
  card,
  kind,
  bars = [],
  lines = [],
  rightLines = [],
  xKey = 'day',
  references,
  tableRows,
  headline,
  caption,
  legend: legendProp = 'inline',
  clampDomain,
  expand,
}: DashboardChartCardProps) {
  const mobile = useIsMobile();
  const hasData = card.data.length > 0;
  // Caption disclosure: on mobile the caption is hidden by default to claw
  // back vertical space; tapping the info trigger reveals it. On desktop the
  // CSS overrides keep the caption block visible regardless of state and the
  // trigger is hidden, so this state is a no-op there.
  const [captionOpen, setCaptionOpen] = React.useState(false);
  const captionId = `${card.meta.id}-caption`;
  const height = mobile ? 230 : 280;
  const axisWidth = mobile ? 42 : 52;

  const yDomain = React.useMemo(
    () => niceDomain(card.data, bars, lines, clampDomain),
    [card.data, bars, lines, clampDomain],
  );

  const series = [...bars, ...lines];
  const targetTicks = mobile ? 4 : 6;
  const tickEvery = Math.max(0, Math.ceil(card.data.length / targetTicks) - 1);

  const isDateAxis = xKey === 'day';
  const xTickFormatter = (v: unknown) => isDateAxis ? dayTick(String(v), mobile) : String(v);
  const xLabelFormatter = (v: unknown) => isDateAxis ? dayTick(String(v), false) : String(v);

  // Whether to show the inline Recharts <Legend> (desktop-only when legend='inline').
  const showInlineLegend = legendProp === 'inline' && !mobile;
  // Whether to show the custom below-chart strip.
  const showBelowLegend =
    legendProp === 'below' || (legendProp === 'inline' && mobile);

  // Date-axis labels: enforce a minimum gap that prevents overlap on dense
  // series. "10 Mar" is ~32px at 10px font; "1" (logXLine) is ~6px. The gap
  // applies after the interval filter, so it's a safety net rather than the
  // primary spacer.
  const xMinTickGap = isDateAxis ? (mobile ? 30 : 42) : (mobile ? 8 : 14);

  const renderCommonAxes = () => (
    <>
      <CartesianGrid stroke={GRID_COLOR} strokeOpacity={0.55} vertical={false} />
      <XAxis
        dataKey={xKey}
        interval={tickEvery}
        minTickGap={xMinTickGap}
        allowDuplicatedCategory={false}
        tickFormatter={xTickFormatter}
        tick={{ fontSize: mobile ? 9 : 10, fill: AXIS_COLOR }}
        height={mobile ? 28 : 30}
        tickMargin={mobile ? 5 : 6}
        padding={{ left: 12, right: 12 }}
      />
      <YAxis
        width={axisWidth}
        domain={yDomain}
        tickFormatter={(v: unknown) => axisNumber(Number(v))}
        tick={{ fontSize: mobile ? 9 : 10, fill: AXIS_COLOR }}
        axisLine={{ stroke: GRID_COLOR }}
        tickLine={{ stroke: GRID_COLOR }}
      />
      <Tooltip
        contentStyle={TOOLTIP_STYLE}
        labelStyle={TOOLTIP_LABEL_STYLE}
        itemStyle={{ color: 'var(--text-1)' }}
        labelFormatter={xLabelFormatter}
        formatter={(value: unknown, name: unknown) => [value as number, legendFormatter(String(name))]}
      />
      {showInlineLegend && (
        <Legend
          wrapperStyle={LEGEND_WRAPPER_STYLE}
          formatter={(value: unknown) => (
            <span style={LEGEND_WRAPPER_STYLE}>{legendFormatter(String(value))}</span>
          )}
        />
      )}
      {renderReferences(references)}
    </>
  );

  const renderPlot = () => {
    if (kind === 'bar' || kind === 'hStackedBar') {
      const layout = kind === 'hStackedBar' ? ('vertical' as const) : ('horizontal' as const);
      return (
        <ComposedChart data={card.data} layout={layout} margin={{ top: 14, right: 8, left: 4, bottom: 8 }}>
          {renderCommonAxes()}
          {bars.map((key, index) => {
            const isTop = bars.length === 1 || index === bars.length - 1;
            return (
              <Bar
                key={key}
                dataKey={key}
                name={legendFormatter(key)}
                stackId={bars.length > 1 ? 'a' : undefined}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                radius={isTop ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                isAnimationActive={false}
              />
            );
          })}
          {lines.map((key, index) => (
            <Line
              key={key}
              yAxisId={0}
              type="monotone"
              dataKey={key}
              name={legendFormatter(key)}
              stroke={CHART_COLORS[(index + bars.length) % CHART_COLORS.length]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </ComposedChart>
      );
    }

    if (kind === 'dualAxis') {
      return (
        <ComposedChart data={card.data} margin={{ top: 14, right: 8, left: 4, bottom: 8 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeOpacity={0.55} vertical={false} />
          <XAxis
            dataKey={xKey}
            interval={tickEvery}
            minTickGap={xMinTickGap}
            allowDuplicatedCategory={false}
            tickFormatter={xTickFormatter}
            tick={{ fontSize: mobile ? 9 : 10, fill: AXIS_COLOR }}
            height={mobile ? 28 : 30}
            tickMargin={mobile ? 5 : 6}
            padding={{ left: 12, right: 12 }}
          />
          <YAxis yAxisId="left" width={axisWidth} domain={yDomain} tickFormatter={(v: unknown) => axisNumber(Number(v))} tick={{ fontSize: mobile ? 9 : 10, fill: AXIS_COLOR }} axisLine={{ stroke: GRID_COLOR }} tickLine={{ stroke: GRID_COLOR }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: mobile ? 9 : 10, fill: AXIS_COLOR }} width={axisWidth} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={TOOLTIP_LABEL_STYLE}
            itemStyle={{ color: 'var(--text-1)' }}
            labelFormatter={xLabelFormatter}
            formatter={(value: unknown, name: unknown) => [value as number, legendFormatter(String(name))]}
          />
          {showInlineLegend && (
            <Legend
              wrapperStyle={LEGEND_WRAPPER_STYLE}
              formatter={(value: unknown) => <span style={LEGEND_WRAPPER_STYLE}>{legendFormatter(String(value))}</span>}
            />
          )}
          {renderReferences(references)}
          {lines.map((key, index) => (
            <Line key={key} yAxisId="left" type="monotone" dataKey={key} name={legendFormatter(key)} stroke={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={2} dot={false} isAnimationActive={false} connectNulls />
          ))}
          {rightLines.map((key, index) => (
            <Line key={key} yAxisId="right" type="monotone" dataKey={key} name={legendFormatter(key)} stroke={CHART_COLORS[(index + lines.length) % CHART_COLORS.length]} strokeWidth={2} strokeDasharray="4 2" dot={false} isAnimationActive={false} connectNulls />
          ))}
        </ComposedChart>
      );
    }

    if (kind === 'scatter') {
      return (
        <ScatterChart margin={{ top: 14, right: 8, left: 4, bottom: 8 }}>
          {renderCommonAxes()}
          {lines.map((key, index) => (
            <Scatter key={key} name={legendFormatter(key)} data={card.data} dataKey={key} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </ScatterChart>
      );
    }

    if (kind === 'logXLine') {
      return (
        <LineChart data={card.data} margin={{ top: 14, right: 8, left: 4, bottom: 8 }}>
          {renderCommonAxes()}
          {lines.map((key, index) => (
            <Line key={key} type="monotone" dataKey={key} name={legendFormatter(key)} stroke={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={2} dot connectNulls isAnimationActive={false} />
          ))}
        </LineChart>
      );
    }

    // Default: line chart
    return (
      <LineChart data={card.data} margin={{ top: 14, right: 8, left: 4, bottom: 8 }}>
        {renderCommonAxes()}
        {lines.map((key, index) => (
          <Line key={key} type="monotone" dataKey={key} name={legendFormatter(key)} stroke={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={2} dot={false} isAnimationActive={false} connectNulls />
        ))}
      </LineChart>
    );
  };

  const seriesSummary = series.length ? series.map(legendFormatter).join(', ') : '';
  const deferredReason = card.deferred?.reason;
  const chartAriaLabel = deferredReason
    ? `${card.meta.title} chart · deferred: ${deferredReason}`
    : hasData
      ? `${card.meta.title} chart · ${card.data.length} data points${seriesSummary ? ` · series: ${seriesSummary}` : ''}`
      : `${card.meta.title} chart · no data yet`;

  const noDataPlaceholder = (
    <div
      style={{ height }}
      className="cc-dashboard-chart__empty"
      role="note"
    >
      No data available yet.
    </div>
  );

  return (
    <figure className="chart-shell cc-dashboard-chart" role="group" aria-label={chartAriaLabel}>
      {/* Header: title + caption + actions */}
      <div className="chart-heading mb-3">
        <div className="cc-dashboard-chart__title-wrap" data-caption-open={captionOpen ? 'true' : 'false'}>
          <div className="cc-dashboard-chart__title-row">
            <h3 className="cc-dashboard-chart__title t-h3">{card.meta.title}</h3>
            {caption && (
              <button
                type="button"
                className="cc-dashboard-chart__caption-toggle"
                aria-controls={captionId}
                aria-expanded={captionOpen}
                aria-label={`About ${card.meta.title}`}
                onClick={() => setCaptionOpen((open) => !open)}
              >
                {/* Unicode circled-i — keeps DS icon-dep-free */}
                <span aria-hidden="true">ⓘ</span>
              </button>
            )}
          </div>
          {caption && (
            <p
              id={captionId}
              className="cc-dashboard-chart__caption t-caption"
            >
              {caption}
            </p>
          )}
        </div>
        {expand ? (
          <div className="chart-actions">
            <button
              type="button"
              className="chart-zoom-toggle"
              onClick={expand.onClick}
              aria-label={`${card.meta.title} expand`}
            >
              Expand
            </button>
          </div>
        ) : null}
      </div>

      {headline ? <div className="chart-headline" style={{ marginBottom: 8 }}>{headline}</div> : null}

      {deferredReason ? (
        <div
          style={{ height: 100 }}
          className="cc-dashboard-chart__empty cc-dashboard-chart__empty--deferred"
          role="note"
        >
          <strong>Deferred:</strong> {deferredReason}
        </div>
      ) : kind === 'heatmap' ? (
        hasData ? (
          <HeatmapGrid data={card.data} ariaLabel={chartAriaLabel} />
        ) : noDataPlaceholder
      ) : hasData ? (
        <div
          className="cc-chart-frame"
          style={{
            '--chart-plot-min-width': '100%',
            '--chart-height': `${height}px`,
          } as React.CSSProperties}
        >
          <div className="cc-chart-frame__scroll" role="img" aria-label={`${card.meta.title} fitted dashboard history`}>
            <div className="cc-chart-frame__plot">
              <ResponsiveContainer width="100%" height="100%">
                {renderPlot()}
              </ResponsiveContainer>
            </div>
          </div>

          {showBelowLegend && series.length > 0 ? (
            <div className="cc-chart-frame__legend" role="list" aria-label={`${card.meta.title} series`}>
              {series.map((key, index) => (
                <span key={key} role="listitem" className="cc-chart-frame__legend-item">
                  <span className="cc-chart-frame__legend-swatch" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
                  {legendFormatter(key)}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : noDataPlaceholder}

      <ScreenReaderTable
        title={card.meta.title}
        rows={tableRows ?? (card.data as DashboardChartCardProps['tableRows'])}
        keys={[...bars, ...lines, ...rightLines]}
      />
    </figure>
  );
}
