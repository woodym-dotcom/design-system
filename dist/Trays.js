import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Drawer } from './Drawer.js';
function formatAt(at) {
    const d = at instanceof Date ? at : new Date(at);
    if (Number.isNaN(d.getTime()))
        return '';
    return d.toLocaleString();
}
/**
 * TasksTray — right-side drawer that surfaces actionable items assigned
 * to the current user. Pairs with the cross-module `useBackStack` so the
 * user can navigate to the task surface and come back without losing
 * context. The DS contract is the shape — host apps wire data sources.
 */
export function TasksTray({ open, onClose, tasks, title = 'Tasks', onMarkDone, onClearCompleted, }) {
    const open_count = tasks.filter((t) => !t.done).length;
    const done_count = tasks.filter((t) => t.done).length;
    return (_jsx(Drawer, { open: open, onClose: onClose, title: title, subtitle: `${open_count} open · ${done_count} done`, side: "right", size: "md", footer: done_count > 0 && onClearCompleted ? (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost", onClick: onClearCompleted, children: "Clear completed" })) : undefined, children: tasks.length === 0 ? (_jsx("p", { className: "cc-tray__empty", children: "Nothing on your plate." })) : (_jsx("ul", { className: "cc-tray__list", role: "list", children: tasks.map((t) => (_jsxs("li", { className: [
                    'cc-tray__item',
                    t.severity && `cc-tray__item--${t.severity}`,
                    t.done && 'cc-tray__item--done',
                ]
                    .filter(Boolean)
                    .join(' '), children: [_jsxs("div", { className: "cc-tray__item-body", children: [_jsx("p", { className: "cc-tray__item-title", children: t.title }), t.description && _jsx("p", { className: "cc-tray__item-desc", children: t.description }), _jsx("p", { className: "cc-tray__item-meta", children: formatAt(t.at) })] }), _jsxs("div", { className: "cc-tray__item-actions", children: [t.action && (t.action.href ? (_jsx("a", { className: "cc-btn cc-btn--ghost", href: t.action.href, children: t.action.label })) : (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost", onClick: t.action.onClick, children: t.action.label }))), onMarkDone && !t.done && (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost", onClick: () => onMarkDone(t.id), "aria-label": `Mark "${t.title}" done`, children: "Done" }))] })] }, t.id))) })) }));
}
/**
 * NotificationsTray — right-side drawer for system / module notifications
 * (digest, not real-time toasts). Unread notifications surface above read
 * ones; a "mark all read" control sits in the header.
 */
export function NotificationsTray({ open, onClose, notifications, title = 'Notifications', onMarkAllRead, onMarkRead, emptyMessage = "You're all caught up.", }) {
    const unread = notifications.filter((n) => !n.read);
    const ordered = [...notifications].sort((a, b) => {
        if (!!a.read !== !!b.read)
            return a.read ? 1 : -1;
        return new Date(b.at).getTime() - new Date(a.at).getTime();
    });
    return (_jsx(Drawer, { open: open, onClose: onClose, title: title, subtitle: unread.length > 0
            ? `${unread.length} unread`
            : 'No unread notifications', side: "right", size: "md", footer: unread.length > 0 && onMarkAllRead ? (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost", onClick: onMarkAllRead, children: "Mark all read" })) : undefined, children: ordered.length === 0 ? (_jsx("p", { className: "cc-tray__empty", children: emptyMessage })) : (_jsx("ul", { className: "cc-tray__list", role: "list", children: ordered.map((n) => (_jsxs("li", { className: [
                    'cc-tray__item',
                    'cc-tray__item--notification',
                    !n.read && 'cc-tray__item--unread',
                ]
                    .filter(Boolean)
                    .join(' '), children: [_jsxs("div", { className: "cc-tray__item-body", children: [_jsxs("div", { className: "cc-tray__item-row", children: [_jsx("p", { className: "cc-tray__item-title", children: n.title }), n.source && _jsx("span", { className: "cc-chip cc-chip--sm", children: n.source })] }), n.body && _jsx("p", { className: "cc-tray__item-desc", children: n.body }), _jsx("p", { className: "cc-tray__item-meta", children: formatAt(n.at) })] }), _jsxs("div", { className: "cc-tray__item-actions", children: [n.action && (n.action.href ? (_jsx("a", { className: "cc-btn cc-btn--ghost", href: n.action.href, onClick: n.action.onClick, children: n.action.label })) : (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost", onClick: n.action.onClick, children: n.action.label }))), !n.read && onMarkRead && (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost", onClick: () => onMarkRead(n.id), "aria-label": `Mark "${n.title}" read`, children: "Mark read" }))] })] }, n.id))) })) }));
}
//# sourceMappingURL=Trays.js.map