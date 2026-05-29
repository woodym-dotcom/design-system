import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "./Card.js";
const RISK_TONES = {
    low: {
        bg: "var(--success-light)",
        border: "var(--success-border)",
        text: "var(--success-text)",
        label: "Low",
    },
    medium: {
        bg: "var(--warning-light)",
        border: "var(--warning-border)",
        text: "var(--warning-text)",
        label: "Medium",
    },
    high: {
        bg: "var(--error-light)",
        border: "var(--error-border)",
        text: "var(--error-text)",
        label: "High",
    },
    critical: {
        bg: "var(--error-light)",
        border: "var(--error-border)",
        text: "var(--error-text)",
        label: "Critical",
    },
};
function groupByRisk(entities) {
    const groups = {
        critical: [],
        high: [],
        medium: [],
        low: [],
    };
    for (const e of entities) {
        groups[e.risk].push(e);
    }
    return groups;
}
export function DryRunPanel({ title, description, entities, onConfirm, onCancel, confirmLabel = "Confirm", cancelLabel = "Cancel", confirmDisabled = false, className, }) {
    const groups = groupByRisk(entities);
    const hasHighRisk = groups.critical.length > 0 || groups.high.length > 0;
    const classes = [
        "cc-dry-run-panel",
        hasHighRisk ? "cc-dry-run-panel--danger" : null,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const footerContent = (_jsxs("div", { className: "cc-dry-run-panel__actions", style: {
            display: "flex",
            justifyContent: "flex-end",
            gap: "var(--space-3, 0.5rem)",
        }, children: [_jsx("button", { type: "button", className: "cc-dry-run-panel__cancel", onClick: onCancel, style: {
                    padding: "var(--space-2, 0.375rem) var(--space-4, 0.75rem)",
                    borderRadius: "var(--radius-1, 4px)",
                    border: "1px solid var(--border-1)",
                    background: "transparent",
                    cursor: "pointer",
                    fontWeight: 500,
                }, children: cancelLabel }), _jsx("button", { type: "button", className: "cc-dry-run-panel__confirm", onClick: onConfirm, disabled: confirmDisabled, style: {
                    padding: "var(--space-2, 0.375rem) var(--space-4, 0.75rem)",
                    borderRadius: "var(--radius-1, 4px)",
                    border: `1px solid ${hasHighRisk ? "var(--error-border)" : "var(--accent-border)"}`,
                    background: hasHighRisk ? "var(--error-light)" : "var(--accent-light)",
                    color: hasHighRisk ? "var(--error-text)" : "var(--accent-text)",
                    cursor: confirmDisabled ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    opacity: confirmDisabled ? 0.5 : 1,
                }, children: confirmLabel })] }));
    return (_jsxs(Card, { title: title, subtitle: description, footer: footerContent, padded: true, className: classes, role: "alertdialog", "aria-label": title, children: [_jsx("div", { className: "cc-dry-run-panel__summary", style: {
                    display: "flex",
                    gap: "var(--space-3, 0.5rem)",
                    flexWrap: "wrap",
                }, children: ["critical", "high", "medium", "low"].map((level) => groups[level].length > 0 ? (_jsxs("span", { className: `cc-dry-run-panel__count cc-dry-run-panel__count--${level}`, style: {
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--space-1, 0.25rem)",
                        padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
                        borderRadius: "var(--radius-1, 4px)",
                        background: RISK_TONES[level].bg,
                        color: RISK_TONES[level].text,
                        fontSize: "var(--text-xs, 0.75rem)",
                        fontWeight: 600,
                    }, children: [groups[level].length, " ", RISK_TONES[level].label] }, level)) : null) }), _jsx("ul", { className: "cc-dry-run-panel__entities", style: {
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2, 0.375rem)",
                    maxHeight: "16rem",
                    overflowY: "auto",
                }, children: entities.map((entity) => {
                    const tone = RISK_TONES[entity.risk];
                    return (_jsxs("li", { className: `cc-dry-run-panel__entity cc-dry-run-panel__entity--${entity.risk}`, style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-2, 0.375rem)",
                            padding: "var(--space-2, 0.375rem) var(--space-3, 0.5rem)",
                            borderRadius: "var(--radius-1, 4px)",
                            border: `1px solid ${tone.border}`,
                            background: tone.bg,
                            fontSize: "var(--text-sm, 0.875rem)",
                        }, children: [_jsx("span", { className: "cc-dry-run-panel__entity-risk", style: {
                                    flexShrink: 0,
                                    fontWeight: 600,
                                    color: tone.text,
                                    fontSize: "var(--text-xs, 0.75rem)",
                                    textTransform: "uppercase",
                                }, children: tone.label }), _jsx("span", { className: "cc-dry-run-panel__entity-label", style: { flex: 1 }, children: entity.label }), entity.description && (_jsx("span", { className: "cc-dry-run-panel__entity-desc", style: { color: "var(--text-3)", fontSize: "var(--text-xs, 0.75rem)" }, children: entity.description }))] }, entity.id));
                }) })] }));
}
//# sourceMappingURL=DryRunPanel.js.map