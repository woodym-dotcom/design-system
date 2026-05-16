/**
 * AuditLogList — collapse-and-toggle audit event list primitive.
 *
 * Features:
 *  - Collapses consecutive identical events (same category × source) into a
 *    single row with a count badge.
 *  - Shows "notable" events by default; routine events behind a toggle.
 *  - Caps visible rows per category to `maxVisible` (default 10).
 *
 * Reusable across any audit-log surface: FA audit events, Health audit
 * events, CoS audit events, Home Automator events, etc.
 *
 * The caller decides which events are "notable" by setting `notable: true`
 * on the relevant entries — this component enforces no domain-specific
 * opinion about which categories matter.
 */
import * as React from "react";
export interface AuditEvent {
    id: string;
    timestamp: string;
    category: string;
    source: string;
    notable: boolean;
    detail?: string;
}
export interface AuditLogListProps {
    events: AuditEvent[];
    /** Show only notable events initially (default: true). */
    notableOnlyByDefault?: boolean;
    /** Collapse consecutive identical (category × source) events (default: true). */
    collapseConsecutive?: boolean;
    /** Maximum rows visible per category band (default: 10). */
    maxVisible?: number;
}
export declare function AuditLogList({ events, notableOnlyByDefault, collapseConsecutive, maxVisible, }: AuditLogListProps): React.ReactElement;
//# sourceMappingURL=AuditLogList.d.ts.map