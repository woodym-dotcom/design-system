/**
 * SuggestedFieldRow — DetailRow with AI provenance + inline accept/decline.
 *
 * Extends the DetailRow concept with AI-suggestion semantics: shows a
 * proposed value alongside the current value, with provenance metadata
 * (model, confidence) and inline accept/decline buttons.
 *
 * Usage:
 *   <SuggestedFieldRow
 *     label="Company Name"
 *     currentValue="ACME Corp"
 *     suggestedValue="Acme Corporation Ltd"
 *     model="gpt-4o"
 *     confidence={0.87}
 *     onAccept={(val) => save(val)}
 *     onDecline={() => dismiss()}
 *   />
 */
import * as React from "react";
export interface SuggestedFieldRowProps {
    /** Field label. */
    label: React.ReactNode;
    /** Current (existing) value. */
    currentValue?: React.ReactNode;
    /** AI-suggested replacement value. */
    suggestedValue: React.ReactNode;
    /** Model that produced the suggestion. */
    model?: string;
    /** Confidence score 0..1. */
    confidence?: number;
    /** Called when user accepts the suggestion. Receives the suggestedValue as string if possible. */
    onAccept: (suggestedValue: React.ReactNode) => void;
    /** Called when user declines the suggestion. */
    onDecline: () => void;
    /** Whether buttons should be disabled (e.g. during save). */
    disabled?: boolean;
    /** Render even when suggestedValue matches currentValue. Default: false. */
    showWhenMatch?: boolean;
    className?: string;
}
export declare function SuggestedFieldRow({ label, currentValue, suggestedValue, model, confidence, onAccept, onDecline, disabled, showWhenMatch, className, }: SuggestedFieldRowProps): React.ReactElement | null;
//# sourceMappingURL=SuggestedFieldRow.d.ts.map