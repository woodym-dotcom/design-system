/**
 * Toolbar / PrimaryActionBar — minimal toolbar with variant support.
 *
 * Variants:
 *   - "default"         — standard horizontal action bar.
 *   - "queue-position"  — shows a queue position indicator alongside actions.
 */
import * as React from "react";

export type ToolbarVariant = "default" | "queue-position";

export interface ToolbarAction {
  id: string;
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
}

export interface ToolbarProps {
  /** Visual variant. Default: "default". */
  variant?: ToolbarVariant;
  /** Action buttons rendered in the bar. */
  actions?: ToolbarAction[];
  /** Queue position number (queue-position variant). */
  queuePosition?: number;
  /** Total queue size (queue-position variant). */
  queueTotal?: number;
  /** Leading content slot (e.g. title, breadcrumb). */
  leading?: React.ReactNode;
  /** Trailing content slot (e.g. status indicators). */
  trailing?: React.ReactNode;
  /** ARIA label for the toolbar region. */
  "aria-label"?: string;
  className?: string;
}

export function Toolbar({
  variant = "default",
  actions,
  queuePosition,
  queueTotal,
  leading,
  trailing,
  className,
  ...rest
}: ToolbarProps): React.ReactElement {
  const classes = [
    "cc-toolbar",
    `cc-toolbar--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="toolbar"
      aria-label={rest["aria-label"] ?? "Actions"}
      className={classes}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3, 0.5rem)",
        padding: "var(--space-2, 0.375rem) var(--space-4, 0.75rem)",
        borderBottom: "1px solid var(--border-1)",
        background: "var(--surface-1)",
      }}
    >
      {leading && <div className="cc-toolbar__leading">{leading}</div>}

      {variant === "queue-position" && queuePosition !== undefined && (
        <span
          className="cc-toolbar__queue-position"
          aria-label={`Queue position ${queuePosition}${queueTotal ? ` of ${queueTotal}` : ""}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "var(--text-sm, 0.875rem)",
            fontWeight: 600,
            color: "var(--text-2)",
            padding: "var(--space-1, 0.25rem) var(--space-3, 0.5rem)",
            borderRadius: "var(--radius-1, 4px)",
            background: "var(--surface-2, #f5f5f5)",
          }}
        >
          #{queuePosition}
          {queueTotal !== undefined && (
            <span style={{ fontWeight: 400 }}>/ {queueTotal}</span>
          )}
        </span>
      )}

      {actions && actions.length > 0 && (
        <div className="cc-toolbar__actions" style={{ display: "flex", gap: "var(--space-2, 0.375rem)", marginLeft: "auto" }}>
          {actions.map((action) => {
            const btnVariant = action.variant ?? "ghost";
            return (
              <button
                key={action.id}
                type="button"
                className={`cc-btn cc-btn--${btnVariant} cc-btn--sm`}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon && <span className="cc-btn__icon" aria-hidden="true">{action.icon}</span>}
                {action.label}
              </button>
            );
          })}
        </div>
      )}

      {trailing && <div className="cc-toolbar__trailing" style={{ marginLeft: actions ? undefined : "auto" }}>{trailing}</div>}
    </div>
  );
}
