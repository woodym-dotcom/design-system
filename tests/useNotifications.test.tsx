/**
 * useNotifications hook + 3-tier priority + snooze.
 *
 * The hook is a tiny in-memory state engine for the notifications inbox:
 * it accepts an incoming stream of `TrayNotification` items, exposes
 * filtered views (by module + by priority + by snoozed state), provides
 * snooze + mark-read mutations, and (optionally) announces urgent items
 * through `useAnnounce`. Consumers wire the live source (SSE / poll /
 * cross-tab) and feed the hook via `add`.
 */
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  useNotifications,
  type NotificationsState,
} from '../react/useNotifications';
import type { TrayNotification } from '../react/Trays';

function notif(
  overrides: Partial<TrayNotification> & Pick<TrayNotification, 'id'>,
): TrayNotification {
  return {
    id: overrides.id,
    title: overrides.title ?? 'A',
    at: overrides.at ?? Date.now(),
    ...overrides,
  };
}

interface Harness {
  Probe: React.ComponentType<{ moduleFilter?: string; priorityFilter?: 'urgent' | 'normal' | 'informational' }>;
  current: NotificationsState | null;
}
function makeProbe(initial?: TrayNotification[]): Harness {
  const harness: Harness = { Probe: null as never, current: null };
  harness.Probe = ({ moduleFilter, priorityFilter }) => {
    const state = useNotifications({ initial, moduleFilter, priorityFilter });
    harness.current = state;
    return <span data-testid="count">{harness.current!.visible.length}</span>;
  };
  return harness;
}

describe('useNotifications', () => {
  it('exposes the initial set as visible', () => {
    const harness = makeProbe([
      notif({ id: 'a', priority: 'normal' }),
      notif({ id: 'b', priority: 'urgent' }),
    ]);
    render(<harness.Probe />);
    expect(harness.current!.visible.map((n) => n.id).sort()).toEqual(['a', 'b']);
  });

  it('filters by moduleFilter', () => {
    const harness = makeProbe([
      notif({ id: 'a', source: 'quality' }),
      notif({ id: 'b', source: 'workforce' }),
      notif({ id: 'c', source: 'quality' }),
    ]);
    render(<harness.Probe moduleFilter="quality" />);
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('filters by priorityFilter', () => {
    const harness = makeProbe([
      notif({ id: 'a', priority: 'urgent' }),
      notif({ id: 'b', priority: 'normal' }),
      notif({ id: 'c', priority: 'urgent' }),
    ]);
    render(<harness.Probe priorityFilter="urgent" />);
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('add() inserts a new notification', () => {
    const harness = makeProbe([notif({ id: 'a' })]);
    render(<harness.Probe />);
    act(() => harness.current!.add(notif({ id: 'b' })));
    expect(harness.current!.visible.map((n) => n.id).sort()).toEqual(['a', 'b']);
  });

  it('markRead() flips read flag', () => {
    const harness = makeProbe([notif({ id: 'a' })]);
    render(<harness.Probe />);
    expect(harness.current!.visible[0].read).toBeFalsy();
    act(() => harness.current!.markRead('a'));
    expect(harness.current!.visible[0].read).toBe(true);
  });

  it('markAllRead() flips all', () => {
    const harness = makeProbe([
      notif({ id: 'a' }),
      notif({ id: 'b' }),
    ]);
    render(<harness.Probe />);
    act(() => harness.current!.markAllRead());
    expect(harness.current!.visible.every((n) => n.read)).toBe(true);
  });

  it('unreadCount() returns count of unread', () => {
    const harness = makeProbe([
      notif({ id: 'a', read: true }),
      notif({ id: 'b' }),
      notif({ id: 'c' }),
    ]);
    render(<harness.Probe />);
    expect(harness.current!.unreadCount).toBe(2);
  });

  describe('snooze', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-05-23T10:00:00Z'));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('snooze() hides the item until snoozedUntil passes', () => {
      const harness = makeProbe([notif({ id: 'a' })]);
      render(<harness.Probe />);
      act(() => harness.current!.snooze('a', { hours: 4 }));
      expect(harness.current!.visible.map((n) => n.id)).not.toContain('a');

      vi.setSystemTime(new Date('2026-05-23T14:30:00Z'));
      act(() => harness.current!.tick());
      expect(harness.current!.visible.map((n) => n.id)).toContain('a');
    });

    it('snoozedItems() returns the currently-snoozed set', () => {
      const harness = makeProbe([
        notif({ id: 'a' }),
        notif({ id: 'b' }),
      ]);
      render(<harness.Probe />);
      act(() => harness.current!.snooze('a', { hours: 4 }));
      expect(harness.current!.snoozed.map((n) => n.id)).toEqual(['a']);
    });

    it('unsnooze() restores the item immediately', () => {
      const harness = makeProbe([notif({ id: 'a' })]);
      render(<harness.Probe />);
      act(() => harness.current!.snooze('a', { hours: 4 }));
      expect(harness.current!.visible.map((n) => n.id)).not.toContain('a');
      act(() => harness.current!.unsnooze('a'));
      expect(harness.current!.visible.map((n) => n.id)).toContain('a');
    });
  });

  describe('quiet hours', () => {
    it('defers normal-priority adds to a digest queue during quiet hours', () => {
      const harness = makeProbe();
      render(
        <harness.Probe />,
      );
      // The hook's `add` accepts a 2nd arg with a clock + quiet-hours config;
      // contract: during quiet hours, normal-priority items go to deferredDigest
      // until the consumer calls flushDigest().
      act(() => {
        harness.current!.addAtNow(notif({ id: 'urg', priority: 'urgent' }), {
          now: new Date('2026-05-23T22:00:00Z'),
          quietHours: { startLocalHour: 19, endLocalHour: 8 },
        });
        harness.current!.addAtNow(notif({ id: 'norm', priority: 'normal' }), {
          now: new Date('2026-05-23T22:00:00Z'),
          quietHours: { startLocalHour: 19, endLocalHour: 8 },
        });
      });
      expect(harness.current!.visible.map((n) => n.id)).toContain('urg');
      expect(harness.current!.visible.map((n) => n.id)).not.toContain('norm');
      expect(harness.current!.deferredDigest.map((n) => n.id)).toContain('norm');
    });

    it('flushDigest() moves deferred items back into visible', () => {
      const harness = makeProbe();
      render(<harness.Probe />);
      act(() => {
        harness.current!.addAtNow(notif({ id: 'norm', priority: 'normal' }), {
          now: new Date('2026-05-23T22:00:00Z'),
          quietHours: { startLocalHour: 19, endLocalHour: 8 },
        });
      });
      expect(harness.current!.deferredDigest.length).toBe(1);
      act(() => harness.current!.flushDigest());
      expect(harness.current!.deferredDigest.length).toBe(0);
      expect(harness.current!.visible.map((n) => n.id)).toContain('norm');
    });
  });
});
