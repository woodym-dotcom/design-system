export interface FilterChip {
    id: string;
    label: string;
    /** Optional group label for sidebar/responsive layout grouping. */
    group?: string;
    /** Optional count badge shown in sidebar layout. */
    count?: number;
}
export interface FilterBarProps {
    /** Available toggle-able filter options. */
    options: FilterChip[];
    /** Currently active (selected) filter ids. */
    activeIds: string[];
    /** Called when the user toggles a chip. */
    onToggle: (id: string) => void;
    /** Called when the user removes an active chip (default: same as onToggle). */
    onRemove?: (id: string) => void;
    /** Label shown when no filters are active. Default: "Showing all". */
    emptyLabel?: string;
    /** Accessible label for the entire bar. Default: "Filters". */
    ariaLabel?: string;
    className?: string;
    /**
     * Visual layout mode.
     *  - "horizontal" (default): flat chip row — backward-compatible.
     *  - "sidebar": sticky 220px left rail with grouped pill chips.
     *  - "responsive": sidebar ≥ collapsedAt, horizontal below.
     */
    layout?: 'horizontal' | 'sidebar' | 'responsive';
    /**
     * Viewport breakpoint (px) below which "responsive" collapses to horizontal.
     * Default: 768.
     */
    collapsedAt?: number;
}
export declare function FilterBar({ options, activeIds, onToggle, onRemove, emptyLabel, ariaLabel, className, layout, collapsedAt, }: FilterBarProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=FilterBar.d.ts.map