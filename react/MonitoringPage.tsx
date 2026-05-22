/**
 * @deprecated Use `<ModuleTemplate variant="monitor">` from `./ModuleTemplate`
 * (DS-SIMPLIFY 04). Will be removed in v1.0 (SIMPLIFY 14).
 *
 * MonitoringPage — KPI tile grid + chart sections.
 * Chart sections accept arbitrary chart content (consumers provide Recharts, etc.)
 */
import * as React from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * @deprecated Use `<Graph layout="tile">` from `@ds/core/react/Graph` instead.
 * Will be removed in v1.0 (SIMPLIFY 14).
 */
export interface KpiTileProps {
  label: string;
  value: React.ReactNode;
  /** Optional delta indicator, e.g. "+12%" */
  delta?: React.ReactNode;
}

export function KpiTile({ label, value, delta }: KpiTileProps) {
  return (
    <div className="cc-kpi-tile">
      <p className="cc-kpi-tile__label">{label}</p>
      <div className="cc-kpi-tile__value">{value}</div>
      {delta !== undefined ? (
        <div className="cc-kpi-tile__delta">{delta}</div>
      ) : null}
    </div>
  );
}

export interface ChartSection {
  heading: string;
  render: () => React.ReactNode;
}

export interface MonitoringPageProps {
  /** KPI tiles to display in the top row */
  kpis?: KpiTileProps[];
  /** Chart sections below the KPI row */
  chartSections?: ChartSection[];
  /** Rendered when both kpis and chartSections are absent or empty */
  emptyState?: React.ReactNode;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MonitoringPage({
  kpis = [],
  chartSections = [],
  emptyState,
  className,
}: MonitoringPageProps) {
  const classes = ['cc-monitoring-page'];
  if (className) classes.push(className);

  const hasContent = kpis.length > 0 || chartSections.length > 0;

  if (!hasContent) {
    return (
      <div className={classes.join(' ')}>
        <div className="cc-monitoring-page__empty">
          {emptyState ?? 'No monitoring data available.'}
        </div>
      </div>
    );
  }

  return (
    <div className={classes.join(' ')}>
      {kpis.length > 0 ? (
        <div className="cc-monitoring-page__kpi-row">
          {kpis.map((kpi, i) => (
            <KpiTile key={i} {...kpi} />
          ))}
        </div>
      ) : null}

      {chartSections.map((section, i) => (
        <div key={i} className="cc-monitoring-page__chart-section">
          <h3 className="cc-monitoring-page__chart-heading">{section.heading}</h3>
          {section.render()}
        </div>
      ))}
    </div>
  );
}
