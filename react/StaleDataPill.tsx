/**
 * StaleDataPill — small warning chip + refresh button when the rendered
 * data is older than `staleAfterMs`.
 *
 * Recomputes age once every 30s. Returns null while data is fresh — the
 * chip only appears when the dataset has aged past the threshold.
 */
import * as React from "react";
import { Chip } from "./Chip";
import { Button } from "./Button";

export interface StaleDataPillProps {
  /** When the data was last refreshed. */
  dataUpdatedAt: Date | number | string;
  /** Threshold past which the chip appears. Default 5 minutes. */
  staleAfterMs?: number;
  /** Optional refresh handler. When present, a "refresh" button is rendered. */
  onRefresh?: () => void;
  className?: string;
}

function toMs(v: Date | number | string): number {
  if (v instanceof Date) return v.getTime();
  if (typeof v === "number") return v;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

function formatAge(ms: number): string {
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h`;
  return `${Math.round(hr / 24)}d`;
}

export function StaleDataPill({
  dataUpdatedAt,
  staleAfterMs = 5 * 60 * 1000,
  onRefresh,
  className,
}: StaleDataPillProps): React.ReactElement | null {
  const [now, setNow] = React.useState<number>(() => Date.now());
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const updated = toMs(dataUpdatedAt);
  const age = now - updated;
  if (age < staleAfterMs) return null;

  return (
    <div
      role="status"
      className={["cc-stale-pill", className].filter(Boolean).join(" ")}
    >
      <Chip tone="warning">Last refreshed {formatAge(age)} ago</Chip>
      {onRefresh ? (
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          Refresh
        </Button>
      ) : null}
    </div>
  );
}
