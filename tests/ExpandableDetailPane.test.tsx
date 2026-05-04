/**
 * ExpandableDetailPane — unit + interaction tests, plus a11y audit via axe-core.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axe from 'axe-core';
import { ExpandableDetailPane, type ExpandableDetailPaneTab } from '../react/ExpandableDetailPane';

const TABS: ExpandableDetailPaneTab[] = [
  { id: 'details', label: 'Details', render: () => <p>Details content</p> },
  { id: 'history', label: 'History', render: () => <p>History content</p> },
  { id: 'notes', label: 'Notes', render: () => <p>Notes content</p> },
];

const SINGLE_TAB: ExpandableDetailPaneTab[] = [
  { id: 'info', label: 'Info', render: () => <p>Info content</p> },
];

function renderPane(props: Partial<React.ComponentProps<typeof ExpandableDetailPane>> = {}) {
  const defaults = {
    open: true,
    onClose: vi.fn(),
    title: 'Vendor: Acme Corp',
    tabs: TABS,
  };
  return render(<ExpandableDetailPane {...defaults} {...props} />);
}

// ── Rendering ─────────────────────────────────────────────────────────────────

describe('ExpandableDetailPane rendering', () => {
  it('renders title', () => {
    renderPane();
    expect(screen.getByRole('heading', { name: 'Vendor: Acme Corp' })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    renderPane({ subtitle: 'Risk level: High' });
    expect(screen.getByText('Risk level: High')).toBeInTheDocument();
  });

  it('renders as dialog with aria-modal', () => {
    renderPane();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('is hidden when open=false', () => {
    renderPane({ open: false });
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders close button', () => {
    renderPane();
    expect(screen.getByRole('button', { name: 'Close panel' })).toBeInTheDocument();
  });

  it('renders full-screen toggle button by default', () => {
    renderPane();
    expect(screen.getByRole('button', { name: /full screen/i })).toBeInTheDocument();
  });

  it('hides full-screen button when allowFullScreen=false', () => {
    renderPane({ allowFullScreen: false });
    expect(screen.queryByRole('button', { name: /full screen/i })).not.toBeInTheDocument();
  });

  it('renders headerActions slot', () => {
    renderPane({ headerActions: <button type="button">Edit</button> });
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });
});

// ── Tab behaviour ─────────────────────────────────────────────────────────────

describe('ExpandableDetailPane tabs', () => {
  it('renders tab bar when multiple tabs', () => {
    renderPane();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Details' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'History' })).toBeInTheDocument();
  });

  it('does not render tab bar for a single tab', () => {
    renderPane({ tabs: SINGLE_TAB });
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('shows the first tab panel by default', () => {
    renderPane();
    expect(screen.getByText('Details content')).toBeInTheDocument();
    expect(screen.queryByText('History content')).not.toBeInTheDocument();
  });

  it('uses defaultTabId to set initial active tab', () => {
    renderPane({ defaultTabId: 'history' });
    expect(screen.getByText('History content')).toBeInTheDocument();
  });

  it('switches tab panel on tab click', () => {
    renderPane();
    fireEvent.click(screen.getByRole('tab', { name: 'History' }));
    expect(screen.getByText('History content')).toBeInTheDocument();
  });

  it('marks active tab with aria-selected=true', () => {
    renderPane();
    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    expect(detailsTab).toHaveAttribute('aria-selected', 'true');
  });

  it('marks inactive tabs with aria-selected=false', () => {
    renderPane();
    const historyTab = screen.getByRole('tab', { name: 'History' });
    expect(historyTab).toHaveAttribute('aria-selected', 'false');
  });

  it('each tab has aria-controls pointing to its panel', () => {
    renderPane();
    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const controls = detailsTab.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    expect(document.getElementById(controls!)).toBeInTheDocument();
  });
});

// ── Full-screen toggle ────────────────────────────────────────────────────────

describe('ExpandableDetailPane full-screen', () => {
  it('adds is-fullscreen class when toggled', () => {
    renderPane();
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).not.toContain('is-fullscreen');
    fireEvent.click(screen.getByRole('button', { name: 'Expand to full screen' }));
    expect(dialog.className).toContain('is-fullscreen');
  });

  it('updates aria-label when in full-screen', () => {
    renderPane();
    fireEvent.click(screen.getByRole('button', { name: 'Expand to full screen' }));
    expect(screen.getByRole('button', { name: 'Exit full screen' })).toBeInTheDocument();
  });

  it('pressing Escape in full-screen exits full-screen before closing', () => {
    const onClose = vi.fn();
    renderPane({ onClose });
    fireEvent.click(screen.getByRole('button', { name: 'Expand to full screen' }));
    // First Escape exits full-screen
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog').className).not.toContain('is-fullscreen');
    // Second Escape closes pane
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('full-screen state is reset when pane closes', () => {
    const { rerender } = renderPane();
    fireEvent.click(screen.getByRole('button', { name: 'Expand to full screen' }));
    expect(screen.getByRole('dialog').className).toContain('is-fullscreen');
    rerender(
      <ExpandableDetailPane
        open={false}
        onClose={vi.fn()}
        title="Vendor: Acme Corp"
        tabs={TABS}
      />,
    );
    rerender(
      <ExpandableDetailPane
        open={true}
        onClose={vi.fn()}
        title="Vendor: Acme Corp"
        tabs={TABS}
      />,
    );
    expect(screen.getByRole('dialog').className).not.toContain('is-fullscreen');
  });
});

// ── Close behaviour ───────────────────────────────────────────────────────────

describe('ExpandableDetailPane close', () => {
  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    renderPane({ onClose });
    fireEvent.click(screen.getByRole('button', { name: 'Close panel' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop clicked', () => {
    const onClose = vi.fn();
    renderPane({ onClose });
    const backdrop = document.querySelector('.cc-expandable-pane__backdrop')!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on Escape when not full-screen', () => {
    const onClose = vi.fn();
    renderPane({ onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});

// ── a11y ──────────────────────────────────────────────────────────────────────

describe('ExpandableDetailPane a11y (axe)', () => {
  it('has no axe violations when open with tabs', async () => {
    const { container } = renderPane();
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('has no axe violations with single tab (no tablist)', async () => {
    const { container } = renderPane({ tabs: SINGLE_TAB });
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });
});
