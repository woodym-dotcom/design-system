/**
 * EmptyState — variants pick the right ARIA role, render multiple actions,
 *              and apply variant CSS classes.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from '../react/EmptyState';

describe('EmptyState — variant ARIA roles', () => {
  it('default variant=empty → role=status', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('variant=offline → role=alert', () => {
    render(<EmptyState title="Offline" variant="offline" />);
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('variant=rate-limited → role=alert', () => {
    render(<EmptyState title="Slow down" variant="rate-limited" />);
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('variant=error → role=alert', () => {
    render(<EmptyState title="Failed" variant="error" />);
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('variant=permissioned-out → no implicit role (note)', () => {
    const { container } = render(
      <EmptyState title="Locked" variant="permissioned-out" />,
    );
    expect(container.firstElementChild?.getAttribute('role')).toBeNull();
    expect(container.firstElementChild?.className).toContain('cc-empty-state--permissioned-out');
  });

  it('variant=stale → role=status, variant class present', () => {
    const { container } = render(<EmptyState title="Old" variant="stale" />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(container.firstElementChild?.className).toContain('cc-empty-state--stale');
  });

  it('variant=partial → role=status, variant class present', () => {
    const { container } = render(<EmptyState title="Partial" variant="partial" />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(container.firstElementChild?.className).toContain('cc-empty-state--partial');
  });

  it('variant=loading → role=status', () => {
    render(<EmptyState title="Loading" variant="loading" />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});

describe('EmptyState — multi-action', () => {
  it('renders two actions when an array is provided', () => {
    const a = vi.fn();
    const b = vi.fn();
    render(
      <EmptyState
        title="Empty"
        action={[
          { label: 'Primary', onClick: a },
          { label: 'Secondary', onClick: b },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Primary' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Secondary' })).toBeTruthy();
  });

  it('first action defaults to primary tone, second to secondary', () => {
    render(
      <EmptyState
        title="x"
        action={[
          { label: 'Add', onClick: () => {} },
          { label: 'Help', onClick: () => {} },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Add' }).className).toContain('cc-empty-state__cta--primary');
    expect(screen.getByRole('button', { name: 'Help' }).className).toContain('cc-empty-state__cta--secondary');
  });
});
