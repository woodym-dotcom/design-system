import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Menu — anchored popover dropdown.
 *
 * ARIA menu pattern: role="menu" / role="menuitem".
 * Click-outside closes, ESC closes, focus trap on open,
 * returns focus to trigger on close.
 *
 * Positioning uses CSS absolute/fixed positioning relative to trigger.
 * No external dependency required.
 */
import * as React from 'react';
import { useFocusTrap } from './a11y/useFocusTrap.js';
const MenuContext = React.createContext(null);
function useMenuContext() {
    const ctx = React.useContext(MenuContext);
    if (!ctx)
        throw new Error('Menu sub-components must be used inside <Menu>');
    return ctx;
}
// ── Placement helpers ──────────────────────────────────────────────────────────
function getPopoverStyle(triggerEl, placement) {
    const rect = triggerEl.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    switch (placement) {
        case 'bottom-end':
            return {
                top: rect.bottom + scrollY + 4,
                left: rect.right + scrollX,
                transform: 'translateX(-100%)',
            };
        case 'bottom-start':
            return {
                top: rect.bottom + scrollY + 4,
                left: rect.left + scrollX,
            };
        case 'top-end':
            return {
                top: rect.top + scrollY - 4,
                left: rect.right + scrollX,
                transform: 'translateX(-100%) translateY(-100%)',
            };
        case 'top-start':
            return {
                top: rect.top + scrollY - 4,
                left: rect.left + scrollX,
                transform: 'translateY(-100%)',
            };
    }
}
// ── Menu ──────────────────────────────────────────────────────────────────────
export function Menu({ trigger, open: controlledOpen, defaultOpen = false, onOpenChange, placement = 'bottom-end', children, closeOnSelect = true, ariaLabel, }) {
    const isControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = isControlled ? controlledOpen : internalOpen;
    const triggerRef = React.useRef(null);
    const popoverRef = React.useRef(null);
    const menuId = React.useId();
    const [popoverStyle, setPopoverStyle] = React.useState({});
    const setOpen = React.useCallback((next) => {
        if (!isControlled)
            setInternalOpen(next);
        onOpenChange?.(next);
    }, [isControlled, onOpenChange]);
    const close = React.useCallback(() => setOpen(false), [setOpen]);
    // Focus trap
    const trapRef = useFocusTrap({
        active: open,
        restoreFocus: true,
    });
    // Merge popoverRef and trapRef
    const setPopoverEl = React.useCallback((el) => {
        popoverRef.current = el;
        trapRef.current = el;
    }, [trapRef]);
    // Recalculate position when opening
    React.useEffect(() => {
        if (open && triggerRef.current) {
            setPopoverStyle(getPopoverStyle(triggerRef.current, placement));
        }
    }, [open, placement]);
    // Click-outside close
    React.useEffect(() => {
        if (!open)
            return;
        const onPointerDown = (e) => {
            const target = e.target;
            if (!popoverRef.current?.contains(target) &&
                !triggerRef.current?.contains(target)) {
                close();
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open, close]);
    // ESC close
    React.useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                close();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, close]);
    // Clone trigger to attach ref and toggle handler
    const triggerEl = trigger;
    const clonedTrigger = React.cloneElement(triggerEl, {
        ref: (el) => {
            triggerRef.current = el;
            // Forward existing ref if present
            const existingRef = triggerEl.ref;
            if (typeof existingRef === 'function')
                existingRef(el);
            else if (existingRef && typeof existingRef === 'object') {
                existingRef.current = el;
            }
        },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': menuId,
        onClick: (e) => {
            triggerEl.props.onClick?.(e);
            setOpen(!open);
        },
    });
    const popoverStyles = {
        position: 'absolute',
        zIndex: 'var(--z-popover, 1000)',
        background: 'var(--surface-0)',
        border: '1px solid var(--border-1)',
        borderRadius: '6px',
        boxShadow: 'var(--shadow-2)',
        minWidth: '160px',
        padding: 'var(--space-2) 0',
        ...popoverStyle,
    };
    return (_jsx(MenuContext.Provider, { value: { close, closeOnSelect }, children: _jsxs("span", { style: { position: 'relative', display: 'inline-block' }, children: [clonedTrigger, open && (_jsx("div", { ref: setPopoverEl, id: menuId, role: "menu", "aria-label": ariaLabel, style: popoverStyles, children: children }))] }) }));
}
// ── MenuItem ──────────────────────────────────────────────────────────────────
export function MenuItem({ children, onSelect, href, disabled = false, destructive = false, icon, }) {
    const { close, closeOnSelect } = useMenuContext();
    const handleActivate = () => {
        if (disabled)
            return;
        onSelect?.();
        if (closeOnSelect)
            close();
    };
    const style = {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-2) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: destructive
            ? 'var(--error)'
            : disabled
                ? 'var(--text-4)'
                : 'var(--text-1)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        textDecoration: 'none',
        background: 'none',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        userSelect: 'none',
    };
    if (href && !disabled) {
        return (_jsxs("a", { href: href, role: "menuitem", style: style, onClick: handleActivate, onKeyDown: (e) => {
                if (e.key === 'Enter' || e.key === ' ')
                    handleActivate();
            }, children: [icon && _jsx("span", { "aria-hidden": "true", children: icon }), children] }));
    }
    return (_jsxs("button", { role: "menuitem", disabled: disabled, "aria-disabled": disabled, style: style, onClick: handleActivate, onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ')
                handleActivate();
        }, children: [icon && _jsx("span", { "aria-hidden": "true", children: icon }), children] }));
}
// ── MenuSeparator ─────────────────────────────────────────────────────────────
export function MenuSeparator(_props) {
    return (_jsx("hr", { role: "separator", style: {
            border: 'none',
            borderTop: '1px solid var(--border-1)',
            margin: 'var(--space-2) 0',
        } }));
}
// ── MenuLabel ─────────────────────────────────────────────────────────────────
export function MenuLabel({ children }) {
    return (_jsx("div", { role: "presentation", style: {
            padding: 'var(--space-2) var(--space-4)',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            color: 'var(--text-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            userSelect: 'none',
        }, children: children }));
}
//# sourceMappingURL=Menu.js.map