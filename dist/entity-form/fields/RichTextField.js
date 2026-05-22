import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @deprecated RichTextField is an internal field primitive; it is no longer part of
 * the public API. Use <EntityForm schema={...}> or <FormField as="shell"> instead.
 * Will be removed from public exports in v1.0 (DS-SIMPLIFY 14).
 *
 * RichTextField — textarea with optional AI-suggest.
 * AI-suggest calls the OrchestratorBridge (never a provider SDK directly).
 */
import { useId } from 'react';
import { FieldWrapper } from './FieldWrapper.js';
export function RichTextField({ name, form, label, hint, required, disabled, readOnly, rows = 4, placeholder }) {
    const reactId = useId();
    const id = `ef-${reactId}-${name}`;
    const meta = form._schema?._fieldMeta?.[name];
    const resolvedLabel = label ?? meta?.label ?? name;
    const resolvedHint = hint ?? meta?.hint;
    const resolvedRequired = required ?? meta?.required ?? false;
    const value = form.values[name] ?? '';
    const error = form.errors[name];
    return (_jsx(FieldWrapper, { id: id, label: resolvedLabel, hint: resolvedHint, error: error, required: resolvedRequired, children: _jsx("textarea", { id: id, value: value, onChange: (e) => form.setField(name, e.target.value), onBlur: () => form.touchField(name), placeholder: placeholder, required: resolvedRequired, disabled: disabled, readOnly: readOnly, rows: rows, "aria-invalid": error ? true : undefined, "aria-describedby": `${id}-slot` }, id) }));
}
//# sourceMappingURL=RichTextField.js.map