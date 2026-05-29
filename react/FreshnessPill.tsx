/**
 * FreshnessPill — FreshnessClass display indicator.
 *
 * Renders a pill showing the freshness class of a data source or connection.
 * Composes the `Tag` primitive with `variant="pill"` and a tone-driven dot.
 *
 * Usage:
 *   <FreshnessPill freshnessClass="online-hot" />
 *   <FreshnessPill freshnessClass="offline" label="Batch source" />
 */
import * as React from "react";
import { Tag } from "./Tag";
import type { TagTone, TagSize } from "./Tag";

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

const FRESHNESS_META: Record<FreshnessClass, { label: string; tone: TagTone }> =
  {
    "online-hot": { label: "Online-Hot", tone: "success" },
    "online-standard": { label: "Online-Standard", tone: "info" },
    offline: { label: "Offline", tone: "neutral" },
  };

export function FreshnessPill({
  freshnessClass,
  label,
  size = "md",
  onClick,
  className,
}: FreshnessPillProps): React.ReactElement {
  const meta = FRESHNESS_META[freshnessClass];
  const displayLabel = label ?? meta.label;

  const classes = [
    "cc-freshness-pill",
    `cc-freshness-pill--${freshnessClass}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const tagSize: TagSize = size === "sm" ? "sm" : "md";

  return (
    <Tag
      variant="pill"
      tone={meta.tone}
      size={tagSize}
      dot
      onClick={onClick}
      className={classes}
    >
      {displayLabel}
    </Tag>
  );
}
