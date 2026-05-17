import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
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
export function Lens({ label, children, defaultOn = false, on: controlled, onChange, className, ...overrides }) {
    const [internalOn, setInternalOn] = React.useState(defaultOn);
    const isControlled = controlled !== undefined;
    const on = isControlled ? controlled : internalOn;
    const parent = useFmt();
    const toggle = () => {
        const next = !on;
        if (!isControlled)
            setInternalOn(next);
        onChange?.(next);
    };
    return (_jsxs("div", { className: ['cc-lens', on && 'cc-lens--on', className].filter(Boolean).join(' '), children: [_jsxs("div", { className: "cc-lens__toolbar", children: [_jsxs("button", { type: "button", className: "cc-lens__toggle", "aria-pressed": on, onClick: toggle, children: [on ? 'Showing' : 'Show', " ", label] }), on && (_jsx("span", { className: "cc-lens__hint", role: "note", children: "Read-only view. Underlying data is unchanged." }))] }), on ? (_jsx(FmtProviderLens, { parent: parent, overrides: overrides, children: children })) : (children)] }));
}
/**
 * Internal wrapper that flips lensActive=true while the lens overrides apply.
 */
function FmtProviderLens({ parent, overrides, children, }) {
    // Use FmtProvider for the locale/tz/currency overrides; lensActive is
    // declared by re-exposing via a thin context layer.
    return (_jsx(FmtProvider, { ...overrides, children: _jsx(LensActiveMarker, { parentLensActive: parent.lensActive, children: children }) }));
}
function LensActiveMarker({ parentLensActive: _parentLensActive, children, }) {
    // Mounted only while the lens is on, so unconditionally mark the active
    // state on <html> for analytics / theming hooks.
    React.useEffect(() => {
        if (typeof document === 'undefined')
            return;
        document.documentElement.dataset.lensActive = 'true';
        return () => {
            delete document.documentElement.dataset.lensActive;
        };
    }, []);
    return _jsx(_Fragment, { children: children });
}
//# sourceMappingURL=Lens.js.map