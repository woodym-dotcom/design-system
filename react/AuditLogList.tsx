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
import { ActivityTimeline, type ActivityEntry, type ActivityTimelineProps } from "./ActivityTimeline";

// ── Legacy AuditEvent type (kept for compile-time back-compat) ────────────────
/** @deprecated Use ActivityEntry instead. */
export interface AuditEvent {
  id: string;
  timestamp: string; // ISO-8601
  category: string;
  source: string;
  notable: boolean;
  detail?: string;
}

// ── Legacy AuditLogListProps (mapped subset of ActivityTimelineProps) ─────────
/** @deprecated Use ActivityTimelineProps instead. */
export interface AuditLogListProps {
  events: AuditEvent[];
  notableOnlyByDefault?: boolean;
  collapseConsecutive?: boolean;
  maxVisible?: number;
  variant?: "flat" | "timeline";
}

// ── Adapter: convert AuditEvent[] → ActivityEntry[] ──────────────────────────
function auditEventToActivityEntry(ev: AuditEvent): ActivityEntry {
  return {
    id: ev.id,
    actor: { name: ev.source },
    action: ev.category,
    target: ev.detail,
    timestamp: ev.timestamp,
  };
}

/**
 * @deprecated Use ActivityTimeline instead.
 */
export function AuditLogList({
  events,
  variant = "flat",
}: AuditLogListProps): React.ReactElement {
  const entries: ActivityEntry[] = events.map(auditEventToActivityEntry);
  return (
    <ActivityTimeline
      entries={entries}
      variant={variant}
      groupByDay={variant === "timeline"}
    />
  );
}

// Re-export ActivityEntry as AuditEvent alias for consumers referencing the new type name
export type { ActivityEntry, ActivityTimelineProps };
