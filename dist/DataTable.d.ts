/**
 * DataTable -- interactive table with sort, filter, select, and paginate.
 *
 * DS-MIG P1-03. Composes BulkSelectableTable (selection) with sort + filter +
 * pagination into a single "batteries-included" table primitive.
 *
 * For just selection, use <BulkSelectableTable> directly.
 * For a full page surface (header, filters, detail pane), use <ListPage> or
 * <Page variant="list">.
 *
 * DataTable is the mid-level building block: it owns the table chrome
 * (sort arrows, filter inputs, pagination controls, selection checkboxes)
 * but does NOT own page layout, headers, or detail panes.
 */
import * as React from 'react';
export interface DataTableColumn<TRow> {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    minWidth?: string;
    render: (row: TRow) => React.ReactNode;
    /** Optional value accessor for filtering (defaults to stringifying render output). */
    filterValue?: (row: TRow) => string;
}
export type DataTableSortDirection = 'asc' | 'desc' | 'none';
export interface DataTableSortState {
    key: string;
    direction: DataTableSortDirection;
}
export interface DataTablePagination {
    page: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}
export interface DataTableSelection {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}
export interface DataTableProps<TRow extends {
    id: string;
}> {
    columns: DataTableColumn<TRow>[];
    rows: TRow[];
    loading?: boolean;
    emptyState?: React.ReactNode;
    sort?: DataTableSortState;
    onSortChange?: (key: string, direction: DataTableSortDirection) => void;
    pagination?: DataTablePagination;
    selection?: DataTableSelection;
    onRowClick?: (id: string) => void;
    activeRowId?: string;
    ariaLabel?: string;
    className?: string;
}
export declare function DataTable<TRow extends {
    id: string;
}>({ columns, rows, loading, emptyState, sort, onSortChange, pagination, selection, onRowClick, activeRowId, ariaLabel, className, }: DataTableProps<TRow>): React.ReactElement;
//# sourceMappingURL=DataTable.d.ts.map