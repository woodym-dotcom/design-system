import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
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
    const inner = (_jsx(_Fragment, { children: fields.map((field, idx) => (_jsxs("span", { className: [
                "cc-envelope-badge__field",
                field.tone ? `cc-envelope-badge__field--${field.tone}` : "",
            ]
                .filter(Boolean)
                .join(" "), style: {
                display: "inline-flex",
                alignItems: "baseline",
                gap: "0.2rem",
                padding: size === "sm"
                    ? "0.1rem 0.35rem"
                    : "0.15rem 0.5rem",
                fontSize: size === "sm" ? "0.7rem" : "0.78rem",
                borderRadius: "var(--radius-1, 4px)",
                background: "var(--surface-2, #f5f5f5)",
                border: "1px solid var(--border-1)",
            }, children: [_jsxs("span", { className: "cc-envelope-badge__label", style: { fontWeight: 600, color: "var(--text-2)" }, children: [field.label, ":"] }), _jsx("span", { className: "cc-envelope-badge__value", style: { color: "var(--text-1)" }, children: field.value })] }, idx))) }));
    const style = {
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--space-1, 0.25rem)",
        cursor: interactive ? "pointer" : "default",
    };
    if (interactive) {
        return (_jsx("button", { type: "button", className: classes, onClick: onClick, "aria-label": rest["aria-label"] ?? "Envelope details", style: style, children: inner }));
    }
    return (_jsx("span", { className: classes, "aria-label": rest["aria-label"] ?? "Envelope details", style: style, children: inner }));
}
//# sourceMappingURL=EnvelopeBadge.js.map