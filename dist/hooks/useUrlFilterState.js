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
// ── Encode ────────────────────────────────────────────────────────────────────
function encodeState(state, prefix, currentSearch) {
    const params = new URLSearchParams(currentSearch);
    for (const key of Object.keys(state)) {
        const paramKey = prefix + key;
        const value = state[key];
        if (Array.isArray(value)) {
            if (value.length === 0) {
                params.delete(paramKey);
            }
            else {
                params.set(paramKey, value.join(','));
            }
        }
        else if (typeof value === 'boolean') {
            if (value) {
                params.set(paramKey, '1');
            }
            else {
                params.delete(paramKey);
            }
        }
        else {
            // string
            if (value === '') {
                params.delete(paramKey);
            }
            else {
                params.set(paramKey, value);
            }
        }
    }
    const str = params.toString();
    return str ? `?${str}` : '';
}
// ── Decode ────────────────────────────────────────────────────────────────────
function decodeState(initial, prefix, search) {
    let params;
    try {
        params = new URLSearchParams(search);
    }
    catch (err) {
        console.warn('[useUrlFilterState] Failed to parse URLSearchParams:', err);
        return initial;
    }
    const result = { ...initial };
    for (const key of Object.keys(initial)) {
        const paramKey = prefix + key;
        const initialValue = initial[key];
        const raw = params.get(paramKey);
        if (Array.isArray(initialValue)) {
            if (raw === null)
                continue;
            if (raw.trim() === '') {
                console.warn(`[useUrlFilterState] Empty value for param "${paramKey}"; falling back to initial.`);
                continue;
            }
            result[key] = raw.split(',').map((v) => v.trim()).filter(Boolean);
        }
        else if (typeof initialValue === 'boolean') {
            // Present and equals "1" → true; absent → false; anything else → warn + false
            if (raw === null) {
                result[key] = false;
            }
            else if (raw === '1') {
                result[key] = true;
            }
            else {
                console.warn(`[useUrlFilterState] Unexpected boolean value for param "${paramKey}": "${raw}"; treating as false.`);
                result[key] = false;
            }
        }
        else {
            // string scalar
            if (raw === null)
                continue;
            result[key] = raw;
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
export function useUrlFilterState(initial, options = {}) {
    const { paramPrefix = '', debounceMs = 0, router } = options;
    const getSearch = () => {
        if (router)
            return router.getSearch();
        if (typeof window !== 'undefined')
            return window.location.search;
        return '';
    };
    const [state, setState] = useState(() => decodeState(initial, paramPrefix, getSearch()));
    // Sync URL → state on popstate or router navigation.
    useEffect(() => {
        if (router) {
            const unsub = router.subscribe(() => {
                setState(decodeState(initial, paramPrefix, router.getSearch()));
            });
            return unsub;
        }
        if (typeof window === 'undefined')
            return;
        const onPop = () => {
            setState(decodeState(initial, paramPrefix, window.location.search));
        };
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramPrefix, router]);
    const timerRef = useRef(null);
    const setFilterState = useCallback((next) => {
        setState(next);
        const writeUrl = () => {
            const search = encodeState(next, paramPrefix, getSearch());
            if (router) {
                router.setSearch(search);
            }
            else if (typeof window !== 'undefined') {
                const newUrl = search
                    ? `${window.location.pathname}${search}`
                    : window.location.pathname;
                window.history.replaceState(null, '', newUrl);
            }
        };
        if (debounceMs > 0) {
            if (timerRef.current !== null)
                clearTimeout(timerRef.current);
            timerRef.current = setTimeout(writeUrl, debounceMs);
        }
        else {
            writeUrl();
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paramPrefix, debounceMs, router]);
    return [state, setFilterState];
}
export function useUrlFilterStateRouter(input) {
    return {
        getSearch: input.getSearch,
        setSearch: input.navigate,
        subscribe: input.subscribe,
    };
}
//# sourceMappingURL=useUrlFilterState.js.map