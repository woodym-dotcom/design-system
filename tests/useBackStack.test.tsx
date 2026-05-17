/**
 * useBackStack — push/pop, de-dupe, max, persist.
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useBackStack } from '../react/hooks/useBackStack';

describe('useBackStack', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') window.sessionStorage.clear();
  });

  it('push adds an entry', () => {
    const { result } = renderHook(() => useBackStack({ storageKey: 'k1' }));
    act(() => { result.current.push({ href: '/a', label: 'A' }); });
    expect(result.current.entries.length).toBe(1);
    expect(result.current.entries[0].label).toBe('A');
  });

  it('de-dupes a consecutive same-href push', () => {
    const { result } = renderHook(() => useBackStack({ storageKey: 'k2' }));
    act(() => {
      result.current.push({ href: '/a', label: 'A' });
      result.current.push({ href: '/a', label: 'A' });
    });
    expect(result.current.entries.length).toBe(1);
  });

  it('max truncates oldest', () => {
    const { result } = renderHook(() => useBackStack({ storageKey: 'k3', max: 2 }));
    act(() => {
      result.current.push({ href: '/a', label: 'A' });
      result.current.push({ href: '/b', label: 'B' });
      result.current.push({ href: '/c', label: 'C' });
    });
    expect(result.current.entries.length).toBe(2);
    expect(result.current.entries[0].label).toBe('B');
  });

  it('pop returns the last entry and removes it', () => {
    const { result } = renderHook(() => useBackStack({ storageKey: 'k4' }));
    act(() => { result.current.push({ href: '/x', label: 'X' }); });
    let popped: { label?: string } | undefined;
    act(() => { popped = result.current.pop(); });
    expect(popped?.label).toBe('X');
    expect(result.current.entries.length).toBe(0);
  });

  it('persists across remounts via sessionStorage', () => {
    const { result, unmount } = renderHook(() => useBackStack({ storageKey: 'k5' }));
    act(() => { result.current.push({ href: '/p', label: 'P' }); });
    unmount();
    const { result: r2 } = renderHook(() => useBackStack({ storageKey: 'k5' }));
    expect(r2.current.entries.length).toBe(1);
    expect(r2.current.entries[0].label).toBe('P');
  });
});
