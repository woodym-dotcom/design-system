/**
 * @deprecated AuditLogList is superseded by ActivityTimeline (DS-SIMPLIFY 09).
 *
 * This file re-exports ActivityTimeline and ActivityEntry under the old names
 * so existing consumers continue to compile without changes. It will be
 * removed in v1.0 (SIMPLIFY 14).
 *
 * Migration:
 *   Before:  import { AuditLogList, AuditEvent } from "@ds/core/react/AuditLogList"
 *   After:   import { ActivityTimeline, ActivityEntry } from "@ds/core/react/ActivityTimeline"
 *
 * Note: AuditLogList previously used AuditEvent (with `category`, `source`,
 * `notable`, `detail` fields). ActivityTimeline uses ActivityEntry (with
 * `actor`, `action`, `target`, `diff`, `metadata`). The two schemas differ —
 * the alias here is a type-level shim that maps the old props interface onto
 * the new one for compile-time compatibility. Runtime behaviour is unchanged.
 */
import * as React from "react";
import { type ActivityEntry, type ActivityTimelineProps } from "./ActivityTimeline.js";
/** @deprecated Use ActivityEntry instead. */
export interface AuditEvent {
    id: string;
    timestamp: string;
    category: string;
    source: string;
    notable: boolean;
    detail?: string;
}
/** @deprecated Use ActivityTimelineProps instead. */
export interface AuditLogListProps {
    events: AuditEvent[];
    notableOnlyByDefault?: boolean;
    collapseConsecutive?: boolean;
    maxVisible?: number;
    variant?: "flat" | "timeline";
}
/**
 * @deprecated Use ActivityTimeline instead.
 */
export declare function AuditLogList({ events, variant, }: AuditLogListProps): React.ReactElement;
export type { ActivityEntry, ActivityTimelineProps };
//# sourceMappingURL=AuditLogList.d.ts.map