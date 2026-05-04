/**
 * <ListView> — table-based entity list primitive.
 *
 * Standard density, sortable column headers, scope filter tabs,
 * and a pagination / infinite-scroll variant.
 *
 * §14 L1: no table primitive existed — building new.
 * §14 L2: composes ListPageHeader (slot for title + createAction),
 *          FilterBar (scope filters), and the cc-table/cc-pagination CSS primitives.
 * §14 L3: follows cc-btn / cc-chip token pattern; no inline colours.
 *
 * Accessibility:
 *  - Table uses role="grid" so cells are interactive via keyboard.
 *  - Sortable headers use aria-sort.
 *  - Pagination uses role="navigation" + aria-label.
 *  - Empty state is role="status".
 */
import * as React from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

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
  render: (row: TRow) => React.ReactNode;
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

export interface ListViewProps<TRow> {
  /** Column definitions. */
  columns: ListViewColumn<TRow>[];
  /** Row data. The row must have an `id` field for React keys. */
  rows: (TRow & { id: string })[];
  /** Page title, shown in the list header. */
  heading: string;
  /** Optional subtitle shown below the heading. */
  subtitle?: string;
  /** Scope-filter tabs (e.g. All / Active / Archived). */
  scopeFilters?: ListViewScopeFilter[];
  /** Currently active scope filter id. */
  activeScopeId?: string;
  /** Called when the user clicks a scope filter tab. */
  onScopeChange?: (id: string) => void;
  /** Current sort state. */
  sortKey?: string;
  sortDirection?: SortDirection;
  /** Called when the user clicks a sortable column header. */
  onSort?: (key: string, direction: SortDirection) => void;
  /** Pagination mode. Default 'pages'. */
  paginationMode?: ListViewPaginationMode;
  /** Pagination state for 'pages' mode. */
  pagination?: ListViewPaginationState;
  /** Called when the user changes page. */
  onPageChange?: (page: number) => void;
  /** Called when the user wants to load more (infinite-scroll mode). */
  onLoadMore?: () => void;
  /** Whether there are more items to load (infinite-scroll). */
  hasMore?: boolean;
  /** Loading state — shows skeleton rows. */
  loading?: boolean;
  /** Rendered when rows is empty and not loading. */
  emptyState?: React.ReactNode;
  /** Create button / action rendered in the header top-right. */
  createAction?: React.ReactNode;
  /** Called when a row is clicked — passes the row id. */
  onRowClick?: (id: string) => void;
  /** Currently selected row id (drives is-selected class). */
  selectedId?: string | null;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function nextSortDirection(
  currentKey: string,
  clickedKey: string,
  currentDir: SortDirection,
): SortDirection {
  if (currentKey !== clickedKey) return 'asc';
  if (currentDir === 'asc') return 'desc';
  if (currentDir === 'desc') return 'none';
  return 'asc';
}

const SKELETON_ROW_COUNT = 5;

// ── Component ─────────────────────────────────────────────────────────────────

export function ListView<TRow>({
  columns,
  rows,
  heading,
  subtitle,
  scopeFilters,
  activeScopeId,
  onScopeChange,
  sortKey = '',
  sortDirection = 'none',
  onSort,
  paginationMode = 'pages',
  pagination,
  onPageChange,
  onLoadMore,
  hasMore,
  loading = false,
  emptyState,
  createAction,
  onRowClick,
  selectedId = null,
  className,
}: ListViewProps<TRow>) {
  const rootClasses = ['cc-list-view'];
  if (className) rootClasses.push(className);

  const handleHeaderClick = (col: ListViewColumn<TRow>) => {
    if (!col.sortable || !onSort) return;
    const next = nextSortDirection(sortKey, col.key, sortDirection);
    onSort(col.key, next);
  };

  const ariaSortFor = (key: string): React.AriaAttributes['aria-sort'] => {
    if (key !== sortKey) return 'none';
    if (sortDirection === 'asc') return 'ascending';
    if (sortDirection === 'desc') return 'descending';
    return 'none';
  };

  const totalPages = pagination
    ? Math.ceil(pagination.totalItems / pagination.pageSize)
    : 0;

  return (
    <div className={rootClasses.join(' ')}>
      {/* Header */}
      <div className="cc-list-view__header">
        <div className="cc-list-view__heading-group">
          <h2 className="cc-list-view__heading">{heading}</h2>
          {subtitle ? <p className="cc-list-view__subtitle">{subtitle}</p> : null}
        </div>
        {createAction ? (
          <div className="cc-list-view__actions">{createAction}</div>
        ) : null}
      </div>

      {/* Scope filters */}
      {scopeFilters && scopeFilters.length > 0 ? (
        <div className="cc-list-view__scope-tabs" role="tablist" aria-label="Scope filters">
          {scopeFilters.map((f) => {
            const active = f.id === activeScopeId;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={[
                  'cc-list-view__scope-tab',
                  active ? 'is-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onScopeChange?.(f.id)}
              >
                {f.label}
                {f.count !== undefined ? (
                  <span className="cc-list-view__scope-count">{f.count}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Table */}
      <div className="cc-list-view__table-wrapper" role="region" aria-label={heading}>
        <table className="cc-table" role="grid">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={col.sortable ? ariaSortFor(col.key) : undefined}
                  style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                  className={[
                    'cc-table__th',
                    col.sortable ? 'cc-table__th--sortable' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={col.sortable ? () => handleHeaderClick(col) : undefined}
                  onKeyDown={
                    col.sortable
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleHeaderClick(col);
                          }
                        }
                      : undefined
                  }
                  tabIndex={col.sortable ? 0 : undefined}
                >
                  <span className="cc-table__th-label">{col.label}</span>
                  {col.sortable ? (
                    <span className="cc-table__sort-icon" aria-hidden="true">
                      {col.key === sortKey && sortDirection === 'asc' ? '↑' : ''}
                      {col.key === sortKey && sortDirection === 'desc' ? '↓' : ''}
                      {col.key !== sortKey || sortDirection === 'none' ? '⇅' : ''}
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="cc-table__row cc-table__row--skeleton" aria-hidden="true">
                  {columns.map((col) => (
                    <td key={col.key} className="cc-table__td">
                      <span className="cc-table__skeleton-cell" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div role="status" className="cc-list-view__empty">
                    {emptyState ?? 'No items found.'}
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isSelected = row.id === selectedId;
                return (
                  <tr
                    key={row.id}
                    className={[
                      'cc-table__row',
                      onRowClick ? 'cc-table__row--clickable' : '',
                      isSelected ? 'is-selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-selected={onRowClick ? isSelected : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onClick={onRowClick ? () => onRowClick(row.id) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onRowClick(row.id);
                            }
                          }
                        : undefined
                    }
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="cc-table__td">
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Infinite scroll load-more */}
      {paginationMode === 'infinite-scroll' && hasMore && !loading ? (
        <div className="cc-list-view__load-more">
          <button
            type="button"
            className="cc-btn cc-btn--ghost"
            onClick={onLoadMore}
          >
            Load more
          </button>
        </div>
      ) : null}

      {/* Page pagination */}
      {paginationMode === 'pages' && pagination && totalPages > 1 ? (
        <nav
          className="cc-list-view__pagination"
          aria-label="Pagination"
          role="navigation"
        >
          <button
            type="button"
            className="cc-btn cc-btn--ghost cc-btn--sm"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange?.(pagination.page - 1)}
            aria-label="Previous page"
          >
            ‹ Prev
          </button>
          <span className="cc-list-view__page-info" aria-live="polite">
            Page {pagination.page} of {totalPages}
          </span>
          <button
            type="button"
            className="cc-btn cc-btn--ghost cc-btn--sm"
            disabled={pagination.page >= totalPages}
            onClick={() => onPageChange?.(pagination.page + 1)}
            aria-label="Next page"
          >
            Next ›
          </button>
        </nav>
      ) : null}
    </div>
  );
}
