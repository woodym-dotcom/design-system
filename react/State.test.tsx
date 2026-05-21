/**
 * State primitive — unit tests
 *
 * Covers: variant defaults, density variants, override props, actions, a11y roles.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { State } from './State';
import type { StateVariant, StateDensity } from './State';

// ── variant default copy + rendering ─────────────────────────────────────────

const ALL_VARIANTS: StateVariant[] = [
  'empty', 'loading', 'error', 'offline', 'stale',
  'not-found', 'forbidden', 'degraded',
];

describe('State — variant defaults', () => {
  it('renders empty default title', () => {
    render(<State variant="empty" />);
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });

  it('renders loading default title', () => {
    render(<State variant="loading" />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('renders error default title', () => {
    render(<State variant="error" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders offline default title', () => {
    render(<State variant="offline" />);
    expect(screen.getByText("You're offline")).toBeInTheDocument();
  });

  it('renders stale default title', () => {
    render(<State variant="stale" />);
    expect(screen.getByText('Data may be out of date')).toBeInTheDocument();
  });

  it('renders not-found default title', () => {
    render(<State variant="not-found" />);
    expect(screen.getByText("We couldn't find that")).toBeInTheDocument();
  });

  it('renders forbidden default title', () => {
    render(<State variant="forbidden" />);
    expect(screen.getByText("You don't have access")).toBeInTheDocument();
  });

  it('renders degraded default title', () => {
    render(<State variant="degraded" />);
    expect(screen.getByText('Degraded service')).toBeInTheDocument();
  });

  it('each variant renders without throwing', () => {
    for (const v of ALL_VARIANTS) {
      expect(() => render(<State variant={v} />)).not.toThrow();
    }
  });
});

// ── density: page (default) ───────────────────────────────────────────────────

describe('State — page density', () => {
  it('defaults to page density', () => {
    render(<State variant="empty" />);
    const el = document.querySelector('[data-state-density="page"]');
    expect(el).toBeInTheDocument();
  });

  it('uses role="region" with accessible label', () => {
    render(<State variant="empty" title="No results" />);
    expect(screen.getByRole('region', { name: 'No results' })).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<State variant="empty" icon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<State variant="empty" description="Add items to get started." />);
    expect(screen.getByText('Add items to get started.')).toBeInTheDocument();
  });
});

// ── density: banner ───────────────────────────────────────────────────────────

describe('State — banner density', () => {
  it('renders banner strip', () => {
    render(<State variant="offline" density="banner" />);
    const el = document.querySelector('[data-state-density="banner"]');
    expect(el).toBeInTheDocument();
  });

  it('offline banner has role="alert"', () => {
    render(<State variant="offline" density="banner" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('error banner has role="alert"', () => {
    render(<State variant="error" density="banner" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('degraded banner has role="alert"', () => {
    render(<State variant="degraded" density="banner" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('empty banner has role="status"', () => {
    render(<State variant="empty" density="banner" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('stale banner has role="status"', () => {
    render(<State variant="stale" density="banner" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

// ── density: chip ─────────────────────────────────────────────────────────────

describe('State — chip density', () => {
  it('renders inline chip element', () => {
    render(<State variant="stale" density="chip" />);
    const el = document.querySelector('[data-state-density="chip"]');
    expect(el).toBeInTheDocument();
    expect(el!.tagName.toLowerCase()).toBe('span');
  });

  it('chip uses inline text (no role attribute)', () => {
    render(<State variant="stale" density="chip" />);
    const el = document.querySelector('[data-state-density="chip"]');
    expect(el).not.toHaveAttribute('role');
  });

  it('chip renders title text', () => {
    render(<State variant="stale" density="chip" title="Stale" />);
    expect(screen.getByText('Stale')).toBeInTheDocument();
  });
});

// ── override props ────────────────────────────────────────────────────────────

describe('State — override props', () => {
  it('title override takes precedence over default', () => {
    render(<State variant="empty" title="Custom title" />);
    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.queryByText('Nothing here yet')).not.toBeInTheDocument();
  });

  it('description override takes precedence over default', () => {
    render(<State variant="empty" description="Custom description" />);
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });

  it('custom className is applied', () => {
    render(<State variant="empty" className="my-state" />);
    const el = document.querySelector('.my-state');
    expect(el).toBeInTheDocument();
  });
});

// ── actions ───────────────────────────────────────────────────────────────────

describe('State — actions', () => {
  it('primaryAction onClick fires on click', () => {
    const handler = vi.fn();
    render(<State variant="error" primaryAction={{ label: 'Retry', onClick: handler }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('secondaryAction renders as anchor with correct href', () => {
    render(<State variant="error" secondaryAction={{ label: 'Help', href: '/help' }} />);
    const link = screen.getByRole('link', { name: 'Help' });
    expect(link).toHaveAttribute('href', '/help');
  });

  it('both actions render together', () => {
    render(
      <State
        variant="error"
        primaryAction={{ label: 'Retry', onClick: () => {} }}
        secondaryAction={{ label: 'Help', href: '/help' }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Help' })).toBeInTheDocument();
  });

  it('primaryAction renders in banner density', () => {
    const handler = vi.fn();
    render(
      <State
        variant="offline"
        density="banner"
        primaryAction={{ label: 'Dismiss', onClick: handler }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('secondaryAction renders in banner density', () => {
    render(
      <State
        variant="offline"
        density="banner"
        secondaryAction={{ label: 'Learn more', href: '/docs/offline' }}
      />,
    );
    const link = screen.getByRole('link', { name: 'Learn more' });
    expect(link).toHaveAttribute('href', '/docs/offline');
  });
});

// ── all density × variant combinations render ─────────────────────────────────

describe('State — density × variant matrix', () => {
  const densities: StateDensity[] = ['page', 'banner', 'chip'];

  for (const density of densities) {
    for (const variant of ALL_VARIANTS) {
      it(`renders ${variant}/${density} without throwing`, () => {
        expect(() =>
          render(<State variant={variant} density={density} />),
        ).not.toThrow();
      });
    }
  }
});
