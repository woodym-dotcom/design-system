/**
 * AIProvenanceChip — chip showing AI provenance metadata.
 *
 * Displays model name, confidence score, and timestamp for AI-generated
 * content. Composes the `Tag` primitive with provenance-specific
 * semantics (confidence-driven tone, structured tooltip content).
 *
 * Usage:
 *   <AIProvenanceChip model="gpt-4o" confidence={0.92} timestamp={new Date()} />
 */
import * as React from "react";
import { Tag } from "./Tag";
import type { TagTone } from "./Tag";

export type AIProvenanceConfidenceLevel = "high" | "medium" | "low";

/** Provenance chip variant — extends base display with read-only and external-binding modes. */
export type AIProvenanceVariant = "default" | "read-only" | "external-binding";

export interface AIProvenanceChipProps {
  /** Model identifier, e.g. "gpt-4o", "claude-opus-4-7". */
  model: string;
  /** Confidence score 0..1. Drives tone: >=0.8 success, >=0.5 warning, <0.5 error. */
  confidence?: number;
  /** When the inference was produced. */
  timestamp?: Date | string;
  /** Override the auto-derived confidence level. */
  confidenceLevel?: AIProvenanceConfidenceLevel;
  /** Click handler — makes the chip interactive (renders as button). */
  onClick?: () => void;
  /** Accessible label override. */
  "aria-label"?: string;
  /**
   * Variant.
   *   - "default"          — standard interactive/read display.
   *   - "read-only"        — renders with a lock icon and no interaction.
   *   - "external-binding" — renders with a link icon indicating external source provenance.
   */
  variant?: AIProvenanceVariant;
  /** External source name — displayed when variant is "external-binding". */
  externalSource?: string;
  className?: string;
}

function deriveConfidenceLevel(score: number): AIProvenanceConfidenceLevel {
  if (score >= 0.8) return "high";
  if (score >= 0.5) return "medium";
  return "low";
}

function levelToTone(level: AIProvenanceConfidenceLevel): TagTone {
  switch (level) {
    case "high":
      return "success";
    case "medium":
      return "warning";
    case "low":
      return "error";
  }
}

function formatTimestamp(ts: Date | string): string {
  const d = typeof ts === "string" ? new Date(ts) : ts;
  return d.toLocaleString();
}

export function AIProvenanceChip({
  model,
  confidence,
  timestamp,
  confidenceLevel,
  onClick,
  variant = "default",
  externalSource,
  className,
  ...rest
}: AIProvenanceChipProps): React.ReactElement {
  const level =
    confidenceLevel ??
    (confidence !== undefined ? deriveConfidenceLevel(confidence) : undefined);
  const tone: TagTone = variant === "read-only" ? "neutral" : level ? levelToTone(level) : "neutral";
  const interactive = variant !== "read-only" && typeof onClick === "function";

  const variantIcon = variant === "read-only" ? "🔒" : variant === "external-binding" ? "🔗" : "AI";

  const classes = [
    "cc-ai-provenance-chip",
    variant !== "default" ? `cc-ai-provenance-chip--${variant}` : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      tone={tone}
      icon={<>{variantIcon}</>}
      onClick={interactive ? onClick : undefined}
      aria-label={rest["aria-label"]}
      className={classes}
    >
      <span className="cc-ai-provenance-chip__model">{model}</span>
      {variant === "external-binding" && externalSource && (
        <span className="cc-ai-provenance-chip__external-source">
          {externalSource}
        </span>
      )}
      {confidence !== undefined && (
        <span className="cc-ai-provenance-chip__confidence">
          {Math.round(confidence * 100)}%
        </span>
      )}
      {timestamp && (
        <span className="cc-ai-provenance-chip__timestamp">
          {formatTimestamp(timestamp)}
        </span>
      )}
    </Tag>
  );
}

/** Alias for backward-compat import paths. */
export const ProvenanceChip = AIProvenanceChip;
