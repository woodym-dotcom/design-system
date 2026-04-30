import * as React from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { FieldPrimitiveProps } from './types';

export interface NumberFieldProps extends FieldPrimitiveProps<number> {
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export function NumberField({ name, form, label, hint, required, disabled, readOnly, min, max, step, placeholder }: NumberFieldProps) {
  const id = `ef-${name}`;
  const meta = (form as any)._schema?._fieldMeta?.[name];
  const resolvedLabel = label ?? meta?.label ?? name;
  const resolvedHint = hint ?? meta?.hint;
  const resolvedRequired = required ?? meta?.required ?? false;
  const rawValue = (form.values as Record<string, unknown>)[name];
  const value = rawValue == null ? '' : String(rawValue);
  const error = form.errors[name];

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const n = e.target.valueAsNumber;
    form.setField(name, isNaN(n) ? '' : n);
  }, [form, name]);

  return (
    <FieldWrapper id={id} label={resolvedLabel} hint={resolvedHint} error={error} required={resolvedRequired}>
      <input
        key={id}
        id={id}
        type="number"
        value={value}
        onChange={handleChange}
        onBlur={() => form.touchField(name)}
        placeholder={placeholder}
        required={resolvedRequired}
        disabled={disabled}
        readOnly={readOnly}
        min={min}
        max={max}
        step={step}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-slot`}
      />
    </FieldWrapper>
  );
}
