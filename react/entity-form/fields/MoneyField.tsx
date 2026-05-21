/**
 * @deprecated MoneyField is an internal field primitive; it is no longer part of
 * the public API. Use <EntityForm schema={...}> or <FormField as="shell"> instead.
 * Will be removed from public exports in v1.0 (DS-SIMPLIFY 14).
 *
 * MoneyField — amount (number input) + currency select.
 * Emits { amount: number, currency: string } as a single field value.
 */
import { useId as useReactId } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { FieldPrimitiveProps } from './types';

export interface MoneyValue {
  /** `null` represents an empty input (distinct from a real `0`). */
  amount: number | null;
  currency: string;
}

export interface MoneyFieldProps extends FieldPrimitiveProps<MoneyValue> {
  currencies: string[];
  defaultCurrency?: string;
}

export function MoneyField({ name, form, label, hint, required, disabled, currencies, defaultCurrency }: MoneyFieldProps) {
  const reactId = useReactId();
  const id = `ef-${reactId}-${name}`;
  const meta = (form as any)._schema?._fieldMeta?.[name];
  const resolvedLabel = label ?? meta?.label ?? name;
  const resolvedHint = hint ?? meta?.hint;
  const resolvedRequired = required ?? meta?.required ?? false;
  const current = ((form.values as Record<string, unknown>)[name] as MoneyValue) ?? { amount: null, currency: defaultCurrency ?? currencies[0] ?? 'USD' };
  const error = form.errors[name];

  const setAmount = (amount: number | null) => form.setField(name, { ...current, amount });
  const setCurrency = (currency: string) => form.setField(name, { ...current, currency });

  return (
    <FieldWrapper id={id} label={resolvedLabel} hint={resolvedHint} error={error} required={resolvedRequired}>
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <input
          key={`${id}-amount`}
          id={id}
          type="number"
          value={current.amount ?? ''}
          onChange={(e) => {
            const n = e.target.valueAsNumber;
            setAmount(Number.isNaN(n) ? null : n);
          }}
          onBlur={() => form.touchField(name)}
          required={resolvedRequired}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-slot`}
          style={{ flex: '1' }}
        />
        <select
          key={`${id}-currency`}
          value={current.currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled={disabled}
          aria-label="Currency"
          style={{ width: '80px' }}
        >
          {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </FieldWrapper>
  );
}
