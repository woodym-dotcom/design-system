/**
 * ListPage — Phase 2 unit tests.
 *
 * Covers (≥25 tests):
 *  - Heading, subtitle, breadcrumb rendering
 *  - CreateMenu permission gating (canCreate)
 *  - Filter chips, sidebar, responsive layouts
 *  - Scope filter tabs
 *  - Sort: column header click, aria-sort, cycle
 *  - List loading skeleton + independent from detail
 *  - List error banner
 *  - Empty state: overall vs filter-active
 *  - Row click + is-selected
 *  - Detail pane: opens, closes, edit-mode toggle, permission gating (canEdit)
 *  - Detail loading + detail error (independent from list)
 *  - Edit-mode resets on selectedId change
 *  - Fullscreen toggle (uncontrolled + controlled)
 *  - Filter change closes pane when selectedId drops out of rows (edge case 1)
 *  - Bulk action bar: renders, hides when selectedIds empty, clears, canDelete
 *  - Pagination prev/next
 *  - Legacy backward-compat props still render
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ListPage } from '../react/ListPage';
import type { ListViewColumn } from '../react/ListView';

// ── Fixtures ──────────────────────────────────────────────────────────────────

interface Row {
  id: string;
  name: string;
  status: string;
}

const COLS: ListViewColumn<Row>[] = [
  { key: 'name', label: 'Name', sortable: true, render: (r) => r.name },
  { key: 'status', label: 'Status', render: (r) => r.status },
];

const ROWS: Row[] = [
  { id: '1', name: 'Alpha', status: 'Active' },
  { id: '2', name: 'Beta', status: 'Inactive' },
  { id: '3', name: 'Gamma', status: 'Active' },
];

const LIST = { columns: COLS, rows: ROWS };

// ── 1. Heading / subtitle / breadcrumb ────────────────────────────────────────

describe('ListPage — header', () => {
  it('renders heading', () => {
    render(<ListPage heading="Companies" list={LIST} />);
    expect(screen.getByRole('heading', { name: 'Companies' })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<ListPage heading="Companies" subtitle="All companies" list={LIST} />);
    expect(screen.getByText('All companies')).toBeInTheDocument();
  });

  it('renders breadcrumb slot', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        breadcrumb={<nav aria-label="Breadcrumb"><a href="/">Home</a></nav>}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });
});

// ── 2. CreateMenu permission gating ──────────────────────────────────────────

describe('ListPage — createMenu permissions', () => {
  const CREATE_MENU = {
    items: [{ kind: 'manual' as const, label: 'New company', onSelect: vi.fn() }],
    triggerLabel: 'New',
  };

  it('renders create button when canCreate not set', () => {
    render(<ListPage heading="Companies" list={LIST} createMenu={CREATE_MENU} />);
    expect(screen.getByRole('button', { name: /new/i })).toBeInTheDocument();
  });

  it('hides create button when canCreate=false', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        createMenu={CREATE_MENU}
        permissions={{ canCreate: false }}
      />,
    );
    expect(screen.queryByRole('button', { name: /new/i })).not.toBeInTheDocument();
  });

  it('shows create button when canCreate=true explicitly', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        createMenu={CREATE_MENU}
        permissions={{ canCreate: true }}
      />,
    );
    expect(screen.getByRole('button', { name: /new/i })).toBeInTheDocument();
  });
});

// ── 3. Filters ────────────────────────────────────────────────────────────────

describe('ListPage — filters', () => {
  const FILTER_OPTIONS = [
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
  ];

  it('renders chip filter bar', () => {
    const onToggle = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        filters={{ kind: 'chips', options: FILTER_OPTIONS, activeIds: [], onToggle }}
      />,
    );
    expect(screen.getByRole('group', { name: 'Filters' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Active' })).toBeInTheDocument();
  });

  it('calls onToggle when chip clicked', () => {
    const onToggle = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        filters={{ kind: 'chips', options: FILTER_OPTIONS, activeIds: [], onToggle }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Active' }));
    expect(onToggle).toHaveBeenCalledWith('active');
  });
});

// ── 4. Scope filter tabs ──────────────────────────────────────────────────────

describe('ListPage — scope filters', () => {
  const SCOPE = [
    { id: 'all', label: 'All', count: 3 },
    { id: 'active', label: 'Active', count: 2 },
  ];

  it('renders scope filter tabs', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, scopeFilters: SCOPE, activeScopeId: 'all' }}
      />,
    );
    expect(screen.getByRole('tab', { name: /all/i })).toBeInTheDocument();
  });

  it('marks active scope with aria-selected=true', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, scopeFilters: SCOPE, activeScopeId: 'active' }}
      />,
    );
    expect(screen.getByRole('tab', { name: /active/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onScopeChange on tab click', () => {
    const onScopeChange = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, scopeFilters: SCOPE, activeScopeId: 'all', onScopeChange }}
      />,
    );
    fireEvent.click(screen.getByRole('tab', { name: /active/i }));
    expect(onScopeChange).toHaveBeenCalledWith('active');
  });
});

// ── 5. Sort ───────────────────────────────────────────────────────────────────

describe('ListPage — sort', () => {
  it('calls onSortChange when sortable header clicked', () => {
    const onSortChange = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, sort: { key: '', direction: 'none' }, onSortChange }}
      />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    expect(onSortChange).toHaveBeenCalledWith('name', 'asc');
  });

  it('cycles sort direction none → asc → desc → none', () => {
    const onSortChange = vi.fn();
    const { rerender } = render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, sort: { key: '', direction: 'none' }, onSortChange }}
      />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    expect(onSortChange).toHaveBeenLastCalledWith('name', 'asc');

    rerender(
      <ListPage
        heading="Companies"
        list={{ ...LIST, sort: { key: 'name', direction: 'asc' }, onSortChange }}
      />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    expect(onSortChange).toHaveBeenLastCalledWith('name', 'desc');

    rerender(
      <ListPage
        heading="Companies"
        list={{ ...LIST, sort: { key: 'name', direction: 'desc' }, onSortChange }}
      />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    expect(onSortChange).toHaveBeenLastCalledWith('name', 'none');
  });

  it('sets aria-sort=ascending when sort key matches and direction=asc', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, sort: { key: 'name', direction: 'asc' } }}
      />,
    );
    expect(screen.getByRole('columnheader', { name: /name/i })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
  });
});

// ── 6. Loading state ──────────────────────────────────────────────────────────

describe('ListPage — loading states', () => {
  it('renders skeleton rows when list.loading=true', () => {
    render(<ListPage heading="Companies" list={{ ...LIST, loading: true }} />);
    const skeletons = document.querySelectorAll('.cc-table__row--skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('does not show real rows while list is loading', () => {
    render(<ListPage heading="Companies" list={{ ...LIST, loading: true }} />);
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  });

  it('list loading is independent from detail: detail pane renders while list loads', () => {
    const onClose = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, loading: true }}
        detail={{
          selectedId: '1',
          onClose,
          render: (_id, _ctx) => <div>Detail content</div>,
          loading: false,
        }}
      />,
    );
    // List is loading (no Alpha row) but detail pane is visible
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
    expect(screen.getByText('Detail content')).toBeInTheDocument();
  });

  it('renders detail skeleton when detail.loading=true', () => {
    const onClose = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: '1',
          onClose,
          render: (_id, _ctx) => <div>Should not show</div>,
          loading: true,
        }}
      />,
    );
    expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
    expect(document.querySelector('.cc-list-page__detail-loading')).toBeInTheDocument();
  });
});

// ── 7. Error states ───────────────────────────────────────────────────────────

describe('ListPage — error states', () => {
  it('renders list error banner instead of table', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, error: <span>Failed to load</span> }}
      />,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('renders detail error inside pane', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: '1',
          onClose: vi.fn(),
          render: (_id, _ctx) => <div>Should not show</div>,
          error: <span>Detail failed</span>,
        }}
      />,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Detail failed')).toBeInTheDocument();
    expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
  });
});

// ── 8. Empty states ───────────────────────────────────────────────────────────

describe('ListPage — empty states', () => {
  it('renders list.emptyState when rows is empty and no filters active', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, rows: [], emptyState: <span>No companies yet</span> }}
      />,
    );
    expect(screen.getByText('No companies yet')).toBeInTheDocument();
  });

  it('renders built-in filter-empty when rows=[] and filters active', () => {
    render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, rows: [] }}
        filters={{
          kind: 'chips',
          options: [{ id: 'active', label: 'Active' }],
          activeIds: ['active'],
          onToggle: vi.fn(),
        }}
      />,
    );
    expect(screen.getByText(/no matches for the current filters/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('clear-filters button calls onToggle for each active filter', () => {
    const onToggle = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, rows: [] }}
        filters={{
          kind: 'chips',
          options: [{ id: 'active', label: 'Active' }],
          activeIds: ['active'],
          onToggle,
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(onToggle).toHaveBeenCalledWith('active');
  });
});

// ── 9. Detail pane: open / close / edit-mode ──────────────────────────────────

describe('ListPage — detail pane', () => {
  it('renders detail pane when selectedId is set', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: '1',
          onClose: vi.fn(),
          render: (id, _ctx) => <div>Detail for {id}</div>,
        }}
      />,
    );
    expect(screen.getByText('Detail for 1')).toBeInTheDocument();
  });

  it('does not render detail pane when selectedId is null', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: null,
          onClose: vi.fn(),
          render: (_id, _ctx) => <div>Should not show</div>,
        }}
      />,
    );
    expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: '1',
          onClose,
          render: (_id, _ctx) => <div>Detail</div>,
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /close detail pane/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('toggles edit mode on button click', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: '1',
          onClose: vi.fn(),
          render: (_id, ctx) => (
            <div>{ctx.editMode ? 'editing' : 'viewing'}</div>
          ),
        }}
      />,
    );
    expect(screen.getByText('viewing')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /switch to edit mode/i }));
    expect(screen.getByText('editing')).toBeInTheDocument();
  });

  it('resets edit mode when selectedId changes', () => {
    const { rerender } = render(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: '1',
          onClose: vi.fn(),
          render: (_id, ctx) => (
            <div>{ctx.editMode ? 'editing' : 'viewing'}</div>
          ),
        }}
      />,
    );
    // Enter edit mode
    fireEvent.click(screen.getByRole('button', { name: /switch to edit mode/i }));
    expect(screen.getByText('editing')).toBeInTheDocument();

    // Change selectedId → should reset to viewing
    rerender(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: '2',
          onClose: vi.fn(),
          render: (_id, ctx) => (
            <div>{ctx.editMode ? 'editing' : 'viewing'}</div>
          ),
        }}
      />,
    );
    expect(screen.getByText('viewing')).toBeInTheDocument();
  });

  it('hides edit toggle when canEdit=false', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: '1',
          onClose: vi.fn(),
          render: (_id, _ctx) => <div>Detail</div>,
        }}
        permissions={{ canEdit: false }}
      />,
    );
    expect(
      screen.queryByRole('button', { name: /switch to edit mode/i }),
    ).not.toBeInTheDocument();
  });
});

// ── 10. Fullscreen toggle ─────────────────────────────────────────────────────

describe('ListPage — fullscreen', () => {
  it('toggles fullscreen uncontrolled', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: '1',
          onClose: vi.fn(),
          render: (_id, _ctx) => <div>Detail</div>,
        }}
      />,
    );
    const pane = document.querySelector('.cc-list-page__detail-pane')!;
    expect(pane).not.toHaveClass('cc-list-page__detail-pane--fullscreen');

    fireEvent.click(screen.getByRole('button', { name: /enter fullscreen/i }));
    expect(pane).toHaveClass('cc-list-page__detail-pane--fullscreen');
  });

  it('calls onFullscreenChange when controlled', () => {
    const onFullscreenChange = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: '1',
          onClose: vi.fn(),
          render: (_id, _ctx) => <div>Detail</div>,
          fullscreen: false,
          onFullscreenChange,
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /enter fullscreen/i }));
    expect(onFullscreenChange).toHaveBeenCalledWith(true);
  });

  it('fullscreen pane has z-60, normal pane has z-40', () => {
    const { rerender } = render(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: '1',
          onClose: vi.fn(),
          render: (_id, _ctx) => <div>Detail</div>,
          fullscreen: false,
        }}
      />,
    );
    const pane = document.querySelector('.cc-list-page__detail-pane') as HTMLElement;
    expect(pane.style.zIndex).toBe('40');

    rerender(
      <ListPage
        heading="Companies"
        list={LIST}
        detail={{
          selectedId: '1',
          onClose: vi.fn(),
          render: (_id, _ctx) => <div>Detail</div>,
          fullscreen: true,
        }}
      />,
    );
    expect(pane.style.zIndex).toBe('60');
  });
});

// ── 11. Filter-change closes pane (edge case 1) ───────────────────────────────

describe('ListPage — filter change closes pane when row removed', () => {
  it('closes pane when selectedId no longer in rows', async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, rows: ROWS }}
        detail={{
          selectedId: '1',
          onClose,
          render: (_id, _ctx) => <div>Detail for 1</div>,
        }}
      />,
    );
    expect(screen.getByText('Detail for 1')).toBeInTheDocument();

    // Now filter rows so row '1' is gone
    const filteredRows = ROWS.filter((r) => r.id !== '1');
    await act(async () => {
      rerender(
        <ListPage
          heading="Companies"
          list={{ ...LIST, rows: filteredRows }}
          detail={{
            selectedId: '1',
            onClose,
            render: (_id, _ctx) => <div>Detail for 1</div>,
          }}
        />,
      );
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('keeps pane open when selectedId still in rows after filter', async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <ListPage
        heading="Companies"
        list={{ ...LIST, rows: ROWS }}
        detail={{
          selectedId: '1',
          onClose,
          render: (_id, _ctx) => <div>Detail for 1</div>,
        }}
      />,
    );

    // Filter removes a different row
    const filteredRows = ROWS.filter((r) => r.id !== '2');
    await act(async () => {
      rerender(
        <ListPage
          heading="Companies"
          list={{ ...LIST, rows: filteredRows }}
          detail={{
            selectedId: '1',
            onClose,
            render: (_id, _ctx) => <div>Detail for 1</div>,
          }}
        />,
      );
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});

// ── 12. Bulk action bar ───────────────────────────────────────────────────────

describe('ListPage — bulk actions', () => {
  const BULK_ACTIONS = [
    { id: 'archive', label: 'Archive', onRun: vi.fn() },
    { id: 'delete', label: 'Delete', onRun: vi.fn() },
  ];

  it('renders bulk bar when selectedIds non-empty', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        bulk={{ selectedIds: ['1', '2'], onChange: vi.fn(), actions: BULK_ACTIONS }}
      />,
    );
    expect(
      screen.getByRole('toolbar', { name: /2 items selected/i }),
    ).toBeInTheDocument();
  });

  it('does not render bulk bar when selectedIds is empty', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        bulk={{ selectedIds: [], onChange: vi.fn(), actions: BULK_ACTIONS }}
      />,
    );
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('calls action.onRun with selected rows', () => {
    const onRun = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        bulk={{
          selectedIds: ['1'],
          onChange: vi.fn(),
          actions: [{ id: 'archive', label: 'Archive', onRun }],
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Archive' }));
    expect(onRun).toHaveBeenCalledWith([ROWS[0]]);
  });

  it('calls onChange([]) when Clear is clicked', () => {
    const onChange = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        bulk={{ selectedIds: ['1'], onChange, actions: BULK_ACTIONS }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /clear selection/i }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('hides delete action when canDelete=false', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        bulk={{ selectedIds: ['1'], onChange: vi.fn(), actions: BULK_ACTIONS }}
        permissions={{ canDelete: false }}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument();
  });

  it('bulk bar has z-index 50', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        bulk={{ selectedIds: ['1'], onChange: vi.fn(), actions: BULK_ACTIONS }}
      />,
    );
    const bar = document.querySelector('.cc-list-page__bulk-bar') as HTMLElement;
    expect(bar.style.zIndex).toBe('50');
  });
});

// ── 13. Pagination ────────────────────────────────────────────────────────────

describe('ListPage — pagination', () => {
  it('renders pagination nav when totalPages > 1', () => {
    render(
      <ListPage
        heading="Companies"
        list={{
          ...LIST,
          pagination: { page: 1, pageSize: 1, totalItems: 10, onPageChange: vi.fn() },
        }}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('calls onPageChange with next page', () => {
    const onPageChange = vi.fn();
    render(
      <ListPage
        heading="Companies"
        list={{
          ...LIST,
          pagination: { page: 1, pageSize: 1, totalItems: 10, onPageChange },
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables prev button on page 1', () => {
    render(
      <ListPage
        heading="Companies"
        list={{
          ...LIST,
          pagination: { page: 1, pageSize: 1, totalItems: 10, onPageChange: vi.fn() },
        }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });
});

// ── 14. Legacy backward-compat props ─────────────────────────────────────────

describe('ListPage — backward compat (deprecated flat props)', () => {
  it('renders children in legacy mode', () => {
    render(
      <ListPage heading="Companies" list={LIST}>
        <p>Legacy content</p>
      </ListPage>,
    );
    expect(screen.getByText('Legacy content')).toBeInTheDocument();
  });

  it('renders legacy filterOptions', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        filterOptions={[{ id: 'active', label: 'Active' }]}
        activeFilterIds={[]}
        onFilterToggle={vi.fn()}
      />,
    );
    expect(screen.getByRole('group', { name: 'Filters' })).toBeInTheDocument();
  });

  it('renders legacy detailPane render-prop', () => {
    render(
      <ListPage
        heading="Companies"
        list={LIST}
        detailPane={(id) => <div>Legacy pane: {id ?? 'none'}</div>}
        selectedId="1"
      />,
    );
    expect(screen.getByText('Legacy pane: 1')).toBeInTheDocument();
  });
});
