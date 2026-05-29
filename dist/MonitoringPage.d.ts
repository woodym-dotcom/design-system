/**
 * @deprecated Use `<Page variant="monitor">` from `./Page`
 * (DS-SIMPLIFY 04).
 *
 * MonitoringPage — KPI tile grid + chart sections.
 * Chart sections accept arbitrary chart content (consumers provide Recharts, etc.)
 */
import * as React from 'react';
/**
 * @deprecated Use `<Graph layout="tile">` from `@ds/core/react/Graph` instead.
 *
 */
export interface KpiTileProps {
    label: string;
    value: React.ReactNode;
    /** Optional delta indicator, e.g. "+12%" */
    delta?: React.ReactNode;
}
export declare function KpiTile({ label, value, delta }: KpiTileProps): import("react/jsx-runtime").JSX.Element;
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
export declare function MonitoringPage({ kpis, chartSections, emptyState, className, }: MonitoringPageProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MonitoringPage.d.ts.map