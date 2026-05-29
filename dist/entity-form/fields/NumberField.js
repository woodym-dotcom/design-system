import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @deprecated NumberField is an internal field primitive; it is no longer part of
 * the public API. Use <EntityForm schema={...}> or <FormField as="shell"> instead.
 *
 */
import * as React from 'react';
import { FieldWrapper } from './FieldWrapper.js';
export function NumberField({ name, form, label, hint, required, disabled, readOnly, min, max, step, placeholder }) {
    const reactId = React.useId();
    const id = `ef-${reactId}-${name}`;
    const meta = form._schema?._fieldMeta?.[name];
    const resolvedLabel = label ?? meta?.label ?? name;
    const resolvedHint = hint ?? meta?.hint;
    const resolvedRequired = required ?? meta?.required ?? false;
    const rawValue = form.values[name];
    const value = rawValue == null ? '' : String(rawValue);
    const error = form.errors[name];
    const handleChange = React.useCallback((e) => {
        const n = e.target.valueAsNumber;
        form.setField(name, isNaN(n) ? '' : n);
    }, [form, name]);
    return (_jsx(FieldWrapper, { id: id, label: resolvedLabel, hint: resolvedHint, error: error, required: resolvedRequired, children: _jsx("input", { id: id, type: "number", value: value, onChange: handleChange, onBlur: () => form.touchField(name), placeholder: placeholder, required: resolvedRequired, disabled: disabled, readOnly: readOnly, min: min, max: max, step: step, "aria-invalid": error ? true : undefined, "aria-describedby": `${id}-slot` }, id) }));
}
//# sourceMappingURL=NumberField.js.map