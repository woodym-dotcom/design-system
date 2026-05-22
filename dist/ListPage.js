import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @deprecated Use `<ModuleTemplate variant="list">` from `./ModuleTemplate`
 * (DS-SIMPLIFY 04). Will be removed in v1.0 (SIMPLIFY 14).
 *
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
import { CreateMenu } from './CreateMenu.js';
import { FilterBar } from './FilterBar.js';
import { useUrlFilterState, } from './hooks/useUrlFilterState.js';
// ── Helpers ───────────────────────────────────────────────────────────────────
function nextSortDirection(currentKey, clickedKey, currentDir) {
    if (currentKey !== clickedKey)
        return 'asc';
    if (currentDir === 'asc')
        return 'desc';
    if (currentDir === 'desc')
        return 'none';
    return 'asc';
}
const SKELETON_ROW_COUNT = 5;
function TableRegion({ list, effectiveEmptyState, bulkSelectedIds, onSelectRow, detailSelectedId, }) {
    const { columns, rows, loading, error, sort, onSortChange, onRowClick } = list;
    if (error) {
        return (_jsx("div", { className: "cc-list-page__list-error", role: "alert", children: error }));
    }
    const bulkSet = new Set(bulkSelectedIds);
    const handleHeaderClick = (col) => {
        if (!col.sortable || !onSortChange)
            return;
        const next = nextSortDirection(sort?.key ?? '', col.key, sort?.direction ?? 'none');
        onSortChange(col.key, next);
    };
    const ariaSortFor = (key) => {
        if (!sort || key !== sort.key)
            return 'none';
        if (sort.direction === 'asc')
            return 'ascending';
        if (sort.direction === 'desc')
            return 'descending';
        return 'none';
    };
    return (_jsx("div", { className: "cc-list-page__table-wrapper", role: "region", children: _jsxs("table", { className: "cc-table", role: "grid", children: [_jsx("thead", { children: _jsxs("tr", { children: [onSelectRow ? (_jsx("th", { scope: "col", className: "cc-table__th cc-table__th--checkbox", children: _jsx("span", { className: "cc-sr-only", children: "Select" }) })) : null, columns.map((col) => (_jsxs("th", { scope: "col", "aria-sort": col.sortable ? ariaSortFor(col.key) : undefined, style: col.minWidth ? { minWidth: col.minWidth } : undefined, className: [
                                    'cc-table__th',
                                    col.sortable ? 'cc-table__th--sortable' : '',
                                ]
                                    .filter(Boolean)
                                    .join(' '), onClick: col.sortable ? () => handleHeaderClick(col) : undefined, onKeyDown: col.sortable
                                    ? (e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleHeaderClick(col);
                                        }
                                    }
                                    : undefined, tabIndex: col.sortable ? 0 : undefined, children: [_jsx("span", { className: "cc-table__th-label", children: col.label }), col.sortable ? (_jsxs("span", { className: "cc-table__sort-icon", "aria-hidden": "true", children: [sort?.key === col.key && sort?.direction === 'asc' ? '↑' : '', sort?.key === col.key && sort?.direction === 'desc' ? '↓' : '', (!sort || sort.key !== col.key || sort.direction === 'none')
                                                ? '⇅'
                                                : ''] })) : null] }, col.key)))] }) }), _jsx("tbody", { children: loading ? (Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (_jsxs("tr", { className: "cc-table__row cc-table__row--skeleton", "aria-hidden": "true", children: [onSelectRow ? _jsx("td", { className: "cc-table__td" }) : null, columns.map((col) => (_jsx("td", { className: "cc-table__td", children: _jsx("span", { className: "cc-table__skeleton-cell" }) }, col.key)))] }, `skeleton-${i}`)))) : rows.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length + (onSelectRow ? 1 : 0), children: _jsx("div", { role: "status", className: "cc-list-page__empty", children: effectiveEmptyState ?? 'No items found.' }) }) })) : (rows.map((row) => {
                        const isDetailSelected = row.id === detailSelectedId;
                        const isBulkSelected = bulkSet.has(row.id);
                        const isSelected = isDetailSelected || isBulkSelected;
                        return (_jsxs("tr", { className: [
                                'cc-table__row',
                                onRowClick ? 'cc-table__row--clickable' : '',
                                isSelected ? 'is-selected' : '',
                            ]
                                .filter(Boolean)
                                .join(' '), "aria-selected": onRowClick || onSelectRow ? isSelected : undefined, tabIndex: onRowClick ? 0 : undefined, onClick: onRowClick ? () => onRowClick(row.id) : undefined, onKeyDown: onRowClick
                                ? (e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onRowClick(row.id);
                                    }
                                }
                                : undefined, children: [onSelectRow ? (_jsx("td", { className: "cc-table__td cc-table__td--checkbox", children: _jsx("input", { type: "checkbox", checked: isBulkSelected, "aria-label": `Select row ${row.id}`, onChange: () => onSelectRow(row.id), onClick: (e) => e.stopPropagation() }) })) : null, columns.map((col) => (_jsx("td", { className: "cc-table__td", children: col.render(row) }, col.key)))] }, row.id));
                    })) })] }) }));
}
function PaginationBar({ pagination }) {
    const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);
    if (totalPages <= 1)
        return null;
    return (_jsxs("nav", { className: "cc-list-page__pagination", "aria-label": "Pagination", role: "navigation", children: [_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", disabled: pagination.page <= 1, onClick: () => pagination.onPageChange(pagination.page - 1), "aria-label": "Previous page", children: "\u2039 Prev" }), _jsxs("span", { className: "cc-list-page__page-info", "aria-live": "polite", children: ["Page ", pagination.page, " of ", totalPages] }), _jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", disabled: pagination.page >= totalPages, onClick: () => pagination.onPageChange(pagination.page + 1), "aria-label": "Next page", children: "Next \u203A" })] }));
}
function BulkBar({ selectedIds, rows, actions, onChange, canDelete, }) {
    if (selectedIds.length === 0)
        return null;
    const selectedRows = rows.filter((r) => selectedIds.includes(r.id));
    const visibleActions = canDelete === false
        ? actions.filter((a) => a.id !== 'delete')
        : actions;
    return (
    /* z-50: above list + pane (z-40); below fullscreen pane (z-60) */
    _jsxs("div", { className: "cc-list-page__bulk-bar", role: "toolbar", "aria-label": `${selectedIds.length} item${selectedIds.length !== 1 ? 's' : ''} selected`, style: { zIndex: 50 }, children: [_jsxs("span", { className: "cc-list-page__bulk-count", children: [selectedIds.length, " selected"] }), _jsx("div", { className: "cc-list-page__bulk-actions", children: visibleActions.map((action) => (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", onClick: () => action.onRun(selectedRows), children: action.label }, action.id))) }), _jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", onClick: () => onChange([]), "aria-label": "Clear selection", children: "Clear" })] }));
}
function DetailShell({ detail, editMode, setEditMode, canEdit, internalFullscreen, onFullscreenToggle, }) {
    const { selectedId, onClose, render, loading, error } = detail;
    const isFullscreen = detail.fullscreen !== undefined ? detail.fullscreen : internalFullscreen;
    if (!selectedId)
        return null;
    return (
    /* z-40 normal; z-60 fullscreen (covers bulk bar at z-50) */
    _jsxs("aside", { className: [
            'cc-list-page__detail-pane',
            isFullscreen ? 'cc-list-page__detail-pane--fullscreen' : '',
        ]
            .filter(Boolean)
            .join(' '), style: { zIndex: isFullscreen ? 60 : 40 }, "aria-label": "Detail pane", children: [_jsxs("div", { className: "cc-list-page__detail-header", children: [canEdit !== false ? (_jsx("button", { type: "button", className: [
                            'cc-btn cc-btn--ghost cc-btn--sm',
                            editMode ? 'is-active' : '',
                        ]
                            .filter(Boolean)
                            .join(' '), onClick: () => setEditMode(!editMode), "aria-pressed": editMode, "aria-label": editMode ? 'Switch to view mode' : 'Switch to edit mode', children: editMode ? 'Viewing' : 'Edit' })) : null, _jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", onClick: () => {
                            if (detail.onFullscreenChange) {
                                detail.onFullscreenChange(!isFullscreen);
                            }
                            else {
                                onFullscreenToggle();
                            }
                        }, "aria-label": isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen', children: isFullscreen ? '⊠' : '⊞' }), _jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", onClick: onClose, "aria-label": "Close detail pane", children: "\u00D7" })] }), _jsx("div", { className: "cc-list-page__detail-body", children: loading ? (_jsx("div", { className: "cc-list-page__detail-loading", "aria-live": "polite", children: _jsx("span", { className: "cc-table__skeleton-cell", style: { display: 'block', minHeight: 80 } }) })) : error ? (_jsx("div", { className: "cc-list-page__detail-error", role: "alert", children: error })) : (render(selectedId, { editMode, setEditMode })) })] }));
}
// ── Main component ────────────────────────────────────────────────────────────
const EMPTY_LIST = { columns: [], rows: [] };
export function ListPage({ heading, subtitle, breadcrumb, createMenu, search, list: listProp, filters, detail, bulk, urlState, permissions, className, 
// Deprecated flat props
filterOptions, activeFilterIds = [], onFilterToggle, onFilterRemove, emptyState, pagination: paginationNode, detailPane, selectedId: legacySelectedId = null, children, }) {
    // Legacy callers may pass only `children` and omit `list`. In that case we
    // skip the TableRegion entirely so its built-in empty state ("No items
    // found.") doesn't collide with the caller-rendered legacy content.
    const hasExplicitList = listProp !== undefined;
    const list = listProp ?? EMPTY_LIST;
    // ── URL state (opt-in) ────────────────────────────────────────────────────
    const urlOpts = urlState
        ? { paramPrefix: urlState.paramPrefix ?? '', router: urlState.router }
        : {};
    // We always call the hook (hooks must not be conditional) but only write when
    // urlState is provided. The initial shape covers the three scalars Phase 2
    // adds: active filters are caller-owned; selectedId and fullscreen are page-level.
    const [_urlPageState, _setUrlPageState] = useUrlFilterState({ _selectedId: '', _fullscreen: false }, urlState ? urlOpts : {});
    // Currently unused directly — consumers manage filter arrays themselves and
    // pass them as filters.activeIds; this wires the scalar/bool extension.
    void _urlPageState;
    void _setUrlPageState;
    // ── Edit mode ─────────────────────────────────────────────────────────────
    const [editMode, setEditMode] = React.useState(false);
    // Reset edit mode when selected item changes.
    const prevSelectedIdRef = React.useRef(null);
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
    // Skip while the list is loading: a refetch can briefly empty `rows` before
    // the new page arrives, and we don't want to close the user's open pane.
    React.useEffect(() => {
        if (!detail?.selectedId)
            return;
        if (list.loading)
            return;
        const stillInRows = list.rows.some((r) => r.id === detail.selectedId);
        if (!stillInRows) {
            detail.onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list.rows, list.loading, detail?.selectedId]);
    // ── Resolve filters ───────────────────────────────────────────────────────
    const resolvedFilters = filters ??
        (filterOptions && filterOptions.length > 0
            ? {
                kind: 'chips',
                options: filterOptions,
                activeIds: activeFilterIds,
                onToggle: onFilterToggle ?? (() => { }),
                onRemove: onFilterRemove,
            }
            : undefined);
    const hasActiveFilters = resolvedFilters !== undefined && resolvedFilters.activeIds.length > 0;
    // ── Effective empty state (edge case 6) ───────────────────────────────────
    const filteredEmptyState = hasActiveFilters ? (_jsxs("div", { className: "cc-list-page__filter-empty", role: "status", children: [_jsx("p", { children: "No matches for the current filters." }), _jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", onClick: () => {
                    if (resolvedFilters) {
                        // Toggle off every active filter.
                        for (const id of [...resolvedFilters.activeIds]) {
                            resolvedFilters.onToggle(id);
                        }
                    }
                }, children: "Clear filters" })] })) : null;
    const effectiveEmptyState = filteredEmptyState ?? list.emptyState ?? emptyState ?? null;
    // ── Permission helpers ────────────────────────────────────────────────────
    const canCreate = permissions?.canCreate !== false;
    const classes = ['cc-list-page'];
    if (className)
        classes.push(className);
    if (detail?.selectedId)
        classes.push('cc-list-page--has-detail');
    return (_jsxs("div", { className: classes.join(' '), children: [breadcrumb ? (_jsx("div", { className: "cc-list-page__breadcrumb", children: breadcrumb })) : null, _jsxs("div", { className: "cc-list-page__header", children: [_jsxs("div", { className: "cc-list-page__heading-group", children: [_jsx("h2", { className: "cc-list-page__heading", children: heading }), subtitle ? (_jsx("p", { className: "cc-list-page__subtitle", children: subtitle })) : null] }), createMenu && canCreate ? (_jsx("div", { className: "cc-list-page__primary-action", children: _jsx(CreateMenu, { items: createMenu.items, triggerLabel: createMenu.triggerLabel }) })) : null] }), search ? (_jsx("div", { className: "cc-list-page__search", children: search })) : null, resolvedFilters ? (_jsx("div", { className: "cc-list-page__filters", children: _jsx(FilterBar, { options: resolvedFilters.options, activeIds: resolvedFilters.activeIds, onToggle: resolvedFilters.onToggle, onRemove: 'onRemove' in resolvedFilters
                        ? resolvedFilters.onRemove
                        : undefined, layout: resolvedFilters.kind === 'sidebar'
                        ? 'sidebar'
                        : resolvedFilters.kind === 'responsive'
                            ? 'responsive'
                            : 'horizontal', collapsedAt: 'collapsedAt' in resolvedFilters
                        ? resolvedFilters.collapsedAt
                        : undefined }) })) : null, list.scopeFilters && list.scopeFilters.length > 0 ? (_jsx("div", { className: "cc-list-view__scope-tabs", role: "tablist", "aria-label": "Scope filters", children: list.scopeFilters.map((f) => {
                    const active = f.id === list.activeScopeId;
                    return (_jsxs("button", { type: "button", role: "tab", "aria-selected": active, className: ['cc-list-view__scope-tab', active ? 'is-active' : '']
                            .filter(Boolean)
                            .join(' '), onClick: () => list.onScopeChange?.(f.id), children: [f.label, f.count !== undefined ? (_jsx("span", { className: "cc-list-view__scope-count", children: f.count })) : null] }, f.id));
                }) })) : null, _jsxs("div", { className: "cc-list-page__content", children: [_jsxs("div", { className: "cc-list-page__list", children: [hasExplicitList ? (_jsx(TableRegion, { list: list, effectiveEmptyState: effectiveEmptyState, bulkSelectedIds: bulk?.selectedIds ?? [], onSelectRow: bulk
                                    ? (id) => {
                                        const next = bulk.selectedIds.includes(id)
                                            ? bulk.selectedIds.filter((x) => x !== id)
                                            : [...bulk.selectedIds, id];
                                        bulk.onChange(next);
                                    }
                                    : undefined, detailSelectedId: detail?.selectedId ?? legacySelectedId })) : null, children ? (_jsx("div", { className: "cc-list-page__body", children: children })) : null, !hasExplicitList && !children && effectiveEmptyState ? (_jsx("div", { className: "cc-list-page__body", children: effectiveEmptyState })) : null, list.pagination ? (_jsx(PaginationBar, { pagination: list.pagination })) : paginationNode ? (_jsx("div", { className: "cc-list-page__pagination", children: paginationNode })) : null] }), detail ? (_jsx(DetailShell, { detail: detail, editMode: editMode, setEditMode: setEditMode, canEdit: permissions?.canEdit, internalFullscreen: internalFullscreen, onFullscreenToggle: () => setInternalFullscreen((v) => !v) })) : detailPane ? (
                    /* Legacy detailPane render-prop */
                    _jsx("aside", { className: "cc-list-page__detail-pane", children: detailPane(legacySelectedId) })) : null] }), bulk ? (_jsx(BulkBar, { selectedIds: bulk.selectedIds, rows: list.rows, actions: bulk.actions, onChange: bulk.onChange, canDelete: permissions?.canDelete })) : null] }));
}
//# sourceMappingURL=ListPage.js.map