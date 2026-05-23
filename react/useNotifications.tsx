/**
 * useNotifications — in-memory notification inbox state.
 *
 * Consumers wire the live source (SSE / poll / cross-tab) and feed the
 * hook via `add` / `addAtNow`. The hook handles filtering, snooze,
 * quiet-hours deferral, and read-state mutation. It does NOT talk to
 * the backend — that's the consumer's job.
 *
 * The accompanying backend subscription / SSE delivery surface is
 * scoped as a separate ticket (see parent on Platform Kanban).
 */
import * as React from 'react';
import type { NotificationPriority, TrayNotification } from './Trays';

export interface QuietHoursWindow {
  /** Hour-of-day in local time (0–23) when quiet hours start. */
  startLocalHour: number;
  /** Hour-of-day in local time (0–23) when quiet hours end. May wrap (e.g. 22→8). */
  endLocalHour: number;
}

export interface AddOptions {
  /** Wall clock to evaluate quiet hours against (defaults to Date.now()). */
  now?: Date;
  /** Quiet-hours window — when set, normal/informational items are deferred. */
  quietHours?: QuietHoursWindow;
}

export interface SnoozeOptions {
  /** Snooze by hours. Either this OR `until` is required. */
  hours?: number;
  /** Snooze until a specific ISO timestamp. */
  until?: string;
}

export interface NotificationsState {
  /** All non-snoozed, non-deferred items matching active filters. */
  visible: ReadonlyArray<TrayNotification>;
  /** Items currently snoozed (snoozedUntil > now). */
  snoozed: ReadonlyArray<TrayNotification>;
  /** Items deferred into the morning digest queue. */
  deferredDigest: ReadonlyArray<TrayNotification>;
  /** Unread count of visible items. */
  unreadCount: number;

  /** Add a new notification, ignoring quiet hours. */
  add: (n: TrayNotification) => void;
  /** Add a notification, deferring to digest if it falls inside quiet hours and is not urgent. */
  addAtNow: (n: TrayNotification, opts?: AddOptions) => void;
  /** Move all deferred-digest items to visible. */
  flushDigest: () => void;
  /** Mark a single item read. */
  markRead: (id: string) => void;
  /** Mark every visible item read. */
  markAllRead: () => void;
  /** Snooze a single item. */
  snooze: (id: string, opts: SnoozeOptions) => void;
  /** Cancel snooze for a single item. */
  unsnooze: (id: string) => void;
  /** Re-evaluate snooze expiry (call from a setInterval). */
  tick: () => void;
}

export interface UseNotificationsOptions {
  initial?: ReadonlyArray<TrayNotification>;
  moduleFilter?: string;
  priorityFilter?: NotificationPriority;
}

function isInQuietHours(now: Date, q: QuietHoursWindow): boolean {
  const h = now.getHours();
  if (q.startLocalHour < q.endLocalHour) {
    return h >= q.startLocalHour && h < q.endLocalHour;
  }
  // Window wraps midnight (e.g. 19→8): inside if h >= start OR h < end.
  return h >= q.startLocalHour || h < q.endLocalHour;
}

function isSnoozed(n: TrayNotification, now: number): boolean {
  if (!n.snoozedUntil) return false;
  const u = new Date(n.snoozedUntil).getTime();
  return !Number.isNaN(u) && u > now;
}

export function useNotifications(opts?: UseNotificationsOptions): NotificationsState {
  const moduleFilter = opts?.moduleFilter;
  const priorityFilter = opts?.priorityFilter;

  const [items, setItems] = React.useState<TrayNotification[]>(() => [...(opts?.initial ?? [])]);
  const [deferred, setDeferred] = React.useState<TrayNotification[]>([]);
  // re-render token so `tick()` causes a re-filter even when items array is unchanged
  const [, setTickToken] = React.useState(0);

  const add = React.useCallback((n: TrayNotification) => {
    setItems((prev) => {
      const exists = prev.findIndex((x) => x.id === n.id);
      if (exists !== -1) {
        const next = prev.slice();
        next[exists] = n;
        return next;
      }
      return [...prev, n];
    });
  }, []);

  const addAtNow = React.useCallback((n: TrayNotification, optionsForAdd?: AddOptions) => {
    const now = optionsForAdd?.now ?? new Date();
    const q = optionsForAdd?.quietHours;
    const inQuiet = q ? isInQuietHours(now, q) : false;
    const priority: NotificationPriority = n.priority ?? 'normal';
    if (inQuiet && priority !== 'urgent') {
      setDeferred((prev) => [...prev, n]);
    } else {
      add(n);
    }
  }, [add]);

  const flushDigest = React.useCallback(() => {
    setDeferred((d) => {
      if (d.length === 0) return d;
      setItems((prev) => [...prev, ...d]);
      return [];
    });
  }, []);

  const markRead = React.useCallback((id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = React.useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const snooze = React.useCallback((id: string, snoozeOpts: SnoozeOptions) => {
    setItems((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const until =
          snoozeOpts.until ??
          (typeof snoozeOpts.hours === 'number'
            ? new Date(Date.now() + snoozeOpts.hours * 60 * 60 * 1000).toISOString()
            : undefined);
        return until ? { ...n, snoozedUntil: until } : n;
      }),
    );
  }, []);

  const unsnooze = React.useCallback((id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, snoozedUntil: undefined } : n)),
    );
  }, []);

  const tick = React.useCallback(() => {
    setTickToken((x) => x + 1);
  }, []);

  // Derive visible / snoozed lists. Read clock fresh on every render so snooze
  // expiry is honoured after time advances (via tick()).
  const now = Date.now();
  const visible = React.useMemo(() => {
    return items.filter((n) => {
      if (isSnoozed(n, now)) return false;
      if (moduleFilter && n.source !== moduleFilter) return false;
      if (priorityFilter && (n.priority ?? 'normal') !== priorityFilter) return false;
      return true;
    });
  }, [items, moduleFilter, priorityFilter, now]);

  const snoozed = React.useMemo(
    () => items.filter((n) => isSnoozed(n, now)),
    [items, now],
  );

  const unreadCount = React.useMemo(
    () => visible.reduce((acc, n) => acc + (n.read ? 0 : 1), 0),
    [visible],
  );

  return {
    visible,
    snoozed,
    deferredDigest: deferred,
    unreadCount,
    add,
    addAtNow,
    flushDigest,
    markRead,
    markAllRead,
    snooze,
    unsnooze,
    tick,
  };
}
