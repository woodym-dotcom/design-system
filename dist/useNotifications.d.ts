import type { NotificationPriority, TrayNotification } from './Trays.js';
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
export declare function useNotifications(opts?: UseNotificationsOptions): NotificationsState;
//# sourceMappingURL=useNotifications.d.ts.map