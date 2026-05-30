/**
 * DataTable — rendering, sorting, selection, pagination, empty state, loading.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataTable, type DataTableColumn, type DataTableSortState } from './DataTable';

interface Person {
  id: string;
  name: string;
  role: string;
  age: number;
}

const columns: DataTableColumn<Person>[] = [
  { key: 'name', label: 'Name', sortable: true, render: (r) => r.name },
  { key: 'role', label: 'Role', render: (r) => r.role },
  { key: 'age',  label: 'Age',  sortable: true, render: (r) => String(r.age) },
];

const rows: Person[] = [
  { id: '1', name: 'Alice',   role: 'Admin',  age: 30 },
  { id: '2', name: 'Bob',     role: 'Editor', age: 25 },
  { id: '3', name: 'Charlie', role: 'Viewer', age: 35 },
];

// ── Column + row rendering ────────────────────────────────────────────────────

describe('DataTable — column and row rendering', () => {
  it('renders column headers with correct labels', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByRole('columnheader', { name: /Name/ })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Role/ })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Age/ })).toBeTruthy();
  });

  it('renders one row per data item with cell values', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
    expect(screen.getByText('Charlie')).toBeTruthy();
    // Cell value from render fn
    expect(screen.getByText('Admin')).toBeTruthy();
    expect(screen.getByText('30')).toBeTruthy();
  });

  it('uses the supplied ariaLabel on the table element', () => {
    render(<DataTable columns={columns} rows={rows} ariaLabel="People table" />);
    expect(screen.getByRole('grid', { name: 'People table' })).toBeTruthy();
  });

  it('defaults ariaLabel to "Data table"', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByRole('grid', { name: 'Data table' })).toBeTruthy();
  });
});

// ── Empty state ───────────────────────────────────────────────────────────────

describe('DataTable — empty state', () => {
  it('shows the default "No items found." message when rows is empty', () => {
    render(<DataTable columns={columns} rows={[]} />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('No items found.');
  });

  it('shows a custom emptyState node when provided', () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        emptyState={<span data-testid="custom-empty">Nothing here yet</span>}
      />,
    );
    expect(screen.getByTestId('custom-empty').textContent).toBe('Nothing here yet');
  });

  it('does not render a status region when there are rows', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.queryByRole('status')).toBeNull();
  });
});

// ── Loading state ─────────────────────────────────────────────────────────────

describe('DataTable — loading state', () => {
  it('hides data rows and renders skeleton rows when loading=true', () => {
    render(<DataTable columns={columns} rows={rows} loading />);
    // Data rows should not appear
    expect(screen.queryByText('Alice')).toBeNull();
    // Skeleton rows are aria-hidden; check the row class via container
    const { container } = render(<DataTable columns={columns} rows={rows} loading />);
    const skeletonRows = container.querySelectorAll('.cc-table__row--skeleton');
    expect(skeletonRows.length).toBe(5); // SKELETON_ROW_COUNT
  });

  it('renders the data again after loading is cleared', () => {
    const { rerender } = render(<DataTable columns={columns} rows={rows} loading />);
    expect(screen.queryByText('Alice')).toBeNull();
    rerender(<DataTable columns={columns} rows={rows} loading={false} />);
    expect(screen.getByText('Alice')).toBeTruthy();
  });
});

// ── Sort ──────────────────────────────────────────────────────────────────────

describe('DataTable — sort', () => {
  it('marks a sortable header with aria-sort="none" when no sort is active', () => {
    render(<DataTable columns={columns} rows={rows} />);
    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    expect(nameHeader.getAttribute('aria-sort')).toBe('none');
  });

  it('marks the active sorted column with aria-sort="ascending"', () => {
    const sort: DataTableSortState = { key: 'name', direction: 'asc' };
    render(<DataTable columns={columns} rows={rows} sort={sort} />);
    expect(
      screen.getByRole('columnheader', { name: /Name/ }).getAttribute('aria-sort'),
    ).toBe('ascending');
  });

  it('marks the active sorted column with aria-sort="descending"', () => {
    const sort: DataTableSortState = { key: 'name', direction: 'desc' };
    render(<DataTable columns={columns} rows={rows} sort={sort} />);
    expect(
      screen.getByRole('columnheader', { name: /Name/ }).getAttribute('aria-sort'),
    ).toBe('descending');
  });

  it('calls onSortChange(key, "asc") when an unsorted sortable column is clicked', () => {
    const onSortChange = vi.fn();
    render(
      <DataTable columns={columns} rows={rows} onSortChange={onSortChange} />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /Name/ }));
    expect(onSortChange).toHaveBeenCalledWith('name', 'asc');
  });

  it('cycles asc → desc → none on repeated clicks of the same column', () => {
    const onSortChange = vi.fn();
    const sort: DataTableSortState = { key: 'name', direction: 'asc' };
    const { rerender } = render(
      <DataTable columns={columns} rows={rows} sort={sort} onSortChange={onSortChange} />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /Name/ }));
    expect(onSortChange).toHaveBeenCalledWith('name', 'desc');

    rerender(
      <DataTable
        columns={columns}
        rows={rows}
        sort={{ key: 'name', direction: 'desc' }}
        onSortChange={onSortChange}
      />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /Name/ }));
    expect(onSortChange).toHaveBeenCalledWith('name', 'none');
  });

  it('does not propagate aria-sort to non-sortable columns', () => {
    render(<DataTable columns={columns} rows={rows} />);
    const roleHeader = screen.getByRole('columnheader', { name: /Role/ });
    // Role column has sortable=undefined → no aria-sort attribute
    expect(roleHeader.getAttribute('aria-sort')).toBeNull();
  });

  it('fires onSortChange via Enter keydown on sortable header', () => {
    const onSortChange = vi.fn();
    render(
      <DataTable columns={columns} rows={rows} onSortChange={onSortChange} />,
    );
    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    fireEvent.keyDown(nameHeader, { key: 'Enter' });
    expect(onSortChange).toHaveBeenCalledWith('name', 'asc');
  });
});

// ── Selection ─────────────────────────────────────────────────────────────────

describe('DataTable — selection', () => {
  it('renders a "Select all" checkbox in the header when selection is provided', () => {
    const onChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selection={{ selectedIds: [], onChange }}
      />,
    );
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeTruthy();
  });

  it('renders per-row checkboxes labelled by row id', () => {
    const onChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selection={{ selectedIds: [], onChange }}
      />,
    );
    expect(screen.getByRole('checkbox', { name: 'Select row 1' })).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: 'Select row 2' })).toBeTruthy();
  });

  it('checks "Select all" when every row is selected', () => {
    const onChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selection={{ selectedIds: ['1', '2', '3'], onChange }}
      />,
    );
    const allCb = screen.getByRole('checkbox', { name: 'Select all rows' }) as HTMLInputElement;
    expect(allCb.checked).toBe(true);
  });

  it('clicking "Select all" when none selected calls onChange with all ids', () => {
    const onChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selection={{ selectedIds: [], onChange }}
      />,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onChange).toHaveBeenCalledWith(['1', '2', '3']);
  });

  it('clicking "Select all" when all selected calls onChange with empty array', () => {
    const onChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selection={{ selectedIds: ['1', '2', '3'], onChange }}
      />,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('clicking a row checkbox adds that id to the selection', () => {
    const onChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selection={{ selectedIds: [], onChange }}
      />,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row 2' }));
    expect(onChange).toHaveBeenCalledWith(['2']);
  });

  it('clicking a row checkbox that is already selected removes it', () => {
    const onChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selection={{ selectedIds: ['1', '2'], onChange }}
      />,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row 1' }));
    expect(onChange).toHaveBeenCalledWith(['2']);
  });

  it('does not render checkboxes when selection prop is omitted', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.queryByRole('checkbox')).toBeNull();
  });
});

// ── Row interaction ───────────────────────────────────────────────────────────

describe('DataTable — row interaction', () => {
  it('calls onRowClick with the row id when a clickable row is clicked', () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={columns} rows={rows} onRowClick={onRowClick} />);
    const allRows = screen.getAllByRole('row').slice(1); // skip header row
    fireEvent.click(allRows[0]);
    expect(onRowClick).toHaveBeenCalledWith('1');
  });

  it('marks the activeRowId row as selected', () => {
    render(
      <DataTable columns={columns} rows={rows} onRowClick={() => {}} activeRowId="2" />,
    );
    const allRows = screen.getAllByRole('row').slice(1);
    // Row 2 is at index 1
    expect(allRows[1].getAttribute('aria-selected')).toBe('true');
    expect(allRows[0].getAttribute('aria-selected')).toBe('false');
  });

  it('fires onRowClick via Enter keydown on a clickable row', () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={columns} rows={rows} onRowClick={onRowClick} />);
    const allRows = screen.getAllByRole('row').slice(1);
    fireEvent.keyDown(allRows[0], { key: 'Enter' });
    expect(onRowClick).toHaveBeenCalledWith('1');
  });
});

// ── Pagination ────────────────────────────────────────────────────────────────

describe('DataTable — pagination', () => {
  const pagination = {
    page: 2,
    pageSize: 2,
    totalItems: 6,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    pagination.onPageChange = vi.fn();
  });

  it('renders a pagination nav when there are multiple pages', () => {
    render(<DataTable columns={columns} rows={rows} pagination={pagination} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeTruthy();
  });

  it('shows page x of y text', () => {
    render(<DataTable columns={columns} rows={rows} pagination={pagination} />);
    expect(screen.getByText('Page 2 of 3')).toBeTruthy();
  });

  it('calls onPageChange(page-1) when Prev is clicked', () => {
    render(<DataTable columns={columns} rows={rows} pagination={pagination} />);
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(pagination.onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange(page+1) when Next is clicked', () => {
    render(<DataTable columns={columns} rows={rows} pagination={pagination} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(pagination.onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables Prev on page 1', () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        pagination={{ ...pagination, page: 1 }}
      />,
    );
    const prevBtn = screen.getByRole('button', { name: 'Previous page' }) as HTMLButtonElement;
    expect(prevBtn.disabled).toBe(true);
  });

  it('disables Next on last page', () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        pagination={{ ...pagination, page: 3 }}
      />,
    );
    const nextBtn = screen.getByRole('button', { name: 'Next page' }) as HTMLButtonElement;
    expect(nextBtn.disabled).toBe(true);
  });

  it('does not render pagination nav when totalItems fits in one page', () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        pagination={{ page: 1, pageSize: 10, totalItems: 3, onPageChange: vi.fn() }}
      />,
    );
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).toBeNull();
  });
});
