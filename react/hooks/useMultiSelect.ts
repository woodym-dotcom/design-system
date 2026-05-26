import * as React from 'react';

export interface UseMultiSelectOptions<T> {
  /** Shortcut: flat string keys. Equivalent to items=allIds, getKey=String. */
  allIds?: readonly string[];
  /** All visible items the user can select. Must be a stable array. */
  items?: ReadonlyArray<T>;
  /** Stable key per item. */
  getKey?: (item: T) => string;
  /** Initial selection (keys). */
  initial?: ReadonlyArray<string>;
}

export interface UseMultiSelectResult<T> {
  selectedKeys: ReadonlySet<string>;
  /** Alias for selectedKeys. */
  selected: ReadonlySet<string>;
  selectedItems: ReadonlyArray<T>;
  isSelected: (item: T) => boolean;
  toggle: (item: T, opts?: { shift?: boolean }) => void;
  selectAll: () => void;
  clear: () => void;
  setSelectedKeys: (keys: Iterable<string>) => void;
  /** True when at least one item is selected. */
  hasSelection: boolean;
  /** Alias for hasSelection. */
  someSelected: boolean;
  /** True when every visible item is selected. */
  allSelected: boolean;
  /** Total selected count. */
  count: number;
}

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
export function useMultiSelect<T>({
  allIds,
  items: itemsProp,
  getKey: getKeyProp,
  initial,
}: UseMultiSelectOptions<T>): UseMultiSelectResult<T> {
  const items = (allIds && !itemsProp ? allIds : itemsProp ?? []) as ReadonlyArray<T>;
  const getKey = (allIds && !getKeyProp ? String : getKeyProp ?? String) as (item: T) => string;
  const [selectedKeys, setKeys] = React.useState<Set<string>>(
    () => new Set(initial ?? []),
  );
  const lastAnchor = React.useRef<string | null>(null);

  // Prune selected keys that no longer exist in items (e.g. after a refetch).
  React.useEffect(() => {
    setKeys((prev) => {
      const visible = new Set(items.map(getKey));
      let dirty = false;
      const next = new Set<string>();
      prev.forEach((k) => {
        if (visible.has(k)) next.add(k);
        else dirty = true;
      });
      return dirty ? next : prev;
    });
  }, [items, getKey]);

  const isSelected = React.useCallback(
    (item: T) => selectedKeys.has(getKey(item)),
    [selectedKeys, getKey],
  );

  const toggle = React.useCallback(
    (item: T, opts?: { shift?: boolean }) => {
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
              if (turningOn) next.add(allKeys[i]);
              else next.delete(allKeys[i]);
            }
            lastAnchor.current = key;
            return next;
          }
        }
        if (next.has(key)) next.delete(key);
        else next.add(key);
        lastAnchor.current = key;
        return next;
      });
    },
    [items, getKey],
  );

  const selectAll = React.useCallback(() => {
    setKeys(new Set(items.map(getKey)));
  }, [items, getKey]);

  const clear = React.useCallback(() => {
    setKeys(new Set());
    lastAnchor.current = null;
  }, []);

  const setSelectedKeys = React.useCallback((keys: Iterable<string>) => {
    setKeys(new Set(keys));
  }, []);

  const selectedItems = React.useMemo(
    () => items.filter((it) => selectedKeys.has(getKey(it))),
    [items, getKey, selectedKeys],
  );

  const hasSelection = selectedKeys.size > 0;
  return {
    selectedKeys,
    selected: selectedKeys,
    selectedItems,
    isSelected,
    toggle,
    selectAll,
    clear,
    setSelectedKeys,
    hasSelection,
    someSelected: hasSelection,
    allSelected: items.length > 0 && selectedKeys.size === items.length,
    count: selectedKeys.size,
  };
}
