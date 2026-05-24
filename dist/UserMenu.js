import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * UserMenu -- user popover with role/email/sign-out.
 *
 * DS-MIG P1-13. This is the standalone export of the UserMenu that
 * already exists inside PlatformAppShell. Extracted here for consumers
 * that need the user menu outside of the full PlatformAppShell.
 *
 * For the standard case, use PlatformAppShell which includes UserMenu
 * automatically.
 */
import * as React from 'react';
function initialsFromName(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}
/**
 * UserMenu -- avatar-triggered dropdown with user info and sign-out.
 * ARIA menu pattern with Escape-to-close and outside-click-to-close.
 */
export function UserMenu({ user, onSignOut, extraItems, className, }) {
    const [open, setOpen] = React.useState(false);
    const menuId = React.useId();
    const anchorRef = React.useRef(null);
    const initials = user.initials ?? initialsFromName(user.name);
    React.useEffect(() => {
        if (!open)
            return;
        const handlePointerDown = (e) => {
            if (anchorRef.current && !anchorRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const handleKey = (e) => {
            if (e.key === 'Escape')
                setOpen(false);
        };
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open]);
    return (_jsxs("div", { ref: anchorRef, className: ['cc-menu-anchor cc-user-menu', className].filter(Boolean).join(' '), children: [_jsx("button", { type: "button", className: "cc-topbar__identity", "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? `cc-user-menu-${menuId}` : undefined, "aria-label": "Open account menu", onClick: () => setOpen((o) => !o), style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: '1px solid var(--border-1)',
                    background: 'var(--surface-2)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm, 0.875rem)',
                    fontWeight: 600,
                    color: 'var(--text-1)',
                }, children: _jsx("span", { "aria-hidden": "true", children: initials }) }), open ? (_jsxs("div", { id: `cc-user-menu-${menuId}`, role: "menu", "aria-label": "Account menu", className: "cc-menu", children: [_jsxs("div", { className: "cc-menu__label", "aria-hidden": "true", children: [_jsx("strong", { children: user.name }), user.role && _jsx("div", { style: { fontSize: 'var(--text-xs, 0.75rem)', color: 'var(--text-3)' }, children: user.role }), user.email && _jsx("div", { style: { fontSize: 'var(--text-xs, 0.75rem)', color: 'var(--text-3)' }, children: user.email })] }), extraItems?.map((item) => (_jsx("button", { type: "button", role: "menuitem", className: "cc-menu__item", onClick: () => {
                            setOpen(false);
                            item.onClick();
                        }, children: item.label }, item.id))), _jsx("button", { type: "button", role: "menuitem", className: "cc-menu__item", onClick: () => {
                            setOpen(false);
                            onSignOut();
                        }, children: "Sign out" })] })) : null] }));
}
//# sourceMappingURL=UserMenu.js.map