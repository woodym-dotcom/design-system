/**
 * ArtefactDetailPane — composable detail pane family for AA artefacts.
 *
 * Composes ExpandableDetailPane (tab shell) + ListView (history/callers/versions)
 * into a single "detail pane for any artefact" abstraction.
 *
 * §14 L1: no artefact detail primitive existed.
 * §14 L2: composes ExpandableDetailPane + ListView already in @ds/core.
 * §14 L3: follows cc-btn / cc-chip token pattern, ListViewColumn shape.
 *
 * Exported types mirror the BE DTOs in com.aa.platform.artefact — keep in sync.
 *
 * Accessibility: inherits ExpandableDetailPane a11y contract (dialog, focus trap,
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
    /** Human-readable name, e.g. "Incident Investigation Process". */
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
     * Produced by the BE from the step graph; displayed read-only.
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
    subjectId?: string;
    subjectType?: string;
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
export interface ArtefactDefinitionProps {
    definition: ArtefactDefinitionDoc;
}
/**
 * Read-only pseudo-code render of an artefact's definition.
 * Shows pre-rules → orchestration steps → post-rules, plus generated
 * procedure text when present.
 */
export declare function ArtefactDefinition({ definition }: ArtefactDefinitionProps): import("react/jsx-runtime").JSX.Element;
export interface ArtefactIOContractProps {
    contract: ArtefactIOContract;
}
/** Input / output / context schema viewer. */
export declare function ArtefactIOContractView({ contract }: ArtefactIOContractProps): import("react/jsx-runtime").JSX.Element;
export interface ArtefactMetricsProps {
    metrics: ArtefactMetrics | null | undefined;
}
/** Metrics tile strip. Renders placeholder when no data available. */
export declare function ArtefactMetricsView({ metrics }: ArtefactMetricsProps): import("react/jsx-runtime").JSX.Element;
export interface ArtefactHistoryProps {
    entries: ArtefactHistoryEntry[];
    /** Total items for pagination. */
    totalItems?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
}
/** Paginated execution/session history list. */
export declare function ArtefactHistory({ entries, totalItems, page, pageSize, onPageChange, }: ArtefactHistoryProps): import("react/jsx-runtime").JSX.Element;
export interface ArtefactCallersProps {
    callers: ArtefactCaller[];
}
/** Version-aware list of callers bound to this artefact. */
export declare function ArtefactCallers({ callers }: ArtefactCallersProps): import("react/jsx-runtime").JSX.Element;
export interface ArtefactVersioningProps {
    versions: ArtefactVersion[];
}
/** Version list with active version pointer. */
export declare function ArtefactVersioning({ versions }: ArtefactVersioningProps): import("react/jsx-runtime").JSX.Element;
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
    history?: ArtefactHistoryProps;
    callers?: ArtefactCaller[];
    versions?: ArtefactVersion[];
}
/**
 * ArtefactDetailPane — the canonical detail pane for any AA artefact.
 *
 * Composes ExpandableDetailPane as the shell with six standard tabs:
 * Definition · IO Contract · Metrics · History · Callers · Versioning.
 *
 * Per-artefact phases (3.2–3.11) mount this component and supply real data;
 * this component itself is data-agnostic — it only renders what it's given.
 */
export declare function ArtefactDetailPane({ open, onClose, title, subtitle, headerActions, definition, ioContract, metrics, history, callers, versions, }: ArtefactDetailPaneProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArtefactDetailPane.d.ts.map