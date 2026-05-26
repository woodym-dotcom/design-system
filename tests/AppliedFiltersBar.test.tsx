import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppliedFiltersBar } from '../react/AppliedFiltersBar';

const filters = [
  { id: 'status', label: 'Open', group: 'Status' },
  { id: 'owner', label: 'Me' },
  { id: 'priority', label: 'High', group: 'Priority' },
];

describe('AppliedFiltersBar', () => {
  it('renders nothing when filters is empty', () => {
    const { container } = render(
      <AppliedFiltersBar filters={[]} onRemove={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders a toolbar with chips for each filter', () => {
    render(<AppliedFiltersBar filters={filters} onRemove={() => {}} />);
    expect(screen.getByRole('toolbar')).toBeTruthy();
    expect(screen.getByTestId('applied-filter-status')).toBeTruthy();
    expect(screen.getByTestId('applied-filter-owner')).toBeTruthy();
  });

  it('shows group prefix when group is set', () => {
    render(<AppliedFiltersBar filters={filters} onRemove={() => {}} />);
    expect(screen.getByText('Status:')).toBeTruthy();
  });

  it('calls onRemove with the filter id when × is clicked', () => {
    const onRemove = vi.fn();
    render(<AppliedFiltersBar filters={filters} onRemove={onRemove} />);
    fireEvent.click(screen.getByLabelText('Remove Status: Open'));
    expect(onRemove).toHaveBeenCalledWith('status');
  });

  it('shows "Clear all" when onClearAll is provided and filters.length > 1', () => {
    const onClearAll = vi.fn();
    render(
      <AppliedFiltersBar filters={filters} onRemove={() => {}} onClearAll={onClearAll} />,
    );
    fireEvent.click(screen.getByText('Clear all'));
    expect(onClearAll).toHaveBeenCalled();
  });

  it('hides "Clear all" when only 1 filter', () => {
    render(
      <AppliedFiltersBar
        filters={[filters[0]]}
        onRemove={() => {}}
        onClearAll={() => {}}
      />,
    );
    expect(screen.queryByText('Clear all')).toBeNull();
  });

  it('uses custom ariaLabel and clearAllLabel', () => {
    render(
      <AppliedFiltersBar
        filters={filters}
        onRemove={() => {}}
        onClearAll={() => {}}
        ariaLabel="Active filters"
        clearAllLabel="Reset"
      />,
    );
    expect(screen.getByRole('toolbar').getAttribute('aria-label')).toBe('Active filters');
    expect(screen.getByText('Reset')).toBeTruthy();
  });
});
