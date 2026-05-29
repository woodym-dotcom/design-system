export interface FilterChip {
    id: string;
    label: string;
    /** Optional group label for sidebar/responsive layout grouping or applied-mode prefix. */
    group?: string;
    /** Optional count badge shown in sidebar layout. */
    count?: number;
}
export interface FilterBarProps {
    /** Available toggle-able filter options. In `layout="applied"`, this list is the active filters. */
    options: FilterChip[];
    /** Currently active (selected) filter ids. Ignored in `layout="applied"`. */
    activeIds?: string[];
    /** Called when the user toggles a chip. Required outside of applied-mode. */
    onToggle?: (id: string) => void;
    /** Called when the user removes an active chip (default: same as onToggle). */
    onRemove?: (id: string) => void;
    /** applied-mode: called when the user clicks "Clear all" (renders only when > 1 filter). */
    onClearAll?: () => void;
    /** applied-mode: label for the clear-all button. Default: "Clear all". */
    clearAllLabel?: string;
    /** Label shown when no filters are active (non-applied modes). Default: "Showing all". */
    emptyLabel?: string;
    /** Accessible label for the entire bar. Default: "Filters". */
    ariaLabel?: string;
    className?: string;
    /**
     * Visual layout mode.
     *  - "horizontal" (default): flat chip row with toggle + active + empty-state.
     *  - "sidebar": sticky 220px left rail with grouped pill chips.
     *  - "responsive": sidebar ≥ collapsedAt, horizontal below.
     *  - "applied": read-only applied-filters toolbar (subsumes AppliedFiltersBar).
     */
    layout?: 'horizontal' | 'sidebar' | 'responsive' | 'applied';
    /**
     * Viewport breakpoint (px) below which "responsive" collapses to horizontal.
     * Default: 768.
     */
    collapsedAt?: number;
}
export declare function FilterBar({ options, activeIds, onToggle, onRemove, onClearAll, clearAllLabel, emptyLabel, ariaLabel, className, layout, collapsedAt, }: FilterBarProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=FilterBar.d.ts.map