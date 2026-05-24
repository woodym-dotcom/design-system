/**
 * DualMeasurementLayout — side-by-side continuous + discrete cadence display.
 *
 * Renders two measurement panels side by side: one for continuous metrics
 * (e.g. time-series, real-time values) and one for discrete/periodic
 * observations (e.g. audit snapshots, scheduled checks).
 *
 * Usage:
 *   <DualMeasurementLayout
 *     continuous={<Graph layout="sparkline" ... />}
 *     continuousLabel="Real-time monitoring"
 *     discrete={<DataTable ... />}
 *     discreteLabel="Quarterly reviews"
 *   />
 */
import * as React from "react";
/** Circuit breaker band — rendered between or overlaid on the two panes. */
export interface CircuitBreakerBand {
    id: string;
    label: string;
    state: "closed" | "open" | "half-open";
    detail?: React.ReactNode;
}
/** Layout variant for the DualMeasurementLayout. */
export type DualMeasurementVariant = "default" | "horizon-stack";
export interface DualMeasurementLayoutProps {
    /** Continuous measurement pane content. */
    continuous: React.ReactNode;
    /** Label for the continuous pane. */
    continuousLabel?: string;
    /** Discrete measurement pane content. */
    discrete: React.ReactNode;
    /** Label for the discrete pane. */
    discreteLabel?: string;
    /** Layout direction. Default: "horizontal". */
    direction?: "horizontal" | "vertical";
    /** Relative size ratio [continuous, discrete]. Default: [1, 1]. */
    ratio?: [number, number];
    /** Optional header above both panes. */
    title?: string;
    /**
     * Layout variant.
     *   - "default" — standard two-pane layout.
     *   - "horizon-stack" — 4-pane layout: top-left, top-right, bottom-left, bottom-right.
     */
    variant?: DualMeasurementVariant;
    /** Top-right pane content (horizon-stack variant only). */
    topRight?: React.ReactNode;
    /** Top-right label (horizon-stack variant only). */
    topRightLabel?: string;
    /** Bottom-right pane content (horizon-stack variant only). */
    bottomRight?: React.ReactNode;
    /** Bottom-right label (horizon-stack variant only). */
    bottomRightLabel?: string;
    /** Circuit breaker bands — rendered as status strips between the panes. */
    circuitBreakerBands?: CircuitBreakerBand[];
    className?: string;
}
export declare function DualMeasurementLayout({ continuous, continuousLabel, discrete, discreteLabel, direction, ratio, title, variant, topRight, topRightLabel, bottomRight, bottomRightLabel, circuitBreakerBands, className, }: DualMeasurementLayoutProps): React.ReactElement;
//# sourceMappingURL=DualMeasurementLayout.d.ts.map