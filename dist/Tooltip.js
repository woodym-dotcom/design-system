import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Lightweight tooltip — hover- and focus-triggered, ESC-dismissible.
 * Uses CSS positioning (no portal) so it inherits typography/contrast
 * naturally. Wraps a single focusable child and wires `aria-describedby`.
 */
export function Tooltip({ label, children, placement = 'top', delayMs = 300, id, className, }) {
    const generatedId = React.useId();
    const tipId = id ?? `cc-tooltip-${generatedId}`;
    const [open, setOpen] = React.useState(false);
    const timer = React.useRef(null);
    const show = React.useCallback(() => {
        if (timer.current)
            window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setOpen(true), delayMs);
    }, [delayMs]);
    const hide = React.useCallback(() => {
        if (timer.current)
            window.clearTimeout(timer.current);
        timer.current = null;
        setOpen(false);
    }, []);
    React.useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            if (e.key === 'Escape')
                hide();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, hide]);
    React.useEffect(() => () => {
        if (timer.current)
            window.clearTimeout(timer.current);
    }, []);
    const child = React.Children.only(children);
    const existingDescribedBy = child.props['aria-describedby'];
    const describedBy = open
        ? [existingDescribedBy, tipId].filter(Boolean).join(' ')
        : existingDescribedBy;
    const trigger = React.cloneElement(child, {
        'aria-describedby': describedBy,
        onMouseEnter: (e) => {
            child.props.onMouseEnter?.(e);
            show();
        },
        onMouseLeave: (e) => {
            child.props.onMouseLeave?.(e);
            hide();
        },
        onFocus: (e) => {
            child.props.onFocus?.(e);
            show();
        },
        onBlur: (e) => {
            child.props.onBlur?.(e);
            hide();
        },
    });
    return (_jsxs("span", { className: ['cc-tooltip-wrap', className].filter(Boolean).join(' '), children: [trigger, _jsx("span", { id: tipId, role: "tooltip", className: `cc-tooltip cc-tooltip--${placement}${open ? ' is-open' : ''}`, "aria-hidden": !open, children: label })] }));
}
//# sourceMappingURL=Tooltip.js.map