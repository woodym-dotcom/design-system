/**
 * Graph.types — discriminated unions for GraphData and related interfaces.
 *
 * `GraphData` is narrowed by `layout` so TS enforces the correct shape
 * for each chart variant at compile time.
 */
import type * as React from "react";
export type GraphLayout = "sparkline" | "tile" | "card" | "dashboard" | "heatmap" | "force" | "hierarchical" | "distribution";
export interface LegendItem {
    key: string;
    label: string;
    color: string;
}
export type LegendDef = LegendItem[];
/** Raw numeric time-series point (any extra keys allowed). */
export type TimeSeriesPoint = Record<string, string | number | null | undefined>;
/** Time-series data — used by sparkline / tile / card / dashboard. */
export interface TimeSeriesData {
    layout: "sparkline" | "tile" | "card" | "dashboard";
    /** Ordered data points. */
    points: TimeSeriesPoint[];
    /** Key for the x-axis (usually 'day'). Defaults to 'day'. */
    xKey?: string;
    /** Series to render as bars. */
    bars?: string[];
    /** Series to render as lines. */
    lines?: string[];
    /**
     * Tile/sparkline convenience: flat numeric array.
     * When provided alongside `points`, this is used for the sparkline path
     * in tile/sparkline layouts.
     */
    values?: readonly number[];
    /** Headline value shown large in tile layout. */
    kpiValue?: React.ReactNode;
    /** Delta indicator shown in tile layout (e.g. "+12%"). */
    kpiDelta?: React.ReactNode;
}
/** One cell in a heatmap. */
export interface HeatmapCell {
    row: string;
    col: string;
    value: number;
}
/** Categorical matrix data — used by heatmap layout. */
export interface HeatmapData {
    layout: "heatmap";
    cells: HeatmapCell[];
    /** Ordered row labels (y-axis). Auto-derived when omitted. */
    rows?: string[];
    /** Ordered column labels (x-axis). Auto-derived when omitted. */
    cols?: string[];
}
/** One bin in a histogram/density. */
export interface DistributionBin {
    /** Left edge (inclusive). */
    x0: number;
    /** Right edge (exclusive). */
    x1: number;
    /** Frequency count. */
    count: number;
}
/** Distribution / histogram data. */
export interface DistributionData {
    layout: "distribution";
    /** Pre-computed bins. Supply either `bins` or `samples` — bins take precedence. */
    bins?: DistributionBin[];
    /** Raw samples to auto-bin (uniform bins derived from data range). */
    samples?: number[];
    /** Number of bins when auto-binning from samples. Default 20. */
    binCount?: number;
}
/** Network node. */
export interface GraphNode {
    id: string;
    label?: string;
    group?: string;
}
/** Network edge. */
export interface GraphEdge {
    source: string;
    target: string;
    weight?: number;
    label?: string;
}
/** Force-directed network / hierarchical tree data (stub — coming v1.1). */
export interface NetworkData {
    layout: "force" | "hierarchical";
    nodes: GraphNode[];
    edges: GraphEdge[];
}
/** Discriminated union over all data shapes. */
export type GraphData = TimeSeriesData | HeatmapData | DistributionData | NetworkData;
export interface GraphProps {
    /** Selects the visualization variant. */
    layout: GraphLayout;
    /** Size token shared across layouts. Default 'md'. */
    size?: "xs" | "sm" | "md" | "lg";
    /** Data payload — shape is discriminated by `layout`. */
    data: GraphData;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    /** Explicit legend config or boolean toggle. Default: layout-specific. */
    legend?: boolean | LegendDef;
    /** Slot rendered when data is empty. */
    empty?: React.ReactNode;
    /** Shows a loading skeleton over the chart area. */
    loading?: boolean;
    /** Called when the user clicks a data point. */
    onClick?: (point: unknown) => void;
    /** Required accessible label (maps to aria-label on the root element). */
    ariaLabel: string;
    /** AI provenance metadata — surfaced only when explicitly provided. */
    source?: {
        model?: string;
        promptVersion?: string;
    };
}
//# sourceMappingURL=Graph.types.d.ts.map