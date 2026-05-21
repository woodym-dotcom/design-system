/**
 * @deprecated Use `<State variant="loading" density="…">` from `./State` instead.
 * This component will be removed in v1.0 (DS-SIMPLIFY 14).
 *
 * AwaitingState — status surface for in-flight upstream calls.
 *
 * Combines Spinner + Chip on one row with default copy per status. When
 * `retryAfter` is provided, the component runs a 1s live countdown
 * ("Retry in 12s" → "Retrying now").
 *
 * role="status" + aria-live="polite" so screen readers are kept in sync
 * without interrupting the user.
 */
import * as React from "react";
import { Spinner } from "./Spinner";
import { Chip } from "./Chip";

export type AwaitingStatus =
  | "awaiting"
  | "opening"
  | "retrying"
  | "rate_limited"
  | "expired"
  | "invalid";

export interface AwaitingStateProps {
  state: AwaitingStatus;
  /** When the upstream system will retry next. Drives the live countdown. */
  retryAfter?: Date;
  /** Idempotency / correlation key shown in a <code>. */
  idempotencyKey?: string;
  /** Optional optimistic copy displayed below the chip. */
  optimisticCopy?: string;
  /** Optional title rendered above the row. */
  title?: React.ReactNode;
  className?: string;
}

const DEFAULT_COPY: Record<AwaitingStatus, string> = {
  awaiting: "Waiting for the upstream system to respond.",
  opening: "Opening connection…",
  retrying: "Retrying the request…",
  rate_limited: "Rate limit reached. Will retry automatically.",
  expired: "Request expired before completion.",
  invalid: "Request rejected as invalid.",
};

const STATUS_LABEL: Record<AwaitingStatus, string> = {
  awaiting: "Awaiting",
  opening: "Opening",
  retrying: "Retrying",
  rate_limited: "Rate-limited",
  expired: "Expired",
  invalid: "Invalid",
};

function countdownText(retryAfter: Date | undefined, now: number): string | null {
  if (!retryAfter) return null;
  const remaining = Math.max(0, Math.round((retryAfter.getTime() - now) / 1000));
  if (remaining === 0) return "Retrying now";
  return `Retry in ${remaining}s`;
}

export function AwaitingState({
  state,
  retryAfter,
  idempotencyKey,
  optimisticCopy,
  title,
  className,
}: AwaitingStateProps): React.ReactElement {
  const [now, setNow] = React.useState<number>(() => Date.now());

  React.useEffect(() => {
    if (!retryAfter) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [retryAfter]);

  const countdown = countdownText(retryAfter, now);
  const showSpinner = state === "awaiting" || state === "opening" || state === "retrying";
  const tone =
    state === "expired" || state === "invalid"
      ? "error"
      : state === "rate_limited"
        ? "warning"
        : "info";

  return (
    <div
      role="status"
      aria-live="polite"
      className={["cc-awaiting", `cc-awaiting--${state}`, className]
        .filter(Boolean)
        .join(" ")}
    >
      {title ? <div className="cc-awaiting__title">{title}</div> : null}
      <div className="cc-awaiting__row">
        {showSpinner ? <Spinner size="sm" label={STATUS_LABEL[state]} /> : null}
        <Chip tone={tone}>{STATUS_LABEL[state]}</Chip>
        <span className="cc-awaiting__copy">{DEFAULT_COPY[state]}</span>
        {countdown ? (
          <span className="cc-awaiting__countdown">{countdown}</span>
        ) : null}
      </div>
      {optimisticCopy ? (
        <p className="cc-awaiting__optimistic">{optimisticCopy}</p>
      ) : null}
      {idempotencyKey ? (
        <p className="cc-awaiting__key">
          Idempotency key: <code>{idempotencyKey}</code>
        </p>
      ) : null}
    </div>
  );
}
