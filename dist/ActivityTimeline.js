import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
// ── Internal helpers ──────────────────────────────────────────────────────────
const DENSITY_PADDING = {
    compact: "0.15rem 0",
    default: "0.35rem 0",
    spacious: "0.65rem 0",
};
function toIso(ts) {
    if (ts instanceof Date)
        return ts.toISOString();
    return ts;
}
function formatTimestamp(ts) {
    try {
        return new Date(toIso(ts)).toISOString().slice(0, 19).replace("T", " ");
    }
    catch {
        return String(ts);
    }
}
function isoDay(ts) {
    try {
        return new Date(toIso(ts)).toISOString().slice(0, 10);
    }
    catch {
        return toIso(ts).slice(0, 10);
    }
}
function groupEntriesByDay(entries) {
    const map = new Map();
    for (const e of entries) {
        const day = isoDay(e.timestamp);
        let bucket = map.get(day);
        if (!bucket) {
            bucket = [];
            map.set(day, bucket);
        }
        bucket.push(e);
    }
    return Array.from(map.entries());
}
const KIND_ICON = {
    default: "",
    "delivery-attempt": "✉", // ✉
    "amendment-chain": "⛓", // ⛓
};
const KIND_COLOR = {
    default: "var(--accent-1, var(--text-2))",
    "delivery-attempt": "var(--info-text, #2563eb)",
    "amendment-chain": "var(--warning-text, #ca8a04)",
};
function EntryRow({ entry, density, expandable, renderEntry, timeline = false, }) {
    const [expanded, setExpanded] = React.useState(false);
    const pad = DENSITY_PADDING[density];
    const iso = toIso(entry.timestamp);
    const kind = entry.kind ?? "default";
    if (renderEntry) {
        return _jsx("li", { style: { padding: pad }, children: renderEntry(entry) });
    }
    const hasDiff = expandable && entry.diff !== undefined;
    return (_jsxs("li", { "data-testid": "activity-entry", style: {
            borderTop: "1px solid var(--border-1)",
            padding: pad,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: "0 0.3rem",
            fontSize: "0.82rem",
            position: "relative",
        }, children: [timeline && (_jsx("span", { className: `at-dot at-dot--${kind}`, "aria-hidden": true, style: {
                    display: "inline-block",
                    width: "0.5rem",
                    height: "0.5rem",
                    borderRadius: "50%",
                    background: KIND_COLOR[kind],
                    flexShrink: 0,
                    alignSelf: "center",
                } })), kind !== "default" && KIND_ICON[kind] && (_jsx("span", { className: `at-kind-icon at-kind-icon--${kind}`, "aria-hidden": "true", style: { color: KIND_COLOR[kind], fontSize: "0.82rem" }, children: KIND_ICON[kind] })), _jsx("span", { style: { fontWeight: 600, color: "var(--text-1)" }, "aria-label": `actor: ${entry.actor.name}`, children: entry.actor.name }), _jsx("span", { style: { color: "var(--text-1)" }, children: entry.action }), entry.target ? (_jsx("span", { style: { color: "var(--text-2)" }, children: entry.target })) : null, _jsx("time", { dateTime: iso, style: { color: "var(--text-2)", fontSize: "0.72rem", marginLeft: "auto" }, children: formatTimestamp(entry.timestamp) }), hasDiff && (_jsx("button", { type: "button", "aria-expanded": expanded, "aria-controls": `at-diff-${entry.id}`, onClick: () => setExpanded((v) => !v), style: {
                    fontSize: "0.72rem",
                    color: "var(--text-2)",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--border-1)",
                    padding: 0,
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    marginTop: "0.15rem",
                }, children: expanded ? "Hide diff" : "Show diff" })), hasDiff && expanded && (_jsx("pre", { id: `at-diff-${entry.id}`, style: {
                    width: "100%",
                    margin: "0.25rem 0 0",
                    fontSize: "0.72rem",
                    background: "var(--surface-2, #f5f5f5)",
                    padding: "0.4rem",
                    overflowX: "auto",
                    borderRadius: "0.2rem",
                }, children: JSON.stringify({ before: entry.diff.before, after: entry.diff.after }, null, 2) }))] }));
}
function Sentinel({ onIntersect }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) {
                onIntersect();
            }
        }, { threshold: 0.1 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [onIntersect]);
    return (_jsx("div", { ref: ref, "data-testid": "at-load-more-sentinel", style: { height: "1px" }, "aria-hidden": true }));
}
// ── Main component ────────────────────────────────────────────────────────────
export function ActivityTimeline({ entries, variant = "flat", groupByDay = false, density = "default", renderEntry, expandable = false, emptyState, loading = false, loadMore, hasMore = false, }) {
    const isTimeline = variant === "timeline";
    // ── Loading skeleton ────────────────────────────────────────────────────
    if (loading && entries.length === 0) {
        return (_jsx("div", { "data-testid": "at-loading", "aria-busy": "true", "aria-label": "Loading activity", style: { fontSize: "0.82rem" }, children: [1, 2, 3].map((n) => (_jsx("div", { style: {
                    height: "1.2rem",
                    background: "var(--surface-2, #e8e8e8)",
                    borderRadius: "0.2rem",
                    marginBottom: "0.4rem",
                    opacity: 0.6,
                } }, n))) }));
    }
    // ── Empty state ─────────────────────────────────────────────────────────
    if (!loading && entries.length === 0) {
        if (emptyState)
            return _jsx(_Fragment, { children: emptyState });
        return (_jsx("p", { style: { color: "var(--text-2)", fontSize: "0.88rem", margin: 0 }, children: "No activity yet." }));
    }
    // ── Build rows (with optional groupByDay) ───────────────────────────────
    const renderEntries = (list) => list.map((entry) => (_jsx(EntryRow, { entry: entry, density: density, expandable: expandable, renderEntry: renderEntry, timeline: isTimeline }, entry.id)));
    let body;
    if (groupByDay) {
        const days = groupEntriesByDay(entries);
        body = days.map(([day, dayEntries]) => (_jsxs("li", { className: "at-day-group", children: [_jsx("div", { className: "at-day-header", style: {
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--text-2)",
                        padding: "0.4rem 0 0.2rem",
                        position: "sticky",
                        top: 0,
                        background: "var(--surface-1, #fff)",
                    }, children: day }), _jsx("ul", { className: "at-day-entries", style: { listStyle: "none", margin: 0, padding: 0 }, children: renderEntries(dayEntries) })] }, day)));
        return (_jsxs("div", { "data-testid": "activity-timeline", "data-variant": variant, "data-density": density, children: [_jsx("ol", { className: `at at--${variant}`, style: { listStyle: "none", margin: 0, padding: 0 }, "aria-label": "Activity timeline", children: body }), hasMore && loadMore && _jsx(Sentinel, { onIntersect: () => void loadMore() }), loading && entries.length > 0 && (_jsx("div", { "data-testid": "at-loading-more", "aria-busy": "true", "aria-label": "Loading more activity", style: { fontSize: "0.75rem", color: "var(--text-2)", padding: "0.4rem 0" }, children: "Loading more\u2026" }))] }));
    }
    // ── No groupByDay ───────────────────────────────────────────────────────
    return (_jsxs("div", { "data-testid": "activity-timeline", "data-variant": variant, "data-density": density, children: [_jsx("ul", { className: `at at--${variant}`, style: { listStyle: "none", margin: 0, padding: 0 }, "aria-label": "Activity timeline", children: renderEntries(entries) }), hasMore && loadMore && _jsx(Sentinel, { onIntersect: () => void loadMore() }), loading && entries.length > 0 && (_jsx("div", { "data-testid": "at-loading-more", "aria-busy": "true", "aria-label": "Loading more activity", style: { fontSize: "0.75rem", color: "var(--text-2)", padding: "0.4rem 0" }, children: "Loading more\u2026" }))] }));
}
//# sourceMappingURL=ActivityTimeline.js.map