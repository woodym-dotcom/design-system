import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * EntityReferenceField — FK picker backed by a search endpoint.
 * Renders a combobox pattern: text input triggers search; results shown
 * as a listbox; selection sets the ID as field value.
 */
import * as React from 'react';
import { FieldWrapper } from './FieldWrapper.js';
export function EntityReferenceField({ name, form, label, hint, required, disabled, search, placeholder, initialLabel }) {
    const reactId = React.useId();
    const id = `ef-${reactId}-${name}`;
    const meta = form._schema?._fieldMeta?.[name];
    const resolvedLabel = label ?? meta?.label ?? name;
    const resolvedHint = hint ?? meta?.hint;
    const resolvedRequired = required ?? meta?.required ?? false;
    const selectedValue = form.values[name] ?? '';
    const error = form.errors[name];
    const [query, setQuery] = React.useState(() => initialLabel ?? (selectedValue ? selectedValue : ''));
    const [results, setResults] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    // Guards against out-of-order responses: a slow earlier request landing
    // after a newer one would otherwise overwrite the latest results.
    const requestIdRef = React.useRef(0);
    const handleQuery = React.useCallback((q) => {
        setQuery(q);
        if (!q) {
            setResults([]);
            setOpen(false);
            return;
        }
        const myId = ++requestIdRef.current;
        search(q).then((r) => {
            if (myId !== requestIdRef.current)
                return;
            setResults(r);
            setOpen(r.length > 0);
        }).catch(() => { });
    }, [search]);
    const handleSelect = React.useCallback((result) => {
        form.setField(name, result.value);
        setQuery(result.label);
        setOpen(false);
    }, [form, name]);
    return (_jsx(FieldWrapper, { id: id, label: resolvedLabel, hint: resolvedHint, error: error, required: resolvedRequired, children: _jsxs("div", { role: "combobox", "aria-expanded": open, "aria-haspopup": "listbox", "aria-owns": `${id}-listbox`, style: { position: 'relative' }, children: [_jsx("input", { id: id, type: "text", value: query, onChange: (e) => handleQuery(e.target.value), onBlur: () => { form.touchField(name); setTimeout(() => setOpen(false), 150); }, placeholder: placeholder, required: resolvedRequired, disabled: disabled, autoComplete: "off", "aria-autocomplete": "list", "aria-controls": `${id}-listbox`, "aria-invalid": error ? true : undefined, "aria-describedby": `${id}-slot` }, id), open && (_jsx("ul", { id: `${id}-listbox`, role: "listbox", "aria-label": resolvedLabel, style: {
                        position: 'absolute',
                        zIndex: 50,
                        background: 'var(--surface-0)',
                        border: '1px solid var(--border-1)',
                        borderRadius: 'var(--radius-sm)',
                        padding: 'var(--space-1)',
                        width: '100%',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        listStyle: 'none',
                        margin: 0,
                    }, children: results.map((r) => (_jsx("li", { role: "option", "aria-selected": r.value === selectedValue, style: { padding: 'var(--space-1) var(--space-3)', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }, onMouseDown: () => handleSelect(r), children: r.label }, r.value))) }))] }) }));
}
//# sourceMappingURL=EntityReferenceField.js.map