import { useId } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { FieldPrimitiveProps } from './types';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SelectFieldProps<T extends string = string> extends FieldPrimitiveProps<T> {
  options: SelectOption<T>[] | ((values: Record<string, unknown>) => SelectOption<T>[]);
  placeholder?: string;
}

export function SelectField<T extends string = string>({
  name, form, label, hint, required, disabled, readOnly, options, placeholder,
}: SelectFieldProps<T>) {
  const reactId = useId();
  const id = `ef-${reactId}-${name}`;
  const meta = (form as any)._schema?._fieldMeta?.[name];
  const resolvedLabel = label ?? meta?.label ?? name;
  const resolvedHint = hint ?? meta?.hint;
  const resolvedRequired = required ?? meta?.required ?? false;
  const value = ((form.values as Record<string, unknown>)[name] as string) ?? '';
  const error = form.errors[name];

  const resolvedOptions = typeof options === 'function'
    ? options(form.values as Record<string, unknown>)
    : options;

  return (
    <FieldWrapper id={id} label={resolvedLabel} hint={resolvedHint} error={error} required={resolvedRequired}>
      <select
        key={id}
        id={id}
        value={value}
        onChange={(e) => form.setField(name, e.target.value as T)}
        onBlur={() => form.touchField(name)}
        required={resolvedRequired}
        disabled={disabled || readOnly}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-slot`}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {resolvedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FieldWrapper>
  );
}
