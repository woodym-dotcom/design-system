/**
 * Drawer — side variants, ESC + backdrop close, ARIA dialog semantics.
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Drawer } from '../react/Drawer';

afterEach(() => {
  document.body.style.overflow = '';
});

describe('Drawer', () => {
  it('returns null when closed', () => {
    render(<Drawer open={false} onClose={() => {}} title="x">b</Drawer>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders ARIA dialog with title + body when open', () => {
    render(<Drawer open onClose={() => {}} title="Filters">body</Drawer>);
    const dlg = screen.getByRole('dialog');
    expect(dlg.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByText('Filters')).toBeTruthy();
    expect(screen.getByText('body')).toBeTruthy();
  });

  it('side prop sets the correct class', () => {
    render(<Drawer open onClose={() => {}} title="x" side="left">b</Drawer>);
    expect(screen.getByRole('dialog').className).toContain('cc-drawer--left');
  });

  it('subtitle renders when provided', () => {
    render(<Drawer open onClose={() => {}} title="x" subtitle="extra">b</Drawer>);
    expect(screen.getByText('extra')).toBeTruthy();
  });

  it('ESC closes', () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose} title="x">b</Drawer>);
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    expect(onClose).toHaveBeenCalled();
  });

  it('backdrop click closes', () => {
    const onClose = vi.fn();
    const { container } = render(<Drawer open onClose={onClose} title="x">b</Drawer>);
    const backdrop = container.ownerDocument.querySelector('.cc-drawer__backdrop')!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });
});
