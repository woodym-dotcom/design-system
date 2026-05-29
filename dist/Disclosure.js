import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Disclosure — collapsible summary/content panel.
 *
 * Uses native <details>/<summary> for uncontrolled mode. Controlled mode
 * manages open state externally.
 *
 * Accordion pattern: compose multiple `<Disclosure>` instances directly. For
 * single-open semantics, lift `open` to a parent and pass `open` / `onOpenChange`
 * to each child; for multi-open, give each Disclosure independent state.
 * Example:
 *
 *   const [openId, setOpenId] = useState<string | null>(null);
 *   <>
 *     <Disclosure summary="A" open={openId === 'a'} onOpenChange={(o) => setOpenId(o ? 'a' : null)}>…</Disclosure>
 *     <Disclosure summary="B" open={openId === 'b'} onOpenChange={(o) => setOpenId(o ? 'b' : null)}>…</Disclosure>
 *   </>
 */
import * as React from 'react';
// ── Icon helpers ──────────────────────────────────────────────────────────────
function ChevronIcon({ open }) {
    return (_jsx("svg", { "aria-hidden": "true", width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", style: {
            flexShrink: 0,
            transition: 'transform 0.15s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--text-3)',
        }, children: _jsx("path", { d: "M2.5 5L7 9.5L11.5 5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
function PlusMinusIcon({ open }) {
    return (_jsx("svg", { "aria-hidden": "true", width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", style: { flexShrink: 0, color: 'var(--text-3)' }, children: open ? (_jsx("path", { d: "M2.5 7h9", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })) : (_jsxs(_Fragment, { children: [_jsx("path", { d: "M7 2.5v9", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }), _jsx("path", { d: "M2.5 7h9", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })] })) }));
}
function DisclosureIconNode({ icon, open }) {
    if (icon === 'none')
        return null;
    if (icon === 'plus-minus')
        return _jsx(PlusMinusIcon, { open: open });
    return _jsx(ChevronIcon, { open: open });
}
// ── Disclosure ────────────────────────────────────────────────────────────────
export function Disclosure({ summary, defaultOpen = false, open: controlledOpen, onOpenChange, icon = 'chevron', className, style, children, }) {
    const isControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = isControlled ? controlledOpen : internalOpen;
    const handleToggle = (next) => {
        if (!isControlled)
            setInternalOpen(next);
        onOpenChange?.(next);
    };
    const summaryStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        cursor: 'pointer',
        userSelect: 'none',
        listStyle: 'none',
        color: 'var(--text-1)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
    };
    const contentStyle = {
        padding: 'var(--space-3) var(--space-4) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-2)',
    };
    if (!isControlled && !onOpenChange) {
        // Native details/summary — fully uncontrolled
        return (_jsxs("details", { className: className, style: {
                borderBottom: '1px solid var(--border-1)',
                ...style,
            }, open: defaultOpen, children: [_jsxs("summary", { style: summaryStyle, children: [_jsx(DisclosureIconNode, { icon: icon, open: open }), summary] }), _jsx("div", { style: contentStyle, children: children })] }));
    }
    // Controlled / hybrid
    return (_jsxs("div", { className: className, style: {
            borderBottom: '1px solid var(--border-1)',
            ...style,
        }, children: [_jsxs("button", { type: "button", "aria-expanded": open, style: {
                    ...summaryStyle,
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                }, onClick: () => handleToggle(!open), children: [_jsx(DisclosureIconNode, { icon: icon, open: open }), summary] }), open && _jsx("div", { style: contentStyle, children: children })] }));
}
//# sourceMappingURL=Disclosure.js.map