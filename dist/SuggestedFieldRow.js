import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function confidenceTone(c) {
    if (c >= 0.8)
        return {
            bg: "var(--success-light)",
            text: "var(--success-text)",
            border: "var(--success-border)",
        };
    if (c >= 0.5)
        return {
            bg: "var(--warning-light)",
            text: "var(--warning-text)",
            border: "var(--warning-border)",
        };
    return {
        bg: "var(--error-light)",
        text: "var(--error-text)",
        border: "var(--error-border)",
    };
}
export function SuggestedFieldRow({ label, currentValue, suggestedValue, model, confidence, onAccept, onDecline, disabled = false, showWhenMatch = false, className, }) {
    // Skip rendering if suggested matches current (unless explicitly requested).
    if (!showWhenMatch &&
        currentValue !== undefined &&
        currentValue === suggestedValue) {
        return null;
    }
    const confTone = confidence !== undefined ? confidenceTone(confidence) : null;
    const classes = ["cc-suggested-field-row", className]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { className: classes, style: {
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2, 0.375rem)",
            padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
            borderRadius: "var(--radius-1, 4px)",
            border: "1px solid var(--accent-border, var(--border-1))",
            background: "var(--accent-light, var(--surface-2))",
        }, children: [_jsxs("div", { className: "cc-suggested-field-row__header", style: {
                    display: "flex",
                    alignItems: "baseline",
                    gap: "var(--space-2, 0.375rem)",
                }, children: [_jsx("span", { className: "cc-suggested-field-row__label", style: {
                            fontWeight: 600,
                            fontSize: "var(--text-sm, 0.875rem)",
                            color: "var(--text-2)",
                        }, children: label }), model && (_jsxs("span", { className: "cc-suggested-field-row__model", style: {
                            fontSize: "var(--text-xs, 0.75rem)",
                            color: "var(--text-3)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "var(--space-1, 0.25rem)",
                        }, children: [_jsx("span", { "aria-hidden": "true", children: "AI" }), " ", model] })), confidence !== undefined && confTone && (_jsxs("span", { className: "cc-suggested-field-row__confidence", style: {
                            fontSize: "var(--text-xs, 0.75rem)",
                            fontWeight: 600,
                            padding: "0 var(--space-1, 0.25rem)",
                            borderRadius: "var(--radius-1, 4px)",
                            background: confTone.bg,
                            color: confTone.text,
                            border: `1px solid ${confTone.border}`,
                        }, children: [Math.round(confidence * 100), "%"] }))] }), _jsxs("div", { className: "cc-suggested-field-row__values", style: {
                    display: "flex",
                    gap: "var(--space-3, 0.5rem)",
                    alignItems: "baseline",
                    fontSize: "var(--text-sm, 0.875rem)",
                }, children: [currentValue !== undefined && (_jsx("span", { className: "cc-suggested-field-row__current", style: {
                            color: "var(--text-3)",
                            textDecoration: "line-through",
                        }, children: currentValue })), _jsx("span", { className: "cc-suggested-field-row__suggested", style: {
                            fontWeight: 500,
                            color: "var(--text-1)",
                        }, children: suggestedValue })] }), _jsxs("div", { className: "cc-suggested-field-row__actions", style: {
                    display: "flex",
                    gap: "var(--space-2, 0.375rem)",
                    justifyContent: "flex-end",
                }, children: [_jsx("button", { type: "button", className: "cc-suggested-field-row__decline", onClick: onDecline, disabled: disabled, style: {
                            padding: "var(--space-1, 0.25rem) var(--space-3, 0.5rem)",
                            borderRadius: "var(--radius-1, 4px)",
                            border: "1px solid var(--border-1)",
                            background: "transparent",
                            cursor: disabled ? "not-allowed" : "pointer",
                            fontSize: "var(--text-sm, 0.875rem)",
                            opacity: disabled ? 0.5 : 1,
                        }, children: "Decline" }), _jsx("button", { type: "button", className: "cc-suggested-field-row__accept", onClick: () => onAccept(suggestedValue), disabled: disabled, style: {
                            padding: "var(--space-1, 0.25rem) var(--space-3, 0.5rem)",
                            borderRadius: "var(--radius-1, 4px)",
                            border: "1px solid var(--success-border)",
                            background: "var(--success-light)",
                            color: "var(--success-text)",
                            cursor: disabled ? "not-allowed" : "pointer",
                            fontSize: "var(--text-sm, 0.875rem)",
                            fontWeight: 600,
                            opacity: disabled ? 0.5 : 1,
                        }, children: "Accept" })] })] }));
}
//# sourceMappingURL=SuggestedFieldRow.js.map