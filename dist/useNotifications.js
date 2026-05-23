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
function isInQuietHours(now, q) {
    const h = now.getHours();
    if (q.startLocalHour < q.endLocalHour) {
        return h >= q.startLocalHour && h < q.endLocalHour;
    }
    // Window wraps midnight (e.g. 19→8): inside if h >= start OR h < end.
    return h >= q.startLocalHour || h < q.endLocalHour;
}
function isSnoozed(n, now) {
    if (!n.snoozedUntil)
        return false;
    const u = new Date(n.snoozedUntil).getTime();
    return !Number.isNaN(u) && u > now;
}
export function useNotifications(opts) {
    const moduleFilter = opts?.moduleFilter;
    const priorityFilter = opts?.priorityFilter;
    const [items, setItems] = React.useState(() => [...(opts?.initial ?? [])]);
    const [deferred, setDeferred] = React.useState([]);
    // re-render token so `tick()` causes a re-filter even when items array is unchanged
    const [, setTickToken] = React.useState(0);
    const add = React.useCallback((n) => {
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
    const addAtNow = React.useCallback((n, optionsForAdd) => {
        const now = optionsForAdd?.now ?? new Date();
        const q = optionsForAdd?.quietHours;
        const inQuiet = q ? isInQuietHours(now, q) : false;
        const priority = n.priority ?? 'normal';
        if (inQuiet && priority !== 'urgent') {
            setDeferred((prev) => [...prev, n]);
        }
        else {
            add(n);
        }
    }, [add]);
    const flushDigest = React.useCallback(() => {
        setDeferred((d) => {
            if (d.length === 0)
                return d;
            setItems((prev) => [...prev, ...d]);
            return [];
        });
    }, []);
    const markRead = React.useCallback((id) => {
        setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }, []);
    const markAllRead = React.useCallback(() => {
        setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);
    const snooze = React.useCallback((id, snoozeOpts) => {
        setItems((prev) => prev.map((n) => {
            if (n.id !== id)
                return n;
            const until = snoozeOpts.until ??
                (typeof snoozeOpts.hours === 'number'
                    ? new Date(Date.now() + snoozeOpts.hours * 60 * 60 * 1000).toISOString()
                    : undefined);
            return until ? { ...n, snoozedUntil: until } : n;
        }));
    }, []);
    const unsnooze = React.useCallback((id) => {
        setItems((prev) => prev.map((n) => (n.id === id ? { ...n, snoozedUntil: undefined } : n)));
    }, []);
    const tick = React.useCallback(() => {
        setTickToken((x) => x + 1);
    }, []);
    // Derive visible / snoozed lists. Read clock fresh on every render so snooze
    // expiry is honoured after time advances (via tick()).
    const now = Date.now();
    const visible = React.useMemo(() => {
        return items.filter((n) => {
            if (isSnoozed(n, now))
                return false;
            if (moduleFilter && n.source !== moduleFilter)
                return false;
            if (priorityFilter && (n.priority ?? 'normal') !== priorityFilter)
                return false;
            return true;
        });
    }, [items, moduleFilter, priorityFilter, now]);
    const snoozed = React.useMemo(() => items.filter((n) => isSnoozed(n, now)), [items, now]);
    const unreadCount = React.useMemo(() => visible.reduce((acc, n) => acc + (n.read ? 0 : 1), 0), [visible]);
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
//# sourceMappingURL=useNotifications.js.map