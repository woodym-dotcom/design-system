import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Tag } from "./Tag.js";
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
function formatTimestamp(ts) {
    const d = typeof ts === "string" ? new Date(ts) : ts;
    return d.toLocaleString();
}
export function AIProvenanceChip({ model, confidence, timestamp, confidenceLevel, onClick, variant = "default", externalSource, className, ...rest }) {
    const level = confidenceLevel ??
        (confidence !== undefined ? deriveConfidenceLevel(confidence) : undefined);
    const tone = variant === "read-only" ? "neutral" : level ? levelToTone(level) : "neutral";
    const interactive = variant !== "read-only" && typeof onClick === "function";
    const variantIcon = variant === "read-only" ? "🔒" : variant === "external-binding" ? "🔗" : "AI";
    const classes = [
        "cc-ai-provenance-chip",
        variant !== "default" ? `cc-ai-provenance-chip--${variant}` : null,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs(Tag, { tone: tone, icon: _jsx(_Fragment, { children: variantIcon }), onClick: interactive ? onClick : undefined, "aria-label": rest["aria-label"], className: classes, children: [_jsx("span", { className: "cc-ai-provenance-chip__model", children: model }), variant === "external-binding" && externalSource && (_jsx("span", { className: "cc-ai-provenance-chip__external-source", children: externalSource })), confidence !== undefined && (_jsxs("span", { className: "cc-ai-provenance-chip__confidence", children: [Math.round(confidence * 100), "%"] })), timestamp && (_jsx("span", { className: "cc-ai-provenance-chip__timestamp", children: formatTimestamp(timestamp) }))] }));
}
/** Alias for backward-compat import paths. */
export const ProvenanceChip = AIProvenanceChip;
//# sourceMappingURL=AIProvenanceChip.js.map