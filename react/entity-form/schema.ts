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

// ── Field types ──────────────────────────────────────────────────────────────

export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multi-select'
  | 'date'
  | 'money'
  | 'entity-ref'
  | 'file'        // union-only; no component in v1 (OQ-5)
  | 'rich-text'
  | string;       // custom registered types

// ── Async validator ──────────────────────────────────────────────────────────

export type AsyncValidator = (
  value: unknown,
  allValues: Record<string, unknown>,
) => Promise<string | null>;

// ── Field metadata ───────────────────────────────────────────────────────────

export interface FieldMeta {
  label: string;
  hint?: string;
  required?: boolean;
  fieldType?: FieldType;
  asyncValidator?: AsyncValidator;
  /** Field is invisible (but still validated) when predicate returns false. */
  visibleWhen?: (values: Record<string, unknown>) => boolean;
}

// ── EntitySchema ─────────────────────────────────────────────────────────────

export interface EntitySchema<TShape extends z.ZodRawShape> {
  _zodSchema: z.ZodObject<TShape>;
  _fieldMeta: Partial<Record<string, FieldMeta>>;
  /** Optional refinement applied on top of the base schema. */
  _refined: z.ZodTypeAny;
}

export function buildEntitySchema<TShape extends z.ZodRawShape>(
  shape: TShape,
  options?: {
    fieldMeta?: Partial<Record<string, FieldMeta>>;
    refine?: (schema: z.ZodObject<TShape>) => z.ZodTypeAny;
  },
): EntitySchema<TShape> {
  const base = z.object(shape);
  const refined = options?.refine ? options.refine(base) : base;
  return {
    _zodSchema: base,
    _fieldMeta: options?.fieldMeta ?? {},
    _refined: refined,
  };
}

// ── AI-review types (Decisions Log corrections) ──────────────────────────────

export interface AiReviewInput {
  entityType: string;                           // PascalCase domain name
  entityDraft: Record<string, unknown>;         // user-authored draft values
  contextRefs?: Array<Record<string, unknown>>; // optional context refs
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

// ── Orchestrator bridge ──────────────────────────────────────────────────────

export interface OrchestratorBridge {
  startReview: (agentName: string, input: AiReviewInput) => Promise<AiReviewOutput>;
}

// Module-level bridge singleton — replaced in tests via setOrchestratorBridge().
let _bridge: OrchestratorBridge = {
  startReview: async (_agentName, _input) => {
    throw new Error(
      '[EntityForm] No OrchestratorBridge configured. Call setOrchestratorBridge() at app bootstrap.',
    );
  },
};

export function setOrchestratorBridge(bridge: OrchestratorBridge): void {
  _bridge = bridge;
}

export function getOrchestratorBridge(): OrchestratorBridge {
  return _bridge;
}
