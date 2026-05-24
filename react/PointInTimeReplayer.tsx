/**
 * PointInTimeReplayer — temporal replay control.
 *
 * Provides a slider or stepper UI to navigate point-in-time snapshots.
 * Used for audit trails, versioned entity views, and temporal queries
 * where users need to "rewind" to see historical state.
 *
 * Usage:
 *   <PointInTimeReplayer
 *     snapshots={[
 *       { id: '1', timestamp: new Date('2024-01-01'), label: 'v1' },
 *       { id: '2', timestamp: new Date('2024-06-01'), label: 'v2' },
 *     ]}
 *     currentIndex={0}
 *     onChange={(index) => loadSnapshot(index)}
 *   />
 */
import * as React from "react";

export interface Snapshot {
  id: string;
  timestamp: Date | string;
  /** Human-readable label for this snapshot. */
  label?: string;
}

export interface PointInTimeReplayerProps {
  /** Ordered list of snapshots (oldest first). */
  snapshots: Snapshot[];
  /** Currently active snapshot index. */
  currentIndex: number;
  /** Called when the user selects a different snapshot. */
  onChange: (index: number) => void;
  /** Display mode. Default: "slider". */
  mode?: "slider" | "stepper";
  /** Whether playback controls (play/pause) are shown. Default: false. */
  playable?: boolean;
  /** Playback interval in ms when playable. Default: 1000. */
  playInterval?: number;
  /** Format function for timestamp display. */
  formatTimestamp?: (ts: Date) => string;
  /** Label above the control. */
  label?: string;
  className?: string;
}

function defaultFormatTimestamp(ts: Date): string {
  return ts.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDate(ts: Date | string): Date {
  return typeof ts === "string" ? new Date(ts) : ts;
}

export function PointInTimeReplayer({
  snapshots,
  currentIndex,
  onChange,
  mode = "slider",
  playable = false,
  playInterval = 1000,
  formatTimestamp = defaultFormatTimestamp,
  label,
  className,
}: PointInTimeReplayerProps): React.ReactElement {
  const [playing, setPlaying] = React.useState(false);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const current = snapshots[currentIndex];
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < snapshots.length - 1;

  React.useEffect(() => {
    if (playing && canNext) {
      intervalRef.current = setInterval(() => {
        onChange(currentIndex + 1);
      }, playInterval);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, currentIndex, canNext, onChange, playInterval]);

  // Stop playing when we reach the end.
  React.useEffect(() => {
    if (playing && !canNext) {
      setPlaying(false);
    }
  }, [playing, canNext]);

  const classes = [
    "cc-point-in-time-replayer",
    `cc-point-in-time-replayer--${mode}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      role="group"
      aria-label={label ?? "Point-in-time replayer"}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2, 0.375rem)",
        padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--radius-2, 8px)",
        background: "var(--surface-1)",
      }}
    >
      {label && (
        <span
          className="cc-point-in-time-replayer__label"
          style={{
            fontSize: "var(--text-sm, 0.875rem)",
            fontWeight: 600,
            color: "var(--text-2)",
          }}
        >
          {label}
        </span>
      )}

      {current && (
        <div
          className="cc-point-in-time-replayer__current"
          style={{
            fontSize: "var(--text-sm, 0.875rem)",
            color: "var(--text-1)",
            display: "flex",
            alignItems: "baseline",
            gap: "var(--space-2, 0.375rem)",
          }}
        >
          <span style={{ fontWeight: 600 }}>
            {current.label ?? `Snapshot ${currentIndex + 1}`}
          </span>
          <span style={{ color: "var(--text-3)", fontSize: "var(--text-xs, 0.75rem)" }}>
            {formatTimestamp(toDate(current.timestamp))}
          </span>
        </div>
      )}

      <div
        className="cc-point-in-time-replayer__controls"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2, 0.375rem)",
        }}
      >
        {playable && (
          <button
            type="button"
            className="cc-point-in-time-replayer__play"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
            style={{
              background: "none",
              border: "1px solid var(--border-1)",
              borderRadius: "var(--radius-1, 4px)",
              padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
              cursor: "pointer",
              fontSize: "var(--text-sm, 0.875rem)",
            }}
          >
            {playing ? "||" : "▶"}
          </button>
        )}

        <button
          type="button"
          className="cc-point-in-time-replayer__prev"
          onClick={() => onChange(currentIndex - 1)}
          disabled={!canPrev}
          aria-label="Previous snapshot"
          style={{
            background: "none",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius-1, 4px)",
            padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
            cursor: canPrev ? "pointer" : "not-allowed",
            opacity: canPrev ? 1 : 0.4,
            fontSize: "var(--text-sm, 0.875rem)",
          }}
        >
          ◀
        </button>

        {mode === "slider" ? (
          <input
            type="range"
            className="cc-point-in-time-replayer__slider"
            min={0}
            max={snapshots.length - 1}
            value={currentIndex}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Snapshot position"
            style={{ flex: 1 }}
          />
        ) : (
          <span
            className="cc-point-in-time-replayer__position"
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: "var(--text-sm, 0.875rem)",
              color: "var(--text-2)",
            }}
          >
            {currentIndex + 1} / {snapshots.length}
          </span>
        )}

        <button
          type="button"
          className="cc-point-in-time-replayer__next"
          onClick={() => onChange(currentIndex + 1)}
          disabled={!canNext}
          aria-label="Next snapshot"
          style={{
            background: "none",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius-1, 4px)",
            padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
            cursor: canNext ? "pointer" : "not-allowed",
            opacity: canNext ? 1 : 0.4,
            fontSize: "var(--text-sm, 0.875rem)",
          }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
