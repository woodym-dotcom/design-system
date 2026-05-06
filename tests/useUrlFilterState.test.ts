/**
 * useUrlFilterState — URL-backed filter state hook tests.
 *
 * Covers: round-trip, back-button replay, malformed URL recovery,
 * debounce, multi-value encoding, paramPrefix.
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useUrlFilterState } from '../react/hooks/useUrlFilterState';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setSearch(search: string) {
  Object.defineProperty(window, 'location', {
    writable: true,
    configurable: true,
    value: { ...window.location, search, pathname: '/' },
  });
}

function triggerPopState() {
  window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  setSearch('');
  vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  setSearch('');
});

// ---------------------------------------------------------------------------
// Round-trip: set state → URL written
// ---------------------------------------------------------------------------

describe('round-trip', () => {
  it('writes active filters to URLSearchParams', () => {
    const { result } = renderHook(() =>
      useUrlFilterState({ status: [], role: [] }),
    );

    act(() => {
      result.current[1]({ status: ['active', 'pending'], role: [] });
    });

    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      '',
      expect.stringContaining('status=active%2Cpending'),
    );
  });

  it('removes param from URL when value is empty array', () => {
    setSearch('?status=active');
    const { result } = renderHook(() =>
      useUrlFilterState({ status: ['active'] }),
    );

    act(() => {
      result.current[1]({ status: [] });
    });

    // URL written should not contain status.
    const call = (window.history.replaceState as ReturnType<typeof vi.fn>).mock.calls.at(-1);
    expect(call?.[2]).not.toContain('status=');
  });

  it('initial state reads from URL', () => {
    setSearch('?status=active,pending');
    const { result } = renderHook(() =>
      useUrlFilterState({ status: [], role: [] }),
    );
    expect(result.current[0].status).toEqual(['active', 'pending']);
  });
});

// ---------------------------------------------------------------------------
// Multi-value encoding
// ---------------------------------------------------------------------------

describe('multi-value encoding', () => {
  it('encodes multiple values as comma-separated', () => {
    const { result } = renderHook(() =>
      useUrlFilterState({ tags: [] }),
    );

    act(() => {
      result.current[1]({ tags: ['alpha', 'beta', 'gamma'] });
    });

    const call = (window.history.replaceState as ReturnType<typeof vi.fn>).mock.calls.at(-1);
    expect(call?.[2]).toContain('tags=alpha%2Cbeta%2Cgamma');
  });

  it('decodes comma-separated URL values to array', () => {
    setSearch('?tags=alpha,beta,gamma');
    const { result } = renderHook(() =>
      useUrlFilterState({ tags: [] }),
    );
    expect(result.current[0].tags).toEqual(['alpha', 'beta', 'gamma']);
  });
});

// ---------------------------------------------------------------------------
// Back-button replay (popstate)
// ---------------------------------------------------------------------------

describe('back-button replay', () => {
  it('updates state when popstate fires with updated URL', () => {
    const { result } = renderHook(() =>
      useUrlFilterState({ status: [] }),
    );

    // Simulate browser navigating back to a URL with status=closed.
    act(() => {
      setSearch('?status=closed');
      triggerPopState();
    });

    expect(result.current[0].status).toEqual(['closed']);
  });

  it('resets to initial on popstate with empty URL', () => {
    setSearch('?status=active');
    const { result } = renderHook(() =>
      useUrlFilterState({ status: ['active'] }),
    );

    act(() => {
      setSearch('');
      triggerPopState();
    });

    // Falls back to initial (no URL value → keep initial).
    expect(result.current[0].status).toEqual(['active']);
  });
});

// ---------------------------------------------------------------------------
// Malformed URL recovery
// ---------------------------------------------------------------------------

describe('malformed URL recovery', () => {
  it('falls back to initial when param value is empty string', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    setSearch('?status=');
    const { result } = renderHook(() =>
      useUrlFilterState({ status: ['default'] }),
    );
    expect(result.current[0].status).toEqual(['default']);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Empty value for param "status"'),
    );
  });
});

// ---------------------------------------------------------------------------
// paramPrefix
// ---------------------------------------------------------------------------

describe('paramPrefix option', () => {
  it('writes params with prefix', () => {
    const { result } = renderHook(() =>
      useUrlFilterState({ status: [] }, { paramPrefix: 'f_' }),
    );

    act(() => {
      result.current[1]({ status: ['active'] });
    });

    const call = (window.history.replaceState as ReturnType<typeof vi.fn>).mock.calls.at(-1);
    expect(call?.[2]).toContain('f_status=active');
  });

  it('reads params with prefix', () => {
    setSearch('?f_status=pending');
    const { result } = renderHook(() =>
      useUrlFilterState({ status: [] }, { paramPrefix: 'f_' }),
    );
    expect(result.current[0].status).toEqual(['pending']);
  });
});

// ---------------------------------------------------------------------------
// Debounce
// ---------------------------------------------------------------------------

describe('debounceMs option', () => {
  it('does not write URL immediately when debounceMs > 0', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useUrlFilterState({ status: [] }, { debounceMs: 200 }),
    );

    act(() => {
      result.current[1]({ status: ['active'] });
    });

    // URL not yet written.
    expect(window.history.replaceState).not.toHaveBeenCalled();

    // Advance timer.
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(window.history.replaceState).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('state is updated immediately even with debounce', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useUrlFilterState({ status: [] }, { debounceMs: 200 }),
    );

    act(() => {
      result.current[1]({ status: ['active'] });
    });

    // React state updated immediately.
    expect(result.current[0].status).toEqual(['active']);
    vi.useRealTimers();
  });
});
