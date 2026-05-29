import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useAnnounce } from './a11y/LiveRegion.js';
const ToastContext = React.createContext(null);
let idCounter = 0;
const nextId = () => `toast-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;
export function ToastProvider({ children, max = 5, position = 'bottom-right', }) {
    const [toasts, setToasts] = React.useState([]);
    const announce = useAnnounce();
    const timers = React.useRef(new Map());
    const dismiss = React.useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        const handle = timers.current.get(id);
        if (handle) {
            window.clearTimeout(handle);
            timers.current.delete(id);
        }
    }, []);
    const toast = React.useCallback((input) => {
        const id = input.id ?? nextId();
        const entry = {
            durationMs: 5000,
            tone: 'info',
            ...input,
            id,
        };
        setToasts((prev) => {
            const next = [...prev.filter((t) => t.id !== id), entry];
            return next.length > max ? next.slice(next.length - max) : next;
        });
        announce(entry.title ? `${entry.title}. ${entry.message}` : entry.message, entry.tone === 'error' || entry.tone === 'warning' ? 'assertive' : 'polite');
        if (entry.durationMs && entry.durationMs > 0) {
            const handle = window.setTimeout(() => dismiss(id), entry.durationMs);
            timers.current.set(id, handle);
        }
        return id;
    }, [announce, dismiss, max]);
    const clear = React.useCallback(() => {
        timers.current.forEach((h) => window.clearTimeout(h));
        timers.current.clear();
        setToasts([]);
    }, []);
    React.useEffect(() => {
        const t = timers.current;
        return () => {
            t.forEach((h) => window.clearTimeout(h));
            t.clear();
        };
    }, []);
    const value = React.useMemo(() => ({ toast, dismiss, clear, toasts }), [toast, dismiss, clear, toasts]);
    const stack = (_jsx("div", { className: `cc-toast-stack cc-toast-stack--${position}`, role: "region", "aria-label": "Notifications", children: toasts.map((t) => (_jsx(ToastItem, { toast: t, onDismiss: () => dismiss(t.id) }, t.id))) }));
    return (_jsxs(ToastContext.Provider, { value: value, children: [children, typeof document !== 'undefined'
                ? createPortal(stack, document.body)
                : stack] }));
}
function ToastItem({ toast, onDismiss }) {
    const tone = toast.tone ?? 'info';
    return (_jsxs("div", { className: `cc-toast cc-toast--${tone}`, role: tone === 'error' || tone === 'warning' ? 'alert' : 'status', "data-toast-id": toast.id, children: [_jsxs("div", { className: "cc-toast__body", children: [toast.title && _jsx("p", { className: "cc-toast__title", children: toast.title }), _jsx("p", { className: "cc-toast__message", children: toast.message })] }), _jsxs("div", { className: "cc-toast__actions", children: [toast.action && (_jsx("button", { type: "button", className: "cc-toast__action", onClick: () => {
                            toast.action.onClick();
                            onDismiss();
                        }, children: toast.action.label })), _jsx("button", { type: "button", className: "cc-toast__close", onClick: onDismiss, "aria-label": "Dismiss notification", children: "\u00D7" })] })] }));
}
export function useToast() {
    const ctx = React.useContext(ToastContext);
    if (!ctx) {
        // Soft fallback — primitives may call useToast unconditionally.
        const noop = () => '';
        return {
            toast: noop,
            dismiss: () => { },
            clear: () => { },
            toasts: [],
        };
    }
    return ctx;
}
//# sourceMappingURL=Toast.js.map