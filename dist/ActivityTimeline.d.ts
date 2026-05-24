/**
 * ActivityTimeline — generalised activity / audit event list primitive.
 *
 * Supersedes AuditLogList (DS-SIMPLIFY 09).
 *
 * Features:
 *  - flat list or timeline (vertical-spine) variant
 *  - optional groupByDay headers
 *  - compact / default / spacious density
 *  - custom renderEntry override
 *  - expandable diff toggle per entry
 *  - loading + infinite-scroll via IntersectionObserver
 *  - custom emptyState slot
 *
 * AuditLogList remains as a deprecated alias — see react/AuditLogList.tsx.
 */
import * as React from "react";
/** Kind discriminator for specialised timeline entries. */
export type ActivityEntryKind = "default" | "delivery-attempt" | "amendment-chain";
export interface ActivityEntry {
    id: string;
    actor: {
        name: string;
        avatarUrl?: string;
    };
    action: string;
    target?: string;
    timestamp: Date | string;
    diff?: {
        before: unknown;
        after: unknown;
    };
    metadata?: Record<string, unknown>;
    /** Entry kind — drives icon/colour treatment per-row. Default: "default". */
    kind?: ActivityEntryKind;
}
export interface ActivityTimelineProps<E extends ActivityEntry = ActivityEntry> {
    entries: E[];
    /** "flat" (default): condensed list. "timeline": vertical spine + dots. */
    variant?: "flat" | "timeline";
    /** Cluster entries under sticky ISO-date headers (both variants). */
    groupByDay?: boolean;
    /** Row height / padding density (default: "default"). */
    density?: "compact" | "default" | "spacious";
    /** Override per-row rendering entirely. */
    renderEntry?: (entry: E) => React.ReactNode;
    /** Show diff toggle per entry when entry.diff is present. */
    expandable?: boolean;
    /** Rendered when entries is empty. */
    emptyState?: React.ReactNode;
    /** When true, renders a skeleton loading state. */
    loading?: boolean;
    /** Called when the sentinel element scrolls into view. */
    loadMore?: () => Promise<void>;
    /** When false, the sentinel is not rendered. */
    hasMore?: boolean;
}
export declare function ActivityTimeline<E extends ActivityEntry = ActivityEntry>({ entries, variant, groupByDay, density, renderEntry, expandable, emptyState, loading, loadMore, hasMore, }: ActivityTimelineProps<E>): React.ReactElement;
//# sourceMappingURL=ActivityTimeline.d.ts.map