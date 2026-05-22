import * as React from 'react';
export interface CommandItem {
    id: string;
    /** Visible label. */
    label: string;
    /** Optional supporting text rendered to the right of the label. */
    hint?: string;
    /** Group label (e.g. "Navigate", "Actions", "Recent"). */
    group?: string;
    /** Optional icon. */
    icon?: React.ReactNode;
    /** Optional keyboard shortcut hint. */
    shortcut?: string | string[];
    /** Free-text keywords used during fuzzy match. */
    keywords?: string[];
    /** Called when the user selects the item. */
    onSelect: () => void;
}
export interface CommandPaletteProps<T extends string = string> {
    open: boolean;
    onClose: () => void;
    /** Static items to choose from. Either this OR `loadItems` is required. */
    items?: CommandItem[];
    /** Async loader. Called whenever the query changes; should be debounced. */
    loadItems?: (query: string) => CommandItem[] | Promise<CommandItem[]>;
    /** Placeholder shown in the search input. */
    placeholder?: string;
    /** Empty-state copy. */
    emptyMessage?: string;
    /** Optional type filter chips shown above the input. */
    filterTypes?: {
        key: T;
        label: string;
    }[];
    /** Initially selected filter type (defaults to 'all'). */
    defaultFilterType?: T | 'all';
    /** Fired when the user clicks a filter chip. */
    onFilterTypeChange?: (type: T | 'all') => void;
    /** Custom renderer for a single result row. */
    renderItem?: (item: CommandItem) => React.ReactNode;
}
/**
 * Cmd+K-style command palette. Composes `<Modal/>` for the dialog +
 * focus-trap, `<Kbd/>` for shortcut hints, and the platform fuzzy match
 * for filtering. Static items via `items` or async via `loadItems`.
 *
 * The palette does NOT bind a global hotkey — wire that in the host app
 * (typically by listening for `Cmd/Ctrl+K` and flipping `open`).
 */
export declare function CommandPalette<T extends string = string>({ open, onClose, items, loadItems, placeholder, emptyMessage, filterTypes, defaultFilterType, onFilterTypeChange, renderItem, }: CommandPaletteProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CommandPalette.d.ts.map