/**
 * ListView — unit + interaction tests, plus a11y audit via axe-core.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axe from 'axe-core';
import { ListView, type ListViewColumn } from '../react/ListView';

interface Row {
  id: string;
  name: string;
  status: string;
}

const COLUMNS: ListViewColumn<Row>[] = [
  { key: 'name', label: 'Name', sortable: true, render: (r) => r.name },
  { key: 'status', label: 'Status', render: (r) => r.status },
];

const ROWS: (Row & { id: string })[] = [
  { id: '1', name: 'Alpha', status: 'Active' },
  { id: '2', name: 'Beta', status: 'Inactive' },
  { id: '3', name: 'Gamma', status: 'Active' },
];

const SCOPE_FILTERS = [
  { id: 'all', label: 'All', count: 3 },
  { id: 'active', label: 'Active', count: 2 },
];

// ── Rendering ─────────────────────────────────────────────────────────────────

describe('ListView rendering', () => {
  it('renders heading', () => {
    render(<ListView columns={COLUMNS} rows={ROWS} heading="Vendors" />);
    expect(screen.getByRole('heading', { name: 'Vendors' })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<ListView columns={COLUMNS} rows={ROWS} heading="Vendors" subtitle="All suppliers" />);
    expect(screen.getByText('All suppliers')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<ListView columns={COLUMNS} rows={ROWS} heading="Vendors" />);
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
  });

  it('renders all row data', () => {
    render(<ListView columns={COLUMNS} rows={ROWS} heading="Vendors" />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('renders createAction slot', () => {
    render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        createAction={<button type="button">Add vendor</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Add vendor' })).toBeInTheDocument();
  });
});

// ── Empty state ───────────────────────────────────────────────────────────────

describe('ListView empty state', () => {
  it('renders default empty message when rows is empty', () => {
    render(<ListView columns={COLUMNS} rows={[]} heading="Vendors" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('No items found.')).toBeInTheDocument();
  });

  it('renders custom emptyState', () => {
    render(
      <ListView
        columns={COLUMNS}
        rows={[]}
        heading="Vendors"
        emptyState={<span>Nothing here yet</span>}
      />,
    );
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });
});

// ── Skeleton loading ──────────────────────────────────────────────────────────

describe('ListView loading state', () => {
  it('renders skeleton rows when loading=true', () => {
    render(<ListView columns={COLUMNS} rows={[]} heading="Vendors" loading />);
    const skeletons = document.querySelectorAll('.cc-table__row--skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('does not render real rows while loading', () => {
    render(<ListView columns={COLUMNS} rows={ROWS} heading="Vendors" loading />);
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  });
});

// ── Scope filters ─────────────────────────────────────────────────────────────

describe('ListView scope filters', () => {
  it('renders scope filter tabs', () => {
    render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        scopeFilters={SCOPE_FILTERS}
        activeScopeId="all"
      />,
    );
    expect(screen.getByRole('tab', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /active/i })).toBeInTheDocument();
  });

  it('marks active scope with aria-selected=true', () => {
    render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        scopeFilters={SCOPE_FILTERS}
        activeScopeId="active"
      />,
    );
    const activeTab = screen.getByRole('tab', { name: /active/i });
    expect(activeTab).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onScopeChange when a tab is clicked', () => {
    const onScopeChange = vi.fn();
    render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        scopeFilters={SCOPE_FILTERS}
        activeScopeId="all"
        onScopeChange={onScopeChange}
      />,
    );
    fireEvent.click(screen.getByRole('tab', { name: /active/i }));
    expect(onScopeChange).toHaveBeenCalledWith('active');
  });

  it('renders count badge on scope tabs', () => {
    render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        scopeFilters={SCOPE_FILTERS}
        activeScopeId="all"
      />,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

// ── Sorting ───────────────────────────────────────────────────────────────────

describe('ListView sorting', () => {
  it('renders aria-sort on sortable column', () => {
    render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        sortKey="name"
        sortDirection="asc"
      />,
    );
    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('calls onSort when sortable header clicked', () => {
    const onSort = vi.fn();
    render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        sortKey=""
        sortDirection="none"
        onSort={onSort}
      />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    expect(onSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('cycles sort direction: none → asc → desc → none', () => {
    const onSort = vi.fn();
    const { rerender } = render(
      <ListView columns={COLUMNS} rows={ROWS} heading="Vendors" sortKey="" sortDirection="none" onSort={onSort} />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    expect(onSort).toHaveBeenLastCalledWith('name', 'asc');

    rerender(<ListView columns={COLUMNS} rows={ROWS} heading="Vendors" sortKey="name" sortDirection="asc" onSort={onSort} />);
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    expect(onSort).toHaveBeenLastCalledWith('name', 'desc');

    rerender(<ListView columns={COLUMNS} rows={ROWS} heading="Vendors" sortKey="name" sortDirection="desc" onSort={onSort} />);
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    expect(onSort).toHaveBeenLastCalledWith('name', 'none');
  });

  it('does not call onSort for non-sortable columns', () => {
    const onSort = vi.fn();
    render(
      <ListView columns={COLUMNS} rows={ROWS} heading="Vendors" onSort={onSort} />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /status/i }));
    expect(onSort).not.toHaveBeenCalled();
  });
});

// ── Row interaction ───────────────────────────────────────────────────────────

describe('ListView row interaction', () => {
  it('calls onRowClick with row id when a row is clicked', () => {
    const onRowClick = vi.fn();
    render(<ListView columns={COLUMNS} rows={ROWS} heading="Vendors" onRowClick={onRowClick} />);
    fireEvent.click(screen.getByText('Alpha').closest('tr')!);
    expect(onRowClick).toHaveBeenCalledWith('1');
  });

  it('marks selected row with is-selected class', () => {
    render(<ListView columns={COLUMNS} rows={ROWS} heading="Vendors" onRowClick={() => {}} selectedId="2" />);
    const row = screen.getByText('Beta').closest('tr')!;
    expect(row.className).toContain('is-selected');
  });

  it('does not apply clickable class when onRowClick is absent', () => {
    render(<ListView columns={COLUMNS} rows={ROWS} heading="Vendors" />);
    const row = screen.getByText('Alpha').closest('tr')!;
    expect(row.className).not.toContain('clickable');
  });
});

// ── Pagination ────────────────────────────────────────────────────────────────

describe('ListView pagination', () => {
  it('renders pagination when totalPages > 1', () => {
    render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        pagination={{ page: 1, pageSize: 1, totalItems: 10 }}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('calls onPageChange with next page number', () => {
    const onPageChange = vi.fn();
    render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        pagination={{ page: 1, pageSize: 1, totalItems: 10 }}
        onPageChange={onPageChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables Prev button on first page', () => {
    render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        pagination={{ page: 1, pageSize: 1, totalItems: 10 }}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('renders load-more button in infinite-scroll mode', () => {
    render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        paginationMode="infinite-scroll"
        hasMore
        onLoadMore={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Load more' })).toBeInTheDocument();
  });
});

// ── a11y ──────────────────────────────────────────────────────────────────────

describe('ListView a11y (axe)', () => {
  it('has no axe violations in default state', async () => {
    const { container } = render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        scopeFilters={SCOPE_FILTERS}
        activeScopeId="all"
      />,
    );
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('has no axe violations in empty state', async () => {
    const { container } = render(
      <ListView columns={COLUMNS} rows={[]} heading="Vendors" />,
    );
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('has no axe violations with pagination', async () => {
    const { container } = render(
      <ListView
        columns={COLUMNS}
        rows={ROWS}
        heading="Vendors"
        pagination={{ page: 2, pageSize: 1, totalItems: 10 }}
        onPageChange={() => {}}
      />,
    );
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });
});
