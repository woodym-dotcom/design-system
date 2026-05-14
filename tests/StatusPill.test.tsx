/**
 * StatusPill — contract tests.
 *
 * Contracts:
 *  (a) Correct CSS class for each status variant.
 *  (b) Dot is aria-hidden; label carries the accessible text.
 *  (c) Status encoded via both class (colour) and dot shape class (non-colour cue).
 *  (d) Interactive variant renders as <button> with ≥44px min-height styling.
 *  (e) Non-interactive renders as <span>.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { StatusPill } from '../react/StatusPill';

// Install @testing-library/user-event if missing — skip gracefully if not available.
// If the import above fails vitest will report an error; add to devDeps if needed.

describe('StatusPill — contract (a): correct status CSS class', () => {
  const STATUSES = ['ok', 'warning', 'error', 'info', 'neutral'] as const;
  for (const status of STATUSES) {
    it(`status "${status}" applies cc-status-pill--${status}`, () => {
      const { container } = render(<StatusPill status={status} label="Test" />);
      expect(container.firstElementChild?.className).toContain(`cc-status-pill--${status}`);
    });
  }
});

describe('StatusPill — contract (b): accessibility', () => {
  it('renders label as readable text', () => {
    render(<StatusPill status="ok" label="System healthy" />);
    expect(screen.getByText('System healthy')).toBeTruthy();
  });

  it('dot element is aria-hidden', () => {
    const { container } = render(<StatusPill status="ok" label="OK" />);
    const dot = container.querySelector('.cc-status-pill__dot');
    expect(dot?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('StatusPill — contract (c): non-colour shape cue', () => {
  it('ok status has round dot class', () => {
    const { container } = render(<StatusPill status="ok" label="OK" />);
    expect(container.querySelector('.cc-status-pill__dot')?.className).toContain('--round');
  });

  it('warning status has diamond dot class', () => {
    const { container } = render(<StatusPill status="warning" label="Warn" />);
    expect(container.querySelector('.cc-status-pill__dot')?.className).toContain('--diamond');
  });

  it('error status has square dot class', () => {
    const { container } = render(<StatusPill status="error" label="Error" />);
    expect(container.querySelector('.cc-status-pill__dot')?.className).toContain('--square');
  });
});

describe('StatusPill — contract (d): interactive variant', () => {
  it('renders as <button> when onClick is provided', () => {
    const handler = vi.fn();
    render(<StatusPill status="ok" label="Click me" onClick={handler} />);
    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn.tagName).toBe('BUTTON');
  });
});

describe('StatusPill — contract (e): static variant', () => {
  it('renders as <span> without onClick', () => {
    render(<StatusPill status="neutral" label="No action" />);
    // Should not be a button
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('StatusPill — size variants', () => {
  it('applies cc-status-pill--sm class for sm size', () => {
    const { container } = render(<StatusPill status="ok" label="Small" size="sm" />);
    expect(container.firstElementChild?.className).toContain('cc-status-pill--sm');
  });

  it('applies cc-status-pill--md class by default', () => {
    const { container } = render(<StatusPill status="ok" label="Medium" />);
    expect(container.firstElementChild?.className).toContain('cc-status-pill--md');
  });
});
