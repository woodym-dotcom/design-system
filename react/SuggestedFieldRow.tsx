/**
 * SuggestedFieldRow — DetailRow with AI provenance + inline accept/decline.
 *
 * Extends the DetailRow concept with AI-suggestion semantics: shows a
 * proposed value alongside the current value, with provenance metadata
 * (model, confidence) and inline accept/decline buttons.
 *
 * Usage:
 *   <SuggestedFieldRow
 *     label="Company Name"
 *     currentValue="ACME Corp"
 *     suggestedValue="Acme Corporation Ltd"
 *     model="gpt-4o"
 *     confidence={0.87}
 *     onAccept={(val) => save(val)}
 *     onDecline={() => dismiss()}
 *   />
 */
import * as React from "react";

export interface SuggestedFieldRowProps {
  /** Field label. */
  label: React.ReactNode;
  /** Current (existing) value. */
  currentValue?: React.ReactNode;
  /** AI-suggested replacement value. */
  suggestedValue: React.ReactNode;
  /** Model that produced the suggestion. */
  model?: string;
  /** Confidence score 0..1. */
  confidence?: number;
  /** Called when user accepts the suggestion. Receives the suggestedValue as string if possible. */
  onAccept: (suggestedValue: React.ReactNode) => void;
  /** Called when user declines the suggestion. */
  onDecline: () => void;
  /** Whether buttons should be disabled (e.g. during save). */
  disabled?: boolean;
  /** Render even when suggestedValue matches currentValue. Default: false. */
  showWhenMatch?: boolean;
  className?: string;
}

function confidenceTone(
  c: number,
): { bg: string; text: string; border: string } {
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

export function SuggestedFieldRow({
  label,
  currentValue,
  suggestedValue,
  model,
  confidence,
  onAccept,
  onDecline,
  disabled = false,
  showWhenMatch = false,
  className,
}: SuggestedFieldRowProps): React.ReactElement | null {
  // Skip rendering if suggested matches current (unless explicitly requested).
  if (
    !showWhenMatch &&
    currentValue !== undefined &&
    currentValue === suggestedValue
  ) {
    return null;
  }

  const confTone = confidence !== undefined ? confidenceTone(confidence) : null;

  const classes = ["cc-suggested-field-row", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2, 0.375rem)",
        padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
        borderRadius: "var(--radius-1, 4px)",
        border: "1px solid var(--accent-border, var(--border-1))",
        background: "var(--accent-light, var(--surface-2))",
      }}
    >
      {/* Label + provenance row */}
      <div
        className="cc-suggested-field-row__header"
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "var(--space-2, 0.375rem)",
        }}
      >
        <span
          className="cc-suggested-field-row__label"
          style={{
            fontWeight: 600,
            fontSize: "var(--text-sm, 0.875rem)",
            color: "var(--text-2)",
          }}
        >
          {label}
        </span>

        {model && (
          <span
            className="cc-suggested-field-row__model"
            style={{
              fontSize: "var(--text-xs, 0.75rem)",
              color: "var(--text-3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-1, 0.25rem)",
            }}
          >
            <span aria-hidden="true">AI</span> {model}
          </span>
        )}

        {confidence !== undefined && confTone && (
          <span
            className="cc-suggested-field-row__confidence"
            style={{
              fontSize: "var(--text-xs, 0.75rem)",
              fontWeight: 600,
              padding: "0 var(--space-1, 0.25rem)",
              borderRadius: "var(--radius-1, 4px)",
              background: confTone.bg,
              color: confTone.text,
              border: `1px solid ${confTone.border}`,
            }}
          >
            {Math.round(confidence * 100)}%
          </span>
        )}
      </div>

      {/* Values */}
      <div
        className="cc-suggested-field-row__values"
        style={{
          display: "flex",
          gap: "var(--space-3, 0.5rem)",
          alignItems: "baseline",
          fontSize: "var(--text-sm, 0.875rem)",
        }}
      >
        {currentValue !== undefined && (
          <span
            className="cc-suggested-field-row__current"
            style={{
              color: "var(--text-3)",
              textDecoration: "line-through",
            }}
          >
            {currentValue}
          </span>
        )}
        <span
          className="cc-suggested-field-row__suggested"
          style={{
            fontWeight: 500,
            color: "var(--text-1)",
          }}
        >
          {suggestedValue}
        </span>
      </div>

      {/* Actions */}
      <div
        className="cc-suggested-field-row__actions"
        style={{
          display: "flex",
          gap: "var(--space-2, 0.375rem)",
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          className="cc-suggested-field-row__decline"
          onClick={onDecline}
          disabled={disabled}
          style={{
            padding: "var(--space-1, 0.25rem) var(--space-3, 0.5rem)",
            borderRadius: "var(--radius-1, 4px)",
            border: "1px solid var(--border-1)",
            background: "transparent",
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: "var(--text-sm, 0.875rem)",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          Decline
        </button>
        <button
          type="button"
          className="cc-suggested-field-row__accept"
          onClick={() => onAccept(suggestedValue)}
          disabled={disabled}
          style={{
            padding: "var(--space-1, 0.25rem) var(--space-3, 0.5rem)",
            borderRadius: "var(--radius-1, 4px)",
            border: "1px solid var(--success-border)",
            background: "var(--success-light)",
            color: "var(--success-text)",
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: "var(--text-sm, 0.875rem)",
            fontWeight: 600,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
