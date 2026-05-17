import * as React from 'react';
export interface UseFocusTrapOptions {
    /** Whether the trap is active. When false, focus moves freely. */
    active: boolean;
    /**
     * Element to focus on activation. Defaults to the first focusable child.
     * Pass `false` to skip initial focus entirely.
     */
    initialFocus?: React.RefObject<HTMLElement | null> | false;
    /** Restore focus to the previously-focused element on deactivation. */
    restoreFocus?: boolean;
}
/**
 * Focus trap for modal-style surfaces. Captures Tab/Shift+Tab inside the
 * referenced container, focuses the first focusable child on activation,
 * and restores focus when deactivated.
 *
 * Returns a ref that should be attached to the container element.
 */
export declare function useFocusTrap<T extends HTMLElement>({ active, initialFocus, restoreFocus, }: UseFocusTrapOptions): React.RefObject<T | null>;
//# sourceMappingURL=useFocusTrap.d.ts.map