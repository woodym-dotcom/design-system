import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from './a11y/useFocusTrap.js';
/**
 * Generic centred modal dialog. Owns focus trap, ESC, backdrop click,
 * ARIA dialog semantics, and portal mounting. Compose primary content
 * freely as children — Modal does not impose a section layout.
 */
export function Modal({ open, onClose, title, description, footer, children, size = 'md', closeOnBackdropClick = true, closeOnEscape = true, className, initialFocusRef, }) {
    const containerRef = useFocusTrap({
        active: open,
        initialFocus: initialFocusRef,
    });
    const titleId = React.useId();
    const descId = React.useId();
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
    // Lock body scroll while open.
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
    const dialog = (_jsxs("div", { className: "cc-modal-root", "data-modal-open": "true", children: [_jsx("div", { className: "cc-modal__backdrop", onClick: closeOnBackdropClick ? onClose : undefined, "aria-hidden": "true" }), _jsxs("div", { ref: containerRef, role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, "aria-describedby": description ? descId : undefined, tabIndex: -1, className: ['cc-modal', `cc-modal--${size}`, className].filter(Boolean).join(' '), children: [_jsxs("header", { className: "cc-modal__header", children: [_jsx("h2", { id: titleId, className: "cc-modal__title", children: title }), _jsx("button", { type: "button", className: "cc-modal__close", onClick: onClose, "aria-label": "Close dialog", children: "\u00D7" })] }), description && (_jsx("p", { id: descId, className: "cc-modal__description", children: description })), _jsx("div", { className: "cc-modal__body", children: children }), footer && _jsx("footer", { className: "cc-modal__footer", children: footer })] })] }));
    if (typeof document === 'undefined')
        return dialog;
    return createPortal(dialog, document.body);
}
//# sourceMappingURL=Modal.js.map