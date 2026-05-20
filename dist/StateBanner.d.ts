/**
 * StateBanner — per-kind status banner for offline / rate-limit /
 * permissions / staleness / partial / degraded surfaces.
 *
 * Defaults to role="status"; warning/error tones promote to role="alert".
 * `asOf` renders as <time dateTime={iso}>.
 */
import * as React from "react";
export type StateBannerKind = "offline" | "rate-limited" | "permissioned-out" | "stale-data" | "partial" | "degraded";
export interface StateBannerAction {
    label: string;
    onClick: () => void;
}
export interface StateBannerProps {
    kind: StateBannerKind;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: StateBannerAction;
    asOf?: Date | string;
    className?: string;
}
export declare function StateBanner({ kind, title, description, action, asOf, className, }: StateBannerProps): React.ReactElement;
//# sourceMappingURL=StateBanner.d.ts.map