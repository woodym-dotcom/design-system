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

// ── Public types ──────────────────────────────────────────────────────────────

export interface ActivityEntry {
  id: string;
  actor: { name: string; avatarUrl?: string };
  action: string;
  target?: string;
  timestamp: Date | string;
  diff?: { before: unknown; after: unknown };
  metadata?: Record<string, unknown>;
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

// ── Internal helpers ──────────────────────────────────────────────────────────

const DENSITY_PADDING: Record<NonNullable<ActivityTimelineProps["density"]>, string> = {
  compact: "0.15rem 0",
  default: "0.35rem 0",
  spacious: "0.65rem 0",
};

function toIso(ts: Date | string): string {
  if (ts instanceof Date) return ts.toISOString();
  return ts;
}

function formatTimestamp(ts: Date | string): string {
  try {
    return new Date(toIso(ts)).toISOString().slice(0, 19).replace("T", " ");
  } catch {
    return String(ts);
  }
}

function isoDay(ts: Date | string): string {
  try {
    return new Date(toIso(ts)).toISOString().slice(0, 10);
  } catch {
    return toIso(ts).slice(0, 10);
  }
}

function groupEntriesByDay<E extends ActivityEntry>(entries: E[]): Array<[string, E[]]> {
  const map = new Map<string, E[]>();
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

// ── Sub-components ────────────────────────────────────────────────────────────

interface EntryRowProps<E extends ActivityEntry> {
  entry: E;
  density: NonNullable<ActivityTimelineProps["density"]>;
  expandable: boolean;
  renderEntry?: (entry: E) => React.ReactNode;
  timeline?: boolean;
}

function EntryRow<E extends ActivityEntry>({
  entry,
  density,
  expandable,
  renderEntry,
  timeline = false,
}: EntryRowProps<E>): React.ReactElement {
  const [expanded, setExpanded] = React.useState(false);
  const pad = DENSITY_PADDING[density];
  const iso = toIso(entry.timestamp);

  if (renderEntry) {
    return <li style={{ padding: pad }}>{renderEntry(entry)}</li>;
  }

  const hasDiff = expandable && entry.diff !== undefined;

  return (
    <li
      data-testid="activity-entry"
      style={{
        borderTop: "1px solid var(--border-1)",
        padding: pad,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        gap: "0 0.3rem",
        fontSize: "0.82rem",
        position: "relative",
      }}
    >
      {timeline && (
        <span
          className="at-dot"
          aria-hidden
          style={{
            display: "inline-block",
            width: "0.5rem",
            height: "0.5rem",
            borderRadius: "50%",
            background: "var(--accent-1, var(--text-2))",
            flexShrink: 0,
            alignSelf: "center",
          }}
        />
      )}

      {/* Actor */}
      <span
        style={{ fontWeight: 600, color: "var(--text-1)" }}
        aria-label={`actor: ${entry.actor.name}`}
      >
        {entry.actor.name}
      </span>

      {/* Action */}
      <span style={{ color: "var(--text-1)" }}>{entry.action}</span>

      {/* Target */}
      {entry.target ? (
        <span style={{ color: "var(--text-2)" }}>{entry.target}</span>
      ) : null}

      {/* Timestamp */}
      <time
        dateTime={iso}
        style={{ color: "var(--text-2)", fontSize: "0.72rem", marginLeft: "auto" }}
      >
        {formatTimestamp(entry.timestamp)}
      </time>

      {/* Expandable diff toggle */}
      {hasDiff && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={`at-diff-${entry.id}`}
          onClick={() => setExpanded((v) => !v)}
          style={{
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
          }}
        >
          {expanded ? "Hide diff" : "Show diff"}
        </button>
      )}

      {hasDiff && expanded && (
        <pre
          id={`at-diff-${entry.id}`}
          style={{
            width: "100%",
            margin: "0.25rem 0 0",
            fontSize: "0.72rem",
            background: "var(--surface-2, #f5f5f5)",
            padding: "0.4rem",
            overflowX: "auto",
            borderRadius: "0.2rem",
          }}
        >
          {JSON.stringify({ before: entry.diff!.before, after: entry.diff!.after }, null, 2)}
        </pre>
      )}
    </li>
  );
}

// ── Sentinel (IntersectionObserver loadMore) ──────────────────────────────────

interface SentinelProps {
  onIntersect: () => void;
}

function Sentinel({ onIntersect }: SentinelProps): React.ReactElement {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  return (
    <div
      ref={ref}
      data-testid="at-load-more-sentinel"
      style={{ height: "1px" }}
      aria-hidden
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ActivityTimeline<E extends ActivityEntry = ActivityEntry>({
  entries,
  variant = "flat",
  groupByDay = false,
  density = "default",
  renderEntry,
  expandable = false,
  emptyState,
  loading = false,
  loadMore,
  hasMore = false,
}: ActivityTimelineProps<E>): React.ReactElement {
  const isTimeline = variant === "timeline";

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (loading && entries.length === 0) {
    return (
      <div
        data-testid="at-loading"
        aria-busy="true"
        aria-label="Loading activity"
        style={{ fontSize: "0.82rem" }}
      >
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              height: "1.2rem",
              background: "var(--surface-2, #e8e8e8)",
              borderRadius: "0.2rem",
              marginBottom: "0.4rem",
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  if (!loading && entries.length === 0) {
    if (emptyState) return <>{emptyState}</>;
    return (
      <p style={{ color: "var(--text-2)", fontSize: "0.88rem", margin: 0 }}>
        No activity yet.
      </p>
    );
  }

  // ── Build rows (with optional groupByDay) ───────────────────────────────
  const renderEntries = (list: E[]): React.ReactNode =>
    list.map((entry) => (
      <EntryRow
        key={entry.id}
        entry={entry}
        density={density}
        expandable={expandable}
        renderEntry={renderEntry}
        timeline={isTimeline}
      />
    ));

  let body: React.ReactNode;

  if (groupByDay) {
    const days = groupEntriesByDay(entries);
    body = days.map(([day, dayEntries]) => (
      <li key={day} className="at-day-group">
        <div
          className="at-day-header"
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "var(--text-2)",
            padding: "0.4rem 0 0.2rem",
            position: "sticky",
            top: 0,
            background: "var(--surface-1, #fff)",
          }}
        >
          {day}
        </div>
        <ul className="at-day-entries" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {renderEntries(dayEntries)}
        </ul>
      </li>
    ));

    return (
      <div data-testid="activity-timeline" data-variant={variant} data-density={density}>
        <ol
          className={`at at--${variant}`}
          style={{ listStyle: "none", margin: 0, padding: 0 }}
          aria-label="Activity timeline"
        >
          {body}
        </ol>
        {hasMore && loadMore && <Sentinel onIntersect={() => void loadMore()} />}
        {loading && entries.length > 0 && (
          <div
            data-testid="at-loading-more"
            aria-busy="true"
            aria-label="Loading more activity"
            style={{ fontSize: "0.75rem", color: "var(--text-2)", padding: "0.4rem 0" }}
          >
            Loading more…
          </div>
        )}
      </div>
    );
  }

  // ── No groupByDay ───────────────────────────────────────────────────────
  return (
    <div data-testid="activity-timeline" data-variant={variant} data-density={density}>
      <ul
        className={`at at--${variant}`}
        style={{ listStyle: "none", margin: 0, padding: 0 }}
        aria-label="Activity timeline"
      >
        {renderEntries(entries)}
      </ul>
      {hasMore && loadMore && <Sentinel onIntersect={() => void loadMore()} />}
      {loading && entries.length > 0 && (
        <div
          data-testid="at-loading-more"
          aria-busy="true"
          aria-label="Loading more activity"
          style={{ fontSize: "0.75rem", color: "var(--text-2)", padding: "0.4rem 0" }}
        >
          Loading more…
        </div>
      )}
    </div>
  );
}
