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
export declare function useBackStack({ max, storageKey, }?: UseBackStackOptions): UseBackStackResult;
//# sourceMappingURL=useBackStack.d.ts.map