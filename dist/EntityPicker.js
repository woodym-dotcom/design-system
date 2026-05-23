import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * EntityPicker — standalone search + inline-create combobox primitive.
 *
 * DS-SIMPLIFY 07.
 *
 * Supports single and multi-select typeahead with optional inline entity
 * creation via Overlay (placement='modal') + EntityForm. On submit, the
 * new entity is auto-selected.
 *
 * ARIA: combobox pattern (role="combobox" input + role="listbox" popup).
 * Focus trap is owned by Overlay when the create modal is open.
 */
import * as React from 'react';
import { Overlay } from './Overlay';
import { EntityForm } from './entity-form/EntityForm';
import { TextField } from './entity-form/fields/TextField';
// ── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce(value, delayMs) {
    const [debounced, setDebounced] = React.useState(value);
    React.useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(id);
    }, [value, delayMs]);
    return debounced;
}
// ── EntityPicker component ───────────────────────────────────────────────────
export function EntityPicker(props) {
    const { search, renderOption, value, onChange, multi = false, allowCreate = false, createSchema, onCreate, placeholder = 'Search…', emptyText = 'No results', } = props;
    const instanceId = React.useId();
    const listboxId = `ep-${instanceId}-listbox`;
    const inputRef = React.useRef(null);
    // ── Query state ─────────────────────────────────────────────────────────────
    const [query, setQuery] = React.useState('');
    const debouncedQuery = useDebounce(query, 250);
    // ── Results ─────────────────────────────────────────────────────────────────
    const [results, setResults] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const requestIdRef = React.useRef(0);
    React.useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            setOpen(false);
            return;
        }
        const myId = ++requestIdRef.current;
        setLoading(true);
        search(debouncedQuery)
            .then((r) => {
            if (myId !== requestIdRef.current)
                return;
            setResults(r);
            setOpen(true);
            setLoading(false);
        })
            .catch(() => {
            if (myId !== requestIdRef.current)
                return;
            setLoading(false);
        });
    }, [debouncedQuery, search]);
    // ── Selection logic ──────────────────────────────────────────────────────────
    const selectedItems = React.useMemo(() => {
        if (value === null)
            return [];
        if (Array.isArray(value))
            return value;
        return [value];
    }, [value]);
    const handleSelect = React.useCallback((item) => {
        if (multi) {
            const alreadySelected = selectedItems.some((s) => s === item);
            const next = alreadySelected
                ? selectedItems.filter((s) => s !== item)
                : [...selectedItems, item];
            onChange(next.length === 0 ? [] : next);
        }
        else {
            onChange(item);
        }
        setQuery('');
        setOpen(false);
    }, [multi, selectedItems, onChange]);
    const handleRemove = React.useCallback((item) => {
        if (multi) {
            const next = selectedItems.filter((s) => s !== item);
            onChange(next.length === 0 ? [] : next);
        }
        else {
            onChange(null);
        }
    }, [multi, selectedItems, onChange]);
    const handleClear = React.useCallback(() => {
        onChange(multi ? [] : null);
        setQuery('');
        setOpen(false);
    }, [multi, onChange]);
    // ── Keyboard navigation ──────────────────────────────────────────────────────
    const [activeIndex, setActiveIndex] = React.useState(-1);
    React.useEffect(() => { setActiveIndex(-1); }, [results]);
    const handleKeyDown = React.useCallback((e) => {
        if (!open)
            return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, -1));
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && results[activeIndex]) {
                handleSelect(results[activeIndex]);
            }
        }
        else if (e.key === 'Escape') {
            setOpen(false);
            setQuery('');
        }
    }, [open, results, activeIndex, handleSelect]);
    // ── Inline create ────────────────────────────────────────────────────────────
    const [createOpen, setCreateOpen] = React.useState(false);
    const handleCreateSubmit = React.useCallback(async (draft) => {
        if (!onCreate)
            return;
        const created = await onCreate(draft);
        if (multi) {
            onChange([...selectedItems, created]);
        }
        else {
            onChange(created);
        }
        setCreateOpen(false);
        setQuery('');
        setOpen(false);
    }, [onCreate, multi, selectedItems, onChange]);
    const showCreateButton = allowCreate && createSchema && onCreate && query.trim().length > 0;
    // ── Render ───────────────────────────────────────────────────────────────────
    const activeOptionId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;
    return (_jsxs("div", { className: "cc-entity-picker", children: [multi && selectedItems.length > 0 ? (_jsx("div", { className: "cc-entity-picker__chips", role: "list", "aria-label": "Selected items", children: selectedItems.map((item, i) => (_jsxs("span", { role: "listitem", className: "cc-entity-picker__chip", children: [_jsx("span", { className: "cc-entity-picker__chip-label", children: renderOption(item) }), _jsx("button", { type: "button", className: "cc-entity-picker__chip-remove", "aria-label": "Remove", onClick: () => handleRemove(item), children: "\u00D7" })] }, i))) })) : null, !multi && value !== null && !Array.isArray(value) ? (_jsxs("div", { className: "cc-entity-picker__single-value", children: [_jsx("span", { className: "cc-entity-picker__single-label", children: renderOption(value) }), _jsx("button", { type: "button", className: "cc-entity-picker__clear", "aria-label": "Clear selection", onClick: handleClear, children: "\u00D7" })] })) : null, (multi || value === null || Array.isArray(value)) ? (_jsxs("div", { role: "combobox", "aria-expanded": open, "aria-haspopup": "listbox", "aria-owns": listboxId, style: { position: 'relative' }, children: [_jsx("input", { ref: inputRef, type: "text", className: "cc-entity-picker__input", value: query, onChange: (e) => setQuery(e.target.value), onKeyDown: handleKeyDown, onBlur: () => setTimeout(() => setOpen(false), 150), placeholder: placeholder, autoComplete: "off", "aria-autocomplete": "list", "aria-controls": listboxId, "aria-activedescendant": activeOptionId }), open ? (_jsxs("ul", { id: listboxId, role: "listbox", "aria-label": "Search results", className: "cc-entity-picker__listbox", style: {
                            position: 'absolute',
                            zIndex: 50,
                            background: 'var(--surface-0)',
                            border: '1px solid var(--border-1)',
                            borderRadius: 'var(--radius-sm)',
                            padding: 'var(--space-1)',
                            width: '100%',
                            maxHeight: '240px',
                            overflowY: 'auto',
                            listStyle: 'none',
                            margin: 0,
                            marginTop: '2px',
                        }, children: [loading ? (_jsx("li", { className: "cc-entity-picker__loading", "aria-live": "polite", children: "Searching\u2026" })) : results.length === 0 ? (_jsx("li", { className: "cc-entity-picker__empty", children: emptyText })) : (results.map((item, i) => (_jsx("li", { id: `${listboxId}-option-${i}`, role: "option", "aria-selected": multi
                                    ? selectedItems.includes(item)
                                    : value === item, className: [
                                    'cc-entity-picker__option',
                                    i === activeIndex ? 'is-active' : '',
                                ]
                                    .filter(Boolean)
                                    .join(' '), style: {
                                    padding: 'var(--space-1) var(--space-3)',
                                    cursor: 'pointer',
                                    borderRadius: 'var(--radius-sm)',
                                    background: i === activeIndex ? 'var(--surface-1)' : undefined,
                                }, onMouseDown: () => handleSelect(item), children: renderOption(item) }, i)))), showCreateButton ? (_jsxs("li", { role: "option", "aria-selected": false, className: "cc-entity-picker__create-option", style: {
                                    padding: 'var(--space-1) var(--space-3)',
                                    cursor: 'pointer',
                                    borderRadius: 'var(--radius-sm)',
                                    borderTop: '1px solid var(--border-1)',
                                }, onMouseDown: (e) => {
                                    e.preventDefault();
                                    setOpen(false);
                                    setCreateOpen(true);
                                }, children: ["Create \"", query, "\""] })) : null] })) : null] })) : null, allowCreate && createSchema && createOpen ? (_jsx(Overlay, { placement: "modal", open: createOpen, onOpenChange: (v) => { if (!v)
                    setCreateOpen(false); }, title: "Create", size: "md", children: _jsx(EntityForm, { schema: createSchema, mode: "edit", initialValues: Object.fromEntries(Object.keys(createSchema._zodSchema.shape).map((k) => [k, ''])), onSubmit: async (values) => {
                        await handleCreateSubmit(values);
                    }, submitLabel: "Create", children: (form) => Object.keys(createSchema._zodSchema.shape).map((fieldName) => (_jsx(TextField, { name: fieldName, form: form }, fieldName))) }) })) : null] }));
}
//# sourceMappingURL=EntityPicker.js.map