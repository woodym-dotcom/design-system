import * as React from 'react';

export interface BackStackEntry {
  /** URL to return to (path + search + hash). */
  href: string;
  /** Human-readable label, e.g. "Vendors" or "Drift alerts". */
  label: string;
  /** Optional module identifier — used by the breadcrumb to group hops. */
  module?: string;
  /** ISO timestamp of when this entry was pushed. */
  at: string;
}

export interface UseBackStackOptions {
  /** Max entries retained. Default 12. */
  max?: number;
  /** Storage key. Defaults to "ds-backstack". */
  storageKey?: string;
}

export interface UseBackStackResult {
  entries: ReadonlyArray<BackStackEntry>;
  push: (entry: Omit<BackStackEntry, 'at'>) => void;
  pop: () => BackStackEntry | undefined;
  clear: () => void;
  /** Most recent entry without removing it. */
  peek: () => BackStackEntry | undefined;
}

/**
 * Cross-module back stack. Persists a small ordered log of visited
 * surfaces in sessionStorage so a user who follows a deep-link or
 * notification can return to where they were — even after a cross-module
 * navigation that would otherwise blow away the browser history.
 *
 * Pair with `<Breadcrumbs />` to render the trail.
 */
export function useBackStack({
  max = 12,
  storageKey = 'ds-backstack',
}: UseBackStackOptions = {}): UseBackStackResult {
  const storage = React.useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.sessionStorage;
    } catch {
      return null;
    }
  }, []);

  const [entries, setEntries] = React.useState<BackStackEntry[]>(() => {
    if (!storage) return [];
    try {
      const raw = storage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as BackStackEntry[]) : [];
    } catch {
      return [];
    }
  });
  // Mirror of `entries` so synchronous callers (e.g. `pop()`) can read the
  // latest state even before the next render has flushed the setState.
  const entriesRef = React.useRef(entries);
  React.useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  const writeStorage = React.useCallback(
    (next: BackStackEntry[]) => {
      if (!storage) return;
      try {
        storage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [storage, storageKey],
  );

  const push = React.useCallback<UseBackStackResult['push']>(
    (entry) => {
      const full: BackStackEntry = { ...entry, at: new Date().toISOString() };
      setEntries((prev) => {
        // De-dupe consecutive same-href entries.
        const tail = prev[prev.length - 1];
        if (tail && tail.href === full.href) return prev;
        const next = [...prev, full].slice(-max);
        writeStorage(next);
        return next;
      });
    },
    [max, writeStorage],
  );

  const pop = React.useCallback(() => {
    const current = entriesRef.current;
    if (current.length === 0) return undefined;
    const popped = current[current.length - 1];
    const next = current.slice(0, -1);
    entriesRef.current = next;
    setEntries(next);
    writeStorage(next);
    return popped;
  }, [writeStorage]);

  const clear = React.useCallback(() => {
    setEntries([]);
    writeStorage([]);
  }, [writeStorage]);

  const peek = React.useCallback(
    () => (entries.length > 0 ? entries[entries.length - 1] : undefined),
    [entries],
  );

  return { entries, push, pop, clear, peek };
}
