import type { SavedView } from './hooks/useSavedViews';
export interface SavedViewsMenuProps<TState = unknown> {
    /** Current views, typically from `useSavedViews({ scope }).views`. */
    views: ReadonlyArray<SavedView<TState>>;
    /** Called when the user selects a saved view. */
    onSelect: (view: SavedView<TState>) => void;
    /**
     * Optional active view id (matches `view.id`). When set, the matching
     * menu item is marked as current.
     */
    activeId?: string;
    /** Called when the user clicks "Save current as…" — host opens a name prompt. */
    onSaveCurrent?: () => void;
    /** Called when the user pins/unpins a view. */
    onTogglePin?: (id: string) => void;
    /** Called when the user removes a view. Host should confirm before destructive action. */
    onRemove?: (id: string) => void;
    /** Called when the user renames a view (host renders the input). */
    onRename?: (id: string) => void;
    /** Trigger label. Defaults to the active view name, then 'Views'. */
    triggerLabel?: string;
    /** Empty state copy when there are no saved views. */
    emptyMessage?: string;
    className?: string;
}
/**
 * Saved-views picker — dropdown on top of `useSavedViews()`. Renders a
 * trigger button that opens a menu of saved views, pinned ones first,
 * with optional inline rename / pin / remove controls. The host wires
 * the actions back into the hook.
 *
 * Composes a tiny click-outside + ESC menu (no portal — sits inline
 * with the trigger). For richer overlays, compose `<Drawer>` instead.
 */
export declare function SavedViewsMenu<TState = unknown>({ views, onSelect, activeId, onSaveCurrent, onTogglePin, onRemove, onRename, triggerLabel, emptyMessage, className, }: SavedViewsMenuProps<TState>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SavedViewsMenu.d.ts.map