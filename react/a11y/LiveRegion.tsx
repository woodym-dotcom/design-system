import * as React from 'react';

export type LiveRegionPoliteness = 'polite' | 'assertive';

export interface LiveRegionProps {
  /** Message announced to AT. Set to '' to clear. */
  message: string;
  /** ARIA live politeness. */
  politeness?: LiveRegionPoliteness;
  /** Auto-clear the message after this many ms (default: 1500). 0 disables. */
  clearAfterMs?: number;
  /** Optional aria-atomic override. Defaults to true. */
  atomic?: boolean;
  className?: string;
}

/**
 * Visually-hidden ARIA live region for announcing transient changes (toast
 * fired, item deleted, undo available). Mount once near the app root and
 * drive via `useAnnounce` — multiple `LiveRegion`s are valid but discouraged.
 */
export function LiveRegion({
  message,
  politeness = 'polite',
  clearAfterMs = 1500,
  atomic = true,
  className,
}: LiveRegionProps) {
  const [text, setText] = React.useState(message);

  React.useEffect(() => {
    setText(message);
    if (!message || !clearAfterMs) return;
    const id = window.setTimeout(() => setText(''), clearAfterMs);
    return () => window.clearTimeout(id);
  }, [message, clearAfterMs]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      className={['cc-sr-only', className].filter(Boolean).join(' ')}
    >
      {text}
    </div>
  );
}

interface AnnounceContextValue {
  announce: (message: string, politeness?: LiveRegionPoliteness) => void;
}

const AnnounceContext = React.createContext<AnnounceContextValue | null>(null);

export interface AnnounceProviderProps {
  children: React.ReactNode;
}

/**
 * Hosts two live regions (polite + assertive) and exposes `useAnnounce` so
 * descendants can announce changes from anywhere in the tree.
 */
export function AnnounceProvider({ children }: AnnounceProviderProps) {
  const [polite, setPolite] = React.useState('');
  const [assertive, setAssertive] = React.useState('');
  const value = React.useMemo<AnnounceContextValue>(
    () => ({
      announce(message, politeness = 'polite') {
        if (politeness === 'assertive') {
          setAssertive('');
          window.setTimeout(() => setAssertive(message), 16);
        } else {
          setPolite('');
          window.setTimeout(() => setPolite(message), 16);
        }
      },
    }),
    [],
  );
  return (
    <AnnounceContext.Provider value={value}>
      {children}
      <LiveRegion message={polite} politeness="polite" />
      <LiveRegion message={assertive} politeness="assertive" />
    </AnnounceContext.Provider>
  );
}

export function useAnnounce(): AnnounceContextValue['announce'] {
  const ctx = React.useContext(AnnounceContext);
  if (!ctx) {
    // Soft fallback so primitives can call useAnnounce unconditionally
    // even when no provider is mounted (e.g. in a Storybook snapshot).
    return () => {};
  }
  return ctx.announce;
}
