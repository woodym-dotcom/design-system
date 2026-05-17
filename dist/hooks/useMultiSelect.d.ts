export interface UseMultiSelectOptions<T> {
    /** All visible items the user can select. Must be a stable array. */
    items: ReadonlyArray<T>;
    /** Stable key per item. */
    getKey: (item: T) => string;
    /** Initial selection (keys). */
    initial?: ReadonlyArray<string>;
}
export interface UseMultiSelectResult<T> {
    selectedKeys: ReadonlySet<string>;
    selectedItems: ReadonlyArray<T>;
    isSelected: (item: T) => boolean;
    toggle: (item: T, opts?: {
        shift?: boolean;
    }) => void;
    selectAll: () => void;
    clear: () => void;
    setSelectedKeys: (keys: Iterable<string>) => void;
    /** True when at least one item is selected. */
    hasSelection: boolean;
    /** True when every visible item is selected. */
    allSelected: boolean;
    /** Total selected count. */
    count: number;
}
/**
 * Selection state hook for list/queue surfaces. Supports:
 *
 *  - toggle (single item)
 *  - shift-toggle (range from last anchor — caller passes `{ shift: true }`)
 *  - select all / clear
 *  - controlled-style `setSelectedKeys`
 *
 * Pair with `<BulkBar />` to expose the bulk-action surface.
 */
export declare function useMultiSelect<T>({ items, getKey, initial, }: UseMultiSelectOptions<T>): UseMultiSelectResult<T>;
//# sourceMappingURL=useMultiSelect.d.ts.map