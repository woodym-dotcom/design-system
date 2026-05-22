/**
 * AISuggestionsPane — canonical AI-review surface (DS-SIMPLIFY 10).
 *
 * Purely presentational: receives `Suggestion[]` from the caller (AA
 * Orchestrator owns all LLM calls) and emits user decisions + full audit
 * metadata via `onDecision` / `onSubmit`.
 *
 * Features:
 *  - Renders each suggestion with title, rationale, confidence chip
 *  - Apply / Reject / Edit decision buttons per row
 *  - Edit mode shows `renderEditor`; edited value propagates via onDecision
 *  - Submit fires `onSubmit` with the curated set
 *  - Loading / error states
 *  - Full keyboard accessibility (all decisions reachable without mouse)
 *  - §18 audit metadata via `source` prop
 */
import * as React from "react";
export interface Suggestion<T = unknown> {
    id: string;
    title: string;
    rationale?: string;
    confidence?: number;
    proposedValue: T;
    currentValue?: T;
    decision?: "apply" | "reject" | "edit" | null;
    editedValue?: T;
}
export interface AISuggestionsPaneProps<T = unknown> {
    suggestions: Suggestion<T>[];
    onDecision: (id: string, decision: Suggestion<T>["decision"], editedValue?: T) => void;
    onSubmit: (curated: Suggestion<T>[]) => Promise<void>;
    renderValue: (v: T) => React.ReactNode;
    renderEditor?: (v: T, onChange: (v: T) => void) => React.ReactNode;
    loading?: boolean;
    error?: string;
    /** §18 audit metadata — model + optional prompt version. */
    source: {
        model: string;
        promptVersion?: string;
    };
}
export declare function AISuggestionsPane<T = unknown>({ suggestions, onDecision, onSubmit, renderValue, renderEditor, loading, error, source, }: AISuggestionsPaneProps<T>): React.ReactElement;
//# sourceMappingURL=AISuggestionsPane.d.ts.map