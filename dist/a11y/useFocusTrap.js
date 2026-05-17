import * as React from 'react';
const FOCUSABLE = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable=true]';
/**
 * Focus trap for modal-style surfaces. Captures Tab/Shift+Tab inside the
 * referenced container, focuses the first focusable child on activation,
 * and restores focus when deactivated.
 *
 * Returns a ref that should be attached to the container element.
 */
export function useFocusTrap({ active, initialFocus, restoreFocus = true, }) {
    const containerRef = React.useRef(null);
    const previouslyFocused = React.useRef(null);
    React.useEffect(() => {
        if (!active)
            return;
        if (typeof document === 'undefined')
            return;
        previouslyFocused.current = document.activeElement;
        const node = containerRef.current;
        if (node && initialFocus !== false) {
            if (initialFocus?.current) {
                initialFocus.current.focus();
            }
            else {
                const focusables = node.querySelectorAll(FOCUSABLE);
                (focusables[0] ?? node).focus();
            }
        }
        return () => {
            if (restoreFocus)
                previouslyFocused.current?.focus?.();
        };
    }, [active, initialFocus, restoreFocus]);
    React.useEffect(() => {
        if (!active)
            return;
        const onKey = (event) => {
            if (event.key !== 'Tab')
                return;
            const node = containerRef.current;
            if (!node)
                return;
            const focusables = Array.from(node.querySelectorAll(FOCUSABLE)).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);
            if (focusables.length === 0) {
                event.preventDefault();
                node.focus();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;
            if (event.shiftKey && (active === first || !node.contains(active))) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && (active === last || !node.contains(active))) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [active]);
    return containerRef;
}
//# sourceMappingURL=useFocusTrap.js.map