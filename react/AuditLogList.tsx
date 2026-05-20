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
  timestamp: string; // ISO-8601
  category: string;  // e.g. "capability_invoked"
  source: string;    // e.g. "financial_advisor_dashboard_query"
  notable: boolean;  // true = shown by default; false = behind toggle
  detail?: string;   // optional sub-info line
}

export interface AuditLogListProps {
  events: AuditEvent[];
  /** Show only notable events initially (default: true). */
  notableOnlyByDefault?: boolean;
  /** Collapse consecutive identical (category × source) events (default: true). */
  collapseConsecutive?: boolean;
  /** Maximum rows visible per category band (default: 10). */
  maxVisible?: number;
  /**
   * Layout variant.
   *  - "flat" (default): existing condensed list, unchanged.
   *  - "timeline": groups events by ISO day with a vertical spine + dots
   *    on each row.
   */
  variant?: "flat" | "timeline";
}

interface CollapsedEvent extends AuditEvent {
  count: number;
}

function collapseConsecutiveEvents(events: AuditEvent[]): CollapsedEvent[] {
  const out: CollapsedEvent[] = [];
  for (const ev of events) {
    const prev = out[out.length - 1];
    if (prev && prev.category === ev.category && prev.source === ev.source) {
      prev.count += 1;
    } else {
      out.push({ ...ev, count: 1 });
    }
  }
  return out;
}

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toISOString().slice(0, 19).replace("T", " ");
  } catch {
    return iso;
  }
}

function EventRow({ ev }: { ev: CollapsedEvent }) {
  return (
    <li
      style={{
        borderTop: "1px solid var(--border-1)",
        padding: "0.25rem 0",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        gap: "0 0.3rem",
        fontSize: "0.82rem",
      }}
    >
      <span style={{ color: "var(--text-1)" }}>{ev.category}</span>
      <span style={{ color: "var(--text-2)" }}>· {ev.source}</span>
      {ev.detail ? (
        <span style={{ color: "var(--text-2)" }}>· {ev.detail}</span>
      ) : null}
      {ev.count > 1 ? (
        <span style={{ color: "var(--text-2)", fontSize: "0.72rem" }}>× {ev.count}</span>
      ) : null}
      <span style={{ color: "var(--text-2)", fontSize: "0.72rem", marginLeft: "auto" }}>
        {formatTimestamp(ev.timestamp)}
      </span>
    </li>
  );
}

function groupByDay(events: AuditEvent[]): Array<[string, AuditEvent[]]> {
  const out = new Map<string, AuditEvent[]>();
  for (const ev of events) {
    let day: string;
    try {
      day = new Date(ev.timestamp).toISOString().slice(0, 10);
    } catch {
      day = ev.timestamp.slice(0, 10);
    }
    let bucket = out.get(day);
    if (!bucket) {
      bucket = [];
      out.set(day, bucket);
    }
    bucket.push(ev);
  }
  return Array.from(out.entries());
}

function TimelineView({ events }: { events: AuditEvent[] }): React.ReactElement {
  const days = groupByDay(events);
  return (
    <ol className="cc-audit-log cc-audit-log--timeline">
      {days.map(([day, items]) => (
        <li key={day} className="cc-audit-log__day">
          <div className="cc-audit-log__day-marker">{day}</div>
          <ul className="cc-audit-log__day-items">
            {items.map((item) => (
              <li key={item.id} className="cc-audit-log__row">
                <span className="cc-audit-log__dot" aria-hidden />
                <time dateTime={item.timestamp}>
                  {formatTimestamp(item.timestamp)}
                </time>
                <span className="cc-audit-log__category">{item.category}</span>
                {item.detail ? (
                  <span className="cc-audit-log__detail">{item.detail}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export function AuditLogList({
  events,
  notableOnlyByDefault = true,
  collapseConsecutive = true,
  maxVisible = 10,
  variant = "flat",
}: AuditLogListProps): React.ReactElement {
  // Hooks must run unconditionally — keep showRoutine state at the top, even
  // if the timeline branch ignores it.
  const [showRoutine, setShowRoutine] = React.useState(!notableOnlyByDefault);

  if (variant === "timeline") {
    if (events.length === 0) {
      return (
        <p style={{ color: "var(--text-2)", fontSize: "0.88rem", margin: 0 }}>
          No audit events yet.
        </p>
      );
    }
    return <TimelineView events={events} />;
  }

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
    return (
      <p style={{ color: "var(--text-2)", fontSize: "0.88rem", margin: 0 }}>
        No audit events yet.
      </p>
    );
  }

  return (
    <div style={{ fontSize: "0.88rem" }}>
      {visibleNotable.length > 0 ? (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            maxHeight: "12rem",
            overflowY: "auto",
          }}
        >
          {visibleNotable.map((ev) => (
            <EventRow key={ev.id} ev={ev} />
          ))}
        </ul>
      ) : (
        <p style={{ color: "var(--text-2)", fontSize: "0.75rem", margin: 0 }}>
          No notable events.
        </p>
      )}

      {notableOnlyByDefault && (
        <div style={{ marginTop: "0.5rem" }}>
          <button
            type="button"
            onClick={() => setShowRoutine((v) => !v)}
            style={{
              fontSize: "0.75rem",
              color: "var(--text-2)",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid var(--border-1)",
              padding: 0,
              cursor: "pointer",
            }}
          >
            {showRoutine
              ? "Hide routine events"
              : `Show routine events (${processedRoutine.length} collapsed)`}
          </button>
          {showRoutine && visibleRoutine.length > 0 ? (
            <ul
              style={{
                listStyle: "none",
                margin: "0.25rem 0 0",
                padding: 0,
                maxHeight: "8rem",
                overflowY: "auto",
              }}
            >
              {visibleRoutine.map((ev) => (
                <EventRow key={ev.id} ev={ev} />
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
}
