import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function deriveConfidenceLevel(score) {
    if (score >= 0.8)
        return "high";
    if (score >= 0.5)
        return "medium";
    return "low";
}
function levelToTone(level) {
    switch (level) {
        case "high":
            return "success";
        case "medium":
            return "warning";
        case "low":
            return "error";
    }
}
const TONE_STYLES = {
    success: {
        bg: "var(--success-light)",
        border: "var(--success-border)",
        text: "var(--success-text)",
    },
    warning: {
        bg: "var(--warning-light)",
        border: "var(--warning-border)",
        text: "var(--warning-text)",
    },
    error: {
        bg: "var(--error-light)",
        border: "var(--error-border)",
        text: "var(--error-text)",
    },
    neutral: {
        bg: "var(--surface-2)",
        border: "var(--border-1)",
        text: "var(--text-2)",
    },
};
function formatTimestamp(ts) {
    const d = typeof ts === "string" ? new Date(ts) : ts;
    return d.toLocaleString();
}
export function AIProvenanceChip({ model, confidence, timestamp, confidenceLevel, onClick, variant = "default", externalSource, className, ...rest }) {
    const level = confidenceLevel ??
        (confidence !== undefined ? deriveConfidenceLevel(confidence) : undefined);
    const tone = variant === "read-only" ? "neutral" : level ? levelToTone(level) : "neutral";
    const vars = TONE_STYLES[tone];
    const interactive = variant !== "read-only" && typeof onClick === "function";
    const classes = [
        "cc-ai-provenance-chip",
        `cc-ai-provenance-chip--${tone}`,
        interactive ? "cc-ai-provenance-chip--interactive" : null,
        variant !== "default" ? `cc-ai-provenance-chip--${variant}` : null,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const variantIcon = variant === "read-only" ? "🔒" : variant === "external-binding" ? "🔗" : "AI";
    const inner = (_jsxs(_Fragment, { children: [_jsx("span", { className: "cc-ai-provenance-chip__icon", "aria-hidden": "true", children: variantIcon }), _jsx("span", { className: "cc-ai-provenance-chip__model", children: model }), variant === "external-binding" && externalSource && (_jsx("span", { className: "cc-ai-provenance-chip__external-source", children: externalSource })), confidence !== undefined && (_jsxs("span", { className: "cc-ai-provenance-chip__confidence", children: [Math.round(confidence * 100), "%"] })), timestamp && (_jsx("span", { className: "cc-ai-provenance-chip__timestamp", children: formatTimestamp(timestamp) }))] }));
    const style = {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2, 0.375rem)",
        padding: "var(--space-1, 0.25rem) var(--space-3, 0.5rem)",
        borderRadius: "999px",
        background: vars.bg,
        border: `1px solid ${vars.border}`,
        color: vars.text,
        fontSize: "var(--text-xs, 0.75rem)",
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: "nowrap",
        cursor: interactive ? "pointer" : "default",
    };
    if (interactive) {
        return (_jsx("button", { type: "button", className: classes, onClick: onClick, "aria-label": rest["aria-label"], style: style, children: inner }));
    }
    return (_jsx("span", { className: classes, "aria-label": rest["aria-label"], style: style, children: inner }));
}
/** Alias for backward-compat import paths. */
export const ProvenanceChip = AIProvenanceChip;
//# sourceMappingURL=AIProvenanceChip.js.map