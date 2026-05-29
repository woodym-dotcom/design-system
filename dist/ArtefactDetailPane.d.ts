/**
 * ArtefactDetailPane — composable detail pane family for artefacts.
 *
 * Composes Overlay (placement="detail-right") + inline tab structure
 * into a single "detail pane for any artefact" abstraction.
 *
 * Accessibility: inherits Overlay a11y contract (dialog, focus trap,
 * keyboard navigation, axe-clean). Individual tab content uses semantic HTML.
 */
import * as React from 'react';
/** A single property in an input/output/context schema. */
export interface ArtefactSchemaField {
    name: string;
    type: string;
    required: boolean;
    description?: string;
}
/**
 * The definition document for an artefact — pseudo-code structure,
 * pre-rules, orchestration model text, post-rules, and generated procedure.
 */
export interface ArtefactDefinitionDoc {
    /** Human-readable name. */
    artefactName: string;
    /** Optional namespace / domain qualifier. */
    namespace?: string;
    /** Execution model label, e.g. "AGENT_LOOP", "SYNCHRONOUS". */
    executionModel?: string;
    /** Free-text pre-rules / guardrail lines applied before execution. */
    preRules: string[];
    /** Ordered step descriptions representing the orchestration model. */
    orchestrationSteps: string[];
    /** Free-text post-rules / side-effects applied after execution. */
    postRules: string[];
    /**
     * Auto-generated procedure narrative paragraph.
     * Produced by the backend from the step graph; displayed read-only.
     */
    generatedProcedureText?: string;
}
/** Input / output / context schema for an artefact. */
export interface ArtefactIOContract {
    inputSchema: ArtefactSchemaField[];
    outputSchema: ArtefactSchemaField[];
    contextSchema: ArtefactSchemaField[];
}
/** Aggregate metrics for an artefact. null → no data yet (renders placeholder). */
export interface ArtefactMetrics {
    totalExecutions: number;
    successRate: number;
    p50LatencyMs?: number;
    p99LatencyMs?: number;
    lastExecutedAt?: string;
}
/** One entry in the execution / session history list. */
export interface ArtefactHistoryEntry {
    id: string;
    executedAt: string;
    state: string;
    /** Human-readable label for the row's target (rendered as-is). */
    targetLabel?: string;
    /** Optional href if the target is navigable. */
    targetHref?: string;
    durationMs?: number;
}
/** A caller that binds to this artefact, with version awareness. */
export interface ArtefactCaller {
    id: string;
    name: string;
    callerType: string;
    boundVersion: number | null;
    domain?: string;
}
/** One version entry in the version list. */
export interface ArtefactVersion {
    version: number;
    state: string;
    createdAt: string;
    notes?: string;
    isActive: boolean;
}
interface HistoryViewProps {
    entries: ArtefactHistoryEntry[];
    /** Total items for pagination. */
    totalItems?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
}
export interface ArtefactDetailPaneProps {
    open: boolean;
    onClose: () => void;
    /** Artefact display name shown in the pane title. */
    title: string;
    /** Optional subtitle, e.g. namespace or version badge. */
    subtitle?: string;
    /** Optional actions rendered in the pane header (e.g. Edit, Deprecate). */
    headerActions?: React.ReactNode;
    definition: ArtefactDefinitionDoc;
    ioContract: ArtefactIOContract;
    metrics?: ArtefactMetrics | null;
    history?: HistoryViewProps;
    callers?: ArtefactCaller[];
    versions?: ArtefactVersion[];
}
/**
 * ArtefactDetailPane — the canonical detail pane for any artefact.
 *
 * Composes Overlay (placement="detail-right", expandable) as the shell with
 * six standard tabs:
 * Definition · IO Contract · Metrics · History · Callers · Versioning.
 *
 * The host supplies data; this component is data-agnostic — it only renders
 * what it's given. Sub-views are internal composition; consumers use the
 * single `<ArtefactDetailPane>`.
 */
export declare function ArtefactDetailPane({ open, onClose, title, subtitle, headerActions, definition, ioContract, metrics, history, callers, versions, }: ArtefactDetailPaneProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ArtefactDetailPane.d.ts.map