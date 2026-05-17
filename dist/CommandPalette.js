import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Modal } from './Modal.js';
import { Kbd } from './Kbd.js';
function fuzzyMatch(item, query) {
    if (!query)
        return true;
    const q = query.toLowerCase();
    const haystacks = [item.label, item.hint, item.group, ...(item.keywords ?? [])]
        .filter(Boolean);
    return haystacks.some((h) => h.toLowerCase().includes(q));
}
/**
 * Cmd+K-style command palette. Composes `<Modal/>` for the dialog +
 * focus-trap, `<Kbd/>` for shortcut hints, and the platform fuzzy match
 * for filtering. Static items via `items` or async via `loadItems`.
 *
 * The palette does NOT bind a global hotkey — wire that in the host app
 * (typically by listening for `Cmd/Ctrl+K` and flipping `open`).
 */
export function CommandPalette({ open, onClose, items, loadItems, placeholder = 'Search commands…', emptyMessage = 'No matches', }) {
    const [query, setQuery] = React.useState('');
    const [loaded, setLoaded] = React.useState([]);
    const [activeIdx, setActiveIdx] = React.useState(0);
    const inputRef = React.useRef(null);
    React.useEffect(() => {
        if (!open) {
            setQuery('');
            setActiveIdx(0);
        }
    }, [open]);
    React.useEffect(() => {
        if (!open || !loadItems)
            return;
        let cancelled = false;
        Promise.resolve(loadItems(query)).then((next) => {
            if (!cancelled)
                setLoaded(next);
        });
        return () => {
            cancelled = true;
        };
    }, [open, query, loadItems]);
    const visible = React.useMemo(() => {
        const base = loadItems ? loaded : items ?? [];
        return base.filter((it) => fuzzyMatch(it, query));
    }, [loadItems, loaded, items, query]);
    // Group items in insertion order.
    const grouped = React.useMemo(() => {
        const groups = new Map();
        visible.forEach((it) => {
            const g = it.group ?? '';
            if (!groups.has(g))
                groups.set(g, []);
            groups.get(g).push(it);
        });
        return Array.from(groups.entries());
    }, [visible]);
    React.useEffect(() => {
        if (activeIdx >= visible.length)
            setActiveIdx(Math.max(0, visible.length - 1));
    }, [visible.length, activeIdx]);
    const select = (it) => {
        it.onSelect();
        onClose();
    };
    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIdx((i) => Math.min(visible.length - 1, i + 1));
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx((i) => Math.max(0, i - 1));
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            const it = visible[activeIdx];
            if (it)
                select(it);
        }
    };
    return (_jsxs(Modal, { open: open, onClose: onClose, title: "Command palette", size: "lg", initialFocusRef: inputRef, className: "cc-cmdk", children: [_jsx("input", { ref: inputRef, type: "search", className: "cc-cmdk__input", placeholder: placeholder, value: query, onChange: (e) => {
                    setQuery(e.target.value);
                    setActiveIdx(0);
                }, onKeyDown: onKeyDown, "aria-label": placeholder, autoComplete: "off" }), _jsx("div", { role: "listbox", "aria-label": "Commands", className: "cc-cmdk__results", children: visible.length === 0 ? (_jsx("p", { className: "cc-cmdk__empty", children: emptyMessage })) : (grouped.map(([group, list]) => (_jsxs("div", { className: "cc-cmdk__group", children: [group && _jsx("p", { className: "cc-cmdk__group-label", children: group }), list.map((it) => {
                            const idx = visible.indexOf(it);
                            const isActive = idx === activeIdx;
                            return (_jsxs("button", { type: "button", role: "option", "aria-selected": isActive, className: `cc-cmdk__item${isActive ? ' is-active' : ''}`, onClick: () => select(it), onMouseEnter: () => setActiveIdx(idx), children: [it.icon && _jsx("span", { className: "cc-cmdk__icon", "aria-hidden": "true", children: it.icon }), _jsx("span", { className: "cc-cmdk__label", children: it.label }), it.hint && _jsx("span", { className: "cc-cmdk__hint", children: it.hint }), it.shortcut && (_jsx("span", { className: "cc-cmdk__shortcut", children: _jsx(Kbd, { keys: it.shortcut, size: "sm" }) }))] }, it.id));
                        })] }, group || '__')))) })] }));
}
//# sourceMappingURL=CommandPalette.js.map