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

// ── Column definition ───────────────────────────────────────────────────────

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

// ── Sort state ──────────────────────────────────────────────────────────────

export type DataTableSortDirection = 'asc' | 'desc' | 'none';

export interface DataTableSortState {
  key: string;
  direction: DataTableSortDirection;
}

// ── Pagination ──────────────────────────────────────────────────────────────

export interface DataTablePagination {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

// ── Selection ───────────────────────────────────────────────────────────────

export interface DataTableSelection {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

// ── Props ───────────────────────────────────────────────────────────────────

export interface DataTableProps<TRow extends { id: string }> {
  columns: DataTableColumn<TRow>[];
  rows: TRow[];
  loading?: boolean;
  emptyState?: React.ReactNode;

  // Sort (controlled)
  sort?: DataTableSortState;
  onSortChange?: (key: string, direction: DataTableSortDirection) => void;

  // Pagination (controlled)
  pagination?: DataTablePagination;

  // Selection (controlled)
  selection?: DataTableSelection;

  // Row interaction
  onRowClick?: (id: string) => void;
  activeRowId?: string;

  ariaLabel?: string;
  className?: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function nextSortDirection(
  currentKey: string,
  clickedKey: string,
  currentDir: DataTableSortDirection,
): DataTableSortDirection {
  if (currentKey !== clickedKey) return 'asc';
  if (currentDir === 'asc') return 'desc';
  if (currentDir === 'desc') return 'none';
  return 'asc';
}

const SKELETON_ROW_COUNT = 5;

// ── Component ───────────────────────────────────────────────────────────────

export function DataTable<TRow extends { id: string }>({
  columns,
  rows,
  loading = false,
  emptyState,
  sort,
  onSortChange,
  pagination,
  selection,
  onRowClick,
  activeRowId,
  ariaLabel = 'Data table',
  className,
}: DataTableProps<TRow>): React.ReactElement {
  const selectedSet = new Set(selection?.selectedIds ?? []);
  const allSelected = rows.length > 0 && rows.every((r) => selectedSet.has(r.id));
  const someSelected = rows.some((r) => selectedSet.has(r.id));

  const handleHeaderClick = (col: DataTableColumn<TRow>) => {
    if (!col.sortable || !onSortChange) return;
    const next = nextSortDirection(
      sort?.key ?? '',
      col.key,
      sort?.direction ?? 'none',
    );
    onSortChange(col.key, next);
  };

  const handleSelectAll = () => {
    if (!selection) return;
    if (allSelected) {
      selection.onChange([]);
    } else {
      selection.onChange(rows.map((r) => r.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (!selection) return;
    const next = selectedSet.has(id)
      ? selection.selectedIds.filter((x) => x !== id)
      : [...selection.selectedIds, id];
    selection.onChange(next);
  };

  const ariaSortFor = (key: string): React.AriaAttributes['aria-sort'] => {
    if (!sort || key !== sort.key) return 'none';
    if (sort.direction === 'asc') return 'ascending';
    if (sort.direction === 'desc') return 'descending';
    return 'none';
  };

  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize))
    : 0;

  return (
    <div className={['cc-data-table', className].filter(Boolean).join(' ')}>
      <div className="cc-data-table__wrapper" role="region">
        <table className="cc-table" role="grid" aria-label={ariaLabel}>
          <thead>
            <tr>
              {selection && (
                <th scope="col" className="cc-table__th cc-table__th--checkbox">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected && !allSelected;
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
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
                  {col.sortable && (
                    <span className="cc-table__sort-icon" aria-hidden="true">
                      {sort?.key === col.key && sort.direction === 'asc' ? '↑' : ''}
                      {sort?.key === col.key && sort.direction === 'desc' ? '↓' : ''}
                      {(!sort || sort.key !== col.key || sort.direction === 'none') ? '⇅' : ''}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
                <tr
                  key={`skeleton-${i}`}
                  className="cc-table__row cc-table__row--skeleton"
                  aria-hidden="true"
                >
                  {selection && <td className="cc-table__td" />}
                  {columns.map((col) => (
                    <td key={col.key} className="cc-table__td">
                      <span className="cc-table__skeleton-cell" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selection ? 1 : 0)}
                  className="cc-table__td"
                >
                  <div role="status" className="cc-data-table__empty">
                    {emptyState ?? 'No items found.'}
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isSelected = selectedSet.has(row.id);
                const isActive = row.id === activeRowId;
                return (
                  <tr
                    key={row.id}
                    className={[
                      'cc-table__row',
                      onRowClick ? 'cc-table__row--clickable' : '',
                      isSelected || isActive ? 'is-selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-selected={selection || onRowClick ? (isSelected || isActive) : undefined}
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
                    {selection && (
                      <td className="cc-table__td cc-table__td--checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          aria-label={`Select row ${row.id}`}
                          onChange={() => handleSelectRow(row.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
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

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <nav
          className="cc-data-table__pagination"
          aria-label="Pagination"
          role="navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-3, 0.5rem)',
            padding: 'var(--space-3, 0.5rem) 0',
          }}
        >
          <button
            type="button"
            className="cc-btn cc-btn--ghost cc-btn--sm"
            disabled={pagination.page <= 1}
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            aria-label="Previous page"
          >
            Prev
          </button>
          <span className="cc-data-table__page-info" aria-live="polite">
            Page {pagination.page} of {totalPages}
          </span>
          <button
            type="button"
            className="cc-btn cc-btn--ghost cc-btn--sm"
            disabled={pagination.page >= totalPages}
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
