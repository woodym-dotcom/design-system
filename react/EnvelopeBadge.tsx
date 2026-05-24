/**
 * EnvelopeBadge — multi-field chip group for a resolved envelope.
 *
 * Renders a compact horizontal group of label-value pairs representing
 * the fields of a resolved envelope (e.g. name, DOB, address, ID number).
 *
 * Usage:
 *   <EnvelopeBadge
 *     fields={[
 *       { label: "Name", value: "John Doe" },
 *       { label: "DOB", value: "1990-01-15" },
 *       { label: "ID", value: "ABC-123" },
 *     ]}
 *   />
 */
import * as React from "react";

export interface EnvelopeBadgeField {
  label: string;
  value: string;
  /** Optional tone for this field's chip. */
  tone?: "neutral" | "success" | "warning" | "error" | "info";
}

export interface EnvelopeBadgeProps {
  /** Fields to display in the envelope chip group. */
  fields: EnvelopeBadgeField[];
  /** Size variant. Default: "md". */
  size?: "sm" | "md";
  /** Click handler — makes the entire badge interactive. */
  onClick?: () => void;
  /** Accessible label for the group. */
  "aria-label"?: string;
  className?: string;
}

export function EnvelopeBadge({
  fields,
  size = "md",
  onClick,
  className,
  ...rest
}: EnvelopeBadgeProps): React.ReactElement {
  const interactive = typeof onClick === "function";
  const classes = [
    "cc-envelope-badge",
    `cc-envelope-badge--${size}`,
    interactive ? "cc-envelope-badge--interactive" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {fields.map((field, idx) => (
        <span
          key={idx}
          className={[
            "cc-envelope-badge__field",
            field.tone ? `cc-envelope-badge__field--${field.tone}` : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "0.2rem",
            padding:
              size === "sm"
                ? "0.1rem 0.35rem"
                : "0.15rem 0.5rem",
            fontSize: size === "sm" ? "0.7rem" : "0.78rem",
            borderRadius: "var(--radius-1, 4px)",
            background: "var(--surface-2, #f5f5f5)",
            border: "1px solid var(--border-1)",
          }}
        >
          <span
            className="cc-envelope-badge__label"
            style={{ fontWeight: 600, color: "var(--text-2)" }}
          >
            {field.label}:
          </span>
          <span
            className="cc-envelope-badge__value"
            style={{ color: "var(--text-1)" }}
          >
            {field.value}
          </span>
        </span>
      ))}
    </>
  );

  const style: React.CSSProperties = {
    display: "inline-flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "var(--space-1, 0.25rem)",
    cursor: interactive ? "pointer" : "default",
  };

  if (interactive) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        aria-label={rest["aria-label"] ?? "Envelope details"}
        style={style}
      >
        {inner}
      </button>
    );
  }

  return (
    <span
      className={classes}
      aria-label={rest["aria-label"] ?? "Envelope details"}
      style={style}
    >
      {inner}
    </span>
  );
}
