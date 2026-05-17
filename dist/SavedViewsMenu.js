import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Saved-views picker — dropdown on top of `useSavedViews()`. Renders a
 * trigger button that opens a menu of saved views, pinned ones first,
 * with optional inline rename / pin / remove controls. The host wires
 * the actions back into the hook.
 *
 * Composes a tiny click-outside + ESC menu (no portal — sits inline
 * with the trigger). For richer overlays, compose `<Drawer>` instead.
 */
export function SavedViewsMenu({ views, onSelect, activeId, onSaveCurrent, onTogglePin, onRemove, onRename, triggerLabel, emptyMessage = 'No saved views yet.', className, }) {
    const [open, setOpen] = React.useState(false);
    const rootRef = React.useRef(null);
    const menuId = React.useId();
    React.useEffect(() => {
        if (!open)
            return;
        const onDocClick = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const onKey = (e) => {
            if (e.key === 'Escape')
                setOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);
    const activeView = activeId ? views.find((v) => v.id === activeId) : undefined;
    const label = triggerLabel ?? activeView?.name ?? 'Views';
    return (_jsxs("div", { ref: rootRef, className: ['cc-saved-views', open && 'is-open', className].filter(Boolean).join(' '), children: [_jsxs("button", { type: "button", className: "cc-saved-views__trigger cc-btn cc-btn--ghost", "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": menuId, onClick: () => setOpen((o) => !o), children: [label, _jsx("span", { "aria-hidden": "true", className: "cc-saved-views__caret", children: "\u25BE" })] }), open && (_jsxs("div", { id: menuId, role: "menu", "aria-label": "Saved views", className: "cc-saved-views__menu", children: [views.length === 0 ? (_jsx("p", { className: "cc-saved-views__empty", children: emptyMessage })) : (_jsx("ul", { className: "cc-saved-views__list", children: views.map((v) => {
                            const isActive = v.id === activeId;
                            return (_jsxs("li", { className: "cc-saved-views__item", role: "none", children: [_jsxs("button", { type: "button", role: "menuitemradio", "aria-checked": isActive, className: `cc-saved-views__select${isActive ? ' is-active' : ''}`, onClick: () => {
                                            onSelect(v);
                                            setOpen(false);
                                        }, children: [v.pinned && _jsx("span", { "aria-hidden": "true", className: "cc-saved-views__pin", children: "\u2605" }), _jsx("span", { className: "cc-saved-views__name", children: v.name })] }), (onTogglePin || onRename || onRemove) && (_jsxs("span", { className: "cc-saved-views__row-actions", children: [onTogglePin && (_jsx("button", { type: "button", className: "cc-saved-views__action", onClick: (e) => { e.stopPropagation(); onTogglePin(v.id); }, "aria-label": v.pinned ? `Unpin ${v.name}` : `Pin ${v.name}`, children: v.pinned ? 'Unpin' : 'Pin' })), onRename && (_jsx("button", { type: "button", className: "cc-saved-views__action", onClick: (e) => { e.stopPropagation(); onRename(v.id); setOpen(false); }, "aria-label": `Rename ${v.name}`, children: "Rename" })), onRemove && (_jsx("button", { type: "button", className: "cc-saved-views__action cc-saved-views__action--danger", onClick: (e) => { e.stopPropagation(); onRemove(v.id); }, "aria-label": `Remove ${v.name}`, children: "Remove" }))] }))] }, v.id));
                        }) })), onSaveCurrent && (_jsx("div", { className: "cc-saved-views__footer", children: _jsx("button", { type: "button", role: "menuitem", className: "cc-saved-views__save", onClick: () => { onSaveCurrent(); setOpen(false); }, children: "+ Save current as\u2026" }) }))] }))] }));
}
//# sourceMappingURL=SavedViewsMenu.js.map