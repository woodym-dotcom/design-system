/**
 * @deprecated Use `<Graph layout="dashboard">` from `@ds/core/react/Graph` instead.
 *
 *
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
    deferred?: {
        reason: string;
    };
}
export type DashboardChartKind = 'bar' | 'line' | 'heatmap' | 'scatter' | 'hStackedBar' | 'dualAxis' | 'logXLine';
export type DashboardChartReference = {
    kind: 'line';
    y: number;
    label?: string;
    tone?: 'good' | 'neutral' | 'bad';
} | {
    kind: 'band';
    y1: number;
    y2: number;
    tone?: 'good' | 'neutral' | 'bad';
};
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
    clampDomain?: {
        yMin?: number;
        yMax?: number;
    };
    /**
     * Expand action. When provided, renders a single "Expand" button that
     * replaces the old Zoom / Details split.
     */
    expand?: {
        onClick: () => void;
    };
}
export declare function DashboardChartCard({ card, kind, bars, lines, rightLines, xKey, references, tableRows, headline, caption, legend: legendProp, clampDomain, expand, }: DashboardChartCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DashboardChartCard.d.ts.map