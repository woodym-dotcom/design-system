import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @deprecated SelectField is an internal field primitive; it is no longer part of
 * the public API. Use <EntityForm schema={...}> or <FormField as="shell"> instead.
 * Will be removed from public exports in v1.0 (DS-SIMPLIFY 14).
 */
import * as React from 'react';
import { FieldWrapper } from './FieldWrapper.js';
export function SelectField({ name, form, label, hint, required, disabled, readOnly, options, placeholder, searchable = false, maxVisible = 8, filter, }) {
    const reactId = React.useId();
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
    // ── Plain <select> path ──────────────────────────────────────────────────
    if (!searchable) {
        return (_jsx(FieldWrapper, { id: id, label: resolvedLabel, hint: resolvedHint, error: error, required: resolvedRequired, children: _jsxs("select", { id: id, value: value, onChange: (e) => form.setField(name, e.target.value), onBlur: () => form.touchField(name), required: resolvedRequired, disabled: disabled || readOnly, "aria-invalid": error ? true : undefined, "aria-describedby": `${id}-slot`, children: [placeholder ? _jsx("option", { value: "", children: placeholder }) : null, resolvedOptions.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] }, id) }));
    }
    // ── Searchable combobox path ─────────────────────────────────────────────
    return (_jsx(SearchableSelect, { id: id, label: resolvedLabel, hint: resolvedHint, error: error, required: resolvedRequired, disabled: disabled, readOnly: readOnly, value: value, options: resolvedOptions, placeholder: placeholder, maxVisible: maxVisible, filter: filter, onChange: (v) => form.setField(name, v), onBlur: () => form.touchField(name) }));
}
function SearchableSelect({ id, label, hint, error, required, disabled, readOnly, value, options, placeholder, maxVisible, filter, onChange, onBlur, }) {
    const listboxId = `${id}-listbox`;
    // Display text: show label of selected option, or empty string when nothing selected
    const selectedLabel = options.find((o) => o.value === value)?.label ?? '';
    const [query, setQuery] = React.useState(selectedLabel);
    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const inputRef = React.useRef(null);
    const listRef = React.useRef(null);
    // Tracks whether focus-back is from a programmatic refocus after selection;
    // prevents onFocus from re-opening the listbox immediately after a pick.
    const suppressNextFocusOpenRef = React.useRef(false);
    // Sync display when value changes externally
    React.useEffect(() => {
        if (!open) {
            setQuery(selectedLabel);
        }
    }, [selectedLabel, open]);
    const defaultFilter = React.useCallback((opt, q) => opt.label.toLowerCase().includes(q.toLowerCase()), []);
    const applyFilter = filter ?? defaultFilter;
    const filtered = React.useMemo(() => (open ? options.filter((o) => applyFilter(o, query)).slice(0, maxVisible) : []), [options, query, open, applyFilter, maxVisible]);
    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setOpen(true);
        setActiveIndex(-1);
    };
    const handleSelect = (opt) => {
        onChange(opt.value);
        setQuery(opt.label);
        setOpen(false);
        setActiveIndex(-1);
        suppressNextFocusOpenRef.current = true;
        inputRef.current?.focus();
    };
    const handleKeyDown = (e) => {
        if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            setOpen(true);
            setActiveIndex(0);
            e.preventDefault();
            return;
        }
        if (e.key === 'Escape') {
            setOpen(false);
            setQuery(selectedLabel);
            return;
        }
        if (e.key === 'ArrowDown') {
            setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
            e.preventDefault();
        }
        else if (e.key === 'ArrowUp') {
            setActiveIndex((i) => Math.max(i - 1, 0));
            e.preventDefault();
        }
        else if (e.key === 'Enter' && activeIndex >= 0 && filtered[activeIndex]) {
            handleSelect(filtered[activeIndex]);
            e.preventDefault();
        }
    };
    const handleBlur = (e) => {
        // Close only when focus leaves the entire combobox container
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setOpen(false);
            setQuery(selectedLabel);
            onBlur();
        }
    };
    const activeOptionId = activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined;
    return (_jsxs(FieldWrapper, { id: id, label: label, hint: hint, error: error, required: required, children: [_jsx("input", { type: "hidden", name: id, value: value }), _jsxs("div", { style: { position: 'relative' }, onBlur: handleBlur, children: [_jsx("input", { ref: inputRef, id: id, type: "text", role: "combobox", autoComplete: "off", "aria-autocomplete": "list", "aria-expanded": open, "aria-haspopup": "listbox", "aria-controls": listboxId, "aria-activedescendant": activeOptionId, "aria-invalid": error ? true : undefined, "aria-describedby": `${id}-slot`, value: query, placeholder: placeholder, required: required, disabled: disabled || readOnly, onChange: handleInputChange, onFocus: () => {
                            if (suppressNextFocusOpenRef.current) {
                                suppressNextFocusOpenRef.current = false;
                                return;
                            }
                            setOpen(true);
                        }, onKeyDown: handleKeyDown, className: "cc-form-field__combobox-input" }, id), open && filtered.length > 0 && (_jsx("ul", { ref: listRef, id: listboxId, role: "listbox", "aria-label": label, className: "cc-form-field__combobox-listbox", style: {
                            position: 'absolute',
                            zIndex: 100,
                            top: '100%',
                            left: 0,
                            right: 0,
                            margin: 0,
                            padding: 0,
                            listStyle: 'none',
                            background: 'var(--cc-surface-overlay, #fff)',
                            border: '1px solid var(--cc-border, #ccc)',
                            borderRadius: '4px',
                            maxHeight: `${maxVisible * 2.25}rem`,
                            overflowY: 'auto',
                        }, children: filtered.map((opt, idx) => (_jsx("li", { id: `${id}-opt-${idx}`, role: "option", "aria-selected": opt.value === value, className: [
                                'cc-form-field__combobox-option',
                                idx === activeIndex ? 'cc-form-field__combobox-option--active' : '',
                                opt.value === value ? 'cc-form-field__combobox-option--selected' : '',
                            ].filter(Boolean).join(' '), onMouseDown: (e) => e.preventDefault(), onClick: () => handleSelect(opt), style: {
                                padding: '0.5rem 0.75rem',
                                cursor: 'pointer',
                                background: idx === activeIndex
                                    ? 'var(--cc-surface-hover, #f0f0f0)'
                                    : 'transparent',
                            }, children: opt.label }, opt.value))) }))] })] }));
}
//# sourceMappingURL=SelectField.js.map