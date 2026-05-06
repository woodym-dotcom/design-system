/**
 * DetailPane — tests for RW lift props:
 *   - subtitle
 *   - resizeKey (localStorage persistence across remount)
 *   - fullscreen (controlled + uncontrolled) + Escape exit
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DetailPane } from '../react/DetailPane';

const SECTIONS = [{ heading: 'Info', content: <p>Content</p> }];

const baseProps = {
  open: true,
  onClose: () => {},
  title: 'Test Pane',
  sections: SECTIONS,
};

// ---------------------------------------------------------------------------
// subtitle prop
// ---------------------------------------------------------------------------

describe('subtitle prop', () => {
  it('renders subtitle below title when provided', () => {
    render(<DetailPane {...baseProps} subtitle="Senior Engineer" />);
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
  });

  it('does not render subtitle element when omitted', () => {
    render(<DetailPane {...baseProps} />);
    expect(screen.queryByText('Senior Engineer')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// resizeKey / localStorage persistence
// ---------------------------------------------------------------------------

describe('resizeKey localStorage persistence', () => {
  const storageKey = 'ds-detailpane-width-candidate-detail';

  beforeEach(() => {
    localStorage.clear();
  });

  it('reads persisted width from localStorage on mount', () => {
    localStorage.setItem(storageKey, '600');
    const { container } = render(
      <DetailPane {...baseProps} resizeKey="candidate-detail" />,
    );
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    // The inline style width should reflect stored value.
    expect((dialog as HTMLElement).style.width).toBe('600px');
  });

  it('renders resize handle when resizeKey is provided', () => {
    render(<DetailPane {...baseProps} resizeKey="candidate-detail" />);
    expect(
      screen.getByRole('separator', { name: 'Resize panel' }),
    ).toBeInTheDocument();
  });

  it('does not render resize handle without resizeKey', () => {
    render(<DetailPane {...baseProps} />);
    expect(
      screen.queryByRole('separator', { name: 'Resize panel' }),
    ).not.toBeInTheDocument();
  });

  it('persists width across remount using same resizeKey', () => {
    // First mount — set a stored value.
    localStorage.setItem(storageKey, '700');

    const { unmount, container } = render(
      <DetailPane {...baseProps} resizeKey="candidate-detail" />,
    );
    const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.style.width).toBe('700px');

    unmount();

    // Second mount — should still read the stored value.
    const { container: c2 } = render(
      <DetailPane {...baseProps} resizeKey="candidate-detail" />,
    );
    const dialog2 = c2.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog2.style.width).toBe('700px');
  });

  it('falls back to default width when stored value is invalid', () => {
    localStorage.setItem(storageKey, 'not-a-number');
    const { container } = render(
      <DetailPane {...baseProps} resizeKey="candidate-detail" />,
    );
    const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
    // Default width is 480; the style should be set.
    expect(dialog.style.width).toBe('480px');
  });
});

// ---------------------------------------------------------------------------
// fullscreen — uncontrolled
// ---------------------------------------------------------------------------

describe('fullscreen (uncontrolled)', () => {
  it('starts non-fullscreen; toggle button is present', () => {
    render(<DetailPane {...baseProps} />);
    const btn = screen.getByRole('button', { name: 'Full screen panel' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('clicking toggle enters fullscreen', () => {
    render(<DetailPane {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Full screen panel' }));
    const btn = screen.getByRole('button', { name: 'Exit full screen' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('Escape exits fullscreen without closing the pane (uncontrolled)', () => {
    const onClose = vi.fn();
    render(<DetailPane open={true} onClose={onClose} title="T" sections={SECTIONS} />);
    // Enter fullscreen.
    fireEvent.click(screen.getByRole('button', { name: 'Full screen panel' }));
    // Escape should exit fullscreen, NOT close pane.
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
    // Button should revert to "Full screen panel".
    expect(
      screen.getByRole('button', { name: 'Full screen panel' }),
    ).toBeInTheDocument();
  });

  it('Escape closes pane when not fullscreen', () => {
    const onClose = vi.fn();
    render(<DetailPane open={true} onClose={onClose} title="T" sections={SECTIONS} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// fullscreen — controlled
// ---------------------------------------------------------------------------

describe('fullscreen (controlled)', () => {
  it('respects controlled fullscreen=true', () => {
    render(<DetailPane {...baseProps} fullscreen={true} onFullscreenChange={() => {}} />);
    const btn = screen.getByRole('button', { name: 'Exit full screen' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onFullscreenChange when toggle is clicked', () => {
    const onFullscreenChange = vi.fn();
    render(
      <DetailPane
        {...baseProps}
        fullscreen={false}
        onFullscreenChange={onFullscreenChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Full screen panel' }));
    expect(onFullscreenChange).toHaveBeenCalledWith(true);
  });

  it('Escape in fullscreen calls onFullscreenChange(false) not onClose', () => {
    const onClose = vi.fn();
    const onFullscreenChange = vi.fn();
    render(
      <DetailPane
        open={true}
        onClose={onClose}
        title="T"
        sections={SECTIONS}
        fullscreen={true}
        onFullscreenChange={onFullscreenChange}
      />,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onFullscreenChange).toHaveBeenCalledWith(false);
    expect(onClose).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// fullscreen hides resize handle
// ---------------------------------------------------------------------------

describe('fullscreen suppresses resize handle', () => {
  it('resize handle hidden when fullscreen', () => {
    render(
      <DetailPane
        {...baseProps}
        resizeKey="candidate-detail"
        fullscreen={true}
        onFullscreenChange={() => {}}
      />,
    );
    expect(
      screen.queryByRole('separator', { name: 'Resize panel' }),
    ).not.toBeInTheDocument();
  });
});
