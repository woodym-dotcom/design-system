import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { FieldWrapper } from './FieldWrapper.js';
export function SelectField({ name, form, label, hint, required, disabled, readOnly, options, placeholder, }) {
    const reactId = useId();
    const id = `ef-${reactId}-${name}`;
    const meta = form._schema?._fieldMeta?.[name];
    const resolvedLabel = label ?? meta?.label ?? name;
    const resolvedHint = hint ?? meta?.hint;
    const resolvedRequired = required ?? meta?.required ?? false;
    const value = form.values[name] ?? '';
    const error = form.errors[name];
    const resolvedOptions = typeof options === 'function'
        ? options(form.values)
        : options;
    return (_jsx(FieldWrapper, { id: id, label: resolvedLabel, hint: resolvedHint, error: error, required: resolvedRequired, children: _jsxs("select", { id: id, value: value, onChange: (e) => form.setField(name, e.target.value), onBlur: () => form.touchField(name), required: resolvedRequired, disabled: disabled || readOnly, "aria-invalid": error ? true : undefined, "aria-describedby": `${id}-slot`, children: [placeholder ? _jsx("option", { value: "", children: placeholder }) : null, resolvedOptions.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] }, id) }));
}
//# sourceMappingURL=SelectField.js.map