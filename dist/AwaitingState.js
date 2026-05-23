import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const DEFAULT_COPY = {
    awaiting: "Waiting for the upstream system to respond.",
    opening: "Opening connection…",
    retrying: "Retrying the request…",
    rate_limited: "Rate limit reached. Will retry automatically.",
    expired: "Request expired before completion.",
    invalid: "Request rejected as invalid.",
};
const STATUS_LABEL = {
    awaiting: "Awaiting",
    opening: "Opening",
    retrying: "Retrying",
    rate_limited: "Rate-limited",
    expired: "Expired",
    invalid: "Invalid",
};
function countdownText(retryAfter, now) {
    if (!retryAfter)
        return null;
    const remaining = Math.max(0, Math.round((retryAfter.getTime() - now) / 1000));
    if (remaining === 0)
        return "Retrying now";
    return `Retry in ${remaining}s`;
}
export function AwaitingState({ state, retryAfter, idempotencyKey, optimisticCopy, title, className, }) {
    const [now, setNow] = React.useState(() => Date.now());
    React.useEffect(() => {
        if (!retryAfter)
            return;
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, [retryAfter]);
    const countdown = countdownText(retryAfter, now);
    const showSpinner = state === "awaiting" || state === "opening" || state === "retrying";
    const tone = state === "expired" || state === "invalid"
        ? "error"
        : state === "rate_limited"
            ? "warning"
            : "info";
    return (_jsxs("div", { role: "status", "aria-live": "polite", className: ["cc-awaiting", `cc-awaiting--${state}`, className]
            .filter(Boolean)
            .join(" "), children: [title ? _jsx("div", { className: "cc-awaiting__title", children: title }) : null, _jsxs("div", { className: "cc-awaiting__row", children: [showSpinner ? _jsx(Spinner, { size: "sm", label: STATUS_LABEL[state] }) : null, _jsx(Chip, { tone: tone, children: STATUS_LABEL[state] }), _jsx("span", { className: "cc-awaiting__copy", children: DEFAULT_COPY[state] }), countdown ? (_jsx("span", { className: "cc-awaiting__countdown", children: countdown })) : null] }), optimisticCopy ? (_jsx("p", { className: "cc-awaiting__optimistic", children: optimisticCopy })) : null, idempotencyKey ? (_jsxs("p", { className: "cc-awaiting__key", children: ["Idempotency key: ", _jsx("code", { children: idempotencyKey })] })) : null] }));
}
//# sourceMappingURL=AwaitingState.js.map