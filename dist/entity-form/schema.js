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
export function buildEntitySchema(shape, options) {
    const base = z.object(shape);
    const refined = options?.refine ? options.refine(base) : base;
    return {
        _zodSchema: base,
        _fieldMeta: options?.fieldMeta ?? {},
        _refined: refined,
    };
}
// Module-level bridge singleton — replaced in tests via setOrchestratorBridge().
let _bridge = {
    startReview: async (_agentName, _input) => {
        throw new Error('[EntityForm] No OrchestratorBridge configured. Call setOrchestratorBridge() at app bootstrap.');
    },
};
export function setOrchestratorBridge(bridge) {
    _bridge = bridge;
}
export function getOrchestratorBridge() {
    return _bridge;
}
//# sourceMappingURL=schema.js.map