import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Tag } from "./Tag.js";
export function EnvelopeBadge({ fields, size = "md", onClick, className, ...rest }) {
    const interactive = typeof onClick === "function";
    const classes = [
        "cc-envelope-badge",
        `cc-envelope-badge--${size}`,
        interactive ? "cc-envelope-badge--interactive" : null,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const tagSize = size === "sm" ? "sm" : "md";
    const inner = (_jsx(_Fragment, { children: fields.map((field, idx) => (_jsxs(Tag, { tone: (field.tone ?? "neutral"), size: tagSize, className: "cc-envelope-badge__field", children: [_jsxs("span", { className: "cc-envelope-badge__label", style: { fontWeight: 600 }, children: [field.label, ":"] }), " ", _jsx("span", { className: "cc-envelope-badge__value", children: field.value })] }, idx))) }));
    const groupStyle = {
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--space-1, 0.25rem)",
        cursor: interactive ? "pointer" : "default",
    };
    if (interactive) {
        return (_jsx("button", { type: "button", className: classes, onClick: onClick, "aria-label": rest["aria-label"] ?? "Envelope details", style: groupStyle, children: inner }));
    }
    return (_jsx("span", { className: classes, "aria-label": rest["aria-label"] ?? "Envelope details", style: groupStyle, children: inner }));
}
//# sourceMappingURL=EnvelopeBadge.js.map