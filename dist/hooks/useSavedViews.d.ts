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
    save: (name: string, state: TState, opts?: {
        pinned?: boolean;
    }) => SavedView<TState>;
    remove: (id: string) => void;
    rename: (id: string, name: string) => void;
    togglePinned: (id: string) => void;
    /** Build a shareable URL for the current state. */
    shareableUrl: (state: TState, baseUrl?: string) => string;
}
/**
 * Saved views + shareable deep-link helper. Persists per-scope view
 * presets and exposes `shareableUrl(state)` to build URLs that other
 * users can open to land on the same filter/sort state.
 */
export declare function useSavedViews<TState = string>({ scope, serialise, deserialise, storage, }: UseSavedViewsOptions<TState>): UseSavedViewsResult<TState>;
//# sourceMappingURL=useSavedViews.d.ts.map