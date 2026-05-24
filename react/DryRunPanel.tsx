/**
 * DryRunPanel — blast-radius preview panel.
 *
 * Shows affected entities grouped by risk level with confirm/cancel actions.
 * Used before destructive or wide-reaching operations to give users a
 * visual preview of what will change and how risky the change is.
 *
 * Usage:
 *   <DryRunPanel
 *     title="Apply policy change"
 *     entities={[
 *       { id: '1', label: 'Acme Corp', risk: 'high' },
 *       { id: '2', label: 'Widget Ltd', risk: 'low' },
 *     ]}
 *     onConfirm={() => apply()}
 *     onCancel={() => dismiss()}
 *   />
 */
import * as React from "react";

export type DryRunRiskLevel = "low" | "medium" | "high" | "critical";

export interface DryRunEntity {
  id: string;
  label: string;
  risk: DryRunRiskLevel;
  /** Optional description of the change for this entity. */
  description?: string;
}

export interface DryRunPanelProps {
  /** Panel heading. */
  title: string;
  /** Description of the operation being previewed. */
  description?: string;
  /** Affected entities with their risk levels. */
  entities: DryRunEntity[];
  /** Called when user confirms the operation. */
  onConfirm: () => void;
  /** Called when user cancels. */
  onCancel: () => void;
  /** Label for the confirm button. Default: "Confirm". */
  confirmLabel?: string;
  /** Label for the cancel button. Default: "Cancel". */
  cancelLabel?: string;
  /** Disable confirm (e.g. while processing). */
  confirmDisabled?: boolean;
  className?: string;
}

const RISK_TONES: Record<
  DryRunRiskLevel,
  { bg: string; border: string; text: string; label: string }
> = {
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

function groupByRisk(
  entities: DryRunEntity[],
): Record<DryRunRiskLevel, DryRunEntity[]> {
  const groups: Record<DryRunRiskLevel, DryRunEntity[]> = {
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

export function DryRunPanel({
  title,
  description,
  entities,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmDisabled = false,
  className,
}: DryRunPanelProps): React.ReactElement {
  const groups = groupByRisk(entities);
  const hasHighRisk = groups.critical.length > 0 || groups.high.length > 0;

  const classes = [
    "cc-dry-run-panel",
    hasHighRisk ? "cc-dry-run-panel--danger" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="alertdialog"
      aria-label={title}
      className={classes}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4, 0.75rem)",
        padding: "var(--space-5, 1rem)",
        borderRadius: "var(--radius-2, 8px)",
        border: `1px solid ${hasHighRisk ? "var(--error-border)" : "var(--border-1)"}`,
        background: "var(--surface-1)",
      }}
    >
      <div className="cc-dry-run-panel__header">
        <h3
          className="cc-dry-run-panel__title"
          style={{
            margin: 0,
            fontSize: "var(--text-lg, 1.125rem)",
            fontWeight: 600,
          }}
        >
          {title}
        </h3>
        {description && (
          <p
            className="cc-dry-run-panel__description"
            style={{
              margin: "var(--space-1, 0.25rem) 0 0",
              fontSize: "var(--text-sm, 0.875rem)",
              color: "var(--text-3)",
            }}
          >
            {description}
          </p>
        )}
      </div>

      <div
        className="cc-dry-run-panel__summary"
        style={{
          display: "flex",
          gap: "var(--space-3, 0.5rem)",
          flexWrap: "wrap",
        }}
      >
        {(
          ["critical", "high", "medium", "low"] as const
        ).map((level) =>
          groups[level].length > 0 ? (
            <span
              key={level}
              className={`cc-dry-run-panel__count cc-dry-run-panel__count--${level}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-1, 0.25rem)",
                padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
                borderRadius: "var(--radius-1, 4px)",
                background: RISK_TONES[level].bg,
                color: RISK_TONES[level].text,
                fontSize: "var(--text-xs, 0.75rem)",
                fontWeight: 600,
              }}
            >
              {groups[level].length} {RISK_TONES[level].label}
            </span>
          ) : null,
        )}
      </div>

      <ul
        className="cc-dry-run-panel__entities"
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2, 0.375rem)",
          maxHeight: "16rem",
          overflowY: "auto",
        }}
      >
        {entities.map((entity) => {
          const tone = RISK_TONES[entity.risk];
          return (
            <li
              key={entity.id}
              className={`cc-dry-run-panel__entity cc-dry-run-panel__entity--${entity.risk}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2, 0.375rem)",
                padding: "var(--space-2, 0.375rem) var(--space-3, 0.5rem)",
                borderRadius: "var(--radius-1, 4px)",
                border: `1px solid ${tone.border}`,
                background: tone.bg,
                fontSize: "var(--text-sm, 0.875rem)",
              }}
            >
              <span
                className="cc-dry-run-panel__entity-risk"
                style={{
                  flexShrink: 0,
                  fontWeight: 600,
                  color: tone.text,
                  fontSize: "var(--text-xs, 0.75rem)",
                  textTransform: "uppercase",
                }}
              >
                {tone.label}
              </span>
              <span className="cc-dry-run-panel__entity-label" style={{ flex: 1 }}>
                {entity.label}
              </span>
              {entity.description && (
                <span
                  className="cc-dry-run-panel__entity-desc"
                  style={{ color: "var(--text-3)", fontSize: "var(--text-xs, 0.75rem)" }}
                >
                  {entity.description}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div
        className="cc-dry-run-panel__actions"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "var(--space-3, 0.5rem)",
          paddingTop: "var(--space-3, 0.5rem)",
          borderTop: "1px solid var(--border-1)",
        }}
      >
        <button
          type="button"
          className="cc-dry-run-panel__cancel"
          onClick={onCancel}
          style={{
            padding: "var(--space-2, 0.375rem) var(--space-4, 0.75rem)",
            borderRadius: "var(--radius-1, 4px)",
            border: "1px solid var(--border-1)",
            background: "transparent",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="cc-dry-run-panel__confirm"
          onClick={onConfirm}
          disabled={confirmDisabled}
          style={{
            padding: "var(--space-2, 0.375rem) var(--space-4, 0.75rem)",
            borderRadius: "var(--radius-1, 4px)",
            border: `1px solid ${hasHighRisk ? "var(--error-border)" : "var(--accent-border)"}`,
            background: hasHighRisk ? "var(--error-light)" : "var(--accent-light)",
            color: hasHighRisk ? "var(--error-text)" : "var(--accent-text)",
            cursor: confirmDisabled ? "not-allowed" : "pointer",
            fontWeight: 600,
            opacity: confirmDisabled ? 0.5 : 1,
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
