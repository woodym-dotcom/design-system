/**
 * Toolbar / PrimaryActionBar — minimal toolbar with variant + mode support.
 *
 * Variants:
 *   - "default"         — standard horizontal action bar.
 *   - "queue-position"  — shows a queue position indicator alongside actions.
 *
 * Modes:
 *   - "default" (default) — standard toolbar appearance.
 *   - "bulk" — sticky bottom (or top) bar that surfaces when a list has a
 *     non-zero selection. Subsumes the legacy `BulkBar` primitive. Pair with
 *     `useMultiSelect`. Renders nothing when `selectedCount === 0`.
 */
import * as React from "react";

export type ToolbarVariant = "default" | "queue-position";
export type ToolbarMode = "default" | "bulk";
export type ToolbarBulkPosition = "bottom" | "top";

export interface ToolbarAction {
  id: string;
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
  /** bulk mode tone alias for `variant`. Accepts "default" | "primary" | "danger". */
  tone?: "default" | "primary" | "danger";
}

export interface ToolbarProps {
  /** Visual variant. Default: "default". */
  variant?: ToolbarVariant;
  /**
   * Toolbar mode.
   *  - "default" (default): renders as a standard toolbar.
   *  - "bulk": renders only when `selectedCount > 0`; styled as a sticky bulk
   *    action bar with selection count + clear control. Subsumes BulkBar.
   */
  mode?: ToolbarMode;
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
  /** bulk-mode: number of items currently selected. Hidden when 0. */
  selectedCount?: number;
  /** bulk-mode: called when the user clicks the clear-selection control. */
  onClear?: () => void;
  /** bulk-mode: optional meta rendered next to the count. */
  meta?: React.ReactNode;
  /** bulk-mode: sticky position. Default 'bottom'. */
  position?: ToolbarBulkPosition;
  /** ARIA label for the toolbar region. */
  "aria-label"?: string;
  className?: string;
}

export function Toolbar({
  variant = "default",
  mode = "default",
  actions,
  queuePosition,
  queueTotal,
  leading,
  trailing,
  selectedCount,
  onClear,
  meta,
  position = "bottom",
  className,
  ...rest
}: ToolbarProps): React.ReactElement | null {
  // ── Bulk mode (subsumes BulkBar) ─────────────────────────────────────────
  if (mode === "bulk") {
    const count = selectedCount ?? 0;
    if (count === 0) return null;
    return (
      <div
        className={["cc-bulkbar", `cc-bulkbar--${position}`, className]
          .filter(Boolean)
          .join(" ")}
        role="region"
        aria-label={rest["aria-label"] ?? `${count} item${count === 1 ? "" : "s"} selected`}
      >
        <div className="cc-bulkbar__summary">
          <span className="cc-bulkbar__count">{count} selected</span>
          {meta && <span className="cc-bulkbar__meta">{meta}</span>}
          {onClear ? (
            <button
              type="button"
              className="cc-bulkbar__clear"
              onClick={onClear}
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="cc-bulkbar__actions">
          {(actions ?? []).map((a) => {
            const tone = a.tone ?? a.variant ?? "default";
            return (
              <button
                key={a.id}
                type="button"
                className={`cc-bulkbar__action cc-bulkbar__action--${tone}`}
                onClick={a.onClick}
                disabled={a.disabled}
              >
                {a.icon && (
                  <span className="cc-bulkbar__action-icon" aria-hidden="true">
                    {a.icon}
                  </span>
                )}
                {a.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Default toolbar mode ─────────────────────────────────────────────────
  const classes = ["cc-toolbar", `cc-toolbar--${variant}`, className]
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
