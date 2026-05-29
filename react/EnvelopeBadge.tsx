/**
 * EnvelopeBadge — multi-field chip group for a resolved envelope.
 *
 * Renders a compact horizontal group of `Tag` chips representing
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
import { Tag } from "./Tag";
import type { TagTone, TagSize } from "./Tag";

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

  const tagSize: TagSize = size === "sm" ? "sm" : "md";

  const inner = (
    <>
      {fields.map((field, idx) => (
        <Tag
          key={idx}
          tone={(field.tone ?? "neutral") as TagTone}
          size={tagSize}
          className="cc-envelope-badge__field"
        >
          <span
            className="cc-envelope-badge__label"
            style={{ fontWeight: 600 }}
          >
            {field.label}:
          </span>{" "}
          <span className="cc-envelope-badge__value">{field.value}</span>
        </Tag>
      ))}
    </>
  );

  const groupStyle: React.CSSProperties = {
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
        style={groupStyle}
      >
        {inner}
      </button>
    );
  }

  return (
    <span
      className={classes}
      aria-label={rest["aria-label"] ?? "Envelope details"}
      style={groupStyle}
    >
      {inner}
    </span>
  );
}
