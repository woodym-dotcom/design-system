/**
 * EntityForm schema types and buildEntitySchema factory.
 *
 * Uses Zod v4 for validation. Consumers call buildEntitySchema(zodShape, options)
 * to produce an EntitySchema that drives both wizard and edit modes.
 *
 * Decisions from spec §3 + Decisions Log:
 * - AiReviewInput: entityType, entityDraft, contextRefs (not data/context)
 * - AiReviewOutput: summary, suggestions[], questions[], blockers[], finalDraft
 * - 'file' in FieldType union but NO FileUploadField component (OQ-5 resolved)
 * - Flat dot-notation keys for nested paths (OQ-3: simpler for migration)
 */
import { z } from 'zod';
export type FieldType = 'text' | 'number' | 'select' | 'multi-select' | 'date' | 'money' | 'entity-ref' | 'file' | 'rich-text' | string;
export type AsyncValidator = (value: unknown, allValues: Record<string, unknown>) => Promise<string | null>;
export interface FieldMeta {
    label: string;
    hint?: string;
    required?: boolean;
    fieldType?: FieldType;
    asyncValidator?: AsyncValidator;
    /** Field is invisible (but still validated) when predicate returns false. */
    visibleWhen?: (values: Record<string, unknown>) => boolean;
}
export interface EntitySchema<TShape extends z.ZodRawShape> {
    _zodSchema: z.ZodObject<TShape>;
    _fieldMeta: Partial<Record<string, FieldMeta>>;
    /** Optional refinement applied on top of the base schema. */
    _refined: z.ZodTypeAny;
}
export declare function buildEntitySchema<TShape extends z.ZodRawShape>(shape: TShape, options?: {
    fieldMeta?: Partial<Record<string, FieldMeta>>;
    refine?: (schema: z.ZodObject<TShape>) => z.ZodTypeAny;
}): EntitySchema<TShape>;
export interface AiReviewInput {
    entityType: string;
    entityDraft: Record<string, unknown>;
    contextRefs?: Array<Record<string, unknown>>;
}
export interface AiReviewSuggestion {
    field: string;
    suggested: unknown;
    rationale: string;
}
export interface AiReviewQuestion {
    field: string;
    prompt: string;
}
export interface AiReviewBlocker {
    field: string;
    reason: string;
}
export interface AiReviewOutput {
    summary: string;
    suggestions: AiReviewSuggestion[];
    questions: AiReviewQuestion[];
    blockers: AiReviewBlocker[];
    finalDraft: Record<string, unknown>;
}
export interface OrchestratorBridge {
    startReview: (agentName: string, input: AiReviewInput) => Promise<AiReviewOutput>;
}
export declare function setOrchestratorBridge(bridge: OrchestratorBridge): void;
export declare function getOrchestratorBridge(): OrchestratorBridge;
//# sourceMappingURL=schema.d.ts.map