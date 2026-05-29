/**
 * @deprecated RichTextField is an internal field primitive; it is no longer part of
 * the public API. Use <EntityForm schema={...}> or <FormField as="shell"> instead.
 *
 *
 * RichTextField — textarea with optional AI-suggest.
 * AI-suggest calls the OrchestratorBridge (never a provider SDK directly).
 */
import { useId } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { FieldPrimitiveProps } from './types';

export interface RichTextFieldProps extends FieldPrimitiveProps<string> {
  rows?: number;
  placeholder?: string;
  aiSuggest?: {
    agentName: string;
    buildInput: (value: string, formValues: Record<string, unknown>) => Record<string, unknown>;
  };
}

export function RichTextField({ name, form, label, hint, required, disabled, readOnly, rows = 4, placeholder }: RichTextFieldProps) {
  const reactId = useId();
  const id = `ef-${reactId}-${name}`;
  const meta = (form as any)._schema?._fieldMeta?.[name];
  const resolvedLabel = label ?? meta?.label ?? name;
  const resolvedHint = hint ?? meta?.hint;
  const resolvedRequired = required ?? meta?.required ?? false;
  const value = ((form.values as Record<string, unknown>)[name] as string) ?? '';
  const error = form.errors[name];

  return (
    <FieldWrapper id={id} label={resolvedLabel} hint={resolvedHint} error={error} required={resolvedRequired}>
      <textarea
        key={id}
        id={id}
        value={value}
        onChange={(e) => form.setField(name, e.target.value)}
        onBlur={() => form.touchField(name)}
        placeholder={placeholder}
        required={resolvedRequired}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-slot`}
      />
      {/* aiSuggest wiring: surface is intentionally minimal for v1.
          Consumers call the bridge themselves for now; full SSE wiring
          is deferred to a follow-on once the bridge pattern is stable. */}
    </FieldWrapper>
  );
}
