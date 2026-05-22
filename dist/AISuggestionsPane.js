import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AISuggestionsPane — canonical AI-review surface (DS-SIMPLIFY 10).
 *
 * Purely presentational: receives `Suggestion[]` from the caller (AA
 * Orchestrator owns all LLM calls) and emits user decisions + full audit
 * metadata via `onDecision` / `onSubmit`.
 *
 * Features:
 *  - Renders each suggestion with title, rationale, confidence chip
 *  - Apply / Reject / Edit decision buttons per row
 *  - Edit mode shows `renderEditor`; edited value propagates via onDecision
 *  - Submit fires `onSubmit` with the curated set
 *  - Loading / error states
 *  - Full keyboard accessibility (all decisions reachable without mouse)
 *  - §18 audit metadata via `source` prop
 */
import * as React from "react";
function SuggestionRow({ suggestion, renderValue, renderEditor, onDecision, }) {
    const { id, title, rationale, confidence, proposedValue, currentValue, decision } = suggestion;
    const [editDraft, setEditDraft] = React.useState(proposedValue);
    // Reset draft when suggestion changes externally
    React.useEffect(() => {
        setEditDraft(proposedValue);
    }, [proposedValue]);
    const isEditing = decision === "edit";
    const confidenceLabel = confidence != null
        ? `${Math.round(confidence * 100)}%`
        : null;
    const confidenceTone = confidence == null
        ? "neutral"
        : confidence >= 0.8
            ? "success"
            : confidence >= 0.5
                ? "warning"
                : "error";
    function handleApply() {
        onDecision(id, "apply", undefined);
    }
    function handleReject() {
        onDecision(id, "reject", undefined);
    }
    function handleEdit() {
        onDecision(id, "edit", undefined);
    }
    function handleEditConfirm() {
        onDecision(id, "edit", editDraft);
    }
    function handleEditCancel() {
        onDecision(id, null, undefined);
        setEditDraft(proposedValue);
    }
    return (_jsxs("li", { className: [
            "cc-ai-suggestions-pane__row",
            decision ? `cc-ai-suggestions-pane__row--${decision}` : null,
        ]
            .filter(Boolean)
            .join(" "), "data-suggestion-id": id, "data-decision": decision ?? undefined, children: [_jsxs("div", { className: "cc-ai-suggestions-pane__row-header", children: [_jsx("span", { className: "cc-ai-suggestions-pane__row-title", children: title }), confidenceLabel != null && (_jsx("span", { className: `cc-ai-suggestions-pane__confidence cc-ai-suggestions-pane__confidence--${confidenceTone}`, "aria-label": `Confidence: ${confidenceLabel}`, children: confidenceLabel })), decision === "apply" && (_jsx("span", { className: "cc-ai-suggestions-pane__decision-badge cc-ai-suggestions-pane__decision-badge--apply", "aria-label": "Decision: apply", children: "Apply" })), decision === "reject" && (_jsx("span", { className: "cc-ai-suggestions-pane__decision-badge cc-ai-suggestions-pane__decision-badge--reject", "aria-label": "Decision: reject", children: "Reject" })), isEditing && (_jsx("span", { className: "cc-ai-suggestions-pane__decision-badge cc-ai-suggestions-pane__decision-badge--edit", "aria-label": "Decision: editing", children: "Editing" }))] }), rationale && (_jsx("p", { className: "cc-ai-suggestions-pane__rationale", children: rationale })), _jsxs("div", { className: "cc-ai-suggestions-pane__values", children: [currentValue !== undefined && (_jsxs("div", { className: "cc-ai-suggestions-pane__value cc-ai-suggestions-pane__value--current", children: [_jsx("span", { className: "cc-ai-suggestions-pane__value-label", children: "Current" }), renderValue(currentValue)] })), _jsxs("div", { className: "cc-ai-suggestions-pane__value cc-ai-suggestions-pane__value--proposed", children: [_jsx("span", { className: "cc-ai-suggestions-pane__value-label", children: "Proposed" }), isEditing && renderEditor ? (renderEditor(editDraft, setEditDraft)) : (renderValue(proposedValue))] })] }), isEditing ? (_jsxs("div", { className: "cc-ai-suggestions-pane__edit-actions", role: "group", "aria-label": `Edit actions for ${title}`, children: [_jsx("button", { type: "button", className: "cc-ai-suggestions-pane__btn cc-ai-suggestions-pane__btn--confirm", onClick: handleEditConfirm, "aria-label": `Confirm edit for ${title}`, children: "Confirm edit" }), _jsx("button", { type: "button", className: "cc-ai-suggestions-pane__btn cc-ai-suggestions-pane__btn--cancel", onClick: handleEditCancel, "aria-label": `Cancel edit for ${title}`, children: "Cancel" })] })) : (_jsxs("div", { className: "cc-ai-suggestions-pane__actions", role: "group", "aria-label": `Decision buttons for ${title}`, children: [_jsx("button", { type: "button", className: [
                            "cc-ai-suggestions-pane__btn",
                            "cc-ai-suggestions-pane__btn--apply",
                            decision === "apply" ? "cc-ai-suggestions-pane__btn--active" : null,
                        ]
                            .filter(Boolean)
                            .join(" "), onClick: handleApply, "aria-pressed": decision === "apply", "aria-label": `Apply suggestion: ${title}`, children: "Apply" }), _jsx("button", { type: "button", className: [
                            "cc-ai-suggestions-pane__btn",
                            "cc-ai-suggestions-pane__btn--reject",
                            decision === "reject" ? "cc-ai-suggestions-pane__btn--active" : null,
                        ]
                            .filter(Boolean)
                            .join(" "), onClick: handleReject, "aria-pressed": decision === "reject", "aria-label": `Reject suggestion: ${title}`, children: "Reject" }), renderEditor && (_jsx("button", { type: "button", className: "cc-ai-suggestions-pane__btn cc-ai-suggestions-pane__btn--edit", onClick: handleEdit, "aria-label": `Edit suggestion: ${title}`, children: "Edit" }))] }))] }));
}
// ── Main component ────────────────────────────────────────────────────────────
export function AISuggestionsPane({ suggestions, onDecision, onSubmit, renderValue, renderEditor, loading = false, error, source, }) {
    const [submitting, setSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(null);
    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError(null);
        setSubmitting(true);
        try {
            await onSubmit(suggestions);
        }
        catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Submission failed");
        }
        finally {
            setSubmitting(false);
        }
    }
    const decidedCount = suggestions.filter((s) => s.decision != null).length;
    const hasAnyDecision = decidedCount > 0;
    if (loading) {
        return (_jsx("section", { className: "cc-ai-suggestions-pane cc-ai-suggestions-pane--loading", "aria-label": "AI suggestions loading", "aria-busy": "true", children: _jsx("div", { className: "cc-ai-suggestions-pane__loading-state", role: "status", children: _jsx("span", { children: "Loading suggestions\u2026" }) }) }));
    }
    if (error) {
        return (_jsx("section", { className: "cc-ai-suggestions-pane cc-ai-suggestions-pane--error", "aria-label": "AI suggestions error", children: _jsx("div", { className: "cc-ai-suggestions-pane__error-state", role: "alert", children: _jsx("span", { children: error }) }) }));
    }
    if (suggestions.length === 0) {
        return (_jsxs("section", { className: "cc-ai-suggestions-pane cc-ai-suggestions-pane--empty", "aria-label": "AI suggestions", children: [_jsx("div", { className: "cc-ai-suggestions-pane__empty-state", role: "status", children: _jsx("span", { children: "No suggestions available." }) }), _jsx("meta", { "data-ai-source-model": source.model }), source.promptVersion && (_jsx("meta", { "data-ai-source-prompt-version": source.promptVersion }))] }));
    }
    return (_jsx("section", { className: "cc-ai-suggestions-pane", "aria-label": `AI suggestions — ${suggestions.length} item${suggestions.length !== 1 ? "s" : ""}`, "data-ai-source-model": source.model, "data-ai-source-prompt-version": source.promptVersion ?? undefined, children: _jsxs("form", { onSubmit: handleSubmit, noValidate: true, children: [_jsx("ul", { className: "cc-ai-suggestions-pane__list", "aria-label": "Suggestions", children: suggestions.map((s) => (_jsx(SuggestionRow, { suggestion: s, renderValue: renderValue, renderEditor: renderEditor, onDecision: onDecision }, s.id))) }), _jsxs("div", { className: "cc-ai-suggestions-pane__footer", children: [_jsxs("span", { className: "cc-ai-suggestions-pane__summary", "aria-live": "polite", children: [decidedCount, " of ", suggestions.length, " reviewed"] }), (submitError ?? null) && (_jsx("p", { className: "cc-ai-suggestions-pane__submit-error", role: "alert", children: submitError })), _jsx("button", { type: "submit", className: "cc-ai-suggestions-pane__submit", disabled: submitting || !hasAnyDecision, "aria-disabled": submitting || !hasAnyDecision, "aria-label": `Submit ${decidedCount} reviewed suggestion${decidedCount !== 1 ? "s" : ""}`, children: submitting ? "Submitting…" : `Submit (${decidedCount})` })] })] }) }));
}
//# sourceMappingURL=AISuggestionsPane.js.map