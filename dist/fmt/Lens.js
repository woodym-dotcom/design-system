import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { FmtProvider, useFmt } from './Fmt.js';
/**
 * Read-only Lens toggle. Wraps a subtree and lets the user temporarily
 * swap locale/timezone/currency for evidence/decision-record review —
 * without persisting any preference. The toggle is non-destructive:
 * underlying data and stored preferences are unchanged. The lens is
 * announced via the FmtContext `lensActive` flag so callers can render
 * a banner ("Showing data in EU view") when appropriate.
 */
export function Lens({ label, children, defaultOn = false, on: controlled, onChange, className, bindShowRaw, ...overrides }) {
    const fmtCtx = useFmt();
    const [internalOn, setInternalOn] = React.useState(defaultOn);
    const isControlled = controlled !== undefined;
    const on = isControlled ? controlled : internalOn;
    const toggle = () => {
        const next = !on;
        if (!isControlled)
            setInternalOn(next);
        onChange?.(next);
        if (bindShowRaw) {
            fmtCtx.setShowRaw(next);
        }
    };
    return (_jsxs("div", { className: ['cc-lens', on && 'cc-lens--on', className].filter(Boolean).join(' '), children: [_jsxs("div", { className: "cc-lens__toolbar", children: [_jsxs("button", { type: "button", className: "cc-lens__toggle", "aria-pressed": on, onClick: toggle, children: [on ? 'Showing' : 'Show', " ", label] }), on && (_jsx("span", { className: "cc-lens__hint", role: "note", children: "Read-only view. Underlying data is unchanged." }))] }), on ? (_jsx(LensProvider, { overrides: overrides, children: children })) : (children)] }));
}
/**
 * Internal wrapper that flips `useFmt().lensActive` to true and sets
 * `html[data-lens-active="true"]` for analytics / theming hooks.
 */
function LensProvider({ overrides, children, }) {
    React.useEffect(() => {
        if (typeof document === 'undefined')
            return;
        document.documentElement.dataset.lensActive = 'true';
        return () => {
            delete document.documentElement.dataset.lensActive;
        };
    }, []);
    return (_jsx(FmtProvider, { lensActive: true, ...overrides, children: children }));
}
//# sourceMappingURL=Lens.js.map