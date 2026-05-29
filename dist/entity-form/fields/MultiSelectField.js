import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * MultiSelectField — chip-based multi-select. Internal field primitive used
 * by EntityForm's schema-driven renderer. Not part of the public API; consumers
 * should use <EntityForm schema={...}> or <FormField as="shell"> instead.
 *
 * Renders selected values as pressed chips; unselected options as togglable
 * chips. Composes `<Tag variant="chip">` for chrome.
 */
import * as React from 'react';
import { FieldWrapper } from './FieldWrapper.js';
import { Tag } from '../../Tag.js';
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
                    return (_jsx(Tag, { variant: "chip", className: ['cc-chip--button', isSelected ? 'is-active' : ''].filter(Boolean).join(' '), tone: isSelected ? 'accent' : 'neutral', onClick: disabled ? undefined : () => toggle(opt.value), "aria-pressed": isSelected, "aria-label": opt.label, children: opt.label }, opt.value));
                }), options.length === 0 && placeholder ? (_jsx("span", { style: { color: 'var(--text-4)', fontSize: 'var(--text-sm)', alignSelf: 'center' }, children: placeholder })) : null] }) }));
}
//# sourceMappingURL=MultiSelectField.js.map