import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
function collapseConsecutiveEvents(events) {
    const out = [];
    for (const ev of events) {
        const prev = out[out.length - 1];
        if (prev && prev.category === ev.category && prev.source === ev.source) {
            prev.count += 1;
        }
        else {
            out.push({ ...ev, count: 1 });
        }
    }
    return out;
}
function formatTimestamp(iso) {
    try {
        return new Date(iso).toISOString().slice(0, 19).replace("T", " ");
    }
    catch {
        return iso;
    }
}
function EventRow({ ev }) {
    return (_jsxs("li", { style: {
            borderTop: "1px solid var(--border-1)",
            padding: "0.25rem 0",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: "0 0.3rem",
            fontSize: "0.82rem",
        }, children: [_jsx("span", { style: { color: "var(--text-1)" }, children: ev.category }), _jsxs("span", { style: { color: "var(--text-2)" }, children: ["\u00B7 ", ev.source] }), ev.detail ? (_jsxs("span", { style: { color: "var(--text-2)" }, children: ["\u00B7 ", ev.detail] })) : null, ev.count > 1 ? (_jsxs("span", { style: { color: "var(--text-2)", fontSize: "0.72rem" }, children: ["\u00D7 ", ev.count] })) : null, _jsx("span", { style: { color: "var(--text-2)", fontSize: "0.72rem", marginLeft: "auto" }, children: formatTimestamp(ev.timestamp) })] }));
}
export function AuditLogList({ events, notableOnlyByDefault = true, collapseConsecutive = true, maxVisible = 10, }) {
    const [showRoutine, setShowRoutine] = React.useState(!notableOnlyByDefault);
    const notable = events.filter((ev) => ev.notable);
    const routine = events.filter((ev) => !ev.notable);
    const processedNotable = collapseConsecutive
        ? collapseConsecutiveEvents(notable)
        : notable.map((ev) => ({ ...ev, count: 1 }));
    const processedRoutine = collapseConsecutive
        ? collapseConsecutiveEvents(routine)
        : routine.map((ev) => ({ ...ev, count: 1 }));
    const visibleNotable = processedNotable.slice(0, maxVisible);
    const visibleRoutine = showRoutine ? processedRoutine.slice(0, maxVisible) : [];
    if (events.length === 0) {
        return (_jsx("p", { style: { color: "var(--text-2)", fontSize: "0.88rem", margin: 0 }, children: "No audit events yet." }));
    }
    return (_jsxs("div", { style: { fontSize: "0.88rem" }, children: [visibleNotable.length > 0 ? (_jsx("ul", { style: {
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    maxHeight: "12rem",
                    overflowY: "auto",
                }, children: visibleNotable.map((ev) => (_jsx(EventRow, { ev: ev }, ev.id))) })) : (_jsx("p", { style: { color: "var(--text-2)", fontSize: "0.75rem", margin: 0 }, children: "No notable events." })), notableOnlyByDefault && (_jsxs("div", { style: { marginTop: "0.5rem" }, children: [_jsx("button", { type: "button", onClick: () => setShowRoutine((v) => !v), style: {
                            fontSize: "0.75rem",
                            color: "var(--text-2)",
                            background: "transparent",
                            border: "none",
                            borderBottom: "1px solid var(--border-1)",
                            padding: 0,
                            cursor: "pointer",
                        }, children: showRoutine
                            ? "Hide routine events"
                            : `Show routine events (${processedRoutine.length} collapsed)` }), showRoutine && visibleRoutine.length > 0 ? (_jsx("ul", { style: {
                            listStyle: "none",
                            margin: "0.25rem 0 0",
                            padding: 0,
                            maxHeight: "8rem",
                            overflowY: "auto",
                        }, children: visibleRoutine.map((ev) => (_jsx(EventRow, { ev: ev }, ev.id))) })) : null] }))] }));
}
//# sourceMappingURL=AuditLogList.js.map