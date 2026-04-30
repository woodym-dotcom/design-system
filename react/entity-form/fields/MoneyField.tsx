/**
 * MoneyField — amount (number input) + currency select.
 * Emits { amount: number, currency: string } as a single field value.
 */
import { FieldWrapper } from './FieldWrapper';
import type { FieldPrimitiveProps } from './types';

export interface MoneyValue {
  amount: number;
  currency: string;
}

export interface MoneyFieldProps extends FieldPrimitiveProps<MoneyValue> {
  currencies: string[];
  defaultCurrency?: string;
}

export function MoneyField({ name, form, label, hint, required, disabled, currencies, defaultCurrency }: MoneyFieldProps) {
  const id = `ef-${name}`;
  const meta = (form as any)._schema?._fieldMeta?.[name];
  const resolvedLabel = label ?? meta?.label ?? name;
  const resolvedHint = hint ?? meta?.hint;
  const resolvedRequired = required ?? meta?.required ?? false;
  const current = ((form.values as Record<string, unknown>)[name] as MoneyValue) ?? { amount: 0, currency: defaultCurrency ?? currencies[0] ?? 'USD' };
  const error = form.errors[name];

  const setAmount = (amount: number) => form.setField(name, { ...current, amount });
  const setCurrency = (currency: string) => form.setField(name, { ...current, currency });

  return (
    <FieldWrapper id={id} label={resolvedLabel} hint={resolvedHint} error={error} required={resolvedRequired}>
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <input
          key={`${id}-amount`}
          id={id}
          type="number"
          value={current.amount}
          onChange={(e) => setAmount(e.target.valueAsNumber || 0)}
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
