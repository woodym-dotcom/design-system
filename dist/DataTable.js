import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ── Helpers ─────────────────────────────────────────────────────────────────
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
// ── Component ───────────────────────────────────────────────────────────────
export function DataTable({ columns, rows, loading = false, emptyState, sort, onSortChange, pagination, selection, onRowClick, activeRowId, ariaLabel = 'Data table', className, }) {
    const selectedSet = new Set(selection?.selectedIds ?? []);
    const allSelected = rows.length > 0 && rows.every((r) => selectedSet.has(r.id));
    const someSelected = rows.some((r) => selectedSet.has(r.id));
    const handleHeaderClick = (col) => {
        if (!col.sortable || !onSortChange)
            return;
        const next = nextSortDirection(sort?.key ?? '', col.key, sort?.direction ?? 'none');
        onSortChange(col.key, next);
    };
    const handleSelectAll = () => {
        if (!selection)
            return;
        if (allSelected) {
            selection.onChange([]);
        }
        else {
            selection.onChange(rows.map((r) => r.id));
        }
    };
    const handleSelectRow = (id) => {
        if (!selection)
            return;
        const next = selectedSet.has(id)
            ? selection.selectedIds.filter((x) => x !== id)
            : [...selection.selectedIds, id];
        selection.onChange(next);
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
    const totalPages = pagination
        ? Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize))
        : 0;
    return (_jsxs("div", { className: ['cc-data-table', className].filter(Boolean).join(' '), children: [_jsx("div", { className: "cc-data-table__wrapper", role: "region", children: _jsxs("table", { className: "cc-table", role: "grid", "aria-label": ariaLabel, children: [_jsx("thead", { children: _jsxs("tr", { children: [selection && (_jsx("th", { scope: "col", className: "cc-table__th cc-table__th--checkbox", children: _jsx("input", { type: "checkbox", checked: allSelected, ref: (el) => {
                                                if (el)
                                                    el.indeterminate = someSelected && !allSelected;
                                            }, onChange: handleSelectAll, "aria-label": "Select all rows" }) })), columns.map((col) => (_jsxs("th", { scope: "col", "aria-sort": col.sortable ? ariaSortFor(col.key) : undefined, style: col.minWidth ? { minWidth: col.minWidth } : undefined, className: [
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
                                            : undefined, tabIndex: col.sortable ? 0 : undefined, children: [_jsx("span", { className: "cc-table__th-label", children: col.label }), col.sortable && (_jsxs("span", { className: "cc-table__sort-icon", "aria-hidden": "true", children: [sort?.key === col.key && sort.direction === 'asc' ? '↑' : '', sort?.key === col.key && sort.direction === 'desc' ? '↓' : '', (!sort || sort.key !== col.key || sort.direction === 'none') ? '⇅' : ''] }))] }, col.key)))] }) }), _jsx("tbody", { children: loading ? (Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (_jsxs("tr", { className: "cc-table__row cc-table__row--skeleton", "aria-hidden": "true", children: [selection && _jsx("td", { className: "cc-table__td" }), columns.map((col) => (_jsx("td", { className: "cc-table__td", children: _jsx("span", { className: "cc-table__skeleton-cell" }) }, col.key)))] }, `skeleton-${i}`)))) : rows.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length + (selection ? 1 : 0), className: "cc-table__td", children: _jsx("div", { role: "status", className: "cc-data-table__empty", children: emptyState ?? 'No items found.' }) }) })) : (rows.map((row) => {
                                const isSelected = selectedSet.has(row.id);
                                const isActive = row.id === activeRowId;
                                return (_jsxs("tr", { className: [
                                        'cc-table__row',
                                        onRowClick ? 'cc-table__row--clickable' : '',
                                        isSelected || isActive ? 'is-selected' : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' '), "aria-selected": selection || onRowClick ? (isSelected || isActive) : undefined, tabIndex: onRowClick ? 0 : undefined, onClick: onRowClick ? () => onRowClick(row.id) : undefined, onKeyDown: onRowClick
                                        ? (e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                onRowClick(row.id);
                                            }
                                        }
                                        : undefined, children: [selection && (_jsx("td", { className: "cc-table__td cc-table__td--checkbox", children: _jsx("input", { type: "checkbox", checked: isSelected, "aria-label": `Select row ${row.id}`, onChange: () => handleSelectRow(row.id), onClick: (e) => e.stopPropagation() }) })), columns.map((col) => (_jsx("td", { className: "cc-table__td", children: col.render(row) }, col.key)))] }, row.id));
                            })) })] }) }), pagination && totalPages > 1 && (_jsxs("nav", { className: "cc-data-table__pagination", "aria-label": "Pagination", role: "navigation", style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-3, 0.5rem)',
                    padding: 'var(--space-3, 0.5rem) 0',
                }, children: [_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", disabled: pagination.page <= 1, onClick: () => pagination.onPageChange(pagination.page - 1), "aria-label": "Previous page", children: "Prev" }), _jsxs("span", { className: "cc-data-table__page-info", "aria-live": "polite", children: ["Page ", pagination.page, " of ", totalPages] }), _jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", disabled: pagination.page >= totalPages, onClick: () => pagination.onPageChange(pagination.page + 1), "aria-label": "Next page", children: "Next" })] }))] }));
}
//# sourceMappingURL=DataTable.js.map