/**
 * Toast — provider/hook contract, auto-dismiss, action click, max limit.
 */
import * as React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from '../react/Toast';

function Stage({ onReady }: { onReady?: (api: ReturnType<typeof useToast>) => void }) {
  const api = useToast();
  React.useEffect(() => { onReady?.(api); }, [api, onReady]);
  return null;
}

function wrap(ui: React.ReactNode) {
  return <ToastProvider>{ui}</ToastProvider>;
}

describe('Toast', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders a toast with the supplied message', () => {
    let api!: ReturnType<typeof useToast>;
    render(wrap(<Stage onReady={(a) => { api = a; }} />));
    act(() => { api.toast({ message: 'Saved' }); });
    expect(screen.getByText('Saved')).toBeTruthy();
  });

  it('error tone uses role=alert', () => {
    let api!: ReturnType<typeof useToast>;
    render(wrap(<Stage onReady={(a) => { api = a; }} />));
    act(() => { api.toast({ message: 'Boom', tone: 'error' }); });
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('auto-dismisses after durationMs', () => {
    let api!: ReturnType<typeof useToast>;
    render(wrap(<Stage onReady={(a) => { api = a; }} />));
    act(() => { api.toast({ message: 'Bye', durationMs: 1000 }); });
    expect(screen.queryByText('Bye')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(1100); });
    expect(screen.queryByText('Bye')).toBeNull();
  });

  it('durationMs=0 keeps the toast sticky', () => {
    let api!: ReturnType<typeof useToast>;
    render(wrap(<Stage onReady={(a) => { api = a; }} />));
    act(() => { api.toast({ message: 'Stay', durationMs: 0 }); });
    act(() => { vi.advanceTimersByTime(30_000); });
    expect(screen.getByText('Stay')).toBeTruthy();
  });

  it('action button fires and dismisses the toast', () => {
    let api!: ReturnType<typeof useToast>;
    const handler = vi.fn();
    render(wrap(<Stage onReady={(a) => { api = a; }} />));
    act(() => { api.toast({ message: 'Deleted', action: { label: 'Undo', onClick: handler } }); });
    act(() => { fireEvent.click(screen.getByText('Undo')); });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Deleted')).toBeNull();
  });

  it('respects max — older toasts drop off', () => {
    let api!: ReturnType<typeof useToast>;
    render(
      <ToastProvider max={2}><Stage onReady={(a) => { api = a; }} /></ToastProvider>,
    );
    act(() => {
      api.toast({ message: 'a', durationMs: 0 });
      api.toast({ message: 'b', durationMs: 0 });
      api.toast({ message: 'c', durationMs: 0 });
    });
    expect(screen.queryByText('a')).toBeNull();
    expect(screen.queryByText('b')).toBeTruthy();
    expect(screen.queryByText('c')).toBeTruthy();
  });

  it('dismiss(id) removes a specific toast', () => {
    let api!: ReturnType<typeof useToast>;
    render(wrap(<Stage onReady={(a) => { api = a; }} />));
    let id = '';
    act(() => { id = api.toast({ message: 'pickme', durationMs: 0 }); });
    act(() => { api.dismiss(id); });
    expect(screen.queryByText('pickme')).toBeNull();
  });
});
