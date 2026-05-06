/**
 * ListView types — re-exported for consumers that reference them directly.
 *
 * The <ListView> component (342 LOC, zero consumers) was deleted in Phase 2.
 * Use <ListPage list={{ columns, rows, ... }}> instead.
 * These type exports remain for backwards-compat type references.
 */

export type SortDirection = 'asc' | 'desc' | 'none';

export interface ListViewColumn<TRow> {
  /** Unique key — used for sort state and React keys. */
  key: string;
  /** Column header label. */
  label: string;
  /** Whether the column is sortable. Default false. */
  sortable?: boolean;
  /** Minimum column width (e.g. '120px'). */
  minWidth?: string;
  /** Render cell content for a row. */
  render: (row: TRow) => import('react').ReactNode;
}

export interface ListViewScopeFilter {
  id: string;
  label: string;
  count?: number;
}

export type ListViewPaginationMode = 'pages' | 'infinite-scroll';

export interface ListViewPaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
}
