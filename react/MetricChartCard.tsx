import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, BarChart, Bar, ComposedChart, Rectangle } from 'recharts';

export type ChartSeriesKind = 'bar' | 'line';
export type ChartRenderKind = 'bar' | 'line' | 'composed';

export interface ChartAxisMeta {
  key?: string;
  unit?: string;
  label?: string;
  isDate?: boolean;
}

export interface ChartSeriesMeta {
  key: string;
  label: string;
  kind: ChartSeriesKind;
  color: string;
  stackId?: string;
  defaultVisible?: boolean;
  unit?: string;
}

export interface MetricMeta {
  id: string;
  title: string;
  source: string;
  freshness: string;
  definition: string;
  info?: string;
  chartKind?: ChartRenderKind;
  axes?: {
    x?: ChartAxisMeta;
    y?: ChartAxisMeta;
  };
  series?: ChartSeriesMeta[];
}

export interface ChartCardData<T = Record<string, unknown>> {
  meta: MetricMeta;
  summary: Record<string, unknown>;
  data: T[];
}

const axisTick = { fontSize: 11, fill: 'var(--text-3)' };
const tooltipContentStyle = {
  backgroundColor: 'var(--surface-0)',
  border: '1px solid var(--border-1)',
  borderRadius: 12,
  boxShadow: 'var(--shadow-2)',
  color: 'var(--text-1)',
};
const tooltipLabelStyle = { color: 'var(--text-1)', fontWeight: 600 };
const tooltipItemStyle = { color: 'var(--text-2)' };
const radiusTop = 6;

function useIsMobile(breakpoint = 767) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [breakpoint]);

  return isMobile;
}

function formatSeriesValue(value: unknown, unit?: string) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'n/a';
  const formatted = Number.isInteger(value)
    ? new Intl.NumberFormat('en-GB').format(value)
    : new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 }).format(value);
  return unit ? `${formatted}${unit}` : formatted;
}

function isTopVisibleSeries(payload: Record<string, unknown>, series: ChartSeriesMeta[], hiddenKeys: Set<string>, currentKey: string) {
  const visibleBars = series.filter((item) => item.kind === 'bar' && !hiddenKeys.has(item.key));
  const currentIndex = visibleBars.findIndex((item) => item.key === currentKey);
  if (currentIndex === -1) return false;
  for (let index = currentIndex + 1; index < visibleBars.length; index += 1) {
    const nextValue = payload[visibleBars[index].key];
    if (typeof nextValue === 'number' && nextValue > 0) return false;
  }
  const currentValue = payload[currentKey];
  return typeof currentValue === 'number' && currentValue > 0;
}

export function MetricChartCard({
  card,
  heightClassName = 'cc-chart-card__plot--compact',
}: {
  card: ChartCardData;
  heightClassName?: string;
}) {
  const hasData = card.data.length > 0;
  const isMobile = useIsMobile();
  const xAxisKey = card.meta.axes?.x?.key ?? 'day';
  const series = card.meta.series ?? [];
  const defaultHiddenKeys = useMemo(
    () => new Set(series.filter((item) => item.defaultVisible === false).map((item) => item.key)),
    [series],
  );
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(defaultHiddenKeys);
  const [showInfo, setShowInfo] = useState(false);
  const [activePointKey, setActivePointKey] = useState<string | null>(null);

  useEffect(() => {
    setHiddenKeys(new Set(defaultHiddenKeys));
  }, [defaultHiddenKeys]);

  const visibleSeries = useMemo(() => series.filter((item) => !hiddenKeys.has(item.key)), [series, hiddenKeys]);
  const visibleBarSeries = visibleSeries.filter((item) => item.kind === 'bar');
  const visibleLineSeries = visibleSeries.filter((item) => item.kind === 'line');
  const activePoint = useMemo(() => {
    if (!card.data.length) return null;
    if (!activePointKey) return card.data[card.data.length - 1] as Record<string, unknown>;
    return ((card.data as Record<string, unknown>[]).find((point) => String(point[xAxisKey]) === activePointKey) ?? null) as Record<string, unknown> | null;
  }, [activePointKey, card.data, xAxisKey]);

  const chartKind: ChartRenderKind = card.meta.chartKind ?? (visibleBarSeries.length && visibleLineSeries.length ? 'composed' : visibleLineSeries.length ? 'line' : 'bar');

  const toggleSeries = (key: string) => {
    setHiddenKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderBars = () =>
    visibleBarSeries.map((item) => (
      <Bar
        key={item.key}
        dataKey={item.key}
        stackId={item.stackId}
        isAnimationActive={false}
        fill={item.color}
        onClick={(state) => setActivePointKey(String(state?.payload?.[xAxisKey] ?? ''))}
        shape={(props: unknown) => {
          const rectProps = props as Record<string, unknown>;
          const payload = rectProps.payload as Record<string, unknown>;
          const radius = item.stackId && isTopVisibleSeries(payload, series, hiddenKeys, item.key) ? [radiusTop, radiusTop, 0, 0] : item.stackId ? [0, 0, 0, 0] : [radiusTop, radiusTop, 0, 0];
          return <Rectangle {...(rectProps as any)} radius={radius as any} />;
        }}
      />
    ));

  const renderLines = () =>
    visibleLineSeries.map((item) => (
      <Line
        key={item.key}
        type="monotone"
        dataKey={item.key}
        stroke={item.color}
        strokeWidth={2.5}
        dot={false}
        activeDot={{ r: 4 }}
        isAnimationActive={false}
      />
    ));

  const chartBody = (() => {
    const common = {
      data: card.data,
      margin: { top: 4, right: 4, left: -18, bottom: 0 },
      onClick: (state: { activeLabel?: string | number } | undefined) => {
        if (state?.activeLabel !== undefined) setActivePointKey(String(state.activeLabel));
      },
    };
    if (chartKind === 'line') {
      return (
        <LineChart {...common}>
          <CartesianGrid stroke="var(--border-1)" vertical={false} />
          <XAxis dataKey={xAxisKey} tick={axisTick} axisLine={{ stroke: 'var(--border-1)' }} tickLine={{ stroke: 'var(--border-1)' }} unit={card.meta.axes?.x?.isDate ? undefined : card.meta.axes?.x?.unit} />
          <YAxis tick={axisTick} axisLine={{ stroke: 'var(--border-1)' }} tickLine={{ stroke: 'var(--border-1)' }} unit={card.meta.axes?.y?.unit} width={44} />
          <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ stroke: 'var(--border-2)' }} />
          {renderLines()}
        </LineChart>
      );
    }
    if (chartKind === 'bar') {
      return (
        <BarChart {...common}>
          <CartesianGrid stroke="var(--border-1)" vertical={false} />
          <XAxis dataKey={xAxisKey} tick={axisTick} axisLine={{ stroke: 'var(--border-1)' }} tickLine={{ stroke: 'var(--border-1)' }} unit={card.meta.axes?.x?.isDate ? undefined : card.meta.axes?.x?.unit} />
          <YAxis tick={axisTick} axisLine={{ stroke: 'var(--border-1)' }} tickLine={{ stroke: 'var(--border-1)' }} unit={card.meta.axes?.y?.unit} width={44} />
          <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ fill: 'color-mix(in oklch, var(--accent-1) 10%, transparent)' }} />
          {renderBars()}
        </BarChart>
      );
    }
    return (
      <ComposedChart {...common}>
        <CartesianGrid stroke="var(--border-1)" vertical={false} />
        <XAxis dataKey={xAxisKey} tick={axisTick} axisLine={{ stroke: 'var(--border-1)' }} tickLine={{ stroke: 'var(--border-1)' }} unit={card.meta.axes?.x?.isDate ? undefined : card.meta.axes?.x?.unit} />
        <YAxis tick={axisTick} axisLine={{ stroke: 'var(--border-1)' }} tickLine={{ stroke: 'var(--border-1)' }} unit={card.meta.axes?.y?.unit} width={44} />
        <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ fill: 'color-mix(in oklch, var(--accent-1) 10%, transparent)' }} />
        {renderBars()}
        {renderLines()}
      </ComposedChart>
    );
  })();

  return (
    <section className="cc-chart-card soft-card chart-card rounded-[20px] border border-[color:var(--border-1)] shadow-ds-1">
      <header className="cc-chart-card__header chart-card-header">
        <div className="cc-chart-card__title-wrap">
          <div className="cc-chart-card__title-row">
            <h3 className="cc-chart-card__title chart-card-title text-foreground">{card.meta.title}</h3>
            {card.meta.info || card.meta.definition ? (
              <button type="button" className="cc-chart-card__info" aria-expanded={showInfo} aria-label={`About ${card.meta.title}`} onClick={() => setShowInfo((value) => !value)}>
                i
              </button>
            ) : null}
          </div>
          {showInfo ? <p className="cc-chart-card__description chart-card-description text-muted-foreground">{card.meta.info ?? card.meta.definition}</p> : null}
        </div>
        <div className="cc-chart-card__meta chart-card-meta text-muted-foreground">
          <div>Source: {card.meta.source}</div>
          <div>{card.meta.freshness}</div>
        </div>
      </header>

      {series.length ? (
        <div className="cc-chart-card__toggles" aria-label={`${card.meta.title} series`}>
          {series.map((item) => {
            const isActive = !hiddenKeys.has(item.key);
            return (
              <button key={item.key} type="button" className={`cc-chart-card__toggle${isActive ? ' is-active' : ''}`} onClick={() => toggleSeries(item.key)}>
                <span className="cc-chart-card__toggle-swatch" style={{ backgroundColor: item.color }} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className={`cc-chart-card__plot ${heightClassName}`}>
        {hasData && visibleSeries.length ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={240} minHeight={220}>
            {chartBody}
          </ResponsiveContainer>
        ) : (
          <div className="cc-chart-card__empty flex h-full items-center justify-center rounded-[20px] border border-dashed border-[color:var(--border-1)] text-sm text-muted-foreground">
            No data available yet.
          </div>
        )}
      </div>

      {isMobile && activePoint && visibleSeries.length ? (
        <div className="cc-chart-card__detail" aria-live="polite">
          <div className="cc-chart-card__detail-label">{String(activePoint[xAxisKey] ?? '')}</div>
          <div className="cc-chart-card__detail-list">
            {visibleSeries.map((item) => (
              <div key={item.key} className="cc-chart-card__detail-row">
                <span className="cc-chart-card__detail-series">
                  <span className="cc-chart-card__toggle-swatch" style={{ backgroundColor: item.color }} aria-hidden="true" />
                  {item.label}
                </span>
                <strong>{formatSeriesValue(activePoint[item.key], item.unit ?? card.meta.axes?.y?.unit)}</strong>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
