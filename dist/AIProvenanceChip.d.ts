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
export declare function AIProvenanceChip({ model, confidence, timestamp, confidenceLevel, onClick, variant, externalSource, className, ...rest }: AIProvenanceChipProps): React.ReactElement;
/** Alias for backward-compat import paths. */
export declare const ProvenanceChip: typeof AIProvenanceChip;
//# sourceMappingURL=AIProvenanceChip.d.ts.map