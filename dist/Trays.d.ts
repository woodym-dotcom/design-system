export interface TrayTask {
    id: string;
    /** Short label. */
    title: string;
    /** Optional secondary copy. */
    description?: string;
    /** When the task surfaced. */
    at: string | Date | number;
    /** Optional CTA to act on the task. */
    action?: {
        label: string;
        onClick: () => void;
        href?: string;
    };
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
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
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
/**
 * TasksTray — right-side drawer that surfaces actionable items assigned
 * to the current user. Pairs with the cross-module `useBackStack` so the
 * user can navigate to the task surface and come back without losing
 * context. The DS contract is the shape — host apps wire data sources.
 */
export declare function TasksTray({ open, onClose, tasks, title, onMarkDone, onClearCompleted, }: TasksTrayProps): import("react/jsx-runtime").JSX.Element;
/**
 * NotificationsTray — right-side drawer for system / module notifications
 * (digest, not real-time toasts). Unread notifications surface above read
 * ones; a "mark all read" control sits in the header.
 */
export declare function NotificationsTray({ open, onClose, notifications, title, onMarkAllRead, onMarkRead, emptyMessage, }: NotificationsTrayProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Trays.d.ts.map