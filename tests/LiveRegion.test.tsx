/**
 * LiveRegion + AnnounceProvider — assertive vs polite + auto-clear.
 */
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LiveRegion, AnnounceProvider, useAnnounce } from '../react/a11y/LiveRegion';

describe('LiveRegion', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders message inside role=status with aria-live=polite by default', () => {
    render(<LiveRegion message="Saved" />);
    const region = screen.getByRole('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toBe('Saved');
  });

  it('honours assertive politeness', () => {
    render(<LiveRegion message="!" politeness="assertive" />);
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('assertive');
  });

  it('clears message after clearAfterMs', () => {
    render(<LiveRegion message="Tick" clearAfterMs={500} />);
    expect(screen.getByRole('status').textContent).toBe('Tick');
    act(() => { vi.advanceTimersByTime(600); });
    expect(screen.getByRole('status').textContent).toBe('');
  });
});

describe('AnnounceProvider + useAnnounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function Trigger() {
    const announce = useAnnounce();
    return (
      <>
        <button onClick={() => announce('Hello', 'polite')}>polite</button>
        <button onClick={() => announce('Alarm', 'assertive')}>assertive</button>
      </>
    );
  }

  it('announces polite messages into the polite live region', () => {
    render(
      <AnnounceProvider>
        <Trigger />
      </AnnounceProvider>,
    );
    act(() => { (screen.getByText('polite') as HTMLButtonElement).click(); });
    act(() => { vi.advanceTimersByTime(50); });
    const regions = screen.getAllByRole('status');
    expect(regions.some((r) => r.getAttribute('aria-live') === 'polite' && r.textContent === 'Hello')).toBe(true);
  });

  it('announces assertive messages into the assertive live region', () => {
    render(
      <AnnounceProvider>
        <Trigger />
      </AnnounceProvider>,
    );
    act(() => { (screen.getByText('assertive') as HTMLButtonElement).click(); });
    act(() => { vi.advanceTimersByTime(50); });
    const regions = screen.getAllByRole('status');
    expect(regions.some((r) => r.getAttribute('aria-live') === 'assertive' && r.textContent === 'Alarm')).toBe(true);
  });

  it('useAnnounce without provider is a no-op (does not throw)', () => {
    function NoCtx() {
      const a = useAnnounce();
      a('drop');
      return <span data-testid="ok" />;
    }
    render(<NoCtx />);
    expect(screen.getByTestId('ok')).toBeTruthy();
  });
});
