import * as React from 'react';

/**
 * Returns true when the user has requested reduced motion, either via
 * the OS-level `prefers-reduced-motion: reduce` media query OR via the
 * explicit `html[data-motion="reduced"]` opt-in. Falls back to the OS
 * value while the document attribute is unset.
 */
export function useReducedMotion(): boolean {
  const subscribe = React.useCallback((notify: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', notify);
    const observer = new MutationObserver(notify);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion'],
    });
    return () => {
      mq.removeEventListener('change', notify);
      observer.disconnect();
    };
  }, []);

  const getSnapshot = React.useCallback(() => {
    if (typeof window === 'undefined') return false;
    const attr = document.documentElement.dataset.motion;
    if (attr === 'reduced') return true;
    if (attr === 'full') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}
