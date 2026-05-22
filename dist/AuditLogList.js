import { jsx as _jsx } from "react/jsx-runtime";
import { ActivityTimeline } from "./ActivityTimeline.js";
// ── Adapter: convert AuditEvent[] → ActivityEntry[] ──────────────────────────
function auditEventToActivityEntry(ev) {
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
export function AuditLogList({ events, variant = "flat", }) {
    const entries = events.map(auditEventToActivityEntry);
    return (_jsx(ActivityTimeline, { entries: entries, variant: variant, groupByDay: variant === "timeline" }));
}
//# sourceMappingURL=AuditLogList.js.map