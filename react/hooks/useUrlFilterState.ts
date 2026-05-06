/**
 * useUrlFilterState — URL-backed filter state hook.
 *
 * Persists filter state to URLSearchParams via `window.history.replaceState`.
 * Reload-safe, back-button-safe, and share-link-safe.
 *
 * Encoding rules:
 *  - string[]  → comma-separated  (?status=active,pending)
 *  - string    → single value     (?selected=abc)
 *  - boolean   → presence flag    (?fullscreen=1 means true; absent means false)
 *
 * Malformed URL values fall back to `initial` with a console.warn.
 *
 * TanStack Router adapter: pass `router` to have reads/writes go through the
 * router's search params instead of `window.location.search`. Mirror of
 * `useModuleShellRouter` pattern (see ModuleShellProvider.tsx).
 *
 * @example — filters only (backward-compatible)
 * const [f, setF] = useUrlFilterState({ status: [], role: [] });
 *
 * @example — filters + scalar + boolean
 * const [state, setState] = useUrlFilterState(
 *   { status: [], selectedId: '', fullscreen: false },
 *   { paramPrefix: 'co.' },
 * );
 */
import { useState, useCallback, useEffect, useRef } from 'react';

// ── Router adapter (mirrors ModuleShellRouterAdapter) ─────────────────────────

export interface UrlFilterStateRouterAdapter {
  /** Read the full search string (e.g. "?foo=bar"). */
  getSearch: () => string;
  /** Replace the search string without full navigation. */
  setSearch: (search: string) => void;
  /** Subscribe to navigation changes; return unsubscribe fn. */
  subscribe: (callback: () => void) => () => void;
}

// ── Public options ─────────────────────────────────────────────────────────────

export interface UseUrlFilterStateOptions {
  /** Prefix prepended to every URLSearchParam key. */
  paramPrefix?: string;
  /** Debounce delay in ms before writing to the URL. Default: 0. */
  debounceMs?: number;
  /**
   * Optional TanStack Router (or any router) adapter.
   * When omitted, falls back to `window.location.search` + `history.replaceState`.
   */
  router?: UrlFilterStateRouterAdapter;
}

// ── Value types ───────────────────────────────────────────────────────────────

type PrimitiveValue = string[] | string | boolean;
type FilterState = Record<string, PrimitiveValue>;

// ── Encode ────────────────────────────────────────────────────────────────────

function encodeState<T extends FilterState>(
  state: T,
  prefix: string,
  currentSearch: string,
): string {
  const params = new URLSearchParams(currentSearch);

  for (const key of Object.keys(state)) {
    const paramKey = prefix + key;
    const value = state[key];

    if (Array.isArray(value)) {
      if (value.length === 0) {
        params.delete(paramKey);
      } else {
        params.set(paramKey, value.join(','));
      }
    } else if (typeof value === 'boolean') {
      if (value) {
        params.set(paramKey, '1');
      } else {
        params.delete(paramKey);
      }
    } else {
      // string
      if (value === '') {
        params.delete(paramKey);
      } else {
        params.set(paramKey, value);
      }
    }
  }

  const str = params.toString();
  return str ? `?${str}` : '';
}

// ── Decode ────────────────────────────────────────────────────────────────────

function decodeState<T extends FilterState>(
  initial: T,
  prefix: string,
  search: string,
): T {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search);
  } catch (err) {
    console.warn('[useUrlFilterState] Failed to parse URLSearchParams:', err);
    return initial;
  }

  const result = { ...initial } as T;

  for (const key of Object.keys(initial)) {
    const paramKey = prefix + key;
    const initialValue = initial[key];
    const raw = params.get(paramKey);

    if (Array.isArray(initialValue)) {
      if (raw === null) continue;
      if (raw.trim() === '') {
        console.warn(
          `[useUrlFilterState] Empty value for param "${paramKey}"; falling back to initial.`,
        );
        continue;
      }
      (result as FilterState)[key] = raw.split(',').map((v) => v.trim()).filter(Boolean);
    } else if (typeof initialValue === 'boolean') {
      // Present and equals "1" → true; absent → false; anything else → warn + false
      if (raw === null) {
        (result as FilterState)[key] = false;
      } else if (raw === '1') {
        (result as FilterState)[key] = true;
      } else {
        console.warn(
          `[useUrlFilterState] Unexpected boolean value for param "${paramKey}": "${raw}"; treating as false.`,
        );
        (result as FilterState)[key] = false;
      }
    } else {
      // string scalar
      if (raw === null) continue;
      (result as FilterState)[key] = raw;
    }
  }

  return result;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * @param initial - Default state. Keys define which params are managed.
 *   Values may be string[], string, or boolean — each encoded differently.
 * @param options - Optional configuration.
 * @returns [state, setState] tuple backed by URLSearchParams.
 */
export function useUrlFilterState<T extends FilterState>(
  initial: T,
  options: UseUrlFilterStateOptions = {},
): [T, (next: T) => void] {
  const { paramPrefix = '', debounceMs = 0, router } = options;

  const getSearch = (): string => {
    if (router) return router.getSearch();
    if (typeof window !== 'undefined') return window.location.search;
    return '';
  };

  const [state, setState] = useState<T>(() =>
    decodeState(initial, paramPrefix, getSearch()),
  );

  // Sync URL → state on popstate or router navigation.
  useEffect(() => {
    if (router) {
      const unsub = router.subscribe(() => {
        setState(decodeState(initial, paramPrefix, router.getSearch()));
      });
      return unsub;
    }

    if (typeof window === 'undefined') return;
    const onPop = () => {
      setState(decodeState(initial, paramPrefix, window.location.search));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramPrefix, router]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setFilterState = useCallback(
    (next: T) => {
      setState(next);

      const writeUrl = () => {
        const search = encodeState(next, paramPrefix, getSearch());
        if (router) {
          router.setSearch(search);
        } else if (typeof window !== 'undefined') {
          const newUrl = search
            ? `${window.location.pathname}${search}`
            : window.location.pathname;
          window.history.replaceState(null, '', newUrl);
        }
      };

      if (debounceMs > 0) {
        if (timerRef.current !== null) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(writeUrl, debounceMs);
      } else {
        writeUrl();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paramPrefix, debounceMs, router],
  );

  return [state, setFilterState];
}

/**
 * useUrlFilterStateRouter — convenience wrapper that pre-wires a
 * TanStack Router adapter into `useUrlFilterState`.
 *
 * Usage (in a TanStack Router route component):
 *   const adapter = useUrlFilterStateRouter({
 *     getSearch: () => router.state.location.search,
 *     navigate: (search) => router.navigate({ search }),
 *     subscribe: router.subscribe,
 *   });
 *   const [state, setState] = useUrlFilterState(initial, { router: adapter });
 */
export interface TanStackRouterAdapterInput {
  getSearch: () => string;
  navigate: (search: string) => void;
  subscribe: (callback: () => void) => () => void;
}

export function useUrlFilterStateRouter(
  input: TanStackRouterAdapterInput,
): UrlFilterStateRouterAdapter {
  return {
    getSearch: input.getSearch,
    setSearch: input.navigate,
    subscribe: input.subscribe,
  };
}
