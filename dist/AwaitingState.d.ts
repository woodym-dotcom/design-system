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
export type AwaitingStatus = "awaiting" | "opening" | "retrying" | "rate_limited" | "expired" | "invalid";
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
export declare function AwaitingState({ state, retryAfter, idempotencyKey, optimisticCopy, title, className, }: AwaitingStateProps): React.ReactElement;
//# sourceMappingURL=AwaitingState.d.ts.map