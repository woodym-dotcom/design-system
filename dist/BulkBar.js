import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
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
export function BulkBar({ count, onClear, actions, meta, position = 'bottom', className, }) {
    if (count === 0)
        return null;
    return (_jsxs("div", { className: ['cc-bulkbar', `cc-bulkbar--${position}`, className]
            .filter(Boolean)
            .join(' '), role: "region", "aria-label": `${count} item${count === 1 ? '' : 's'} selected`, children: [_jsxs("div", { className: "cc-bulkbar__summary", children: [_jsxs("span", { className: "cc-bulkbar__count", children: [count, " selected"] }), meta && _jsx("span", { className: "cc-bulkbar__meta", children: meta }), _jsx("button", { type: "button", className: "cc-bulkbar__clear", onClick: onClear, children: "Clear" })] }), _jsx("div", { className: "cc-bulkbar__actions", children: actions.map((a) => (_jsxs("button", { type: "button", className: `cc-bulkbar__action cc-bulkbar__action--${a.tone ?? 'default'}`, onClick: a.onClick, disabled: a.disabled, children: [a.icon && _jsx("span", { className: "cc-bulkbar__action-icon", "aria-hidden": "true", children: a.icon }), a.label] }, a.id))) })] }));
}
//# sourceMappingURL=BulkBar.js.map