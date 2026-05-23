/**
 * useEntityForm — core form state hook.
 *
 * G4 stability invariants enforced here:
 *  - setField / setFields / touchField / validate / handleSubmit are all
 *    stable via useCallback with empty dep arrays + ref forwarding.
 *  - No key-reset on submit — use form.reset() instead.
 *  - Async validators are debounced 400ms; cancelled on unmount.
 */
import * as React from 'react';
import { z } from 'zod';
import type { EntitySchema } from './schema';
export interface EntityFormHandle<TValues> {
    values: TValues;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    isDirty: boolean;
    isSubmitting: boolean;
    setField: (path: string, value: unknown) => void;
    setFields: (partial: Partial<TValues>) => void;
    /** Merge server-side field errors (e.g. from a 400 response) into form.errors. */
    applyServerErrors: (serverErrors: Record<string, string>) => void;
    touchField: (path: string) => void;
    reset: (values?: TValues) => void;
    validate: () => Promise<boolean>;
    validatePaths: (paths: string[]) => Promise<boolean>;
    handleSubmit: (onValid: (values: TValues) => Promise<void>) => (e?: React.FormEvent) => void;
}
export declare function useEntityForm<TShape extends z.ZodRawShape>(schema: EntitySchema<TShape>, initialValues: z.infer<z.ZodObject<TShape>>): EntityFormHandle<z.infer<z.ZodObject<TShape>>>;
//# sourceMappingURL=useEntityForm.d.ts.map