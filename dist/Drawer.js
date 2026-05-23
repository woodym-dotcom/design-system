import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from './a11y/useFocusTrap';
/**
 * Generic slide-in drawer. Distinct from `DetailPane` (which is a record
 * detail surface with a fixed section list) — use Drawer when you need
 * a side panel that hosts arbitrary content (filters, settings, wizards).
 *
 * @deprecated Since DS-SIMPLIFY 01. Use `<Overlay placement="drawer-right">`
 *   or `<Overlay placement="drawer-left">` instead. Removed at v1.0
 *   (DS-SIMPLIFY 14).
 */
export function Drawer({ open, onClose, title, subtitle, footer, children, side = 'right', size = 'md', closeOnBackdropClick = true, closeOnEscape = true, className, }) {
    const containerRef = useFocusTrap({ active: open });
    const titleId = React.useId();
    React.useEffect(() => {
        if (!open || !closeOnEscape)
            return;
        const onKey = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose, closeOnEscape]);
    React.useEffect(() => {
        if (!open || typeof document === 'undefined')
            return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);
    if (!open)
        return null;
    const drawer = (_jsxs("div", { className: "cc-drawer-root", "data-drawer-side": side, children: [_jsx("div", { className: "cc-drawer__backdrop is-open", onClick: closeOnBackdropClick ? onClose : undefined, "aria-hidden": "true" }), _jsxs("div", { ref: containerRef, role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, tabIndex: -1, className: [
                    'cc-drawer',
                    `cc-drawer--${side}`,
                    `cc-drawer--size-${size}`,
                    'is-open',
                    className,
                ]
                    .filter(Boolean)
                    .join(' '), children: [_jsxs("header", { className: "cc-drawer__header", children: [_jsxs("div", { children: [_jsx("h2", { id: titleId, className: "cc-drawer__title", children: title }), subtitle && _jsx("p", { className: "cc-drawer__subtitle", children: subtitle })] }), _jsx("button", { type: "button", className: "cc-drawer__close", onClick: onClose, "aria-label": "Close drawer", children: "\u00D7" })] }), _jsx("div", { className: "cc-drawer__body", children: children }), footer && _jsx("div", { className: "cc-drawer__footer", children: footer })] })] }));
    if (typeof document === 'undefined')
        return drawer;
    return createPortal(drawer, document.body);
}
//# sourceMappingURL=Drawer.js.map