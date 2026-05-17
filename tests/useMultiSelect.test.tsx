/**
 * useMultiSelect — toggle, shift-range, select all, prune on item change.
 */
import * as React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMultiSelect } from '../react/hooks/useMultiSelect';

const items = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id }));
const key = (it: { id: string }) => it.id;

describe('useMultiSelect', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useMultiSelect({ items, getKey: key }));
    expect(result.current.count).toBe(0);
    expect(result.current.hasSelection).toBe(false);
  });

  it('toggles a single item', () => {
    const { result } = renderHook(() => useMultiSelect({ items, getKey: key }));
    act(() => { result.current.toggle(items[1]); });
    expect(result.current.isSelected(items[1])).toBe(true);
    act(() => { result.current.toggle(items[1]); });
    expect(result.current.isSelected(items[1])).toBe(false);
  });

  it('shift-toggle selects a range from the last anchor', () => {
    const { result } = renderHook(() => useMultiSelect({ items, getKey: key }));
    act(() => { result.current.toggle(items[0]); });
    act(() => { result.current.toggle(items[3], { shift: true }); });
    expect(result.current.selectedItems.map(key)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('selectAll + clear', () => {
    const { result } = renderHook(() => useMultiSelect({ items, getKey: key }));
    act(() => { result.current.selectAll(); });
    expect(result.current.allSelected).toBe(true);
    act(() => { result.current.clear(); });
    expect(result.current.count).toBe(0);
  });

  it('prunes keys that disappear from items', () => {
    const { result, rerender } = renderHook(
      ({ list }: { list: { id: string }[] }) =>
        useMultiSelect({ items: list, getKey: key }),
      { initialProps: { list: items } },
    );
    act(() => { result.current.toggle(items[2]); });
    rerender({ list: items.filter((_, i) => i !== 2) });
    expect(result.current.count).toBe(0);
  });

  it('initial preselects keys', () => {
    const { result } = renderHook(() =>
      useMultiSelect({ items, getKey: key, initial: ['a', 'c'] }),
    );
    expect(result.current.count).toBe(2);
    expect(result.current.isSelected(items[0])).toBe(true);
    expect(result.current.isSelected(items[2])).toBe(true);
  });
});
