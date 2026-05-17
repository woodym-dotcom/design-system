/**
 * ModuleShell + sub-primitive tests (G7)
 *
 * Coverage:
 *  1. ModuleShell renders title and tabs
 *  2. ModuleShell icon prop renders aria-hidden wrapper
 *  3. ModuleShell tab switching shows correct panel
 *  4. ModuleShell router adapter is called on tab switch
 *  5. ModuleShell subscribes to router adapter changes
 *  6. ListPage renders heading and children
 *  7. ListPage shows emptyState when no children
 *  8. ListPage composes CreateMenu (trigger present)
 *  9. ListPage composes FilterBar when filterOptions provided
 * 10. ListPage renders pagination and detailPane
 * 11. ConfigurationsPage renders section nav and content
 * 12. ConfigurationsPage switches sections on click
 * 13. ReviewQueue renders approve/reject/escalate buttons per item
 * 14. ReviewQueue shows loading state
 * 15. ReviewQueue shows empty state
 * 16. ReviewQueue custom actions and disabled state
 * 17. MonitoringPage renders KPI tiles
 * 18. MonitoringPage renders chart sections
 * 19. MonitoringPage shows empty state
 * 20. KpiTile renders label, value, delta
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModuleShell } from '../react/ModuleShell';
import {
  ModuleShellProvider,
  type ModuleShellRouterAdapter,
} from '../react/ModuleShellProvider';
import { ListPage } from '../react/ListPage';
import { ConfigurationsPage } from '../react/ConfigurationsPage';
import { ReviewQueue } from '../react/ReviewQueue';
import { MonitoringPage, KpiTile } from '../react/MonitoringPage';

// ── ModuleShell ───────────────────────────────────────────────────────────────

describe('ModuleShell', () => {
  it('renders title', () => {
    render(
      <ModuleShell
        title="Companies"
        list={{ label: 'List', render: () => <div>list content</div> }}
      />
    );
    expect(screen.getByText('Companies')).toBeInTheDocument();
  });

  it('renders icon with aria-hidden', () => {
    render(
      <ModuleShell
        title="Companies"
        icon={<svg data-testid="icon" />}
        list={{ label: 'List', render: () => <div>list</div> }}
      />
    );
    const wrapper = screen.getByTestId('icon').parentElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows first tab panel by default', () => {
    render(
      <ModuleShell
        title="Companies"
        list={{ label: 'List', render: () => <div>list content</div> }}
        review={{ label: 'Review', render: () => <div>review content</div> }}
      />
    );
    expect(screen.getByText('list content')).toBeInTheDocument();
    expect(screen.queryByText('review content')).not.toBeInTheDocument();
  });

  it('switches tab on click', () => {
    render(
      <ModuleShell
        title="Companies"
        list={{ label: 'List', render: () => <div>list content</div> }}
        review={{ label: 'Review', render: () => <div>review content</div> }}
      />
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Review' }));
    expect(screen.getByText('review content')).toBeInTheDocument();
    expect(screen.queryByText('list content')).not.toBeInTheDocument();
  });

  it('calls router adapter setParam on tab switch', () => {
    const adapter: ModuleShellRouterAdapter = {
      getParam: vi.fn(() => null),
      setParam: vi.fn(),
      subscribe: vi.fn(() => () => {}),
    };
    render(
      <ModuleShellProvider adapter={adapter}>
        <ModuleShell
          title="Companies"
          list={{ label: 'List', render: () => <div>list</div> }}
          review={{ label: 'Review', render: () => <div>review</div> }}
        />
      </ModuleShellProvider>
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Review' }));
    expect(adapter.setParam).toHaveBeenCalledWith('tab', 'review');
  });

  it('subscribes to router adapter on mount', () => {
    const unsubscribe = vi.fn();
    const subscribe = vi.fn(() => unsubscribe);
    const adapter: ModuleShellRouterAdapter = {
      getParam: vi.fn(() => null),
      setParam: vi.fn(),
      subscribe,
    };
    const { unmount } = render(
      <ModuleShellProvider adapter={adapter}>
        <ModuleShell
          title="Companies"
          list={{ label: 'List', render: () => <div>list</div> }}
        />
      </ModuleShellProvider>
    );
    expect(subscribe).toHaveBeenCalled();
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });

  // ── tabs[] caller-controlled API ───────────────────────────────────────────

  it('tabs[]: renders tabs in caller-supplied order', () => {
    render(
      <ModuleShell
        title="Companies"
        tabs={[
          { id: 'list', label: 'List', render: () => <div>list content</div> },
          { id: 'review-queue', label: 'Review queue', render: () => <div>review content</div> },
          { id: 'configurations', label: 'Configurations', render: () => <div>config content</div> },
        ]}
      />
    );
    const tabButtons = screen.getAllByRole('tab');
    expect(tabButtons[0]).toHaveTextContent('List');
    expect(tabButtons[1]).toHaveTextContent('Review queue');
    expect(tabButtons[2]).toHaveTextContent('Configurations');
  });

  it('tabs[]: shows first tab content by default', () => {
    render(
      <ModuleShell
        title="Companies"
        tabs={[
          { id: 'list', label: 'List', render: () => <div>list content</div> },
          { id: 'review-queue', label: 'Review queue', render: () => <div>review content</div> },
        ]}
      />
    );
    expect(screen.getByText('list content')).toBeInTheDocument();
    expect(screen.queryByText('review content')).not.toBeInTheDocument();
  });

  it('tabs[]: defaultTab controls which tab is active initially', () => {
    render(
      <ModuleShell
        title="Companies"
        defaultTab="review-queue"
        tabs={[
          { id: 'list', label: 'List', render: () => <div>list content</div> },
          { id: 'review-queue', label: 'Review queue', render: () => <div>review content</div> },
        ]}
      />
    );
    expect(screen.getByText('review content')).toBeInTheDocument();
    expect(screen.queryByText('list content')).not.toBeInTheDocument();
  });

  it('tabs[]: hidden tabs are omitted from the strip and never rendered', () => {
    render(
      <ModuleShell
        title="Companies"
        tabs={[
          { id: 'list', label: 'List', render: () => <div>list content</div> },
          { id: 'review-queue', label: 'Review queue', hidden: true, render: () => <div>review content</div> },
          { id: 'configurations', label: 'Configurations', render: () => <div>config content</div> },
        ]}
      />
    );
    expect(screen.queryByRole('tab', { name: 'Review queue' })).not.toBeInTheDocument();
    expect(screen.queryByText('review content')).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'List' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Configurations' })).toBeInTheDocument();
  });

  it('tabs[]: switches tab on click', () => {
    render(
      <ModuleShell
        title="Companies"
        tabs={[
          { id: 'list', label: 'List', render: () => <div>list content</div> },
          { id: 'review-queue', label: 'Review queue', render: () => <div>review content</div> },
        ]}
      />
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Review queue' }));
    expect(screen.getByText('review content')).toBeInTheDocument();
    expect(screen.queryByText('list content')).not.toBeInTheDocument();
  });

  it('tabs[]: calls router adapter setParam on tab switch', () => {
    const adapter: ModuleShellRouterAdapter = {
      getParam: vi.fn(() => null),
      setParam: vi.fn(),
      subscribe: vi.fn(() => () => {}),
    };
    render(
      <ModuleShellProvider adapter={adapter}>
        <ModuleShell
          title="Companies"
          tabs={[
            { id: 'list', label: 'List', render: () => <div>list</div> },
            { id: 'review-queue', label: 'Review queue', render: () => <div>review</div> },
          ]}
        />
      </ModuleShellProvider>
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Review queue' }));
    expect(adapter.setParam).toHaveBeenCalledWith('tab', 'review-queue');
  });

  it('tabs[]: named props are ignored when tabs[] is provided', () => {
    // Provide tabs[] with review-queue first, then list. With enforceTabOrder
    // disabled the caller's order is preserved verbatim.
    render(
      <ModuleShell
        title="Companies"
        enforceTabOrder={false}
        tabs={[
          { id: 'review-queue', label: 'Review queue', render: () => <div>review content</div> },
          { id: 'list', label: 'List', render: () => <div>list content</div> },
        ]}
        // These named props should be ignored because tabs[] is present.
        list={{ label: 'List (named)', render: () => <div>named list</div> }}
        review={{ label: 'Review (named)', render: () => <div>named review</div> }}
      />
    );
    const tabButtons = screen.getAllByRole('tab');
    expect(tabButtons[0]).toHaveTextContent('Review queue');
    expect(tabButtons[1]).toHaveTextContent('List');
    // Named-prop content must not appear
    expect(screen.queryByText('named list')).not.toBeInTheDocument();
    expect(screen.queryByText('named review')).not.toBeInTheDocument();
  });

  // Tab-order convention enforcement (canonical: monitoring → list → review-queue → configurations).
  it('tabs[]: enforces canonical order (configurations always last)', () => {
    render(
      <ModuleShell
        title="Companies"
        tabs={[
          { id: 'configurations', label: 'Configurations', render: () => <div>config</div> },
          { id: 'list', label: 'List', render: () => <div>list</div> },
          { id: 'review-queue', label: 'Review queue', render: () => <div>review</div> },
          { id: 'monitoring', label: 'Monitoring', render: () => <div>monitoring</div> },
        ]}
      />
    );
    const tabButtons = screen.getAllByRole('tab');
    expect(tabButtons.map((b) => b.textContent)).toEqual([
      'Monitoring',
      'List',
      'Review queue',
      'Configurations',
    ]);
  });
});

// ── ListPage ──────────────────────────────────────────────────────────────────

describe('ListPage', () => {
  it('renders heading and children', () => {
    render(
      <ListPage heading="All Companies">
        <table><tbody><tr><td>Acme</td></tr></tbody></table>
      </ListPage>
    );
    expect(screen.getByRole('heading', { name: 'All Companies' })).toBeInTheDocument();
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('shows emptyState when no children', () => {
    render(<ListPage heading="All Companies" emptyState={<p>No companies yet.</p>} />);
    expect(screen.getByText('No companies yet.')).toBeInTheDocument();
  });

  it('shows subtitle', () => {
    render(<ListPage heading="All Companies" subtitle="Manage your companies" />);
    expect(screen.getByText('Manage your companies')).toBeInTheDocument();
  });

  it('composes CreateMenu when createMenu prop provided', () => {
    render(
      <ListPage
        heading="All Companies"
        createMenu={{
          items: [{ kind: 'manual', label: 'New company' }],
          triggerLabel: 'New',
        }}
      />
    );
    // CreateMenu trigger button with explicit label
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
  });

  it('composes FilterBar when filterOptions provided', () => {
    render(
      <ListPage
        heading="All Companies"
        filterOptions={[{ id: 'active', label: 'Active' }]}
        activeFilterIds={[]}
        onFilterToggle={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Active' })).toBeInTheDocument();
  });

  it('renders pagination slot', () => {
    render(
      <ListPage heading="H" pagination={<nav aria-label="pagination">pages</nav>}>
        <div>content</div>
      </ListPage>
    );
    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();
  });

  it('renders detailPane with selected id', () => {
    render(
      <ListPage
        heading="H"
        selectedId="abc"
        detailPane={(id) => <aside>{`Detail: ${id}`}</aside>}
      />
    );
    expect(screen.getByText('Detail: abc')).toBeInTheDocument();
  });
});

// ── ConfigurationsPage ────────────────────────────────────────────────────────

describe('ConfigurationsPage', () => {
  const sections = [
    { id: 'general', label: 'General', render: () => <div>General content</div> },
    { id: 'billing', label: 'Billing', render: () => <div>Billing content</div> },
  ];

  beforeEach(() => {
    // Reset URL search params between tests to avoid state pollution
    window.history.replaceState(null, '', '/');
  });

  it('renders first section by default', () => {
    render(<ConfigurationsPage sections={sections} />);
    expect(screen.getByText('General content')).toBeInTheDocument();
    expect(screen.queryByText('Billing content')).not.toBeInTheDocument();
  });

  it('switches section on nav click', () => {
    render(<ConfigurationsPage sections={sections} />);
    fireEvent.click(screen.getByRole('button', { name: 'Billing' }));
    expect(screen.getByText('Billing content')).toBeInTheDocument();
    expect(screen.queryByText('General content')).not.toBeInTheDocument();
  });

  it('marks active nav item with aria-current', () => {
    render(<ConfigurationsPage sections={sections} />);
    const generalBtn = screen.getByRole('button', { name: 'General' });
    // Canonical ARIA value for the current item in a set of pages is "page".
    expect(generalBtn).toHaveAttribute('aria-current', 'page');
  });
});

// ── ReviewQueue ───────────────────────────────────────────────────────────────

describe('ReviewQueue', () => {
  const items = [
    { id: '1', title: 'Acme Corp', meta: 'Submitted 30 Apr 2026' },
    { id: '2', title: 'Beta Ltd' },
  ];

  it('renders approve, reject per item', () => {
    render(
      <ReviewQueue
        items={items}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    );
    expect(screen.getAllByRole('button', { name: 'Approve' })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Reject' })).toHaveLength(2);
  });

  it('renders escalate when onEscalate provided', () => {
    render(
      <ReviewQueue
        items={items}
        onApprove={vi.fn()}
        onReject={vi.fn()}
        onEscalate={vi.fn()}
      />
    );
    expect(screen.getAllByRole('button', { name: 'Escalate' })).toHaveLength(2);
  });

  it('calls onApprove with correct item', () => {
    const onApprove = vi.fn();
    render(<ReviewQueue items={items} onApprove={onApprove} onReject={vi.fn()} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Approve' })[0]);
    expect(onApprove).toHaveBeenCalledWith(items[0]);
  });

  it('shows loading state', () => {
    render(<ReviewQueue items={[]} onApprove={vi.fn()} onReject={vi.fn()} isLoading />);
    expect(screen.getByLabelText('Loading review queue')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(
      <ReviewQueue
        items={[]}
        onApprove={vi.fn()}
        onReject={vi.fn()}
        emptyState={<p>Queue is empty</p>}
      />
    );
    expect(screen.getByText('Queue is empty')).toBeInTheDocument();
  });

  it('renders custom actions and disables when isDisabled returns true', () => {
    const customActions = [
      {
        label: 'Flag',
        onAction: vi.fn(),
        isDisabled: (item: typeof items[0]) => item.id === '1',
      },
    ];
    render(
      <ReviewQueue
        items={items}
        onApprove={vi.fn()}
        onReject={vi.fn()}
        customActions={customActions}
      />
    );
    const flagBtns = screen.getAllByRole('button', { name: 'Flag' });
    expect(flagBtns[0]).toBeDisabled();
    expect(flagBtns[1]).not.toBeDisabled();
  });
});

// ── MonitoringPage + KpiTile ──────────────────────────────────────────────────

describe('MonitoringPage', () => {
  it('renders KPI tiles', () => {
    render(
      <MonitoringPage
        kpis={[
          { label: 'Companies', value: '1,234' },
          { label: 'Active', value: '987', delta: '+12%' },
        ]}
      />
    );
    expect(screen.getByText('Companies')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('renders chart sections', () => {
    render(
      <MonitoringPage
        chartSections={[
          { heading: 'Revenue', render: () => <div>chart here</div> },
        ]}
      />
    );
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('chart here')).toBeInTheDocument();
  });

  it('shows empty state when no kpis or charts', () => {
    render(<MonitoringPage emptyState={<p>No data</p>} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});

describe('KpiTile', () => {
  it('renders label, value, and delta', () => {
    render(<KpiTile label="Revenue" value="$42k" delta="+5%" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$42k')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });

  it('omits delta when not provided', () => {
    render(<KpiTile label="Revenue" value="$42k" />);
    expect(screen.queryByText('+5%')).not.toBeInTheDocument();
  });
});
