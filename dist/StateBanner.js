import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const KIND = {
    offline: { title: "You're offline", tone: "warning" },
    "rate-limited": { title: "Rate-limited — slow down", tone: "warning" },
    "permissioned-out": {
        title: "You don't have access to this view",
        tone: "neutral",
    },
    "stale-data": { title: "Data is stale", tone: "info" },
    partial: { title: "Partial data shown", tone: "info" },
    degraded: { title: "Degraded service", tone: "warning" },
    "fail-closed": { title: "Fail-closed — access denied by default", tone: "warning" },
    "device-mismatch": { title: "Device mismatch detected", tone: "warning" },
    lockout: { title: "Account locked out", tone: "warning" },
};
function isoOf(value) {
    if (!value)
        return null;
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
export function StateBanner({ kind, title, description, action, asOf, className, }) {
    const meta = KIND[kind];
    const role = meta.tone === "warning" ? "alert" : "status";
    const iso = isoOf(asOf);
    return (_jsxs("div", { role: role, className: [
            "cc-state-banner",
            `cc-state-banner--${kind}`,
            `cc-state-banner--${meta.tone}`,
            className,
        ]
            .filter(Boolean)
            .join(" "), children: [_jsxs("div", { className: "cc-state-banner__body", children: [_jsx("strong", { className: "cc-state-banner__title", children: title ?? meta.title }), description ? (_jsxs("span", { className: "cc-state-banner__description", children: [" ", description] })) : null, iso ? (_jsxs("span", { className: "cc-state-banner__asof", children: [" ", "as of ", _jsx("time", { dateTime: iso, children: iso })] })) : null] }), action ? (_jsx("button", { type: "button", className: "cc-state-banner__action", onClick: action.onClick, children: action.label })) : null] }));
}
//# sourceMappingURL=StateBanner.js.map