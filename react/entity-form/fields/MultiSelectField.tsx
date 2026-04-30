/**
 * MultiSelectField — chip-based multi-select.
 * Renders selected values as chips; unselected options as toggle buttons.
 */
import * as React from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { FieldPrimitiveProps } from './types';
import type { SelectOption } from './SelectField';

export interface MultiSelectFieldProps extends FieldPrimitiveProps<string[]> {
  options: SelectOption[];
  placeholder?: string;
}

export function MultiSelectField({ name, form, label, hint, required, disabled, options, placeholder }: MultiSelectFieldProps) {
  const id = `ef-${name}`;
  const meta = (form as any)._schema?._fieldMeta?.[name];
  const resolvedLabel = label ?? meta?.label ?? name;
  const resolvedHint = hint ?? meta?.hint;
  const resolvedRequired = required ?? meta?.required ?? false;
  const selected: string[] = ((form.values as Record<string, unknown>)[name] as string[]) ?? [];
  const selectedSet = new Set(selected);
  const error = form.errors[name];

  const toggle = React.useCallback((value: string) => {
    const next = selectedSet.has(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    form.setField(name, next);
  }, [form, name, selected, selectedSet]);

  return (
    <FieldWrapper id={id} label={resolvedLabel} hint={resolvedHint} error={error} required={resolvedRequired}>
      <div
        id={id}
        role="group"
        aria-label={resolvedLabel}
        aria-describedby={`${id}-slot`}
        className="cc-field-multi-select"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', minHeight: '36px' }}
      >
        {options.map((opt) => {
          const isSelected = selectedSet.has(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              className={`cc-chip cc-chip--button${isSelected ? ' is-active' : ''}`}
              aria-pressed={isSelected}
              disabled={disabled}
              onClick={() => toggle(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
        {options.length === 0 && placeholder ? (
          <span style={{ color: 'var(--text-4)', fontSize: 'var(--text-sm)', alignSelf: 'center' }}>{placeholder}</span>
        ) : null}
      </div>
    </FieldWrapper>
  );
}
