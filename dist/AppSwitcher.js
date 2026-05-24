import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AppSwitcher -- cross-app navigation dropdown.
 *
 * DS-MIG P1-12. This is the standalone export of the AppSwitcher that
 * already exists inside PlatformAppShell. It is extracted here for
 * consumers that need the app-switching dropdown outside of the full
 * PlatformAppShell (e.g., in a custom shell or embedded view).
 *
 * For the standard case, use PlatformAppShell which includes AppSwitcher
 * automatically.
 */
import * as React from 'react';
/**
 * AppSwitcher -- dropdown for switching between platform applications.
 * ARIA menu pattern with Escape-to-close and outside-click-to-close.
 */
export function AppSwitcher({ apps, currentAppKey, onSwitch, className, }) {
    const [open, setOpen] = React.useState(false);
    const menuId = React.useId();
    const anchorRef = React.useRef(null);
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
    const current = apps.find((a) => a.key === currentAppKey);
    const label = current?.label ?? 'Apps';
    return (_jsxs("div", { ref: anchorRef, className: ['cc-menu-anchor cc-app-switcher', className].filter(Boolean).join(' '), children: [_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? `cc-app-switcher-${menuId}` : undefined, "aria-label": `Switch app (current: ${label})`, onClick: () => setOpen((o) => !o), children: _jsx("span", { "aria-hidden": "true", children: label }) }), open ? (_jsx("div", { id: `cc-app-switcher-${menuId}`, role: "menu", "aria-label": "Switch app", className: "cc-menu", children: apps.map((app) => (_jsx("button", { type: "button", role: "menuitem", className: "cc-menu__item", "aria-current": app.key === currentAppKey ? 'true' : undefined, onClick: () => {
                        setOpen(false);
                        onSwitch(app.key, app.url);
                    }, children: app.label }, app.key))) })) : null] }));
}
//# sourceMappingURL=AppSwitcher.js.map