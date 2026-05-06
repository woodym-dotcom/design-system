/**
 * FilterBar layout-mode tests (RW lift).
 *
 * - Existing horizontal tests still pass (those live in FilterBar.test.tsx).
 * - New: sidebar mode renders nav with grouped chips + "All X" + count badges.
 * - New: responsive mode switches based on window.innerWidth.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FilterBar } from '../react/FilterBar';

const OPTIONS = [
  { id: 'active', label: 'Active', group: 'Status', count: 3 },
  { id: 'pending', label: 'Pending', group: 'Status', count: 1 },
  { id: 'closed', label: 'Closed', group: 'Status', count: 0 },
  { id: 'senior', label: 'Senior', group: 'Level' },
  { id: 'junior', label: 'Junior', group: 'Level' },
];

// ---------------------------------------------------------------------------
// Sidebar layout
// ---------------------------------------------------------------------------

describe('FilterBar sidebar layout', () => {
  it('renders a nav element instead of a div', () => {
    render(
      <FilterBar
        options={OPTIONS}
        activeIds={[]}
        onToggle={() => {}}
        layout="sidebar"
      />,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders "All Status" and "All Level" first in each group', () => {
    render(
      <FilterBar
        options={OPTIONS}
        activeIds={[]}
        onToggle={() => {}}
        layout="sidebar"
      />,
    );
    const allBtns = screen.getAllByRole('button', { name: /^All / });
    const labels = allBtns.map((b) => b.textContent?.trim() ?? '');
    expect(labels).toContain('All Status');
    expect(labels).toContain('All Level');
  });

  it('"All X" button is aria-pressed=true when no group items active', () => {
    render(
      <FilterBar
        options={OPTIONS}
        activeIds={[]}
        onToggle={() => {}}
        layout="sidebar"
      />,
    );
    const allStatus = screen.getByRole('button', { name: 'All Status' });
    expect(allStatus).toHaveAttribute('aria-pressed', 'true');
  });

  it('"All X" button is aria-pressed=false when a group item is active', () => {
    render(
      <FilterBar
        options={OPTIONS}
        activeIds={['active']}
        onToggle={() => {}}
        layout="sidebar"
      />,
    );
    const allStatus = screen.getByRole('button', { name: 'All Status' });
    expect(allStatus).toHaveAttribute('aria-pressed', 'false');
  });

  it('clicking "All X" calls onToggle for each active item in the group', () => {
    const onToggle = vi.fn();
    render(
      <FilterBar
        options={OPTIONS}
        activeIds={['active', 'pending']}
        onToggle={onToggle}
        layout="sidebar"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'All Status' }));
    expect(onToggle).toHaveBeenCalledWith('active');
    expect(onToggle).toHaveBeenCalledWith('pending');
  });

  it('renders count badge when count > 0', () => {
    render(
      <FilterBar
        options={OPTIONS}
        activeIds={[]}
        onToggle={() => {}}
        layout="sidebar"
      />,
    );
    // "Active" has count=3, "Pending" has count=1
    expect(screen.getByLabelText('3 items')).toBeInTheDocument();
    expect(screen.getByLabelText('1 items')).toBeInTheDocument();
  });

  it('does not render count badge when count is 0', () => {
    render(
      <FilterBar
        options={OPTIONS}
        activeIds={[]}
        onToggle={() => {}}
        layout="sidebar"
      />,
    );
    // "Closed" has count=0 — badge should not appear
    expect(screen.queryByLabelText('0 items')).not.toBeInTheDocument();
  });

  it('individual chip is aria-pressed=true when active', () => {
    render(
      <FilterBar
        options={OPTIONS}
        activeIds={['senior']}
        onToggle={() => {}}
        layout="sidebar"
      />,
    );
    const seniorBtn = screen.getByRole('button', { name: /^Senior/ });
    expect(seniorBtn).toHaveAttribute('aria-pressed', 'true');
  });
});

// ---------------------------------------------------------------------------
// Responsive layout
// ---------------------------------------------------------------------------

describe('FilterBar responsive layout', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it('renders sidebar when window.innerWidth >= collapsedAt (768)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    render(
      <FilterBar
        options={OPTIONS}
        activeIds={[]}
        onToggle={() => {}}
        layout="responsive"
        collapsedAt={768}
      />,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders horizontal when window.innerWidth < collapsedAt', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });
    render(
      <FilterBar
        options={OPTIONS}
        activeIds={[]}
        onToggle={() => {}}
        layout="responsive"
        collapsedAt={768}
      />,
    );
    // Horizontal renders a div[role=group], not a nav.
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Filters' })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Horizontal backward-compat (smoke — full suite in FilterBar.test.tsx)
// ---------------------------------------------------------------------------

describe('FilterBar horizontal (default) backward compat', () => {
  it('renders chip bar with default layout', () => {
    render(
      <FilterBar
        options={[{ id: 'x', label: 'X' }]}
        activeIds={[]}
        onToggle={() => {}}
      />,
    );
    expect(screen.getByRole('group', { name: 'Filters' })).toBeInTheDocument();
  });

  it('default layout renders cc-filter-bar__empty when no filters active', () => {
    render(
      <FilterBar
        options={[{ id: 'x', label: 'X' }]}
        activeIds={[]}
        onToggle={() => {}}
        layout="horizontal"
      />,
    );
    expect(screen.getByText('Showing all')).toBeInTheDocument();
  });
});
