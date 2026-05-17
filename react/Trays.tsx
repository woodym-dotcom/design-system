import * as React from 'react';
import { Drawer } from './Drawer';

export interface TrayTask {
  id: string;
  /** Short label. */
  title: string;
  /** Optional secondary copy. */
  description?: string;
  /** When the task surfaced. */
  at: string | Date | number;
  /** Optional CTA to act on the task. */
  action?: { label: string; onClick: () => void; href?: string };
  /** Optional severity for visual emphasis. */
  severity?: 'info' | 'warning' | 'critical';
  /** True when the user has already acted on or seen the task. */
  done?: boolean;
}

export interface TrayNotification {
  id: string;
  title: string;
  body?: string;
  /** When the notification arrived. */
  at: string | Date | number;
  /** Optional source module — rendered as a chip. */
  source?: string;
  /** Optional CTA. */
  action?: { label: string; href?: string; onClick?: () => void };
  /** True when read. */
  read?: boolean;
  /** Optional category for grouping. */
  category?: string;
}

interface TrayBaseProps {
  open: boolean;
  onClose: () => void;
  /** Title displayed at the top of the drawer. */
  title?: string;
}

export interface TasksTrayProps extends TrayBaseProps {
  tasks: TrayTask[];
  /** Called when the user marks a task done (optional). */
  onMarkDone?: (id: string) => void;
  /** Called when the user clears completed tasks. */
  onClearCompleted?: () => void;
}

export interface NotificationsTrayProps extends TrayBaseProps {
  notifications: TrayNotification[];
  /** Mark all visible notifications as read. */
  onMarkAllRead?: () => void;
  /** Mark a single notification as read. */
  onMarkRead?: (id: string) => void;
  /** Empty-state copy. */
  emptyMessage?: string;
}

function formatAt(at: string | Date | number): string {
  const d = at instanceof Date ? at : new Date(at);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

/**
 * TasksTray — right-side drawer that surfaces actionable items assigned
 * to the current user. Pairs with the cross-module `useBackStack` so the
 * user can navigate to the task surface and come back without losing
 * context. The DS contract is the shape — host apps wire data sources.
 */
export function TasksTray({
  open,
  onClose,
  tasks,
  title = 'Tasks',
  onMarkDone,
  onClearCompleted,
}: TasksTrayProps) {
  const open_count = tasks.filter((t) => !t.done).length;
  const done_count = tasks.filter((t) => t.done).length;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={`${open_count} open · ${done_count} done`}
      side="right"
      size="md"
      footer={
        done_count > 0 && onClearCompleted ? (
          <button
            type="button"
            className="cc-btn cc-btn--ghost"
            onClick={onClearCompleted}
          >
            Clear completed
          </button>
        ) : undefined
      }
    >
      {tasks.length === 0 ? (
        <p className="cc-tray__empty">Nothing on your plate.</p>
      ) : (
        <ul className="cc-tray__list" role="list">
          {tasks.map((t) => (
            <li
              key={t.id}
              className={[
                'cc-tray__item',
                t.severity && `cc-tray__item--${t.severity}`,
                t.done && 'cc-tray__item--done',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="cc-tray__item-body">
                <p className="cc-tray__item-title">{t.title}</p>
                {t.description && <p className="cc-tray__item-desc">{t.description}</p>}
                <p className="cc-tray__item-meta">{formatAt(t.at)}</p>
              </div>
              <div className="cc-tray__item-actions">
                {t.action && (
                  t.action.href ? (
                    <a className="cc-btn cc-btn--ghost" href={t.action.href}>
                      {t.action.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="cc-btn cc-btn--ghost"
                      onClick={t.action.onClick}
                    >
                      {t.action.label}
                    </button>
                  )
                )}
                {onMarkDone && !t.done && (
                  <button
                    type="button"
                    className="cc-btn cc-btn--ghost"
                    onClick={() => onMarkDone(t.id)}
                    aria-label={`Mark "${t.title}" done`}
                  >
                    Done
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}

/**
 * NotificationsTray — right-side drawer for system / module notifications
 * (digest, not real-time toasts). Unread notifications surface above read
 * ones; a "mark all read" control sits in the header.
 */
export function NotificationsTray({
  open,
  onClose,
  notifications,
  title = 'Notifications',
  onMarkAllRead,
  onMarkRead,
  emptyMessage = "You're all caught up.",
}: NotificationsTrayProps) {
  const unread = notifications.filter((n) => !n.read);
  const ordered = [...notifications].sort((a, b) => {
    if (!!a.read !== !!b.read) return a.read ? 1 : -1;
    return new Date(b.at).getTime() - new Date(a.at).getTime();
  });

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={
        unread.length > 0
          ? `${unread.length} unread`
          : 'No unread notifications'
      }
      side="right"
      size="md"
      footer={
        unread.length > 0 && onMarkAllRead ? (
          <button
            type="button"
            className="cc-btn cc-btn--ghost"
            onClick={onMarkAllRead}
          >
            Mark all read
          </button>
        ) : undefined
      }
    >
      {ordered.length === 0 ? (
        <p className="cc-tray__empty">{emptyMessage}</p>
      ) : (
        <ul className="cc-tray__list" role="list">
          {ordered.map((n) => (
            <li
              key={n.id}
              className={[
                'cc-tray__item',
                'cc-tray__item--notification',
                !n.read && 'cc-tray__item--unread',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="cc-tray__item-body">
                <div className="cc-tray__item-row">
                  <p className="cc-tray__item-title">{n.title}</p>
                  {n.source && <span className="cc-chip cc-chip--sm">{n.source}</span>}
                </div>
                {n.body && <p className="cc-tray__item-desc">{n.body}</p>}
                <p className="cc-tray__item-meta">{formatAt(n.at)}</p>
              </div>
              <div className="cc-tray__item-actions">
                {n.action && (
                  n.action.href ? (
                    <a className="cc-btn cc-btn--ghost" href={n.action.href} onClick={n.action.onClick}>
                      {n.action.label}
                    </a>
                  ) : (
                    <button type="button" className="cc-btn cc-btn--ghost" onClick={n.action.onClick}>
                      {n.action.label}
                    </button>
                  )
                )}
                {!n.read && onMarkRead && (
                  <button
                    type="button"
                    className="cc-btn cc-btn--ghost"
                    onClick={() => onMarkRead(n.id)}
                    aria-label={`Mark "${n.title}" read`}
                  >
                    Mark read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
