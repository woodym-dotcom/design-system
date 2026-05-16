export interface UrlFilterStateRouterAdapter {
    /** Read the full search string (e.g. "?foo=bar"). */
    getSearch: () => string;
    /** Replace the search string without full navigation. */
    setSearch: (search: string) => void;
    /** Subscribe to navigation changes; return unsubscribe fn. */
    subscribe: (callback: () => void) => () => void;
}
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
type PrimitiveValue = string[] | string | boolean;
type FilterState = Record<string, PrimitiveValue>;
/**
 * @param initial - Default state. Keys define which params are managed.
 *   Values may be string[], string, or boolean — each encoded differently.
 * @param options - Optional configuration.
 * @returns [state, setState] tuple backed by URLSearchParams.
 */
export declare function useUrlFilterState<T extends FilterState>(initial: T, options?: UseUrlFilterStateOptions): [T, (next: T) => void];
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
export declare function useUrlFilterStateRouter(input: TanStackRouterAdapterInput): UrlFilterStateRouterAdapter;
export {};
//# sourceMappingURL=useUrlFilterState.d.ts.map