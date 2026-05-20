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
export type SparklineTone = "accent" | "success" | "warning" | "error" | "muted" | "neutral";
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
export declare function Sparkline({ values, data, tone, size, showArea, showLastDot, ariaLabel, "aria-label": ariaLabelAttr, label, className, }: SparklineProps): React.ReactElement | null;
//# sourceMappingURL=Sparkline.d.ts.map