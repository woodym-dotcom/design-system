import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * <CreateMenu> — single create entry-point primitive (G8 / "+" menu pattern).
 *
 * A "+" button that opens a dropdown menu with CreateMenuItem[] sub-actions.
 * Built-in sub-action kinds: manual | ai-generated | from-template | import | custom.
 * Consumers extend with `kind: 'custom'` and a `label`.
 *
 * Accessibility:
 *  - Trigger: role="button", aria-haspopup="menu", aria-expanded.
 *  - Menu: role="menu", aria-label.
 *  - Items: role="menuitem", aria-disabled.
 *  - Keyboard: Escape closes; ArrowDown/ArrowUp navigate items; Enter/Space activate.
 *  - Outside-click closes.
 *  - Focus returns to trigger on close.
 *
 * Composes cc-menu-anchor / cc-menu / cc-menu__item CSS primitives.
 * Does NOT import a DropdownMenu component — one doesn't exist in DS yet;
 * uses the existing cc-menu CSS classes directly (search-before-build §14).
 */
import * as React from 'react';
const DEFAULT_LABELS = {
    manual: 'Create manually',
    'ai-generated': 'Generate with AI',
    'from-template': 'From template',
    import: 'Import',
};
function itemLabel(item) {
    if (item.label)
        return item.label;
    if (item.kind === 'custom')
        return 'Custom';
    return DEFAULT_LABELS[item.kind];
}
export function CreateMenu({ items, menuLabel = 'Create options', triggerLabel = '+', className, }) {
    const [open, setOpen] = React.useState(false);
    const menuId = React.useId();
    const triggerRef = React.useRef(null);
    const menuRef = React.useRef(null);
    const itemRefs = React.useRef([]);
    // When exactly one enabled item exists, collapse the menu: clicking the
    // trigger runs that item's onSelect directly (no dropdown). The dropdown
    // is reserved for the 2+ item case.
    const enabledItems = items.filter((i) => !i.disabled);
    const singleEnabled = enabledItems.length === 1 ? enabledItems[0] : null;
    // Close on outside click
    React.useEffect(() => {
        if (!open)
            return;
        const handlePointerDown = (e) => {
            const anchor = triggerRef.current?.parentElement;
            if (anchor && !anchor.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [open]);
    // Focus first item when menu opens
    React.useEffect(() => {
        if (open) {
            // Defer one tick so the menu is in the DOM
            const id = setTimeout(() => itemRefs.current[0]?.focus(), 0);
            return () => clearTimeout(id);
        }
    }, [open]);
    const close = React.useCallback(() => {
        setOpen(false);
        triggerRef.current?.focus();
    }, []);
    const handleTriggerKeyDown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
        }
    };
    const handleMenuKeyDown = (e) => {
        // Only enabled items participate in arrow navigation; disabled <button>s
        // can't receive focus, so calling .focus() on them is a no-op.
        const refs = itemRefs.current.filter((ref, idx) => Boolean(ref) && !items[idx]?.disabled);
        if (refs.length === 0) {
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
            }
            return;
        }
        const focusedIndex = refs.findIndex((r) => r === document.activeElement);
        if (e.key === 'Escape') {
            e.preventDefault();
            close();
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = (focusedIndex + 1) % refs.length;
            refs[next]?.focus();
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = (focusedIndex - 1 + refs.length) % refs.length;
            refs[prev]?.focus();
        }
        else if (e.key === 'Home') {
            e.preventDefault();
            refs[0]?.focus();
        }
        else if (e.key === 'End') {
            e.preventDefault();
            refs[refs.length - 1]?.focus();
        }
    };
    const handleItemClick = (item) => {
        if (item.disabled)
            return;
        close();
        item.onSelect();
    };
    const anchorClasses = ['cc-menu-anchor'];
    if (className)
        anchorClasses.push(className);
    if (singleEnabled) {
        // Direct-action mode — render a button that calls onSelect on click.
        // The button keeps the primary-button chrome but drops the menu ARIA so
        // assistive tech announces it as a plain action, not a popup trigger.
        return (_jsx("div", { className: anchorClasses.join(' '), children: _jsx("button", { ref: triggerRef, type: "button", className: "cc-btn cc-btn--primary", onClick: () => singleEnabled.onSelect(), children: triggerLabel }) }));
    }
    return (_jsxs("div", { className: anchorClasses.join(' '), children: [_jsx("button", { ref: triggerRef, type: "button", className: "cc-btn cc-btn--primary", "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? `cc-create-menu-${menuId}` : undefined, onClick: () => setOpen((o) => !o), onKeyDown: handleTriggerKeyDown, children: triggerLabel }), open ? (_jsx("div", { id: `cc-create-menu-${menuId}`, ref: menuRef, role: "menu", "aria-label": menuLabel, className: "cc-menu", onKeyDown: handleMenuKeyDown, children: items.map((item, index) => (_jsx("button", { ref: (el) => { itemRefs.current[index] = el; }, type: "button", role: "menuitem", "aria-disabled": item.disabled || undefined, disabled: item.disabled, className: "cc-menu__item", onClick: () => handleItemClick(item), tabIndex: -1, children: itemLabel(item) }, `${item.kind}-${index}`))) })) : null] }));
}
//# sourceMappingURL=CreateMenu.js.map