import * as React from 'react';

export interface SavedView<TState = unknown> {
  /** Stable id; usually a slug derived from `name`. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** URL search string OR opaque serialised state ("?status=open&owner=me"). */
  state: TState;
  /** Optional pinned flag — surfaces above other saved views. */
  pinned?: boolean;
  /** ISO timestamp of last edit. */
  updatedAt: string;
}

export interface UseSavedViewsOptions<TState> {
  /**
   * Storage namespace — typically the module + list id, e.g.
   * `vendors.list`. Saved views are keyed under this scope in localStorage.
   */
  scope: string;
  /**
   * Serialiser for the current state. Defaults to a JSON pass-through.
   * For URL-state lists you can pass `(s) => s` (when TState is string).
   */
  serialise?: (state: TState) => string;
  /** Inverse of `serialise`. */
  deserialise?: (raw: string) => TState;
  /** Storage backend. Defaults to `localStorage`. */
  storage?: Pick<Storage, 'getItem' | 'setItem'>;
}

export interface UseSavedViewsResult<TState> {
  views: ReadonlyArray<SavedView<TState>>;
  save: (name: string, state: TState, opts?: { pinned?: boolean }) => SavedView<TState>;
  remove: (id: string) => void;
  rename: (id: string, name: string) => void;
  togglePinned: (id: string) => void;
  /** Build a shareable URL for the current state. */
  shareableUrl: (state: TState, baseUrl?: string) => string;
}

const STORAGE_PREFIX = 'ds-saved-views.';

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `view-${Date.now()}`;
}

/**
 * Saved views + shareable deep-link helper. Persists per-scope view
 * presets and exposes `shareableUrl(state)` to build URLs that other
 * users can open to land on the same filter/sort state.
 */
export function useSavedViews<TState = string>({
  scope,
  serialise,
  deserialise,
  storage,
}: UseSavedViewsOptions<TState>): UseSavedViewsResult<TState> {
  const ser = serialise ?? ((s: TState) => JSON.stringify(s));
  const deser = deserialise ?? ((raw: string) => JSON.parse(raw) as TState);
  const store: Pick<Storage, 'getItem' | 'setItem'> | undefined =
    storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
  const storageKey = `${STORAGE_PREFIX}${scope}`;

  const [views, setViews] = React.useState<SavedView<TState>[]>(() => {
    if (!store) return [];
    try {
      const raw = store.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Array<Omit<SavedView<TState>, 'state'> & { state: string }>;
      return parsed.map((v) => ({ ...v, state: deser(v.state) }));
    } catch {
      return [];
    }
  });

  const writeStorage = React.useCallback(
    (next: SavedView<TState>[]) => {
      if (!store) return;
      try {
        const serialised = next.map((v) => ({ ...v, state: ser(v.state) }));
        store.setItem(storageKey, JSON.stringify(serialised));
      } catch {
        /* private mode or quota — best-effort. */
      }
    },
    [store, storageKey, ser],
  );

  const save = React.useCallback<UseSavedViewsResult<TState>['save']>(
    (name, state, opts) => {
      const id = slugify(name);
      const entry: SavedView<TState> = {
        id,
        name,
        state,
        pinned: opts?.pinned,
        updatedAt: new Date().toISOString(),
      };
      setViews((prev) => {
        const next = [...prev.filter((v) => v.id !== id), entry];
        writeStorage(next);
        return next;
      });
      return entry;
    },
    [writeStorage],
  );

  const remove = React.useCallback(
    (id: string) => {
      setViews((prev) => {
        const next = prev.filter((v) => v.id !== id);
        writeStorage(next);
        return next;
      });
    },
    [writeStorage],
  );

  const rename = React.useCallback(
    (id: string, name: string) => {
      setViews((prev) => {
        const next = prev.map((v) =>
          v.id === id
            ? { ...v, name, updatedAt: new Date().toISOString() }
            : v,
        );
        writeStorage(next);
        return next;
      });
    },
    [writeStorage],
  );

  const togglePinned = React.useCallback(
    (id: string) => {
      setViews((prev) => {
        const next = prev.map((v) =>
          v.id === id ? { ...v, pinned: !v.pinned } : v,
        );
        writeStorage(next);
        return next;
      });
    },
    [writeStorage],
  );

  const shareableUrl = React.useCallback(
    (state: TState, baseUrl?: string): string => {
      const base = baseUrl ?? (typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : '');
      const serialised = ser(state);
      // If serialised already starts with "?", treat as URL search.
      if (serialised.startsWith('?')) return `${base}${serialised}`;
      // Otherwise embed under a single ?view= search param so the link is
      // self-contained without leaking implementation shape.
      return `${base}?view=${encodeURIComponent(serialised)}`;
    },
    [ser],
  );

  const sorted = React.useMemo(
    () =>
      [...views].sort((a, b) => {
        if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      }),
    [views],
  );

  return { views: sorted, save, remove, rename, togglePinned, shareableUrl };
}
