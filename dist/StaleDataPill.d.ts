/**
 * StaleDataPill — small warning chip + refresh button when the rendered
 * data is older than `staleAfterMs`.
 *
 * Recomputes age once every 30s. Returns null while data is fresh — the
 * chip only appears when the dataset has aged past the threshold.
 */
import * as React from "react";
export interface StaleDataPillProps {
    /** When the data was last refreshed. */
    dataUpdatedAt: Date | number | string;
    /** Threshold past which the chip appears. Default 5 minutes. */
    staleAfterMs?: number;
    /** Optional refresh handler. When present, a "refresh" button is rendered. */
    onRefresh?: () => void;
    className?: string;
}
export declare function StaleDataPill({ dataUpdatedAt, staleAfterMs, onRefresh, className, }: StaleDataPillProps): React.ReactElement | null;
//# sourceMappingURL=StaleDataPill.d.ts.map