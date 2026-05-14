/**
 * EmptyState — contract tests.
 *
 * Contracts:
 *  (a) Renders with role="status" for screen reader discoverability.
 *  (b) Title is always rendered.
 *  (c) Description is optional.
 *  (d) CTA with onClick renders a button; CTA with href renders an anchor.
 *  (e) Icon slot renders when provided.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from '../react/EmptyState';

describe('EmptyState — contract (a): role="status"', () => {
  it('container has role="status"', () => {
    render(<EmptyState title="No tasks" />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});

describe('EmptyState — contract (b): title', () => {
  it('renders title text', () => {
    render(<EmptyState title="No tasks yet" />);
    expect(screen.getByText('No tasks yet')).toBeTruthy();
  });
});

describe('EmptyState — contract (c): description', () => {
  it('renders description when provided', () => {
    render(<EmptyState title="Empty" description="Add something to get started" />);
    expect(screen.getByText('Add something to get started')).toBeTruthy();
  });

  it('description is absent when not provided', () => {
    const { container } = render(<EmptyState title="Empty" />);
    expect(container.querySelector('.cc-empty-state__description')).toBeNull();
  });
});

describe('EmptyState — contract (d): CTA variants', () => {
  it('renders <button> when action has onClick', () => {
    const handler = vi.fn();
    render(<EmptyState title="Empty" action={{ label: 'Add task', onClick: handler }} />);
    expect(screen.getByRole('button', { name: 'Add task' })).toBeTruthy();
  });

  it('renders <a> when action has href', () => {
    render(<EmptyState title="Empty" action={{ label: 'Browse', href: '/browse' }} />);
    const link = screen.getByRole('link', { name: 'Browse' });
    expect(link.getAttribute('href')).toBe('/browse');
  });

  it('no CTA renders when action not provided', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });
});

describe('EmptyState — contract (e): icon', () => {
  it('renders icon when provided', () => {
    render(<EmptyState title="Empty" icon={<span data-testid="icon">✦</span>} />);
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  it('icon is aria-hidden', () => {
    const { container } = render(
      <EmptyState title="Empty" icon={<span>✦</span>} />,
    );
    expect(container.querySelector('.cc-empty-state__icon')?.getAttribute('aria-hidden')).toBe('true');
  });
});
