import * as React from 'react';

const FOCUSABLE =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable=true]';

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
export function useFocusTrap<T extends HTMLElement>({
  active,
  initialFocus,
  restoreFocus = true,
}: UseFocusTrapOptions): React.RefObject<T | null> {
  const containerRef = React.useRef<T | null>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!active) return;
    if (typeof document === 'undefined') return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const node = containerRef.current;
    if (node && initialFocus !== false) {
      if (initialFocus?.current) {
        initialFocus.current.focus();
      } else {
        const focusables = node.querySelectorAll<HTMLElement>(FOCUSABLE);
        (focusables[0] ?? node).focus();
      }
    }

    return () => {
      if (restoreFocus) previouslyFocused.current?.focus?.();
    };
  }, [active, initialFocus, restoreFocus]);

  React.useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const node = containerRef.current;
      if (!node) return;
      const focusables = Array.from(
        node.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);
      if (focusables.length === 0) {
        event.preventDefault();
        node.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (active === first || !node.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !node.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  return containerRef;
}
