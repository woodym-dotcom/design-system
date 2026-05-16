import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { FieldWrapper } from './FieldWrapper.js';
export function TextField({ name, form, label, hint, required, disabled, readOnly, inputMode, maxLength, placeholder, type = 'text', }) {
    const reactId = React.useId();
    const id = `ef-${reactId}-${name}`;
    const meta = form._schema?._fieldMeta?.[name];
    const resolvedLabel = label ?? meta?.label ?? name;
    const resolvedHint = hint ?? meta?.hint;
    const resolvedRequired = required ?? meta?.required ?? false;
    const value = form.values[name] ?? '';
    const error = form.errors[name];
    const onChangeRef = React.useRef(form.setField);
    React.useLayoutEffect(() => { onChangeRef.current = form.setField; });
    const handleChange = React.useCallback((e) => {
        onChangeRef.current(name, e.target.value);
    }, [name]);
    const handleBlur = React.useCallback(() => {
        form.touchField(name);
    }, [form, name]);
    return (_jsx(FieldWrapper, { id: id, label: resolvedLabel, hint: resolvedHint, error: error, required: resolvedRequired, children: _jsx("input", { id: id, type: type, value: value, onChange: handleChange, onBlur: handleBlur, placeholder: placeholder, required: resolvedRequired, disabled: disabled, readOnly: readOnly, inputMode: inputMode, maxLength: maxLength, "aria-invalid": error ? true : undefined, "aria-describedby": `${id}-slot` }, id) }));
}
//# sourceMappingURL=TextField.js.map