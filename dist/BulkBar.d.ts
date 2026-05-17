import * as React from 'react';
export interface BulkBarAction {
    id: string;
    label: string;
    onClick: () => void;
    /** Visual tone. 'danger' is rendered in error palette. */
    tone?: 'default' | 'primary' | 'danger';
    /** Disable the action (e.g. selection invalid for it). */
    disabled?: boolean;
    /** Optional icon. */
    icon?: React.ReactNode;
}
export interface BulkBarProps {
    /** Number of items currently selected. Hidden when 0. */
    count: number;
    /** Called when the user clicks the clear-selection control. */
    onClear: () => void;
    /** Bulk actions. */
    actions: BulkBarAction[];
    /** Optional rendered above the actions (e.g. "Selected across 3 pages"). */
    meta?: React.ReactNode;
    /** Sticky position. Default 'bottom'. */
    position?: 'bottom' | 'top';
    className?: string;
}
/**
 * Sticky action bar that appears when a list has a non-zero selection.
 * Pair with `useMultiSelect`:
 *
 *   const sel = useMultiSelect({ items, getKey });
 *   ...
 *   <BulkBar
 *     count={sel.count}
 *     onClear={sel.clear}
 *     actions={[
 *       { id: 'archive', label: 'Archive', onClick: () => archive(sel.selectedItems) },
 *       { id: 'delete', label: 'Delete', tone: 'danger', onClick: () => del(sel.selectedItems) },
 *     ]}
 *   />
 */
export declare function BulkBar({ count, onClear, actions, meta, position, className, }: BulkBarProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=BulkBar.d.ts.map