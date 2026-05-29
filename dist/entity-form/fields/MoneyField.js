import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @deprecated MoneyField is an internal field primitive; it is no longer part of
 * the public API. Use <EntityForm schema={...}> or <FormField as="shell"> instead.
 *
 *
 * MoneyField — amount (number input) + currency select.
 * Emits { amount: number, currency: string } as a single field value.
 */
import { useId as useReactId } from 'react';
import { FieldWrapper } from './FieldWrapper.js';
export function MoneyField({ name, form, label, hint, required, disabled, currencies, defaultCurrency }) {
    const reactId = useReactId();
    const id = `ef-${reactId}-${name}`;
    const meta = form._schema?._fieldMeta?.[name];
    const resolvedLabel = label ?? meta?.label ?? name;
    const resolvedHint = hint ?? meta?.hint;
    const resolvedRequired = required ?? meta?.required ?? false;
    const current = form.values[name] ?? { amount: null, currency: defaultCurrency ?? currencies[0] ?? 'USD' };
    const error = form.errors[name];
    const setAmount = (amount) => form.setField(name, { ...current, amount });
    const setCurrency = (currency) => form.setField(name, { ...current, currency });
    return (_jsx(FieldWrapper, { id: id, label: resolvedLabel, hint: resolvedHint, error: error, required: resolvedRequired, children: _jsxs("div", { style: { display: 'flex', gap: 'var(--space-2)' }, children: [_jsx("input", { id: id, type: "number", value: current.amount ?? '', onChange: (e) => {
                        const n = e.target.valueAsNumber;
                        setAmount(Number.isNaN(n) ? null : n);
                    }, onBlur: () => form.touchField(name), required: resolvedRequired, disabled: disabled, "aria-invalid": error ? true : undefined, "aria-describedby": `${id}-slot`, style: { flex: '1' } }, `${id}-amount`), _jsx("select", { value: current.currency, onChange: (e) => setCurrency(e.target.value), disabled: disabled, "aria-label": "Currency", style: { width: '80px' }, children: currencies.map((c) => _jsx("option", { value: c, children: c }, c)) }, `${id}-currency`)] }) }));
}
//# sourceMappingURL=MoneyField.js.map