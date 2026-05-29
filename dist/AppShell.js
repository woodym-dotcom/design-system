import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * AppShell — pre-composed, drop-in top-level application chrome.
 *
 * One component replaces the seven previously-public shell sub-primitives
 * (AppShellInternal, TopBar, NavRail, CompanyGroupSwitcher, AppSwitcher,
 * UserMenu, CreateMenu). Those primitives still live in this package but are
 * removed from the public barrel and export map. Consumers should compose at
 * this level instead of re-assembling the shell by hand.
 *
 * Composition (rendered top-down):
 *   FmtProvider
 *     OfflineBanner
 *     <header role=banner> TopBar — brand + groupSwitcher + topBarSlot
 *                                  + AppSwitcher + UserMenu
 *     <div cc-shell__body>
 *       <nav aria-label="Modules"> NavRail (modules)
 *         + optional navFooterSlot
 *       <main id="cc-shell-main">
 *         skip-to-content link
 *         {children}
 *     {commandPalette && <CommandPalette … bound to Cmd+K/Ctrl+K/>}
 *
 * a11y: header[role=banner], nav[aria-label=Modules], main[id=cc-shell-main],
 * ARIA menu pattern on the app switcher, user menu, and the in-shell
 * CompanyGroupSwitcher.
 */
import * as React from 'react';
import { FmtProvider } from './fmt/Fmt.js';
import { State } from './State.js';
import { TopBar } from './TopBar.js';
import { NavRail } from './NavRail.js';
import { CompanyGroupSwitcher } from './CompanyGroupSwitcher.js';
import { CommandPalette } from './CommandPalette.js';
import { Tooltip } from './Tooltip.js';
function useOnlineStatus() {
    const [online, setOnline] = React.useState(typeof navigator === 'undefined' ? true : navigator.onLine !== false);
    React.useEffect(() => {
        const onOnline = () => setOnline(true);
        const onOffline = () => setOnline(false);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        setOnline(typeof navigator === 'undefined' ? true : navigator.onLine !== false);
        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);
    return online;
}
const BRAND_LABEL = {
    companyco: 'CompanyCo',
    recruitment: 'Recruitment Woody',
    'customer-lifecycle': 'Customer Lifecycle',
    automation: 'Automation Armoury',
};
function initialsFromName(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}
const SKIP_TARGET_ID = 'cc-shell-main';
function AppSwitcher({ apps, currentAppKey, onSwitch }) {
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
    return (_jsxs("div", { ref: anchorRef, className: "cc-menu-anchor cc-app-shell__appswitcher", children: [_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? `cc-app-switcher-${menuId}` : undefined, "aria-label": `Switch app (current: ${label})`, onClick: () => setOpen((o) => !o), children: _jsxs("span", { "aria-hidden": "true", children: ["\u25A6 ", label] }) }), open ? (_jsx("div", { id: `cc-app-switcher-${menuId}`, role: "menu", "aria-label": "Switch app", className: "cc-menu", children: apps.map((app) => (_jsx("button", { type: "button", role: "menuitem", className: "cc-menu__item", "aria-current": app.key === currentAppKey ? 'true' : undefined, onClick: () => {
                        setOpen(false);
                        onSwitch(app.key, app.url);
                    }, children: app.label }, app.key))) })) : null] }));
}
function UserMenu({ user, onSignOut }) {
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
    return (_jsxs("div", { ref: anchorRef, className: "cc-menu-anchor cc-app-shell__usermenu", children: [_jsx("button", { type: "button", className: "cc-topbar__identity", "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? `cc-user-menu-${menuId}` : undefined, "aria-label": "Open account menu", onClick: () => setOpen((o) => !o), children: _jsx("span", { "aria-hidden": "true", children: initials }) }), open ? (_jsxs("div", { id: `cc-user-menu-${menuId}`, role: "menu", "aria-label": "Account menu", className: "cc-menu", children: [_jsxs("div", { className: "cc-menu__label", "aria-hidden": "true", children: [_jsx("strong", { children: user.name }), user.email ? _jsx("div", { children: user.email }) : null] }), _jsx("button", { type: "button", role: "menuitem", className: "cc-menu__item", onClick: () => {
                            setOpen(false);
                            onSignOut();
                        }, children: "Sign out" })] })) : null] }));
}
function ModuleNavLink({ module, isActive, itemClassName, onNavigate }) {
    const linkClass = [itemClassName, module.disabled ? 'is-disabled' : '']
        .filter(Boolean)
        .join(' ');
    const inner = (_jsxs(_Fragment, { children: [module.icon ? (_jsx("span", { className: "cc-text-navrail__icon", "aria-hidden": true, children: module.icon })) : null, _jsx("span", { className: "cc-text-navrail__label", children: module.label }), module.badge !== undefined && module.badge !== null ? (_jsx("span", { className: "cc-text-navrail__badge", "aria-label": `${module.badge} new`, children: module.badge })) : null] }));
    if (module.disabled) {
        const disabledButton = (_jsx("button", { type: "button", className: linkClass, disabled: true, "aria-disabled": "true", "data-module-id": module.id, children: inner }));
        if (module.disabledReason) {
            return _jsx(Tooltip, { label: module.disabledReason, children: disabledButton });
        }
        return disabledButton;
    }
    return (_jsx("a", { href: module.href, className: linkClass, "aria-current": isActive ? 'page' : undefined, "data-module-id": module.id, onClick: onNavigate
            ? (e) => {
                e.preventDefault();
                onNavigate(module.id);
            }
            : undefined, children: inner }));
}
export function AppShell({ brand, modules, appKey, user, companyGroups, apps, onSignOut, onSwitchApp, onSwitchCompanyGroup, onNavigate, children, topBarSlot, navFooterSlot, commandPalette, activeModuleId, className, }) {
    const online = useOnlineStatus();
    // Cmd+K binding owned by the shell when commandPalette is provided.
    const [paletteOpen, setPaletteOpen] = React.useState(false);
    React.useEffect(() => {
        if (!commandPalette)
            return;
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setPaletteOpen((o) => !o);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [commandPalette]);
    // Build NavRail items; renderItem decorates each with disabled/badge/onNavigate.
    const navItems = modules.map((m) => ({
        id: m.id,
        to: m.href,
        label: m.label,
        icon: m.icon,
        isActive: activeModuleId ? m.id === activeModuleId : undefined,
    }));
    const showGroupSwitcher = (companyGroups?.length ?? 0) > 1;
    const groupOptions = (companyGroups ?? []).map((g) => ({
        companyGroupUuid: g.id,
        name: g.name,
    }));
    const groupSwitcher = showGroupSwitcher ? (_jsx(CompanyGroupSwitcher, { currentGroupUuid: groupOptions[0]?.companyGroupUuid ?? null, memberships: groupOptions, onChange: (id) => onSwitchCompanyGroup?.(id) })) : null;
    const topBarExtras = (_jsxs(_Fragment, { children: [groupSwitcher, topBarSlot, _jsx(AppSwitcher, { apps: apps, currentAppKey: appKey, onSwitch: onSwitchApp }), _jsx(UserMenu, { user: user, onSignOut: onSignOut })] }));
    const brandLabel = BRAND_LABEL[brand];
    const brandNode = (_jsx("span", { className: `cc-app-shell__brand cc-app-shell__brand--${brand}`, children: brandLabel }));
    const rootClass = [
        'cc-app-shell',
        'cc-shell',
        `cc-app-shell--brand-${brand}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');
    return (_jsx(FmtProvider, { children: _jsxs("div", { className: rootClass, "data-brand": brand, children: [!online && _jsx(State, { variant: "offline", density: "banner" }), _jsx(TopBar, { brand: brandNode, showCmdK: Boolean(commandPalette), onCmdK: commandPalette ? () => setPaletteOpen(true) : undefined, extras: topBarExtras }), _jsxs("div", { className: "cc-shell__body", children: [modules.length > 0 ? (_jsx(NavRail, { items: navItems, footerItems: navFooterSlot
                                ? // navFooterSlot is rendered as a synthetic footer cell so
                                    // a11y nav landmark contains it. We pass a single
                                    // pseudo-item that renderItem replaces with the slot.
                                    [{ id: '__app_shell_footer__', to: '#', label: 'footer' }]
                                : undefined, renderItem: ({ item, isActive, className: itemClassName }) => {
                                if (item.id === '__app_shell_footer__') {
                                    return (_jsx("div", { className: "cc-app-shell__nav-footer", "data-testid": "app-shell-nav-footer", children: navFooterSlot }));
                                }
                                const mod = modules.find((m) => m.id === item.id);
                                if (!mod)
                                    return null;
                                return (_jsx(ModuleNavLink, { module: mod, isActive: isActive, itemClassName: itemClassName, onNavigate: onNavigate }));
                            } })) : null, _jsxs("main", { id: SKIP_TARGET_ID, className: "cc-shell__main", children: [_jsx("a", { href: `#${SKIP_TARGET_ID}`, className: "cc-skip-link", children: "Skip to content" }), children] })] }), commandPalette ? (_jsx(CommandPalette, { ...commandPalette, open: paletteOpen, onClose: () => setPaletteOpen(false) })) : null] }) }));
}
//# sourceMappingURL=AppShell.js.map