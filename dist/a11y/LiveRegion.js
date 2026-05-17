import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Visually-hidden ARIA live region for announcing transient changes (toast
 * fired, item deleted, undo available). Mount once near the app root and
 * drive via `useAnnounce` — multiple `LiveRegion`s are valid but discouraged.
 */
export function LiveRegion({ message, politeness = 'polite', clearAfterMs = 1500, atomic = true, className, }) {
    const [text, setText] = React.useState(message);
    React.useEffect(() => {
        setText(message);
        if (!message || !clearAfterMs)
            return;
        const id = window.setTimeout(() => setText(''), clearAfterMs);
        return () => window.clearTimeout(id);
    }, [message, clearAfterMs]);
    return (_jsx("div", { role: "status", "aria-live": politeness, "aria-atomic": atomic, className: ['cc-sr-only', className].filter(Boolean).join(' '), children: text }));
}
const AnnounceContext = React.createContext(null);
/**
 * Hosts two live regions (polite + assertive) and exposes `useAnnounce` so
 * descendants can announce changes from anywhere in the tree.
 */
export function AnnounceProvider({ children }) {
    const [polite, setPolite] = React.useState('');
    const [assertive, setAssertive] = React.useState('');
    const value = React.useMemo(() => ({
        announce(message, politeness = 'polite') {
            if (politeness === 'assertive') {
                setAssertive('');
                window.setTimeout(() => setAssertive(message), 16);
            }
            else {
                setPolite('');
                window.setTimeout(() => setPolite(message), 16);
            }
        },
    }), []);
    return (_jsxs(AnnounceContext.Provider, { value: value, children: [children, _jsx(LiveRegion, { message: polite, politeness: "polite" }), _jsx(LiveRegion, { message: assertive, politeness: "assertive" })] }));
}
export function useAnnounce() {
    const ctx = React.useContext(AnnounceContext);
    if (!ctx) {
        // Soft fallback so primitives can call useAnnounce unconditionally
        // even when no provider is mounted (e.g. in a Storybook snapshot).
        return () => { };
    }
    return ctx.announce;
}
//# sourceMappingURL=LiveRegion.js.map