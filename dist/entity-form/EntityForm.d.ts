/**
 * <EntityForm> — unified wizard + edit form primitive (G3).
 *
 * Design C from the spec: Zod schema + step slots + field-primitive kit.
 * One schema drives both wizard mode (multi-step creation) and edit mode
 * (single-page edit). Consumers own layout; the primitive owns validation
 * lifecycle, step navigation, AI-review orchestration, and G4 stability.
 *
 * AI-review: calls getOrchestratorBridge().startReview(agentName, input).
 * No provider SDK imported (CLAUDE.md §18). Bridge is stubbed in tests via
 * setOrchestratorBridge().
 *
 * Decisions Log corrections applied:
 * - Process name: creation-wizard-review.v1
 * - AiReviewInput: entityType, entityDraft, contextRefs[]
 * - AiReviewOutput: summary, suggestions[], questions[], blockers[], finalDraft
 */
import * as React from 'react';
import { z } from 'zod';
import { type EntityFormHandle } from './useEntityForm';
import { type EntitySchema, type AiReviewInput } from './schema';
export interface WizardStepDef<TValues> {
    id: string;
    label: string;
    fields: Array<string>;
    render: (ctx: WizardStepRenderCtx<TValues>) => React.ReactNode;
    /**
     * Optional async hook called after field validation passes and before the
     * wizard advances. Return false (or throw) to block advance with an optional
     * banner reason. Use for per-step API saves (e.g. createDraftCompany).
     */
    onBeforeAdvance?: (values: TValues) => Promise<boolean | string>;
}
export interface WizardStepRenderCtx<TValues> {
    form: EntityFormHandle<TValues>;
    blockAdvance: (reason?: string) => void;
}
export interface AiReviewConfig<TValues> {
    agentName: string;
    buildInput: (values: TValues) => AiReviewInput;
    label?: string;
    blockOnError?: boolean;
}
type BaseProps<S extends EntitySchema<any>> = {
    schema: S;
    initialValues: z.infer<S['_zodSchema']>;
    onSubmit: (values: z.infer<S['_zodSchema']>, form: EntityFormHandle<z.infer<S['_zodSchema']>>) => void | Promise<void>;
    className?: string;
};
type WizardProps<S extends EntitySchema<any>> = BaseProps<S> & {
    mode: 'wizard';
    steps: WizardStepDef<z.infer<S['_zodSchema']>>[];
    aiReview?: AiReviewConfig<z.infer<S['_zodSchema']>>;
    submitLabel?: string;
};
type EditProps<S extends EntitySchema<any>> = BaseProps<S> & {
    mode: 'edit';
    submitLabel?: string;
    children?: (form: EntityFormHandle<z.infer<S['_zodSchema']>>) => React.ReactNode;
};
export type EntityFormProps<S extends EntitySchema<any>> = WizardProps<S> | EditProps<S>;
export declare function EntityForm<S extends EntitySchema<any>>(props: EntityFormProps<S>): React.ReactElement;
export {};
//# sourceMappingURL=EntityForm.d.ts.map