/**
 * FreshnessPill — FreshnessClass display indicator.
 *
 * Renders a pill showing the freshness class of a data source or connection:
 *   - "online-hot"      — real-time, low-latency data (green)
 *   - "online-standard" — online but standard latency (blue/info)
 *   - "offline"         — data is offline / stale (neutral)
 *
 * Usage:
 *   <FreshnessPill freshnessClass="online-hot" />
 *   <FreshnessPill freshnessClass="offline" label="Batch source" />
 */
import * as React from "react";

export type FreshnessClass = "online-hot" | "online-standard" | "offline";

export interface FreshnessPillProps {
  /** Freshness class — drives colour and dot treatment. */
  freshnessClass: FreshnessClass;
  /** Override the auto-derived label. */
  label?: string;
  /** Size variant. Default: "md". */
  size?: "sm" | "md";
  /** Click handler — makes the pill interactive. */
  onClick?: () => void;
  className?: string;
}

const FRESHNESS_META: Record<
  FreshnessClass,
  { label: string; dotColor: string; tone: string }
> = {
  "online-hot": {
    label: "Online-Hot",
    dotColor: "var(--success-text, #16a34a)",
    tone: "success",
  },
  "online-standard": {
    label: "Online-Standard",
    dotColor: "var(--info-text, #2563eb)",
    tone: "info",
  },
  offline: {
    label: "Offline",
    dotColor: "var(--text-3, #9ca3af)",
    tone: "neutral",
  },
};

export function FreshnessPill({
  freshnessClass,
  label,
  size = "md",
  onClick,
  className,
}: FreshnessPillProps): React.ReactElement {
  const meta = FRESHNESS_META[freshnessClass];
  const interactive = typeof onClick === "function";
  const displayLabel = label ?? meta.label;

  const classes = [
    "cc-freshness-pill",
    `cc-freshness-pill--${freshnessClass}`,
    `cc-freshness-pill--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span
        className="cc-freshness-pill__dot"
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: size === "sm" ? "0.4rem" : "0.5rem",
          height: size === "sm" ? "0.4rem" : "0.5rem",
          borderRadius: "50%",
          background: meta.dotColor,
          flexShrink: 0,
        }}
      />
      <span className="cc-freshness-pill__label">{displayLabel}</span>
    </>
  );

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-1, 0.25rem)",
    padding:
      size === "sm"
        ? "0.1rem 0.4rem"
        : "0.15rem 0.5rem",
    fontSize: size === "sm" ? "0.72rem" : "0.82rem",
    fontWeight: 500,
    borderRadius: "999px",
    border: "1px solid var(--border-1)",
    background: "var(--surface-1)",
    cursor: interactive ? "pointer" : "default",
  };

  if (interactive) {
    return (
      <button type="button" className={classes} onClick={onClick} style={style}>
        {inner}
      </button>
    );
  }

  return (
    <span className={classes} style={style}>
      {inner}
    </span>
  );
}
