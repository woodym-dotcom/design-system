/**
 * @deprecated TextField is an internal field primitive; it is no longer part of
 * the public API. Use <EntityForm schema={...}> or <FormField as="shell"> instead.
 * Will be removed from public exports in v1.0 (DS-SIMPLIFY 14).
 */
import * as React from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { FieldPrimitiveProps } from './types';

export interface TextFieldProps extends FieldPrimitiveProps<string> {
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
}

export function TextField({
  name,
  form,
  label,
  hint,
  required,
  disabled,
  readOnly,
  inputMode,
  maxLength,
  placeholder,
  type = 'text',
}: TextFieldProps) {
  const reactId = React.useId();
  const id = `ef-${reactId}-${name}`;
  const meta = (form as any)._schema?._fieldMeta?.[name];
  const resolvedLabel = label ?? meta?.label ?? name;
  const resolvedHint = hint ?? meta?.hint;
  const resolvedRequired = required ?? meta?.required ?? false;
  const value = (form.values as Record<string, unknown>)[name] as string ?? '';
  const error = form.errors[name];

  const onChangeRef = React.useRef(form.setField);
  React.useLayoutEffect(() => { onChangeRef.current = form.setField; });
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeRef.current(name, e.target.value);
  }, [name]);

  const handleBlur = React.useCallback(() => {
    form.touchField(name);
  }, [form, name]);

  return (
    <FieldWrapper id={id} label={resolvedLabel} hint={resolvedHint} error={error} required={resolvedRequired}>
      <input
        key={id}
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={resolvedRequired}
        disabled={disabled}
        readOnly={readOnly}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-slot`}
      />
    </FieldWrapper>
  );
}
