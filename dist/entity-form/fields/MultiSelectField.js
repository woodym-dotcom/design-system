import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @deprecated MultiSelectField is an internal field primitive; it is no longer part of
 * the public API. Use <EntityForm schema={...}> or <FormField as="shell"> instead.
 * Will be removed from public exports in v1.0 (DS-SIMPLIFY 14).
 *
 * MultiSelectField — chip-based multi-select.
 * Renders selected values as chips; unselected options as toggle buttons.
 */
import * as React from 'react';
import { FieldWrapper } from './FieldWrapper';
export function MultiSelectField({ name, form, label, hint, required, disabled, options, placeholder }) {
    const reactId = React.useId();
    const id = `ef-${reactId}-${name}`;
    const meta = form._schema?._fieldMeta?.[name];
    const resolvedLabel = label ?? meta?.label ?? name;
    const resolvedHint = hint ?? meta?.hint;
    const resolvedRequired = required ?? meta?.required ?? false;
    const selected = form.values[name] ?? [];
    const selectedSet = new Set(selected);
    const error = form.errors[name];
    const toggle = React.useCallback((value) => {
        const next = selectedSet.has(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];
        form.setField(name, next);
    }, [form, name, selected, selectedSet]);
    return (_jsx(FieldWrapper, { id: id, label: resolvedLabel, hint: resolvedHint, error: error, required: resolvedRequired, children: _jsxs("div", { id: id, role: "group", "aria-label": resolvedLabel, "aria-describedby": `${id}-slot`, className: "cc-field-multi-select", style: { display: 'flex', flexWrap: 'wrap', gap: '4px', minHeight: '36px' }, children: [options.map((opt) => {
                    const isSelected = selectedSet.has(opt.value);
                    return (_jsx("button", { type: "button", className: `cc-chip cc-chip--button${isSelected ? ' is-active' : ''}`, "aria-pressed": isSelected, disabled: disabled, onClick: () => toggle(opt.value), children: opt.label }, opt.value));
                }), options.length === 0 && placeholder ? (_jsx("span", { style: { color: 'var(--text-4)', fontSize: 'var(--text-sm)', alignSelf: 'center' }, children: placeholder })) : null] }) }));
}
//# sourceMappingURL=MultiSelectField.js.map