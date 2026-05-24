/**
 * AIProvenanceChip — chip showing AI provenance metadata.
 *
 * Displays model name, confidence score, and timestamp for AI-generated
 * content. Builds on the Chip visual language with provenance-specific
 * semantics (confidence-driven tone, structured tooltip content).
 *
 * Usage:
 *   <AIProvenanceChip model="gpt-4o" confidence={0.92} timestamp={new Date()} />
 */
import * as React from "react";

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

type Tone = "success" | "warning" | "error" | "neutral";

function levelToTone(level: AIProvenanceConfidenceLevel): Tone {
  switch (level) {
    case "high":
      return "success";
    case "medium":
      return "warning";
    case "low":
      return "error";
  }
}

const TONE_STYLES: Record<Tone, { bg: string; border: string; text: string }> =
  {
    success: {
      bg: "var(--success-light)",
      border: "var(--success-border)",
      text: "var(--success-text)",
    },
    warning: {
      bg: "var(--warning-light)",
      border: "var(--warning-border)",
      text: "var(--warning-text)",
    },
    error: {
      bg: "var(--error-light)",
      border: "var(--error-border)",
      text: "var(--error-text)",
    },
    neutral: {
      bg: "var(--surface-2)",
      border: "var(--border-1)",
      text: "var(--text-2)",
    },
  };

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
  const tone: Tone = variant === "read-only" ? "neutral" : level ? levelToTone(level) : "neutral";
  const vars = TONE_STYLES[tone];
  const interactive = variant !== "read-only" && typeof onClick === "function";

  const classes = [
    "cc-ai-provenance-chip",
    `cc-ai-provenance-chip--${tone}`,
    interactive ? "cc-ai-provenance-chip--interactive" : null,
    variant !== "default" ? `cc-ai-provenance-chip--${variant}` : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const variantIcon = variant === "read-only" ? "🔒" : variant === "external-binding" ? "🔗" : "AI";

  const inner = (
    <>
      <span className="cc-ai-provenance-chip__icon" aria-hidden="true">
        {variantIcon}
      </span>
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
    </>
  );

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-2, 0.375rem)",
    padding: "var(--space-1, 0.25rem) var(--space-3, 0.5rem)",
    borderRadius: "999px",
    background: vars.bg,
    border: `1px solid ${vars.border}`,
    color: vars.text,
    fontSize: "var(--text-xs, 0.75rem)",
    fontWeight: 500,
    lineHeight: 1,
    whiteSpace: "nowrap",
    cursor: interactive ? "pointer" : "default",
  };

  if (interactive) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        aria-label={rest["aria-label"]}
        style={style}
      >
        {inner}
      </button>
    );
  }

  return (
    <span className={classes} aria-label={rest["aria-label"]} style={style}>
      {inner}
    </span>
  );
}

/** Alias for backward-compat import paths. */
export const ProvenanceChip = AIProvenanceChip;
