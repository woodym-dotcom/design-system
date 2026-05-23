import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * @deprecated Use `<State variant="stale" density="chip">` from `./State` instead.
 * This component will be removed in v1.0 (DS-SIMPLIFY 14).
 *
 * StaleDataPill — small warning chip + refresh button when the rendered
 * data is older than `staleAfterMs`.
 *
 * Recomputes age once every 30s. Returns null while data is fresh — the
 * chip only appears when the dataset has aged past the threshold.
 */
import * as React from "react";
import { Chip } from "./Chip";
import { Button } from "./Button";
function toMs(v) {
    if (v instanceof Date)
        return v.getTime();
    if (typeof v === "number")
        return v;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}
function formatAge(ms) {
    const sec = Math.round(ms / 1000);
    if (sec < 60)
        return `${sec}s`;
    const min = Math.round(sec / 60);
    if (min < 60)
        return `${min}m`;
    const hr = Math.round(min / 60);
    if (hr < 24)
        return `${hr}h`;
    return `${Math.round(hr / 24)}d`;
}
export function StaleDataPill({ dataUpdatedAt, staleAfterMs = 5 * 60 * 1000, onRefresh, className, }) {
    const [now, setNow] = React.useState(() => Date.now());
    React.useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), 30_000);
        return () => window.clearInterval(id);
    }, []);
    const updated = toMs(dataUpdatedAt);
    const age = now - updated;
    if (age < staleAfterMs)
        return null;
    return (_jsxs("div", { role: "status", className: ["cc-stale-pill", className].filter(Boolean).join(" "), children: [_jsxs(Chip, { tone: "warning", children: ["Last refreshed ", formatAge(age), " ago"] }), onRefresh ? (_jsx(Button, { variant: "ghost", size: "sm", onClick: onRefresh, children: "Refresh" })) : null] }));
}
//# sourceMappingURL=StaleDataPill.js.map