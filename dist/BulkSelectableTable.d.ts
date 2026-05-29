/**
 * BulkSelectableTable — composes useMultiSelect + Toolbar (mode="bulk") with a
 * list of rows and provides keyboard shortcuts, a tri-state header, and a
 * typed bulk-action result contract.
 *
 * Pair with `useMultiSelect` (internal); the bulk action bar is auto-mounted
 * via `<Toolbar mode="bulk">`. Caller supplies `rows`, `rowKey`, `renderRow`,
 * and a list of `bulkActions` — each action returns a `BulkActionResult`
 * describing which rows succeeded and which failed.
 *
 * Failed-results detail is shown inline in a `role="status"` live region;
 * caller can also subscribe via `onResult` to surface a Drawer.
 */
import * as React from 'react';
import { type ToolbarAction } from './Toolbar.js';
/**
 * Contract returned by a bulk action. Keys are the values produced by
 * `rowKey(row)` for the original row set.
 */
export interface BulkActionResult<T> {
    /** Keys that succeeded. */
    succeeded: ReadonlyArray<string>;
    /** Per-row failures with a human-readable reason. */
    failed: ReadonlyArray<{
        key: string;
        reason: string;
    }>;
    /** Optional aggregated note (e.g. "skipped 3 already-done rows"). */
    note?: string;
    /** Identity of the action that produced this result (helps multi-action callers). */
    actionId?: string;
}
export interface BulkSelectableTableAction<T> {
    id: string;
    label: string;
    /** Visual tone forwarded to the bulk Toolbar. */
    tone?: ToolbarAction['tone'];
    /** Optional disable predicate based on the current selection. */
    disabled?: (selection: ReadonlyArray<T>) => boolean;
    /** Optional icon forwarded to the bulk Toolbar. */
    icon?: React.ReactNode;
    /**
     * Run the bulk action against the selected rows and return a result.
     * The component will display a summary; the caller can use `onResult`
     * for richer surfaces (drawer, toast, etc.).
     */
    run: (selection: ReadonlyArray<T>) => Promise<BulkActionResult<T>>;
}
export interface BulkSelectableTableProps<T> {
    rows: ReadonlyArray<T>;
    rowKey: (row: T) => string;
    /** Render a single row's body content. The checkbox column is added automatically. */
    renderRow: (row: T) => React.ReactNode;
    bulkActions: ReadonlyArray<BulkSelectableTableAction<T>>;
    /** Optional callback fired after a bulk action completes. */
    onResult?: (result: BulkActionResult<T>) => void;
    /** Accessible label for the grid as a whole. */
    ariaLabel?: string;
    className?: string;
    /** Optional column heading rendered above the row content. */
    rowHeading?: React.ReactNode;
}
export declare function BulkSelectableTable<T>({ rows, rowKey, renderRow, bulkActions, onResult, ariaLabel, className, rowHeading, }: BulkSelectableTableProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BulkSelectableTable.d.ts.map