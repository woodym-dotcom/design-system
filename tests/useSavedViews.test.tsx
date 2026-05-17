/**
 * useSavedViews — save/remove/rename, pinned sorting, shareable URL.
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useSavedViews } from '../react/hooks/useSavedViews';

function makeStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => { data.set(k, v); },
  };
}

describe('useSavedViews', () => {
  beforeEach(() => {
    // Each test gets a fresh storage via the option to avoid shared state.
  });

  it('save inserts a view, removes by id', () => {
    const storage = makeStorage();
    const { result } = renderHook(() => useSavedViews<string>({ scope: 'm.list', storage, serialise: (s) => s, deserialise: (s) => s }));
    act(() => { result.current.save('All open', '?status=open'); });
    expect(result.current.views.length).toBe(1);
    expect(result.current.views[0].name).toBe('All open');
    const id = result.current.views[0].id;
    act(() => { result.current.remove(id); });
    expect(result.current.views.length).toBe(0);
  });

  it('rename updates the view', () => {
    const storage = makeStorage();
    const { result } = renderHook(() => useSavedViews<string>({ scope: 'm.list', storage, serialise: (s) => s, deserialise: (s) => s }));
    act(() => { result.current.save('A', '?x=1'); });
    const id = result.current.views[0].id;
    act(() => { result.current.rename(id, 'B'); });
    expect(result.current.views[0].name).toBe('B');
  });

  it('pinned views sort to the top', () => {
    const storage = makeStorage();
    const { result } = renderHook(() => useSavedViews<string>({ scope: 'm.list', storage, serialise: (s) => s, deserialise: (s) => s }));
    act(() => {
      result.current.save('Old', '?a');
      result.current.save('New', '?b');
    });
    const oldId = result.current.views.find((v) => v.name === 'Old')!.id;
    act(() => { result.current.togglePinned(oldId); });
    expect(result.current.views[0].name).toBe('Old');
  });

  it('shareableUrl embeds raw URL search when state already starts with "?"', () => {
    const storage = makeStorage();
    const { result } = renderHook(() => useSavedViews<string>({ scope: 'm.list', storage, serialise: (s) => s, deserialise: (s) => s }));
    const url = result.current.shareableUrl('?status=open', 'https://x.test/m');
    expect(url).toBe('https://x.test/m?status=open');
  });

  it('shareableUrl wraps non-URL states under ?view=', () => {
    const storage = makeStorage();
    const { result } = renderHook(() => useSavedViews<{ q: string }>({ scope: 'm.list', storage }));
    const url = result.current.shareableUrl({ q: 'hello world' }, 'https://x.test/m');
    expect(url).toBe(`https://x.test/m?view=${encodeURIComponent(JSON.stringify({ q: 'hello world' }))}`);
  });

  it('persists across hook remounts via storage', () => {
    const storage = makeStorage();
    const { result, unmount } = renderHook(() => useSavedViews<string>({ scope: 'm.list', storage, serialise: (s) => s, deserialise: (s) => s }));
    act(() => { result.current.save('Persist', '?p=1'); });
    unmount();
    const { result: r2 } = renderHook(() => useSavedViews<string>({ scope: 'm.list', storage, serialise: (s) => s, deserialise: (s) => s }));
    expect(r2.current.views.length).toBe(1);
    expect(r2.current.views[0].name).toBe('Persist');
  });
});
