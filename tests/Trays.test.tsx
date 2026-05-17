/**
 * TasksTray + NotificationsTray — list rendering, actions, empty state.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { TasksTray, NotificationsTray, type TrayTask, type TrayNotification } from '../react/Trays';

afterEach(() => { document.body.style.overflow = ''; });

describe('TasksTray', () => {
  it('renders title + tasks', () => {
    const t: TrayTask[] = [
      { id: '1', title: 'Approve vendor', at: '2026-05-17T10:00:00Z' },
    ];
    render(<TasksTray open onClose={() => {}} tasks={t} />);
    expect(screen.getByText('Tasks')).toBeTruthy();
    expect(screen.getByText('Approve vendor')).toBeTruthy();
  });

  it('empty state when no tasks', () => {
    render(<TasksTray open onClose={() => {}} tasks={[]} />);
    expect(screen.getByText('Nothing on your plate.')).toBeTruthy();
  });

  it('mark done fires handler', () => {
    const onMarkDone = vi.fn();
    render(
      <TasksTray
        open
        onClose={() => {}}
        tasks={[{ id: '1', title: 'X', at: Date.now() }]}
        onMarkDone={onMarkDone}
      />,
    );
    fireEvent.click(screen.getByLabelText('Mark "X" done'));
    expect(onMarkDone).toHaveBeenCalledWith('1');
  });

  it('shows severity class', () => {
    const t: TrayTask[] = [{ id: '1', title: 'Critical', at: Date.now(), severity: 'critical' }];
    // Drawer portals to document.body — query through document, not the local
    // render container.
    render(<TasksTray open onClose={() => {}} tasks={t} />);
    expect(document.querySelector('.cc-tray__item--critical')).toBeTruthy();
  });
});

describe('NotificationsTray', () => {
  it('orders unread above read', () => {
    const n: TrayNotification[] = [
      { id: 'r', title: 'Read one', at: '2026-05-16T00:00:00Z', read: true },
      { id: 'u', title: 'Unread one', at: '2026-05-15T00:00:00Z' },
    ];
    render(<NotificationsTray open onClose={() => {}} notifications={n} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0].textContent).toContain('Unread one');
    expect(items[1].textContent).toContain('Read one');
  });

  it('mark-all-read fires when unread > 0', () => {
    const onMarkAllRead = vi.fn();
    render(
      <NotificationsTray
        open
        onClose={() => {}}
        notifications={[{ id: '1', title: 'x', at: Date.now() }]}
        onMarkAllRead={onMarkAllRead}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Mark all read' }));
    expect(onMarkAllRead).toHaveBeenCalled();
  });

  it('empty state copy', () => {
    render(<NotificationsTray open onClose={() => {}} notifications={[]} />);
    expect(screen.getByText("You're all caught up.")).toBeTruthy();
  });
});
