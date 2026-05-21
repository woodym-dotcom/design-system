/**
 * ActivityTimeline stories — covers all new props:
 *   variant × groupByDay × density × loading × expandable
 */
import * as React from "react";
import { ActivityTimeline, type ActivityEntry } from "../react/ActivityTimeline";

export default {
  title: "Primitives/ActivityTimeline",
  component: ActivityTimeline,
};

// ── Shared fixtures ───────────────────────────────────────────────────────────

const ENTRIES: ActivityEntry[] = [
  {
    id: "1",
    actor: { name: "Alice Nguyen" },
    action: "created",
    target: "Project Alpha",
    timestamp: "2024-03-01T09:00:00.000Z",
  },
  {
    id: "2",
    actor: { name: "Bob Smith" },
    action: "updated",
    target: "Project Alpha",
    timestamp: "2024-03-01T11:30:00.000Z",
    diff: { before: { status: "draft" }, after: { status: "active" } },
  },
  {
    id: "3",
    actor: { name: "Alice Nguyen" },
    action: "commented",
    target: "Task #42",
    timestamp: "2024-03-01T14:15:00.000Z",
  },
  {
    id: "4",
    actor: { name: "Carol Davis" },
    action: "archived",
    target: "Project Beta",
    timestamp: "2024-03-02T08:05:00.000Z",
  },
  {
    id: "5",
    actor: { name: "Bob Smith" },
    action: "reassigned",
    target: "Task #17",
    timestamp: "2024-03-02T10:00:00.000Z",
    diff: {
      before: { assignee: "Alice" },
      after: { assignee: "Carol" },
    },
  },
  {
    id: "6",
    actor: { name: "Carol Davis" },
    action: "closed",
    target: "Sprint 12",
    timestamp: "2024-03-03T17:00:00.000Z",
  },
];

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <div style={{ maxWidth: 560, padding: 24 }}>{children}</div>
);

// ── Stories ───────────────────────────────────────────────────────────────────

export function FlatDefault() {
  return (
    <Wrap>
      <ActivityTimeline entries={ENTRIES} />
    </Wrap>
  );
}

export function TimelineVariant() {
  return (
    <Wrap>
      <ActivityTimeline entries={ENTRIES} variant="timeline" />
    </Wrap>
  );
}

export function FlatGroupByDay() {
  return (
    <Wrap>
      <ActivityTimeline entries={ENTRIES} groupByDay />
    </Wrap>
  );
}

export function TimelineGroupByDay() {
  return (
    <Wrap>
      <ActivityTimeline entries={ENTRIES} variant="timeline" groupByDay />
    </Wrap>
  );
}

export function DensityCompact() {
  return (
    <Wrap>
      <ActivityTimeline entries={ENTRIES} density="compact" />
    </Wrap>
  );
}

export function DensityDefault() {
  return (
    <Wrap>
      <ActivityTimeline entries={ENTRIES} density="default" />
    </Wrap>
  );
}

export function DensitySpacious() {
  return (
    <Wrap>
      <ActivityTimeline entries={ENTRIES} density="spacious" />
    </Wrap>
  );
}

export function ExpandableDiffs() {
  return (
    <Wrap>
      <p style={{ marginBottom: 12, fontSize: "0.8rem", color: "var(--text-2, #666)" }}>
        Entries with a diff field show a "Show diff" toggle.
      </p>
      <ActivityTimeline entries={ENTRIES} expandable />
    </Wrap>
  );
}

export function LoadingEmpty() {
  return (
    <Wrap>
      <ActivityTimeline entries={[]} loading />
    </Wrap>
  );
}

export function LoadingMore() {
  return (
    <Wrap>
      <ActivityTimeline entries={ENTRIES.slice(0, 3)} loading />
    </Wrap>
  );
}

export function EmptyState() {
  return (
    <Wrap>
      <ActivityTimeline entries={[]} />
    </Wrap>
  );
}

export function CustomEmptyState() {
  return (
    <Wrap>
      <ActivityTimeline
        entries={[]}
        emptyState={
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--text-2, #888)",
              fontSize: "0.88rem",
            }}
          >
            <p style={{ margin: 0, fontWeight: 600 }}>No events yet</p>
            <p style={{ margin: "0.25rem 0 0" }}>Activities will appear here as they happen.</p>
          </div>
        }
      />
    </Wrap>
  );
}

export function CustomRenderEntry() {
  return (
    <Wrap>
      <ActivityTimeline
        entries={ENTRIES}
        renderEntry={(entry) => (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              padding: "0.25rem 0",
              borderBottom: "1px solid var(--border-1, #eee)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--accent-2, #e0e7ff)",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--accent-1, #4f46e5)",
                flexShrink: 0,
              }}
            >
              {entry.actor.name.charAt(0)}
            </span>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, fontSize: "0.82rem" }}>{entry.actor.name}</span>
              {" "}
              <span style={{ fontSize: "0.82rem" }}>{entry.action}</span>
              {entry.target && (
                <span style={{ fontSize: "0.82rem", color: "var(--text-2, #666)" }}>
                  {" "}{entry.target}
                </span>
              )}
            </div>
            <time
              dateTime={entry.timestamp instanceof Date ? entry.timestamp.toISOString() : entry.timestamp}
              style={{ fontSize: "0.72rem", color: "var(--text-2, #888)", whiteSpace: "nowrap" }}
            >
              {new Date(entry.timestamp).toLocaleDateString()}
            </time>
          </div>
        )}
      />
    </Wrap>
  );
}

export function InfiniteScrollSimulated() {
  const [items, setItems] = React.useState<ActivityEntry[]>(ENTRIES.slice(0, 3));
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const loadMore = async () => {
    setLoading(true);
    // Simulate async fetch
    await new Promise((r) => setTimeout(r, 800));
    const next = ENTRIES.slice(items.length, items.length + 3);
    setItems((prev) => [...prev, ...next]);
    setHasMore(items.length + next.length < ENTRIES.length);
    setLoading(false);
  };

  return (
    <Wrap>
      <p style={{ marginBottom: 12, fontSize: "0.8rem", color: "var(--text-2, #666)" }}>
        Scroll to the bottom to load more entries. ({items.length} / {ENTRIES.length})
      </p>
      <ActivityTimeline
        entries={items}
        hasMore={hasMore}
        loadMore={loadMore}
        loading={loading}
      />
    </Wrap>
  );
}

export function AllFeaturesCombined() {
  return (
    <Wrap>
      <ActivityTimeline
        entries={ENTRIES}
        variant="timeline"
        groupByDay
        density="default"
        expandable
      />
    </Wrap>
  );
}
