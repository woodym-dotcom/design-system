/**
 * useUrlFilterState — URL-backed filter state hook.
 *
 * Persists multi-value filter state to URLSearchParams via
 * `window.history.replaceState`. Reload-safe, back-button-safe,
 * and share-link-safe.
 *
 * Encoding: each key maps to a comma-separated list of values.
 *   ?status=active,pending&role=admin
 *
 * Malformed URL values (empty strings, etc.) fall back to `initial` with a
 * console.warn so the caller can diagnose issues in development.
 *
 * @example
 * const [filters, setFilters] = useUrlFilterState({ status: [], role: [] });
 */
import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseUrlFilterStateOptions {
  /**
   * Prefix prepended to every URLSearchParam key.
   * Useful when multiple independent filter states share one URL.
   */
  paramPrefix?: string;
  /**
   * Debounce delay in ms before writing to the URL.
   * Default: 0 (immediate).
   */
  debounceMs?: number;
}

type FilterState = Record<string, string[]>;

function encodeState<T extends FilterState>(
  state: T,
  prefix: string,
): URLSearchParams {
  const params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : '',
  );
  for (const key of Object.keys(state)) {
    const paramKey = prefix + key;
    const values = state[key];
    if (values.length === 0) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, values.join(','));
    }
  }
  return params;
}

function decodeState<T extends FilterState>(
  initial: T,
  prefix: string,
): T {
  if (typeof window === 'undefined') return initial;
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(window.location.search);
  } catch (err) {
    console.warn('[useUrlFilterState] Failed to parse URLSearchParams:', err);
    return initial;
  }

  const result = { ...initial } as T;
  for (const key of Object.keys(initial)) {
    const paramKey = prefix + key;
    const raw = params.get(paramKey);
    if (raw === null) {
      // Key absent — keep initial value.
      continue;
    }
    if (raw.trim() === '') {
      console.warn(
        `[useUrlFilterState] Empty value for param "${paramKey}"; falling back to initial.`,
      );
      continue;
    }
    try {
      const values = raw.split(',').map((v) => v.trim()).filter(Boolean);
      (result as FilterState)[key] = values;
    } catch (err) {
      console.warn(
        `[useUrlFilterState] Malformed value for param "${paramKey}": "${raw}"; falling back to initial.`,
        err,
      );
    }
  }
  return result;
}

/**
 * @param initial - Default filter state. Keys define which params are managed.
 * @param options - Optional configuration (paramPrefix, debounceMs).
 * @returns [state, setState] tuple backed by URLSearchParams.
 */
export function useUrlFilterState<T extends FilterState>(
  initial: T,
  options: UseUrlFilterStateOptions = {},
): [T, (next: T) => void] {
  const { paramPrefix = '', debounceMs = 0 } = options;

  const [state, setState] = useState<T>(() => decodeState(initial, paramPrefix));

  // Sync URL → state on popstate (back/forward navigation).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPop = () => {
      setState(decodeState(initial, paramPrefix));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramPrefix]);

  // Debounce timer ref for URL writes.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setFilterState = useCallback(
    (next: T) => {
      setState(next);

      const writeUrl = () => {
        if (typeof window === 'undefined') return;
        const params = encodeState(next, paramPrefix);
        const search = params.toString();
        const newUrl = search
          ? `${window.location.pathname}?${search}`
          : window.location.pathname;
        window.history.replaceState(null, '', newUrl);
      };

      if (debounceMs > 0) {
        if (timerRef.current !== null) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(writeUrl, debounceMs);
      } else {
        writeUrl();
      }
    },
    [paramPrefix, debounceMs],
  );

  return [state, setFilterState];
}
