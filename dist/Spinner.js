import { jsx as _jsx } from "react/jsx-runtime";
export function Spinner({ size = "md", label = "Loading", className, }) {
    const cls = [
        "cc-spinner",
        `cc-spinner--${size}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsx("span", { role: "status", "aria-label": label, className: cls, children: _jsx("span", { className: "cc-spinner__ring", "aria-hidden": "true" }) }));
}
//# sourceMappingURL=Spinner.js.map