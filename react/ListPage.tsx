/**
 * ListPage — the canonical entity-surface keystone primitive (Phase 2).
 *
 * Every entity list surface across CC / AA / CL mounts exactly one <ListPage>.
 * Lower-level primitives (FilterBar, DetailPane, CreateMenu) remain importable
 * as escape hatches for non-entity-surface use only.
 *
 * Phase 2 additions (over Phase 1 / original):
 *  - `breadcrumb` slot
 *  - `filters` sub-object (replaces flat filterOptions/activeFilterIds/…)
 *  - `list` sub-object (folds ListView table render + scope filters + sort + pagination)
 *  - `detail` sub-object (edit-mode toggle button; caller owns form state)
 *  - `bulk` sub-object (bulk action bar; z-50)
 *  - `urlState` sub-object (extends useUrlFilterState with scalar + boolean)
 *  - `permissions` sub-object (hide, not disable)
 *
 * Backward compat: old flat filter props (filterOptions/activeFilterIds/…),
 * `children`, `emptyState`, `pagination`, `detailPane`, `selectedId` are
 * preserved but deprecated. Migrate to `list`, `filters`, `detail` sub-objects.
 *
 * Edge cases (proposal §3.3):
 *  1. Filter change while detail pane open — close pane if selectedId drops
 *     out of filtered rows.
 *  2. Fullscreen + bulk z-index — bulk bar z-50; pane z-40 / fullscreen z-60.
 *  3. Edit-mode — ListPage owns the toggle button; caller owns form state via
 *     detail.render ctx arg.
 *  4. Loading per region — list.loading and detail.loading are independent.
 *  5. Error per region — list.error shows inline banner; detail.error in pane.
 *  6. Empty states — filter-active zero shows built-in "No matches" + clear.
 *  7. Permission gating — hide affordances (not disable).
 */
import * as React from 'react';
import { CreateMenu, type CreateMenuProps } from './CreateMenu';
import { FilterBar, type FilterChip } from './FilterBar';
import {
  useUrlFilterState,
  type UseUrlFilterStateOptions,
  type UrlFilterStateRouterAdapter,
} from './hooks/useUrlFilterState';
import type {
  ListViewColumn,
  ListViewScopeFilter,
  ListViewPaginationState,
  SortDirection,
} from './ListView';

// ── Bulk actions ──────────────────────────────────────────────────────────────

export interface BulkAction<TRow = { id: string }> {
  id: string;
  label: string;
  /** Called with the full row objects for the selected ids. */
  onRun: (rows: TRow[]) => void;
  /** If true, shows a confirmation step before running. */
  requiresConfirm?: boolean;
}

// ── Filters sub-prop ──────────────────────────────────────────────────────────

export type ListPageFiltersChips = {
  kind: 'chips';
  options: FilterChip[];
  activeIds: string[];
  onToggle: (id: string) => void;
  onRemove?: (id: string) => void;
};

export type ListPageFiltersSidebar = {
  kind: 'sidebar';
  options: FilterChip[];
  activeIds: string[];
  onToggle: (id: string) => void;
};

export type ListPageFiltersResponsive = {
  kind: 'responsive';
  options: FilterChip[];
  activeIds: string[];
  onToggle: (id: string) => void;
  collapsedAt?: number;
};

export type ListPageFilters =
  | ListPageFiltersChips
  | ListPageFiltersSidebar
  | ListPageFiltersResponsive;

// ── List sub-prop ─────────────────────────────────────────────────────────────

export interface ListPageListProps<TRow extends { id: string }> {
  columns: ListViewColumn<TRow>[];
  rows: TRow[];
  loading?: boolean;
  error?: React.ReactNode;
  emptyState?: React.ReactNode;
  /** Scope filter tabs rendered above the table (e.g. All / Active / Archived). */
  scopeFilters?: ListViewScopeFilter[];
  activeScopeId?: string;
  onScopeChange?: (id: string) => void;
  sort?: { key: string; direction: SortDirection };
  onSortChange?: (key: string, direction: SortDirection) => void;
  pagination?: ListViewPaginationState & { onPageChange: (page: number) => void };
  onRowClick?: (id: string) => void;
}

// ── Detail sub-prop ───────────────────────────────────────────────────────────

export interface ListPageDetailProps {
  /** null = pane closed */
  selectedId: string | null;
  onClose: () => void;
  /**
   * Render the detail pane content.
   * ListPage owns the edit-toggle button; the render ctx provides the current
   * state so the pane body can show the right form/view.
   */
  render: (
    id: string,
    ctx: { editMode: boolean; setEditMode: (v: boolean) => void },
  ) => React.ReactNode;
  /** Controlled fullscreen. Omit for internal management. */
  fullscreen?: boolean;
  onFullscreenChange?: (fs: boolean) => void;
  loading?: boolean;
  error?: React.ReactNode;
}

// ── URL state sub-prop ────────────────────────────────────────────────────────

export interface ListPageUrlState {
  paramPrefix?: string;
  /** TanStack Router or other router adapter. Falls back to history.replaceState. */
  router?: UrlFilterStateRouterAdapter;
}

// ── Permissions sub-prop ──────────────────────────────────────────────────────

export interface ListPagePermissions {
  /** false → CreateMenu trigger hidden (not disabled). */
  canCreate?: boolean;
  /** false → edit-toggle button in detail pane hidden. */
  canEdit?: boolean;
  /** false → bulk 'delete' action hidden from bulk bar. */
  canDelete?: boolean;
}

// ── Main props ────────────────────────────────────────────────────────────────

export interface ListPageProps<TRow extends { id: string } = { id: string }> {
  // ── header
  heading: string;
  subtitle?: string;
  /** ReactNode rendered above the heading (e.g. a Breadcrumb strip). */
  breadcrumb?: React.ReactNode;
  createMenu?: Pick<CreateMenuProps, 'items' | 'triggerLabel'>;

  // ── list region
  // Required in Phase 2. For backward-compat callers that use only `children`,
  // you may pass `list={{ columns: [], rows: [] }}` or omit (will default to empty).
  list?: ListPageListProps<TRow>;

  // ── filters
  filters?: ListPageFilters;

  // ── detail pane
  detail?: ListPageDetailProps;

  // ── bulk actions
  bulk?: {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    actions: BulkAction<TRow>[];
  };

  // ── URL state (opt-in)
  urlState?: ListPageUrlState;

  // ── permissions
  permissions?: ListPagePermissions;

  className?: string;

  // ── Deprecated flat filter props (backward compat — migrate to filters sub-object)
  /** @deprecated Use filters={{ kind:'chips', options, activeIds, onToggle }} */
  filterOptions?: FilterChip[];
  /** @deprecated Use filters.activeIds */
  activeFilterIds?: string[];
  /** @deprecated Use filters.onToggle */
  onFilterToggle?: (id: string) => void;
  /** @deprecated Use filters.onRemove */
  onFilterRemove?: (id: string) => void;
  /** @deprecated Use list.emptyState */
  emptyState?: React.ReactNode;
  /** @deprecated Use list.pagination rendered below list */
  pagination?: React.ReactNode;
  /** @deprecated Use detail.render + detail.selectedId */
  detailPane?: (selectedId: string | null) => React.ReactNode;
  /** @deprecated Use detail.selectedId */
  selectedId?: string | null;
  /** @deprecated Render your list via list.columns + list.rows instead */
  children?: React.ReactNode;
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

// ── TableRegion ───────────────────────────────────────────────────────────────

interface TableRegionProps<TRow extends { id: string }> {
  list: ListPageListProps<TRow>;
  effectiveEmptyState: React.ReactNode;
  bulkSelectedIds: string[];
  onSelectRow?: (id: string) => void;
  detailSelectedId: string | null;
}

function TableRegion<TRow extends { id: string }>({
  list,
  effectiveEmptyState,
  bulkSelectedIds,
  onSelectRow,
  detailSelectedId,
}: TableRegionProps<TRow>) {
  const { columns, rows, loading, error, sort, onSortChange, onRowClick } = list;

  if (error) {
    return (
      <div className="cc-list-page__list-error" role="alert">
        {error}
      </div>
    );
  }

  const bulkSet = new Set(bulkSelectedIds);

  const handleHeaderClick = (col: ListViewColumn<TRow>) => {
    if (!col.sortable || !onSortChange) return;
    const next = nextSortDirection(
      sort?.key ?? '',
      col.key,
      sort?.direction ?? 'none',
    );
    onSortChange(col.key, next);
  };

  const ariaSortFor = (key: string): React.AriaAttributes['aria-sort'] => {
    if (!sort || key !== sort.key) return 'none';
    if (sort.direction === 'asc') return 'ascending';
    if (sort.direction === 'desc') return 'descending';
    return 'none';
  };

  return (
    <div className="cc-list-page__table-wrapper" role="region">
      <table className="cc-table" role="grid">
        <thead>
          <tr>
            {onSelectRow ? (
              <th scope="col" className="cc-table__th cc-table__th--checkbox">
                <span className="cc-sr-only">Select</span>
              </th>
            ) : null}
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
                    {sort?.key === col.key && sort?.direction === 'asc' ? '↑' : ''}
                    {sort?.key === col.key && sort?.direction === 'desc' ? '↓' : ''}
                    {(!sort || sort.key !== col.key || sort.direction === 'none')
                      ? '⇅'
                      : ''}
                  </span>
                ) : null}
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
                {onSelectRow ? <td className="cc-table__td" /> : null}
                {columns.map((col) => (
                  <td key={col.key} className="cc-table__td">
                    <span className="cc-table__skeleton-cell" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onSelectRow ? 1 : 0)}>
                <div role="status" className="cc-list-page__empty">
                  {effectiveEmptyState ?? 'No items found.'}
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const isDetailSelected = row.id === detailSelectedId;
              const isBulkSelected = bulkSet.has(row.id);
              const isSelected = isDetailSelected || isBulkSelected;
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
                  aria-selected={onRowClick || onSelectRow ? isSelected : undefined}
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
                  {onSelectRow ? (
                    <td className="cc-table__td cc-table__td--checkbox">
                      <input
                        type="checkbox"
                        checked={isBulkSelected}
                        aria-label={`Select row ${row.id}`}
                        onChange={() => onSelectRow(row.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  ) : null}
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
  );
}

// ── PaginationBar ─────────────────────────────────────────────────────────────

interface PaginationBarProps {
  pagination: ListViewPaginationState & { onPageChange: (page: number) => void };
}

function PaginationBar({ pagination }: PaginationBarProps) {
  const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);
  if (totalPages <= 1) return null;
  return (
    <nav
      className="cc-list-page__pagination"
      aria-label="Pagination"
      role="navigation"
    >
      <button
        type="button"
        className="cc-btn cc-btn--ghost cc-btn--sm"
        disabled={pagination.page <= 1}
        onClick={() => pagination.onPageChange(pagination.page - 1)}
        aria-label="Previous page"
      >
        ‹ Prev
      </button>
      <span className="cc-list-page__page-info" aria-live="polite">
        Page {pagination.page} of {totalPages}
      </span>
      <button
        type="button"
        className="cc-btn cc-btn--ghost cc-btn--sm"
        disabled={pagination.page >= totalPages}
        onClick={() => pagination.onPageChange(pagination.page + 1)}
        aria-label="Next page"
      >
        Next ›
      </button>
    </nav>
  );
}

// ── BulkBar ───────────────────────────────────────────────────────────────────

interface BulkBarProps<TRow extends { id: string }> {
  selectedIds: string[];
  rows: TRow[];
  actions: BulkAction<TRow>[];
  onChange: (ids: string[]) => void;
  canDelete?: boolean;
}

function BulkBar<TRow extends { id: string }>({
  selectedIds,
  rows,
  actions,
  onChange,
  canDelete,
}: BulkBarProps<TRow>) {
  if (selectedIds.length === 0) return null;

  const selectedRows = rows.filter((r) => selectedIds.includes(r.id));
  const visibleActions =
    canDelete === false
      ? actions.filter((a) => a.id !== 'delete')
      : actions;

  return (
    /* z-50: above list + pane (z-40); below fullscreen pane (z-60) */
    <div
      className="cc-list-page__bulk-bar"
      role="toolbar"
      aria-label={`${selectedIds.length} item${selectedIds.length !== 1 ? 's' : ''} selected`}
      style={{ zIndex: 50 }}
    >
      <span className="cc-list-page__bulk-count">{selectedIds.length} selected</span>
      <div className="cc-list-page__bulk-actions">
        {visibleActions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="cc-btn cc-btn--ghost cc-btn--sm"
            onClick={() => action.onRun(selectedRows)}
          >
            {action.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="cc-btn cc-btn--ghost cc-btn--sm"
        onClick={() => onChange([])}
        aria-label="Clear selection"
      >
        Clear
      </button>
    </div>
  );
}

// ── DetailShell ───────────────────────────────────────────────────────────────

interface DetailShellProps {
  detail: ListPageDetailProps;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  canEdit?: boolean;
  internalFullscreen: boolean;
  onFullscreenToggle: () => void;
}

function DetailShell({
  detail,
  editMode,
  setEditMode,
  canEdit,
  internalFullscreen,
  onFullscreenToggle,
}: DetailShellProps) {
  const { selectedId, onClose, render, loading, error } = detail;
  const isFullscreen =
    detail.fullscreen !== undefined ? detail.fullscreen : internalFullscreen;

  if (!selectedId) return null;

  return (
    /* z-40 normal; z-60 fullscreen (covers bulk bar at z-50) */
    <aside
      className={[
        'cc-list-page__detail-pane',
        isFullscreen ? 'cc-list-page__detail-pane--fullscreen' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ zIndex: isFullscreen ? 60 : 40 }}
      aria-label="Detail pane"
    >
      <div className="cc-list-page__detail-header">
        {canEdit !== false ? (
          <button
            type="button"
            className={[
              'cc-btn cc-btn--ghost cc-btn--sm',
              editMode ? 'is-active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setEditMode(!editMode)}
            aria-pressed={editMode}
            aria-label={editMode ? 'Switch to view mode' : 'Switch to edit mode'}
          >
            {editMode ? 'Viewing' : 'Edit'}
          </button>
        ) : null}
        <button
          type="button"
          className="cc-btn cc-btn--ghost cc-btn--sm"
          onClick={() => {
            if (detail.onFullscreenChange) {
              detail.onFullscreenChange(!isFullscreen);
            } else {
              onFullscreenToggle();
            }
          }}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? '⊠' : '⊞'}
        </button>
        <button
          type="button"
          className="cc-btn cc-btn--ghost cc-btn--sm"
          onClick={onClose}
          aria-label="Close detail pane"
        >
          ×
        </button>
      </div>
      <div className="cc-list-page__detail-body">
        {loading ? (
          <div className="cc-list-page__detail-loading" aria-live="polite">
            <span className="cc-table__skeleton-cell" style={{ display: 'block', minHeight: 80 }} />
          </div>
        ) : error ? (
          <div className="cc-list-page__detail-error" role="alert">
            {error}
          </div>
        ) : (
          render(selectedId, { editMode, setEditMode })
        )}
      </div>
    </aside>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const EMPTY_LIST = { columns: [], rows: [] };

export function ListPage<TRow extends { id: string } = { id: string }>({
  heading,
  subtitle,
  breadcrumb,
  createMenu,
  list: listProp,
  filters,
  detail,
  bulk,
  urlState,
  permissions,
  className,
  // Deprecated flat props
  filterOptions,
  activeFilterIds = [],
  onFilterToggle,
  onFilterRemove,
  emptyState,
  pagination: paginationNode,
  detailPane,
  selectedId: legacySelectedId = null,
  children,
}: ListPageProps<TRow>) {
  // Legacy callers may pass only `children` and omit `list`. In that case we
  // skip the TableRegion entirely so its built-in empty state ("No items
  // found.") doesn't collide with the caller-rendered legacy content.
  const hasExplicitList = listProp !== undefined;
  const list = listProp ?? (EMPTY_LIST as unknown as ListPageListProps<TRow>);

  // ── URL state (opt-in) ────────────────────────────────────────────────────
  const urlOpts: UseUrlFilterStateOptions = urlState
    ? { paramPrefix: urlState.paramPrefix ?? '', router: urlState.router }
    : {};

  // We always call the hook (hooks must not be conditional) but only write when
  // urlState is provided. The initial shape covers the three scalars Phase 2
  // adds: active filters are caller-owned; selectedId and fullscreen are page-level.
  const [_urlPageState, _setUrlPageState] = useUrlFilterState(
    { _selectedId: '', _fullscreen: false },
    urlState ? urlOpts : {},
  );
  // Currently unused directly — consumers manage filter arrays themselves and
  // pass them as filters.activeIds; this wires the scalar/bool extension.
  void _urlPageState;
  void _setUrlPageState;

  // ── Edit mode ─────────────────────────────────────────────────────────────
  const [editMode, setEditMode] = React.useState(false);

  // Reset edit mode when selected item changes.
  const prevSelectedIdRef = React.useRef<string | null>(null);
  const currentSelectedId = detail?.selectedId ?? null;
  React.useEffect(() => {
    if (currentSelectedId !== prevSelectedIdRef.current) {
      prevSelectedIdRef.current = currentSelectedId;
      setEditMode(false);
    }
  }, [currentSelectedId]);

  // ── Fullscreen (uncontrolled fallback when detail.fullscreen is absent) ───
  const [internalFullscreen, setInternalFullscreen] = React.useState(false);

  // ── Edge case 1: close pane if selectedId drops out of rows ──────────────
  React.useEffect(() => {
    if (!detail?.selectedId) return;
    const stillInRows = list.rows.some((r) => r.id === detail.selectedId);
    if (!stillInRows) {
      detail.onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.rows, detail?.selectedId]);

  // ── Resolve filters ───────────────────────────────────────────────────────
  const resolvedFilters: ListPageFilters | undefined =
    filters ??
    (filterOptions && filterOptions.length > 0
      ? {
          kind: 'chips' as const,
          options: filterOptions,
          activeIds: activeFilterIds,
          onToggle: onFilterToggle ?? (() => {}),
          onRemove: onFilterRemove,
        }
      : undefined);

  const hasActiveFilters =
    resolvedFilters !== undefined && resolvedFilters.activeIds.length > 0;

  // ── Effective empty state (edge case 6) ───────────────────────────────────
  const filteredEmptyState: React.ReactNode = hasActiveFilters ? (
    <div className="cc-list-page__filter-empty" role="status">
      <p>No matches for the current filters.</p>
      <button
        type="button"
        className="cc-btn cc-btn--ghost cc-btn--sm"
        onClick={() => {
          if (resolvedFilters) {
            // Toggle off every active filter.
            for (const id of [...resolvedFilters.activeIds]) {
              resolvedFilters.onToggle(id);
            }
          }
        }}
      >
        Clear filters
      </button>
    </div>
  ) : null;

  const effectiveEmptyState =
    filteredEmptyState ?? list.emptyState ?? emptyState ?? null;

  // ── Permission helpers ────────────────────────────────────────────────────
  const canCreate = permissions?.canCreate !== false;

  const classes = ['cc-list-page'];
  if (className) classes.push(className);
  if (detail?.selectedId) classes.push('cc-list-page--has-detail');

  return (
    <div className={classes.join(' ')}>
      {/* Breadcrumb */}
      {breadcrumb ? (
        <div className="cc-list-page__breadcrumb">{breadcrumb}</div>
      ) : null}

      {/* Header */}
      <div className="cc-list-page__header">
        <div className="cc-list-page__heading-group">
          <h2 className="cc-list-page__heading">{heading}</h2>
          {subtitle ? (
            <p className="cc-list-page__subtitle">{subtitle}</p>
          ) : null}
        </div>
        {createMenu && canCreate ? (
          <CreateMenu
            items={createMenu.items}
            triggerLabel={createMenu.triggerLabel}
          />
        ) : null}
      </div>

      {/* Filters */}
      {resolvedFilters ? (
        <div className="cc-list-page__filters">
          <FilterBar
            options={resolvedFilters.options}
            activeIds={resolvedFilters.activeIds}
            onToggle={resolvedFilters.onToggle}
            onRemove={
              'onRemove' in resolvedFilters
                ? resolvedFilters.onRemove
                : undefined
            }
            layout={
              resolvedFilters.kind === 'sidebar'
                ? 'sidebar'
                : resolvedFilters.kind === 'responsive'
                ? 'responsive'
                : 'horizontal'
            }
            collapsedAt={
              'collapsedAt' in resolvedFilters
                ? resolvedFilters.collapsedAt
                : undefined
            }
          />
        </div>
      ) : null}

      {/* Scope filter tabs */}
      {list.scopeFilters && list.scopeFilters.length > 0 ? (
        <div className="cc-list-view__scope-tabs" role="tablist" aria-label="Scope filters">
          {list.scopeFilters.map((f) => {
            const active = f.id === list.activeScopeId;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={['cc-list-view__scope-tab', active ? 'is-active' : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => list.onScopeChange?.(f.id)}
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

      {/* Main content: list + detail pane */}
      <div className="cc-list-page__content">
        <div className="cc-list-page__list">
          {hasExplicitList ? (
            <TableRegion
              list={list}
              effectiveEmptyState={effectiveEmptyState}
              bulkSelectedIds={bulk?.selectedIds ?? []}
              onSelectRow={
                bulk
                  ? (id) => {
                      const next = bulk.selectedIds.includes(id)
                        ? bulk.selectedIds.filter((x) => x !== id)
                        : [...bulk.selectedIds, id];
                      bulk.onChange(next);
                    }
                  : undefined
              }
              detailSelectedId={detail?.selectedId ?? legacySelectedId}
            />
          ) : null}

          {/* Legacy children slot */}
          {children ? (
            <div className="cc-list-page__body">{children}</div>
          ) : null}

          {/* Pagination */}
          {list.pagination ? (
            <PaginationBar pagination={list.pagination} />
          ) : paginationNode ? (
            <div className="cc-list-page__pagination">{paginationNode}</div>
          ) : null}
        </div>

        {/* Detail pane */}
        {detail ? (
          <DetailShell
            detail={detail}
            editMode={editMode}
            setEditMode={setEditMode}
            canEdit={permissions?.canEdit}
            internalFullscreen={internalFullscreen}
            onFullscreenToggle={() => setInternalFullscreen((v) => !v)}
          />
        ) : detailPane ? (
          /* Legacy detailPane render-prop */
          <aside className="cc-list-page__detail-pane">
            {detailPane(legacySelectedId)}
          </aside>
        ) : null}
      </div>

      {/* Bulk action bar — z-50, above list pane (z-40), below fullscreen (z-60) */}
      {bulk ? (
        <BulkBar
          selectedIds={bulk.selectedIds}
          rows={list.rows}
          actions={bulk.actions}
          onChange={bulk.onChange}
          canDelete={permissions?.canDelete}
        />
      ) : null}
    </div>
  );
}
