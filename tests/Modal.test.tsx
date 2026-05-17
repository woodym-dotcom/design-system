/**
 * Modal — ARIA dialog semantics, ESC closes, backdrop click closes,
 *         focus trap, body scroll lock, customised size.
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Modal } from '../react/Modal';

afterEach(() => {
  document.body.style.overflow = '';
});

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(<Modal open={false} onClose={() => {}} title="Hello">body</Modal>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders ARIA dialog with title + body when open', () => {
    render(<Modal open onClose={() => {}} title="Settings">Body</Modal>);
    const dlg = screen.getByRole('dialog');
    expect(dlg.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="x">y</Modal>);
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<Modal open onClose={onClose} title="x">y</Modal>);
    const backdrop = container.ownerDocument.querySelector('.cc-modal__backdrop')!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('closeOnBackdropClick=false suppresses backdrop close', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open onClose={onClose} title="x" closeOnBackdropClick={false}>y</Modal>,
    );
    const backdrop = container.ownerDocument.querySelector('.cc-modal__backdrop')!;
    fireEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll while open', () => {
    const { rerender } = render(<Modal open onClose={() => {}} title="x">y</Modal>);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<Modal open={false} onClose={() => {}} title="x">y</Modal>);
    expect(document.body.style.overflow).toBe('');
  });

  it('size class applied', () => {
    render(<Modal open onClose={() => {}} title="x" size="lg">y</Modal>);
    expect(screen.getByRole('dialog').className).toContain('cc-modal--lg');
  });

  it('description is wired via aria-describedby', () => {
    render(<Modal open onClose={() => {}} title="x" description="Read me">y</Modal>);
    const dlg = screen.getByRole('dialog');
    const id = dlg.getAttribute('aria-describedby');
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)?.textContent).toBe('Read me');
  });
});
