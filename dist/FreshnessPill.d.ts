/**
 * FreshnessPill — FreshnessClass display indicator.
 *
 * Renders a pill showing the freshness class of a data source or connection:
 *   - "online-hot"      — real-time, low-latency data (green)
 *   - "online-standard" — online but standard latency (blue/info)
 *   - "offline"         — data is offline / stale (neutral)
 *
 * Usage:
 *   <FreshnessPill freshnessClass="online-hot" />
 *   <FreshnessPill freshnessClass="offline" label="Batch source" />
 */
import * as React from "react";
export type FreshnessClass = "online-hot" | "online-standard" | "offline";
export interface FreshnessPillProps {
    /** Freshness class — drives colour and dot treatment. */
    freshnessClass: FreshnessClass;
    /** Override the auto-derived label. */
    label?: string;
    /** Size variant. Default: "md". */
    size?: "sm" | "md";
    /** Click handler — makes the pill interactive. */
    onClick?: () => void;
    className?: string;
}
export declare function FreshnessPill({ freshnessClass, label, size, onClick, className, }: FreshnessPillProps): React.ReactElement;
//# sourceMappingURL=FreshnessPill.d.ts.map