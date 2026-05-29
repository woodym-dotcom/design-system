import * as React from 'react';
/**
 * Selection state hook for list/queue surfaces. Supports:
 *
 *  - toggle (single item)
 *  - shift-toggle (range from last anchor — caller passes `{ shift: true }`)
 *  - select all / clear
 *  - controlled-style `setSelectedKeys`
 *
 * Pair with `<BulkBar />` to expose the bulk-action surface.
 */
export function useMultiSelect({ items, getKey, initial, }) {
    const [selectedKeys, setKeys] = React.useState(() => new Set(initial ?? []));
    const lastAnchor = React.useRef(null);
    // Prune selected keys that no longer exist in items (e.g. after a refetch).
    React.useEffect(() => {
        setKeys((prev) => {
            const visible = new Set(items.map(getKey));
            let dirty = false;
            const next = new Set();
            prev.forEach((k) => {
                if (visible.has(k))
                    next.add(k);
                else
                    dirty = true;
            });
            return dirty ? next : prev;
        });
    }, [items, getKey]);
    const isSelected = React.useCallback((item) => selectedKeys.has(getKey(item)), [selectedKeys, getKey]);
    const toggle = React.useCallback((item, opts) => {
        const key = getKey(item);
        setKeys((prev) => {
            const next = new Set(prev);
            if (opts?.shift && lastAnchor.current) {
                const allKeys = items.map(getKey);
                const startIdx = allKeys.indexOf(lastAnchor.current);
                const endIdx = allKeys.indexOf(key);
                if (startIdx !== -1 && endIdx !== -1) {
                    const [lo, hi] = startIdx < endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
                    const turningOn = !prev.has(key);
                    for (let i = lo; i <= hi; i++) {
                        if (turningOn)
                            next.add(allKeys[i]);
                        else
                            next.delete(allKeys[i]);
                    }
                    lastAnchor.current = key;
                    return next;
                }
            }
            if (next.has(key))
                next.delete(key);
            else
                next.add(key);
            lastAnchor.current = key;
            return next;
        });
    }, [items, getKey]);
    const selectAll = React.useCallback(() => {
        setKeys(new Set(items.map(getKey)));
    }, [items, getKey]);
    const clear = React.useCallback(() => {
        setKeys(new Set());
        lastAnchor.current = null;
    }, []);
    const setSelectedKeys = React.useCallback((keys) => {
        setKeys(new Set(keys));
    }, []);
    const selectedItems = React.useMemo(() => items.filter((it) => selectedKeys.has(getKey(it))), [items, getKey, selectedKeys]);
    const hasSelection = selectedKeys.size > 0;
    return {
        selectedKeys,
        selectedItems,
        isSelected,
        toggle,
        selectAll,
        clear,
        setSelectedKeys,
        hasSelection,
        allSelected: items.length > 0 && selectedKeys.size === items.length,
        count: selectedKeys.size,
    };
}
//# sourceMappingURL=useMultiSelect.js.map