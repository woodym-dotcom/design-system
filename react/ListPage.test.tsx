/**
 * ListPage — heading, filters, sort, pagination, detail pane, bulk actions,
 * permissions, scope filter tabs, and edge-case empty-state behaviour.
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListPage } from './ListPage';
import type { ListPageListProps, ListPageFilters, BulkAction } from './ListPage';

// ── Shared fixtures ───────────────────────────────────────────────────────────

interface Company {
  id: string;
  name: string;
  status: string;
}

const columns: ListPageListProps<Company>['columns'] = [
  { key: 'name',   label: 'Name',   sortable: true, render: (r) => r.name },
  { key: 'status', label: 'Status',                 render: (r) => r.status },
];

const companies: Company[] = [
  { id: 'c1', name: 'Klarna',      status: 'Active'   },
  { id: 'c2', name: 'Corner Cafe', status: 'Pending'  },
  { id: 'c3', name: 'Acme Corp',   status: 'Archived' },
];

beforeEach(() => {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', window.location.pathname);
  }
});

// ── Header ────────────────────────────────────────────────────────────────────

describe('ListPage — header', () => {
  it('renders the heading', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Companies' })).toBeTruthy();
  });

  it('renders a subtitle when provided', () => {
    render(
      <ListPage
        heading="Companies"
        subtitle="All registered companies"
        list={{ columns, rows: companies }}
      />,
    );
    expect(screen.getByText('All registered companies')).toBeTruthy();
  });

  it('renders a breadcrumb slot', () => {
    render(
      <ListPage
        heading="Companies"
        breadcrumb={<nav aria-label="breadcrumb"><a href="/">Home</a></nav>}
        list={{ columns, rows: companies }}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeTruthy();
    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('renders a search slot above the filter bar', () => {
    render(
      <ListPage
        heading="Companies"
        search={<input aria-label="Search companies" />}
        list={{ columns, rows: companies }}
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Search companies' })).toBeTruthy();
  });
});

// ── Row rendering ─────────────────────────────────────────────────────────────

describe('ListPage — row rendering', () => {
  it('renders all rows with cell content', () => {
    render(<ListPage heading="Companies" list={{ columns, rows: companies }} />);
    expect(screen.getByText('Klarna')).toBeTruthy();
    expect(screen.getByText('Corner Cafe')).toBeTruthy();
    expect(screen.getByText('Acme Corp')).toBeTruthy();
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('shows the default empty state when rows is empty', () => {
    render(<ListPage heading="Companies" list={{ columns, rows: [] }} />);
    const status = screen.getByRole('status');
    expect(status.textContent).toContain('No items found.');
  });

  it('shows a custom emptyState when rows is empty', () => {
    render(
      <ListPage
        heading="Companies"
        list={{
          columns,
          rows: [],
          emptyState: <p>No companies registered yet.</p>,
        }}
      />,
    );
    expect(screen.getByText('No companies registered yet.')).toBeTruthy();
  });
});

// ── Filters ───────────────────────────────────────────────────────────────────

describe('ListPage — filters', () => {
  it('renders filter chips', () => {
    const filters: ListPageFilters = {
      kind: 'chips',
      options: [
        { id: 'active',   label: 'Active' },
        { id: 'archived', label: 'Archived' },
      ],
      activeIds: [],
      onToggle: vi.fn(),
    };
    render(
      <ListPage heading="Companies" list={{ columns, rows: companies }} filters={filters} />,
    );
    expect(screen.getByRole('button', { name: 'Active' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Archived' })).toBeTruthy();
  });

  it('calls filters.onToggle when a filter chip is clicked', () => {
    const onToggle = vi.fn();
    const filters: ListPageFilters = {
      kind: 'chips',
      options: [{ id: 'active', label: 'Active' }],
      activeIds: [],
      onToggle,
    };
    render(
      <ListPage heading="Companies" list={{ columns, rows: companies }} filters={filters} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Active' }));
    expect(onToggle).toHaveBeenCalledWith('active');
  });

  it('shows "No matches" and a "Clear filters" button when rows is empty and filters are active', () => {
    const onToggle = vi.fn();
    const filters: ListPageFilters = {
      kind: 'chips',
      options: [{ id: 'active', label: 'Active' }],
      activeIds: ['active'],
      onToggle,
    };
    render(
      <ListPage heading="Companies" list={{ columns, rows: [] }} filters={filters} />,
    );
    expect(screen.getByText(/No matches for the current filters/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeTruthy();
  });

  it('"Clear filters" calls onToggle for each active filter id', () => {
    const onToggle = vi.fn();
    const filters: ListPageFilters = {
      kind: 'chips',
      options: [
        { id: 'active',   label: 'Active' },
        { id: 'archived', label: 'Archived' },
      ],
      activeIds: ['active', 'archived'],
      onToggle,
    };
    render(
      <ListPage heading="Companies" list={{ columns, rows: [] }} filters={filters} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onToggle).toHaveBeenCalledWith('active');
    expect(onToggle).toHaveBeenCalledWith('archived');
  });
});

// ── Sort ──────────────────────────────────────────────────────────────────────

describe('ListPage — sort', () => {
  it('marks the active sort column with aria-sort="ascending"', () => {
    render(
      <ListPage
        heading="Companies"
        list={{
          columns,
          rows: companies,
          sort: { key: 'name', direction: 'asc' },
          onSortChange: vi.fn(),
        }}
      />,
    );
    expect(
      screen.getByRole('columnheader', { name: /Name/ }).getAttribute('aria-sort'),
    ).toBe('ascending');
  });

  it('fires onSortChange when a sortable header is clicked', () => {
    const onSortChange = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies, onSortChange }}
      />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /Name/ }));
    expect(onSortChange).toHaveBeenCalledWith('name', 'asc');
  });

  it('cycles asc → desc → none on repeated header clicks', () => {
    const onSortChange = vi.fn();
    const { rerender } = render(
      <ListPage
        heading="Companies"
        list={{
          columns,
          rows: companies,
          sort: { key: 'name', direction: 'asc' },
          onSortChange,
        }}
      />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /Name/ }));
    expect(onSortChange).toHaveBeenCalledWith('name', 'desc');

    rerender(
      <ListPage
        heading="Companies"
        list={{
          columns,
          rows: companies,
          sort: { key: 'name', direction: 'desc' },
          onSortChange,
        }}
      />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /Name/ }));
    expect(onSortChange).toHaveBeenCalledWith('name', 'none');
  });
});

// ── Scope filter tabs ─────────────────────────────────────────────────────────

describe('ListPage — scope filter tabs', () => {
  it('renders a tablist with scope filters', () => {
    render(
      <ListPage
        heading="Companies"
        list={{
          columns,
          rows: companies,
          scopeFilters: [
            { id: 'all',      label: 'All',      count: 3 },
            { id: 'active',   label: 'Active',   count: 1 },
            { id: 'archived', label: 'Archived', count: 1 },
          ],
          activeScopeId: 'all',
          onScopeChange: vi.fn(),
        }}
      />,
    );
    expect(screen.getByRole('tablist', { name: 'Scope filters' })).toBeTruthy();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('calls onScopeChange when a scope tab is clicked', () => {
    const onScopeChange = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={{
          columns,
          rows: companies,
          scopeFilters: [
            { id: 'all',    label: 'All' },
            { id: 'active', label: 'Active' },
          ],
          activeScopeId: 'all',
          onScopeChange,
        }}
      />,
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Active' }));
    expect(onScopeChange).toHaveBeenCalledWith('active');
  });

  it('renders a count badge on scope tabs that have a count', () => {
    render(
      <ListPage
        heading="Companies"
        list={{
          columns,
          rows: companies,
          scopeFilters: [{ id: 'all', label: 'All', count: 42 }],
          activeScopeId: 'all',
        }}
      />,
    );
    expect(screen.getByText('42')).toBeTruthy();
  });
});

// ── Pagination ────────────────────────────────────────────────────────────────

describe('ListPage — pagination', () => {
  const pagination = {
    page: 1,
    pageSize: 2,
    totalItems: 6,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    pagination.onPageChange = vi.fn();
  });

  it('renders a pagination nav with prev/next buttons', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies, pagination }}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeTruthy();
  });

  it('shows page x of y', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies, pagination: { ...pagination, page: 2 } }}
      />,
    );
    expect(screen.getByText('Page 2 of 3')).toBeTruthy();
  });

  it('calls onPageChange when Next is clicked', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies, pagination }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(pagination.onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables Prev on page 1 and Next on last page', () => {
    const { rerender } = render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies, pagination: { ...pagination, page: 1 } }}
      />,
    );
    expect(
      (screen.getByRole('button', { name: 'Previous page' }) as HTMLButtonElement).disabled,
    ).toBe(true);

    rerender(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies, pagination: { ...pagination, page: 3 } }}
      />,
    );
    expect(
      (screen.getByRole('button', { name: 'Next page' }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});

// ── Detail pane ───────────────────────────────────────────────────────────────

describe('ListPage — detail pane', () => {
  it('renders the detail pane for the selected id', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        detail={{
          selectedId: 'c1',
          onClose: vi.fn(),
          render: (id) => <p data-testid="pane-body">Detail for {id}</p>,
        }}
      />,
    );
    expect(screen.getByTestId('pane-body').textContent).toBe('Detail for c1');
  });

  it('does not render the detail pane when selectedId is null', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        detail={{
          selectedId: null,
          onClose: vi.fn(),
          render: (id) => <p>Detail for {id}</p>,
        }}
      />,
    );
    expect(screen.queryByLabelText('Detail pane')).toBeNull();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        detail={{
          selectedId: 'c1',
          onClose,
          render: (id) => <p>Detail for {id}</p>,
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close detail pane' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows the edit button by default and toggles aria-pressed', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        detail={{
          selectedId: 'c1',
          onClose: vi.fn(),
          render: (_id, { editMode }) => <p>{editMode ? 'editing' : 'viewing'}</p>,
        }}
      />,
    );
    const editBtn = screen.getByRole('button', { name: 'Switch to edit mode' });
    expect(editBtn.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(editBtn);
    expect(screen.getByText('editing')).toBeTruthy();
  });

  it('hides the edit button when permissions.canEdit is false', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        detail={{
          selectedId: 'c1',
          onClose: vi.fn(),
          render: () => <p>Detail</p>,
        }}
        permissions={{ canEdit: false }}
      />,
    );
    expect(screen.queryByRole('button', { name: /edit mode/i })).toBeNull();
  });

  it('calls detail.onClose when the selected row drops out of the filtered rows', async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        detail={{
          selectedId: 'c2',
          onClose,
          render: (id) => <p>Detail {id}</p>,
        }}
      />,
    );
    // Remove c2 from the rows — should trigger the edge-case effect
    await act(async () => {
      rerender(
        <ListPage
          heading="Companies"
          list={{ columns, rows: companies.filter((c) => c.id !== 'c2') }}
          detail={{
            selectedId: 'c2',
            onClose,
            render: (id) => <p>Detail {id}</p>,
          }}
        />,
      );
    });
    expect(onClose).toHaveBeenCalled();
  });
});

// ── Bulk actions ──────────────────────────────────────────────────────────────

describe('ListPage — bulk actions', () => {
  it('does not render the bulk bar when no rows are selected', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        bulk={{ selectedIds: [], onChange: vi.fn(), actions: [] }}
      />,
    );
    expect(screen.queryByRole('toolbar')).toBeNull();
  });

  it('renders the bulk bar with selected count when rows are selected', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        bulk={{
          selectedIds: ['c1', 'c2'],
          onChange: vi.fn(),
          actions: [{ id: 'archive', label: 'Archive', onRun: vi.fn() }],
        }}
      />,
    );
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar.getAttribute('aria-label')).toContain('2 items selected');
    expect(screen.getByText('2 selected')).toBeTruthy();
  });

  it('runs the bulk action with the correct row objects', () => {
    const onRun = vi.fn();
    const actions: BulkAction<Company>[] = [{ id: 'archive', label: 'Archive', onRun }];
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        bulk={{ selectedIds: ['c1'], onChange: vi.fn(), actions }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Archive' }));
    expect(onRun).toHaveBeenCalledWith([companies[0]]);
  });

  it('calls onChange([]) when "Clear" is clicked in the bulk bar', () => {
    const onChange = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        bulk={{
          selectedIds: ['c1'],
          onChange,
          actions: [],
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('hides the "delete" bulk action when permissions.canDelete is false', () => {
    const onRun = vi.fn();
    const actions: BulkAction<Company>[] = [
      { id: 'delete', label: 'Delete', onRun },
      { id: 'export', label: 'Export', onRun: vi.fn() },
    ];
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        bulk={{ selectedIds: ['c1'], onChange: vi.fn(), actions }}
        permissions={{ canDelete: false }}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Delete' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Export' })).toBeTruthy();
  });
});

// ── Permissions — canCreate ───────────────────────────────────────────────────

describe('ListPage — permissions.canCreate', () => {
  it('hides the CreateMenu when canCreate is false', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        createMenu={{ triggerLabel: 'New', items: [{ kind: 'manual', label: 'Company', onSelect: vi.fn() }] }}
        permissions={{ canCreate: false }}
      />,
    );
    expect(screen.queryByRole('button', { name: 'New' })).toBeNull();
  });

  it('shows the CreateMenu when canCreate is true (default)', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies }}
        createMenu={{ triggerLabel: 'New', items: [{ kind: 'manual', label: 'Company', onSelect: vi.fn() }] }}
      />,
    );
    expect(screen.getByRole('button', { name: 'New' })).toBeTruthy();
  });
});

// ── List error ────────────────────────────────────────────────────────────────

describe('ListPage — list.error', () => {
  it('renders an alert with the error message instead of rows', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ columns, rows: companies, error: 'Failed to load' }}
      />,
    );
    expect(screen.getByRole('alert').textContent).toContain('Failed to load');
    expect(screen.queryByText('Klarna')).toBeNull();
  });
});
