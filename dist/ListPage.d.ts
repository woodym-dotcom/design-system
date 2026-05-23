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
import { type CreateMenuProps } from './CreateMenu.js';
import { type FilterChip } from './FilterBar.js';
import { type UrlFilterStateRouterAdapter } from './hooks/useUrlFilterState.js';
import type { ListViewColumn, ListViewScopeFilter, ListViewPaginationState, SortDirection } from './ListView.js';
export interface BulkAction<TRow = {
    id: string;
}> {
    id: string;
    label: string;
    /** Called with the full row objects for the selected ids. */
    onRun: (rows: TRow[]) => void;
    /** If true, shows a confirmation step before running. */
    requiresConfirm?: boolean;
}
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
export type ListPageFilters = ListPageFiltersChips | ListPageFiltersSidebar | ListPageFiltersResponsive;
export interface ListPageListProps<TRow extends {
    id: string;
}> {
    columns: ListViewColumn<TRow>[];
    rows: TRow[];
    loading?: boolean;
    error?: React.ReactNode;
    emptyState?: React.ReactNode;
    /** Scope filter tabs rendered above the table (e.g. All / Active / Archived). */
    scopeFilters?: ListViewScopeFilter[];
    activeScopeId?: string;
    onScopeChange?: (id: string) => void;
    sort?: {
        key: string;
        direction: SortDirection;
    };
    onSortChange?: (key: string, direction: SortDirection) => void;
    pagination?: ListViewPaginationState & {
        onPageChange: (page: number) => void;
    };
    onRowClick?: (id: string) => void;
}
export interface ListPageDetailProps {
    /** null = pane closed */
    selectedId: string | null;
    onClose: () => void;
    /**
     * Render the detail pane content.
     * ListPage owns the edit-toggle button; the render ctx provides the current
     * state so the pane body can show the right form/view.
     */
    render: (id: string, ctx: {
        editMode: boolean;
        setEditMode: (v: boolean) => void;
    }) => React.ReactNode;
    /** Controlled fullscreen. Omit for internal management. */
    fullscreen?: boolean;
    onFullscreenChange?: (fs: boolean) => void;
    loading?: boolean;
    error?: React.ReactNode;
}
export interface ListPageUrlState {
    paramPrefix?: string;
    /** TanStack Router or other router adapter. Falls back to history.replaceState. */
    router?: UrlFilterStateRouterAdapter;
}
export interface ListPagePermissions {
    /** false → CreateMenu trigger hidden (not disabled). */
    canCreate?: boolean;
    /** false → edit-toggle button in detail pane hidden. */
    canEdit?: boolean;
    /** false → bulk 'delete' action hidden from bulk bar. */
    canDelete?: boolean;
}
export interface ListPageProps<TRow extends {
    id: string;
} = {
    id: string;
}> {
    heading: string;
    subtitle?: string;
    /** ReactNode rendered above the heading (e.g. a Breadcrumb strip). */
    breadcrumb?: React.ReactNode;
    createMenu?: Pick<CreateMenuProps, 'items' | 'triggerLabel'>;
    /**
     * Optional search/toolbar slot rendered above the filter bar and list.
     * Stays sticky to the top of the scroll container so it remains visible
     * on long lists where the page header has scrolled away.
     */
    search?: React.ReactNode;
    list?: ListPageListProps<TRow>;
    filters?: ListPageFilters;
    detail?: ListPageDetailProps;
    bulk?: {
        selectedIds: string[];
        onChange: (ids: string[]) => void;
        actions: BulkAction<TRow>[];
    };
    urlState?: ListPageUrlState;
    permissions?: ListPagePermissions;
    className?: string;
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
export declare function ListPage<TRow extends {
    id: string;
} = {
    id: string;
}>({ heading, subtitle, breadcrumb, createMenu, search, list: listProp, filters, detail, bulk, urlState, permissions, className, filterOptions, activeFilterIds, onFilterToggle, onFilterRemove, emptyState, pagination: paginationNode, detailPane, selectedId: legacySelectedId, children, }: ListPageProps<TRow>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ListPage.d.ts.map