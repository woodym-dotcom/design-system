/**
 * G10 regression: filter component fixes.
 *
 * Invariants:
 *  1. Selected state is driven by aria-pressed, not hard-coded colour.
 *  2. Empty state label renders when nothing is selected.
 *  3. Empty state label disappears when a filter is active.
 *  4. Active chips appear in the active chip list.
 *  5. Remove button calls onRemove/onToggle.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterBar } from '../react/FilterBar';

const OPTIONS = [
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'closed', label: 'Closed' },
];

// ---------------------------------------------------------------------------
// Invariant 1: selected state via aria-pressed (no hard-coded colour)
// ---------------------------------------------------------------------------
describe('G10 invariant 1 — selected state via aria-pressed', () => {
  it('unselected chip has aria-pressed=false', () => {
    render(<FilterBar options={OPTIONS} activeIds={[]} onToggle={() => {}} />);
    const btn = screen.getByRole('button', { name: 'Active' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('selected chip has aria-pressed=true', () => {
    render(<FilterBar options={OPTIONS} activeIds={['active']} onToggle={() => {}} />);
    const btn = screen.getByRole('button', { name: 'Active' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('toggling a chip calls onToggle with the id', () => {
    const onToggle = vi.fn();
    render(<FilterBar options={OPTIONS} activeIds={[]} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button', { name: 'Pending' }));
    expect(onToggle).toHaveBeenCalledWith('pending');
  });

  it('all toggle chip buttons use cc-chip--button class (token-driven colour)', () => {
    render(<FilterBar options={OPTIONS} activeIds={['active']} onToggle={() => {}} />);
    // Exact match on option labels to avoid matching "Remove Active" remove buttons
    const toggleBtns = OPTIONS.map((opt) => screen.getByRole('button', { name: opt.label }));
    for (const btn of toggleBtns) {
      expect(btn.className).toContain('cc-chip--button');
    }
  });
});

// ---------------------------------------------------------------------------
// Invariant 2: empty state label when nothing selected
// ---------------------------------------------------------------------------
describe('G10 invariant 2 — empty state label when nothing selected', () => {
  it('shows default empty label when no filters active', () => {
    render(<FilterBar options={OPTIONS} activeIds={[]} onToggle={() => {}} />);
    expect(screen.getByText('Showing all')).toBeInTheDocument();
  });

  it('shows custom empty label', () => {
    render(
      <FilterBar options={OPTIONS} activeIds={[]} onToggle={() => {}} emptyLabel="No filters applied" />
    );
    expect(screen.getByText('No filters applied')).toBeInTheDocument();
  });

  it('empty state has cc-filter-bar__empty class', () => {
    render(<FilterBar options={OPTIONS} activeIds={[]} onToggle={() => {}} />);
    const el = screen.getByText('Showing all');
    expect(el.className).toContain('cc-filter-bar__empty');
  });
});

// ---------------------------------------------------------------------------
// Invariant 3: empty state disappears when a filter is active
// ---------------------------------------------------------------------------
describe('G10 invariant 3 — empty state hidden when filter is active', () => {
  it('does not show empty label when a filter is selected', () => {
    render(<FilterBar options={OPTIONS} activeIds={['active']} onToggle={() => {}} />);
    expect(screen.queryByText('Showing all')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Invariant 4: active chips appear in chip list
// ---------------------------------------------------------------------------
describe('G10 invariant 4 — active chips in chip list', () => {
  it('active chip renders in chip list', () => {
    render(<FilterBar options={OPTIONS} activeIds={['active', 'pending']} onToggle={() => {}} />);
    const list = screen.getByRole('list', { name: 'Active filters' });
    expect(list).toBeInTheDocument();
    // Both active items should be in the list
    expect(list.textContent).toContain('Active');
    expect(list.textContent).toContain('Pending');
  });

  it('inactive chip does not appear in chip list', () => {
    render(<FilterBar options={OPTIONS} activeIds={['active']} onToggle={() => {}} />);
    const list = screen.getByRole('list', { name: 'Active filters' });
    expect(list.textContent).not.toContain('Closed');
  });
});

// ---------------------------------------------------------------------------
// Invariant 5: remove button
// ---------------------------------------------------------------------------
describe('G10 invariant 5 — remove button', () => {
  it('remove button calls onRemove when provided', () => {
    const onRemove = vi.fn();
    render(
      <FilterBar options={OPTIONS} activeIds={['active']} onToggle={() => {}} onRemove={onRemove} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Remove Active' }));
    expect(onRemove).toHaveBeenCalledWith('active');
  });

  it('remove button falls back to onToggle when onRemove not provided', () => {
    const onToggle = vi.fn();
    render(
      <FilterBar options={OPTIONS} activeIds={['active']} onToggle={onToggle} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Remove Active' }));
    expect(onToggle).toHaveBeenCalledWith('active');
  });
});
