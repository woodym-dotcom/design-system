/**
 * SavedViewsMenu — open/close, render views, action handlers,
 *                  pinned-first ordering, empty state, ESC/click-outside.
 */
import * as React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SavedViewsMenu } from '../react/SavedViewsMenu';
import type { SavedView } from '../react/hooks/useSavedViews';

const views: SavedView<string>[] = [
  { id: 'open', name: 'All open', state: '?status=open', updatedAt: '2026-05-17' },
  { id: 'mine', name: 'Mine', state: '?owner=me', pinned: true, updatedAt: '2026-05-16' },
];

describe('SavedViewsMenu', () => {
  it('starts closed; trigger toggles the popup', () => {
    render(<SavedViewsMenu views={views} onSelect={() => {}} />);
    expect(screen.queryByRole('group', { name: 'Saved views' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Views/ }));
    expect(screen.getByRole('group', { name: 'Saved views' })).toBeTruthy();
  });

  it('trigger label defaults to the active view name', () => {
    render(<SavedViewsMenu views={views} onSelect={() => {}} activeId="mine" />);
    expect(screen.getByRole('button', { name: /Mine/ })).toBeTruthy();
  });

  it('clicking a view fires onSelect and closes the menu', () => {
    const onSelect = vi.fn();
    render(<SavedViewsMenu views={views} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /Views/ }));
    fireEvent.click(screen.getByRole('button', { name: /All open/ }));
    expect(onSelect).toHaveBeenCalledWith(views[0]);
    expect(screen.queryByRole('group', { name: 'Saved views' })).toBeNull();
  });

  it('active view is marked aria-current', () => {
    render(<SavedViewsMenu views={views} onSelect={() => {}} activeId="mine" />);
    fireEvent.click(screen.getByRole('button', { name: /Mine/ }));
    // The trigger label is also "Mine"; scope to the popup to get the row button.
    const popup = screen.getByRole('group', { name: 'Saved views' });
    expect(
      within(popup).getByRole('button', { name: /Mine/ }).getAttribute('aria-current'),
    ).toBe('true');
  });

  it('renders pin/rename/remove actions when handlers are supplied', () => {
    const onTogglePin = vi.fn();
    const onRemove = vi.fn();
    render(
      <SavedViewsMenu
        views={views}
        onSelect={() => {}}
        onTogglePin={onTogglePin}
        onRemove={onRemove}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Views/ }));
    fireEvent.click(screen.getByLabelText(/Unpin Mine/));
    expect(onTogglePin).toHaveBeenCalledWith('mine');
    fireEvent.click(screen.getByLabelText(/Remove All open/));
    expect(onRemove).toHaveBeenCalledWith('open');
  });

  it('save-current row fires its callback', () => {
    const onSaveCurrent = vi.fn();
    render(<SavedViewsMenu views={views} onSelect={() => {}} onSaveCurrent={onSaveCurrent} />);
    fireEvent.click(screen.getByRole('button', { name: /Views/ }));
    fireEvent.click(screen.getByText(/Save current as/));
    expect(onSaveCurrent).toHaveBeenCalled();
  });

  it('empty state when no views', () => {
    render(<SavedViewsMenu views={[]} onSelect={() => {}} emptyMessage="None yet." />);
    fireEvent.click(screen.getByRole('button', { name: /Views/ }));
    expect(screen.getByText('None yet.')).toBeTruthy();
  });

  it('Escape closes the menu', () => {
    render(<SavedViewsMenu views={views} onSelect={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Views/ }));
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    expect(screen.queryByRole('group', { name: 'Saved views' })).toBeNull();
  });

  it('click outside closes the menu', () => {
    render(
      <div>
        <button>outside</button>
        <SavedViewsMenu views={views} onSelect={() => {}} />
      </div>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Views/ }));
    expect(screen.getByRole('group', { name: 'Saved views' })).toBeTruthy();
    act(() => { fireEvent.mouseDown(screen.getByText('outside')); });
    expect(screen.queryByRole('group', { name: 'Saved views' })).toBeNull();
  });
});
