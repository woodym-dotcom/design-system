import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * BulkSelectableTable — composes useMultiSelect + BulkBar with a list of
 * rows and provides keyboard shortcuts, a tri-state header, and a typed
 * bulk-action result contract.
 *
 * Pair with the existing `BulkBar` (auto-mounted) and `useMultiSelect`
 * (internal). Caller supplies `rows`, `rowKey`, `renderRow`, and a list
 * of `bulkActions` — each action returns a `BulkActionResult` describing
 * which rows succeeded and which failed.
 *
 * Failed-results detail is shown inline in a `role="status"` live region;
 * caller can also subscribe via `onResult` to surface a Drawer.
 */
import * as React from 'react';
import { useMultiSelect } from './hooks/useMultiSelect';
import { BulkBar } from './BulkBar';
/**
 * Header tri-state checkbox: empty / indeterminate / all-checked.
 */
function HeaderCheckbox({ total, selectedCount, onChange, }) {
    const ref = React.useRef(null);
    const allChecked = total > 0 && selectedCount === total;
    const indeterminate = selectedCount > 0 && selectedCount < total;
    React.useEffect(() => {
        if (ref.current)
            ref.current.indeterminate = indeterminate;
    }, [indeterminate]);
    return (_jsx("input", { ref: ref, type: "checkbox", "aria-label": allChecked ? 'Deselect all rows' : 'Select all rows', className: "cc-bst__cb cc-bst__cb--header", checked: allChecked, onChange: (e) => onChange(e.currentTarget.checked) }));
}
export function BulkSelectableTable({ rows, rowKey, renderRow, bulkActions, onResult, ariaLabel = 'Selectable rows', className, rowHeading, }) {
    const sel = useMultiSelect({ items: rows, getKey: rowKey });
    const [busy, setBusy] = React.useState(null);
    const [lastResult, setLastResult] = React.useState(null);
    const onKeyDown = React.useCallback((e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            sel.clear();
            setLastResult(null);
        }
    }, [sel]);
    const runAction = React.useCallback(async (action) => {
        const items = sel.selectedItems;
        if (items.length === 0)
            return;
        setBusy(action.id);
        setLastResult(null);
        try {
            const result = await action.run(items);
            const tagged = { ...result, actionId: action.id };
            setLastResult(tagged);
            onResult?.(tagged);
            // Convention: on full success, clear selection. On any failure, keep so user can act.
            if (tagged.failed.length === 0)
                sel.clear();
        }
        finally {
            setBusy(null);
        }
    }, [sel, onResult]);
    const barActions = bulkActions.map((a) => ({
        id: a.id,
        label: a.label,
        tone: a.tone,
        icon: a.icon,
        disabled: busy !== null || (a.disabled?.(sel.selectedItems) ?? false),
        onClick: () => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            runAction(a);
        },
    }));
    return (_jsxs("div", { className: ['cc-bst', className].filter(Boolean).join(' '), onKeyDown: onKeyDown, children: [_jsxs("div", { role: "grid", "aria-label": ariaLabel, className: "cc-bst__grid", tabIndex: -1, children: [_jsxs("div", { role: "row", className: "cc-bst__row cc-bst__row--header", children: [_jsx("div", { role: "columnheader", className: "cc-bst__cell cc-bst__cell--checkbox", children: _jsx(HeaderCheckbox, { total: rows.length, selectedCount: sel.count, onChange: (checked) => (checked ? sel.selectAll() : sel.clear()) }) }), rowHeading && (_jsx("div", { role: "columnheader", className: "cc-bst__cell cc-bst__cell--heading", children: rowHeading }))] }), rows.map((r) => {
                        const key = rowKey(r);
                        const checked = sel.isSelected(r);
                        return (_jsxs("div", { role: "row", "aria-selected": checked, className: ['cc-bst__row', checked ? 'cc-bst__row--selected' : '']
                                .filter(Boolean)
                                .join(' '), children: [_jsx("div", { role: "gridcell", className: "cc-bst__cell cc-bst__cell--checkbox", children: _jsx("input", { type: "checkbox", className: "cc-bst__cb", "aria-label": `Select row ${key}`, checked: checked, onChange: (e) => {
                                            // Native onChange doesn't carry shift; use the click event for that.
                                            const ev = e.nativeEvent;
                                            sel.toggle(r, { shift: ev.shiftKey });
                                        } }) }), _jsx("div", { role: "gridcell", className: "cc-bst__cell", children: renderRow(r) })] }, key));
                    })] }), _jsx(BulkBar, { count: sel.count, onClear: () => {
                    sel.clear();
                    setLastResult(null);
                }, actions: barActions }), lastResult && (_jsxs("div", { role: "status", "aria-live": "polite", className: "cc-bst__result", children: [lastResult.succeeded.length, " succeeded", lastResult.failed.length > 0 ? `, ${lastResult.failed.length} failed` : '', lastResult.note ? ` — ${lastResult.note}` : '', lastResult.failed.length > 0 && (_jsx("ul", { className: "cc-bst__result-failures", children: lastResult.failed.map((f) => (_jsxs("li", { children: [_jsx("code", { children: f.key }), ": ", f.reason] }, f.key))) }))] }))] }));
}
//# sourceMappingURL=BulkSelectableTable.js.map