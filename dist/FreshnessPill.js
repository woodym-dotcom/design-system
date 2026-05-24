import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const FRESHNESS_META = {
    "online-hot": {
        label: "Online-Hot",
        dotColor: "var(--success-text, #16a34a)",
        tone: "success",
    },
    "online-standard": {
        label: "Online-Standard",
        dotColor: "var(--info-text, #2563eb)",
        tone: "info",
    },
    offline: {
        label: "Offline",
        dotColor: "var(--text-3, #9ca3af)",
        tone: "neutral",
    },
};
export function FreshnessPill({ freshnessClass, label, size = "md", onClick, className, }) {
    const meta = FRESHNESS_META[freshnessClass];
    const interactive = typeof onClick === "function";
    const displayLabel = label ?? meta.label;
    const classes = [
        "cc-freshness-pill",
        `cc-freshness-pill--${freshnessClass}`,
        `cc-freshness-pill--${size}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const inner = (_jsxs(_Fragment, { children: [_jsx("span", { className: "cc-freshness-pill__dot", "aria-hidden": "true", style: {
                    display: "inline-block",
                    width: size === "sm" ? "0.4rem" : "0.5rem",
                    height: size === "sm" ? "0.4rem" : "0.5rem",
                    borderRadius: "50%",
                    background: meta.dotColor,
                    flexShrink: 0,
                } }), _jsx("span", { className: "cc-freshness-pill__label", children: displayLabel })] }));
    const style = {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1, 0.25rem)",
        padding: size === "sm"
            ? "0.1rem 0.4rem"
            : "0.15rem 0.5rem",
        fontSize: size === "sm" ? "0.72rem" : "0.82rem",
        fontWeight: 500,
        borderRadius: "999px",
        border: "1px solid var(--border-1)",
        background: "var(--surface-1)",
        cursor: interactive ? "pointer" : "default",
    };
    if (interactive) {
        return (_jsx("button", { type: "button", className: classes, onClick: onClick, style: style, children: inner }));
    }
    return (_jsx("span", { className: classes, style: style, children: inner }));
}
//# sourceMappingURL=FreshnessPill.js.map