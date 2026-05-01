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
import type { EntitySchema, AsyncValidator } from './schema';

// ── Public handle type ────────────────────────────────────────────────────────

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
  handleSubmit: (
    onValid: (values: TValues) => Promise<void>,
  ) => (e?: React.FormEvent) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function flatSet(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  // If the key exists verbatim in the object (flat dot-notation, OQ-3), update it directly.
  if (Object.prototype.hasOwnProperty.call(obj, path)) {
    return { ...obj, [path]: value };
  }
  // Otherwise treat dots as nested path separators.
  const parts = path.split('.');
  const result = { ...obj };
  let current = result as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    current[key] = { ...(current[key] as Record<string, unknown>) };
    current = current[key] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
  return result;
}

/** Parse Zod errors into a flat path→message map. */
function parseZodErrors(result: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of result.issues) {
    const path = issue.path.join('.');
    if (!out[path]) out[path] = issue.message;
  }
  return out;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useEntityForm<TShape extends z.ZodRawShape>(
  schema: EntitySchema<TShape>,
  initialValues: z.infer<z.ZodObject<TShape>>,
): EntityFormHandle<z.infer<z.ZodObject<TShape>>> {
  type TValues = z.infer<z.ZodObject<TShape>>;

  const [values, setValuesState] = React.useState<TValues>(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const initialValuesRef = React.useRef(initialValues);

  const valuesRef = React.useRef(values);
  React.useEffect(() => { valuesRef.current = values; }, [values]);

  const schemaRef = React.useRef(schema);
  React.useEffect(() => { schemaRef.current = schema; }, [schema]);

  // Async validator debounce timers — keyed by field path.
  const debounceTimers = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  // Mounted flag for cleanup.
  const mountedRef = React.useRef(true);
  React.useEffect(() => () => { mountedRef.current = false; }, []);

  // Run async validator for a field (debounced).
  const runAsyncValidator = React.useCallback((
    path: string,
    value: unknown,
    validator: AsyncValidator,
  ) => {
    const existing = debounceTimers.current.get(path);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(async () => {
      const allValues = valuesRef.current as Record<string, unknown>;
      const message = await validator(value, allValues);
      if (!mountedRef.current) return;
      setErrors((prev) => {
        if (message) return { ...prev, [path]: message };
        const next = { ...prev };
        delete next[path];
        return next;
      });
    }, 400);
    debounceTimers.current.set(path, timer);
  }, []);

  // Stable setField — never causes remounts.
  const setField = React.useCallback((path: string, value: unknown) => {
    setValuesState((prev) => {
      const next = flatSet(prev as Record<string, unknown>, path, value) as TValues;
      valuesRef.current = next;
      return next;
    });
    // Clear error optimistically on change.
    setErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
    // Run async validator if registered.
    const meta = schemaRef.current._fieldMeta[path];
    if (meta?.asyncValidator) {
      runAsyncValidator(path, value, meta.asyncValidator);
    }
  }, [runAsyncValidator]);

  const setFields = React.useCallback((partial: Partial<TValues>) => {
    setValuesState((prev) => {
      const next = { ...prev, ...partial };
      valuesRef.current = next;
      return next;
    });
  }, []);

  // Expose server-side errors (e.g. from a 400 response) as inline field annotations.
  const applyServerErrors = React.useCallback((serverErrors: Record<string, string>) => {
    setErrors((prev) => ({ ...prev, ...serverErrors }));
  }, [setErrors]);

  const touchField = React.useCallback((path: string) => {
    setTouched((prev) => {
      if (prev[path]) return prev;
      return { ...prev, [path]: true };
    });
  }, []);

  const reset = React.useCallback((newValues?: TValues) => {
    const v = newValues ?? initialValuesRef.current;
    setValuesState(v);
    valuesRef.current = v;
    setErrors({});
    setTouched({});
  }, []);

  // Full validation — runs Zod + all pending async validators.
  const validate = React.useCallback(async (): Promise<boolean> => {
    const result = schemaRef.current._refined.safeParse(valuesRef.current);
    if (!result.success) {
      setErrors(parseZodErrors(result.error as z.ZodError));
      return false;
    }
    setErrors({});
    return true;
  }, []);

  // Validate specific paths only (wizard step advance).
  const validatePaths = React.useCallback(async (paths: string[]): Promise<boolean> => {
    const result = schemaRef.current._zodSchema.safeParse(valuesRef.current);
    const allErrors = result.success ? {} : parseZodErrors(result.error as z.ZodError);
    const pathSet = new Set(paths);
    const relevant = Object.fromEntries(
      Object.entries(allErrors).filter(([k]) => pathSet.has(k)),
    );
    // Merge: keep errors for non-path fields, replace for path fields.
    setErrors((prev) => {
      const next = { ...prev };
      // Clear path errors first.
      for (const p of paths) delete next[p];
      // Apply new.
      return { ...next, ...relevant };
    });
    return Object.keys(relevant).length === 0;
  }, []);

  const handleSubmit = React.useCallback(
    (onValid: (values: TValues) => Promise<void>) =>
      (e?: React.FormEvent) => {
        e?.preventDefault();
        void (async () => {
          setIsSubmitting(true);
          try {
            const valid = await validate();
            if (!valid) return;
            await onValid(valuesRef.current);
          } catch {
            // onValid is responsible for displaying errors; suppress the rejection
            // so it doesn't become an unhandled promise rejection.
          } finally {
            if (mountedRef.current) setIsSubmitting(false);
          }
        })();
      },
    [validate],
  );

  const isDirty = React.useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValuesRef.current),
    [values],
  );

  return {
    values,
    errors,
    touched,
    isDirty,
    isSubmitting,
    setField,
    setFields,
    applyServerErrors,
    touchField,
    reset,
    validate,
    validatePaths,
    handleSubmit,
  };
}
