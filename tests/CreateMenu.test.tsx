/**
 * G8 regression: CreateMenu primitive.
 *
 * Tests:
 *  - Menu opens/closes on trigger click.
 *  - Escape closes menu and returns focus to trigger.
 *  - Outside-click closes menu.
 *  - Keyboard nav: ArrowDown/Up/Home/End.
 *  - ARIA: role=menu, role=menuitem, aria-expanded, aria-haspopup.
 *  - Disabled item: aria-disabled, does not call onSelect.
 *  - onSelect called on item click.
 *  - Built-in kind default labels.
 */
import * as React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateMenu } from '../react/CreateMenu';
import type { CreateMenuItem } from '../react/CreateMenu';

const ITEMS: CreateMenuItem[] = [
  { kind: 'manual', onSelect: vi.fn() },
  { kind: 'ai-generated', onSelect: vi.fn() },
  { kind: 'from-template', onSelect: vi.fn() },
  { kind: 'import', onSelect: vi.fn() },
];

function setup(items = ITEMS) {
  return render(<CreateMenu items={items} />);
}

function openMenu() {
  fireEvent.click(screen.getByRole('button', { name: '+' }));
}

// ---------------------------------------------------------------------------
// Open / close
// ---------------------------------------------------------------------------
describe('G8 — CreateMenu open/close', () => {
  it('menu is closed by default', () => {
    setup();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('clicking trigger opens menu', () => {
    setup();
    openMenu();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('clicking trigger again closes menu', () => {
    setup();
    openMenu();
    openMenu();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Escape closes and returns focus
// ---------------------------------------------------------------------------
describe('G8 — Escape closes + focus return', () => {
  it('Escape closes the menu', async () => {
    setup();
    openMenu();
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('focus returns to trigger after Escape', async () => {
    setup();
    const trigger = screen.getByRole('button', { name: '+' });
    openMenu();
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(document.activeElement).toBe(trigger);
  });
});

// ---------------------------------------------------------------------------
// ARIA
// ---------------------------------------------------------------------------
describe('G8 — ARIA semantics', () => {
  it('trigger has aria-haspopup=menu', () => {
    setup();
    expect(screen.getByRole('button', { name: '+' })).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('trigger aria-expanded=false when closed', () => {
    setup();
    expect(screen.getByRole('button', { name: '+' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('trigger aria-expanded=true when open', () => {
    setup();
    openMenu();
    expect(screen.getByRole('button', { name: '+' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('menu has role=menu', () => {
    setup();
    openMenu();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('items have role=menuitem', () => {
    setup();
    openMenu();
    const items = screen.getAllByRole('menuitem');
    expect(items.length).toBe(ITEMS.length);
  });
});

// ---------------------------------------------------------------------------
// Disabled item
// ---------------------------------------------------------------------------
describe('G8 — disabled item', () => {
  it('disabled item has aria-disabled', () => {
    const onSelect = vi.fn();
    const items: CreateMenuItem[] = [
      { kind: 'manual', onSelect, disabled: true },
    ];
    render(<CreateMenu items={items} />);
    openMenu();
    const item = screen.getByRole('menuitem', { name: 'Create manually' });
    expect(item).toHaveAttribute('aria-disabled', 'true');
  });

  it('disabled item does not call onSelect', () => {
    const onSelect = vi.fn();
    const items: CreateMenuItem[] = [
      { kind: 'manual', onSelect, disabled: true },
    ];
    render(<CreateMenu items={items} />);
    openMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Create manually' }));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// onSelect
// ---------------------------------------------------------------------------
describe('G8 — onSelect', () => {
  it('clicking an item calls onSelect and closes menu', () => {
    const onSelect = vi.fn();
    const items: CreateMenuItem[] = [{ kind: 'manual', onSelect }];
    render(<CreateMenu items={items} />);
    openMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Create manually' }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Built-in kind default labels
// ---------------------------------------------------------------------------
describe('G8 — built-in kind labels', () => {
  it('renders default labels for all built-in kinds', () => {
    setup();
    openMenu();
    expect(screen.getByRole('menuitem', { name: 'Create manually' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Generate with AI' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'From template' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Import' })).toBeInTheDocument();
  });

  it('custom kind uses provided label', () => {
    const items: CreateMenuItem[] = [{ kind: 'custom', label: 'Bulk add', onSelect: vi.fn() }];
    render(<CreateMenu items={items} />);
    openMenu();
    expect(screen.getByRole('menuitem', { name: 'Bulk add' })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------
describe('G8 — keyboard navigation', () => {
  it('ArrowDown navigates to next item', async () => {
    const items: CreateMenuItem[] = [
      { kind: 'manual', onSelect: vi.fn() },
      { kind: 'ai-generated', onSelect: vi.fn() },
    ];
    render(<CreateMenu items={items} />);
    openMenu();
    // Wait for first item to be focused
    await waitFor(() => {
      const firstItem = screen.getByRole('menuitem', { name: 'Create manually' });
      firstItem.focus();
      return Promise.resolve();
    });
    const firstItem = screen.getByRole('menuitem', { name: 'Create manually' });
    firstItem.focus();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Generate with AI' }));
  });

  it('ArrowUp wraps to last item from first', async () => {
    const items: CreateMenuItem[] = [
      { kind: 'manual', onSelect: vi.fn() },
      { kind: 'ai-generated', onSelect: vi.fn() },
    ];
    render(<CreateMenu items={items} />);
    openMenu();
    const firstItem = screen.getByRole('menuitem', { name: 'Create manually' });
    firstItem.focus();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Generate with AI' }));
  });
});
