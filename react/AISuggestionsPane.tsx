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

// ── Public types ──────────────────────────────────────────────────────────────

export interface Suggestion<T = unknown> {
  id: string;
  title: string;
  rationale?: string;
  confidence?: number;
  proposedValue: T;
  currentValue?: T;
  decision?: "apply" | "reject" | "edit" | null;
  editedValue?: T;
}

export interface AISuggestionsPaneProps<T = unknown> {
  suggestions: Suggestion<T>[];
  onDecision: (
    id: string,
    decision: Suggestion<T>["decision"],
    editedValue?: T,
  ) => void;
  onSubmit: (curated: Suggestion<T>[]) => Promise<void>;
  renderValue: (v: T) => React.ReactNode;
  renderEditor?: (v: T, onChange: (v: T) => void) => React.ReactNode;
  loading?: boolean;
  error?: string;
  /** §18 audit metadata — model + optional prompt version. */
  source: { model: string; promptVersion?: string };
}

// ── Internal sub-components ───────────────────────────────────────────────────

interface SuggestionRowProps<T> {
  suggestion: Suggestion<T>;
  renderValue: (v: T) => React.ReactNode;
  renderEditor?: (v: T, onChange: (v: T) => void) => React.ReactNode;
  onDecision: (
    id: string,
    decision: Suggestion<T>["decision"],
    editedValue?: T,
  ) => void;
}

function SuggestionRow<T>({
  suggestion,
  renderValue,
  renderEditor,
  onDecision,
}: SuggestionRowProps<T>): React.ReactElement {
  const { id, title, rationale, confidence, proposedValue, currentValue, decision } = suggestion;

  const [editDraft, setEditDraft] = React.useState<T>(proposedValue);

  // Reset draft when suggestion changes externally
  React.useEffect(() => {
    setEditDraft(proposedValue);
  }, [proposedValue]);

  const isEditing = decision === "edit";

  const confidenceLabel =
    confidence != null
      ? `${Math.round(confidence * 100)}%`
      : null;

  const confidenceTone =
    confidence == null
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

  return (
    <li
      className={[
        "cc-ai-suggestions-pane__row",
        decision ? `cc-ai-suggestions-pane__row--${decision}` : null,
      ]
        .filter(Boolean)
        .join(" ")}
      data-suggestion-id={id}
      data-decision={decision ?? undefined}
    >
      <div className="cc-ai-suggestions-pane__row-header">
        <span className="cc-ai-suggestions-pane__row-title">{title}</span>
        {confidenceLabel != null && (
          <span
            className={`cc-ai-suggestions-pane__confidence cc-ai-suggestions-pane__confidence--${confidenceTone}`}
            aria-label={`Confidence: ${confidenceLabel}`}
          >
            {confidenceLabel}
          </span>
        )}
        {decision === "apply" && (
          <span
            className="cc-ai-suggestions-pane__decision-badge cc-ai-suggestions-pane__decision-badge--apply"
            aria-label="Decision: apply"
          >
            Apply
          </span>
        )}
        {decision === "reject" && (
          <span
            className="cc-ai-suggestions-pane__decision-badge cc-ai-suggestions-pane__decision-badge--reject"
            aria-label="Decision: reject"
          >
            Reject
          </span>
        )}
        {isEditing && (
          <span
            className="cc-ai-suggestions-pane__decision-badge cc-ai-suggestions-pane__decision-badge--edit"
            aria-label="Decision: editing"
          >
            Editing
          </span>
        )}
      </div>

      {rationale && (
        <p className="cc-ai-suggestions-pane__rationale">{rationale}</p>
      )}

      <div className="cc-ai-suggestions-pane__values">
        {currentValue !== undefined && (
          <div className="cc-ai-suggestions-pane__value cc-ai-suggestions-pane__value--current">
            <span className="cc-ai-suggestions-pane__value-label">Current</span>
            {renderValue(currentValue)}
          </div>
        )}
        <div className="cc-ai-suggestions-pane__value cc-ai-suggestions-pane__value--proposed">
          <span className="cc-ai-suggestions-pane__value-label">Proposed</span>
          {isEditing && renderEditor ? (
            renderEditor(editDraft, setEditDraft)
          ) : (
            renderValue(proposedValue)
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="cc-ai-suggestions-pane__edit-actions" role="group" aria-label={`Edit actions for ${title}`}>
          <button
            type="button"
            className="cc-ai-suggestions-pane__btn cc-ai-suggestions-pane__btn--confirm"
            onClick={handleEditConfirm}
            aria-label={`Confirm edit for ${title}`}
          >
            Confirm edit
          </button>
          <button
            type="button"
            className="cc-ai-suggestions-pane__btn cc-ai-suggestions-pane__btn--cancel"
            onClick={handleEditCancel}
            aria-label={`Cancel edit for ${title}`}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="cc-ai-suggestions-pane__actions" role="group" aria-label={`Decision buttons for ${title}`}>
          <button
            type="button"
            className={[
              "cc-ai-suggestions-pane__btn",
              "cc-ai-suggestions-pane__btn--apply",
              decision === "apply" ? "cc-ai-suggestions-pane__btn--active" : null,
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={handleApply}
            aria-pressed={decision === "apply"}
            aria-label={`Apply suggestion: ${title}`}
          >
            Apply
          </button>
          <button
            type="button"
            className={[
              "cc-ai-suggestions-pane__btn",
              "cc-ai-suggestions-pane__btn--reject",
              decision === "reject" ? "cc-ai-suggestions-pane__btn--active" : null,
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={handleReject}
            aria-pressed={decision === "reject"}
            aria-label={`Reject suggestion: ${title}`}
          >
            Reject
          </button>
          {renderEditor && (
            <button
              type="button"
              className="cc-ai-suggestions-pane__btn cc-ai-suggestions-pane__btn--edit"
              onClick={handleEdit}
              aria-label={`Edit suggestion: ${title}`}
            >
              Edit
            </button>
          )}
        </div>
      )}
    </li>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AISuggestionsPane<T = unknown>({
  suggestions,
  onDecision,
  onSubmit,
  renderValue,
  renderEditor,
  loading = false,
  error,
  source,
}: AISuggestionsPaneProps<T>): React.ReactElement {
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      await onSubmit(suggestions);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Submission failed",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const decidedCount = suggestions.filter((s) => s.decision != null).length;
  const hasAnyDecision = decidedCount > 0;

  if (loading) {
    return (
      <section
        className="cc-ai-suggestions-pane cc-ai-suggestions-pane--loading"
        aria-label="AI suggestions loading"
        aria-busy="true"
      >
        <div className="cc-ai-suggestions-pane__loading-state" role="status">
          <span>Loading suggestions…</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="cc-ai-suggestions-pane cc-ai-suggestions-pane--error"
        aria-label="AI suggestions error"
      >
        <div className="cc-ai-suggestions-pane__error-state" role="alert">
          <span>{error}</span>
        </div>
      </section>
    );
  }

  if (suggestions.length === 0) {
    return (
      <section
        className="cc-ai-suggestions-pane cc-ai-suggestions-pane--empty"
        aria-label="AI suggestions"
      >
        <div className="cc-ai-suggestions-pane__empty-state" role="status">
          <span>No suggestions available.</span>
        </div>
        {/* §18 audit metadata hidden from visual rendering */}
        <meta data-ai-source-model={source.model} />
        {source.promptVersion && (
          <meta data-ai-source-prompt-version={source.promptVersion} />
        )}
      </section>
    );
  }

  return (
    <section
      className="cc-ai-suggestions-pane"
      aria-label={`AI suggestions — ${suggestions.length} item${suggestions.length !== 1 ? "s" : ""}`}
      data-ai-source-model={source.model}
      data-ai-source-prompt-version={source.promptVersion ?? undefined}
    >
      <form onSubmit={handleSubmit} noValidate>
        <ul
          className="cc-ai-suggestions-pane__list"
          aria-label="Suggestions"
        >
          {suggestions.map((s) => (
            <SuggestionRow<T>
              key={s.id}
              suggestion={s}
              renderValue={renderValue}
              renderEditor={renderEditor}
              onDecision={onDecision}
            />
          ))}
        </ul>

        <div className="cc-ai-suggestions-pane__footer">
          <span className="cc-ai-suggestions-pane__summary" aria-live="polite">
            {decidedCount} of {suggestions.length} reviewed
          </span>

          {(submitError ?? null) && (
            <p
              className="cc-ai-suggestions-pane__submit-error"
              role="alert"
            >
              {submitError}
            </p>
          )}

          <button
            type="submit"
            className="cc-ai-suggestions-pane__submit"
            disabled={submitting || !hasAnyDecision}
            aria-disabled={submitting || !hasAnyDecision}
            aria-label={`Submit ${decidedCount} reviewed suggestion${decidedCount !== 1 ? "s" : ""}`}
          >
            {submitting ? "Submitting…" : `Submit (${decidedCount})`}
          </button>
        </div>
      </form>
    </section>
  );
}
