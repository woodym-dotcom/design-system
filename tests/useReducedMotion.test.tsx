/**
 * useReducedMotion — respects OS media query + html[data-motion] override.
 */
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useReducedMotion } from '../react/a11y/useReducedMotion';

function Probe() {
  const reduced = useReducedMotion();
  return <span data-testid="r">{reduced ? 'yes' : 'no'}</span>;
}

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql: Partial<MediaQueryList> & { listeners: typeof listeners } = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.add(cb);
    },
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.delete(cb);
    },
    listeners,
  };
  // @ts-expect-error patch for jsdom
  window.matchMedia = () => mql;
  return mql;
}

describe('useReducedMotion', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-motion');
  });

  it('returns false when OS prefers no reduction and no html attr', () => {
    mockMatchMedia(false);
    render(<Probe />);
    expect(screen.getByTestId('r').textContent).toBe('no');
  });

  it('returns true when OS prefers reduced motion', () => {
    mockMatchMedia(true);
    render(<Probe />);
    expect(screen.getByTestId('r').textContent).toBe('yes');
  });

  it('html[data-motion="reduced"] overrides OS pref (forces true)', () => {
    mockMatchMedia(false);
    document.documentElement.setAttribute('data-motion', 'reduced');
    render(<Probe />);
    expect(screen.getByTestId('r').textContent).toBe('yes');
  });

  it('html[data-motion="full"] overrides OS pref (forces false)', () => {
    mockMatchMedia(true);
    document.documentElement.setAttribute('data-motion', 'full');
    render(<Probe />);
    expect(screen.getByTestId('r').textContent).toBe('no');
  });
});
