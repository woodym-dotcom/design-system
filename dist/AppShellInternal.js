import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AppShellInternal — low-level layout chrome (internal only).
 *
 * Public consumers should use `AppShell` from `@ds/core/react` — it pre-composes
 * this primitive with TopBar, NavRail, CompanyGroupSwitcher, AppSwitcher,
 * UserMenu, and CreateMenu into one drop-in shell. This file is not exported
 * from the public barrel; it exists only for internal composition.
 *
 * Composes:
 *   <FmtProvider>
 *     <OfflineBanner />
 *     <TopBar />
 *     <div cc-shell>
 *       <NavRail />
 *       <main>
 *         skip-to-content link (visually-hidden, focusable)
 *         <Breadcrumbs />
 *         {children}
 *       </main>
 *     </div>
 *   </FmtProvider>
 *
 * The `groupSwitcher` slot, when provided, replaces `groupInitials` in the
 * top bar's extras slot.
 */
import * as React from "react";
import { FmtProvider } from "./fmt/Fmt.js";
import { State } from "./State.js";
import { TopBar } from "./TopBar.js";
import { NavRail } from "./NavRail.js";
import { Breadcrumbs } from "./Breadcrumbs.js";
function useOnlineStatus() {
    const [online, setOnline] = React.useState(typeof navigator === "undefined" ? true : navigator.onLine !== false);
    React.useEffect(() => {
        const onOnline = () => setOnline(true);
        const onOffline = () => setOnline(false);
        window.addEventListener("online", onOnline);
        window.addEventListener("offline", onOffline);
        setOnline(typeof navigator === "undefined" ? true : navigator.onLine !== false);
        return () => {
            window.removeEventListener("online", onOnline);
            window.removeEventListener("offline", onOffline);
        };
    }, []);
    return online;
}
const SKIP_TARGET_ID = "cc-shell-main";
export function AppShellInternal({ brand, identity, groupInitials, navItems, navFooterItems, navAriaLabel, activeId, onNavigate, crumbs, onCmdK, onIdentityClick, topBarExtras, activity, groupSwitcher, fmtSettings, children, className, }) {
    const online = useOnlineStatus();
    // Build NavRailItem with isActive bound to activeId.
    const items = (navItems ?? []).map((item) => ({
        ...item,
        isActive: activeId !== undefined ? item.id === activeId : item.isActive,
    }));
    // Compose TopBar extras: activity + groupSwitcher (or groupInitials chip)
    // + user-supplied extras.
    const groupChip = groupSwitcher ??
        (groupInitials ? (_jsx("span", { className: "cc-shell__group", "aria-label": "Active group", children: groupInitials })) : null);
    const extras = (_jsxs(_Fragment, { children: [activity, groupChip, topBarExtras] }));
    return (_jsx(FmtProvider, { ...(fmtSettings ?? {}), children: _jsxs("div", { className: ["cc-shell", className].filter(Boolean).join(" "), children: [!online && _jsx(State, { variant: "offline", density: "banner" }), _jsx(TopBar, { brand: brand, identity: identity, onCmdK: onCmdK, onIdentityClick: onIdentityClick, extras: extras }), _jsxs("div", { className: "cc-shell__body", children: [items.length > 0 ? (_jsx(NavRail, { items: items, footerItems: navFooterItems, ariaLabel: navAriaLabel, renderItem: onNavigate
                                ? ({ item, isActive, className: itemClassName }) => (_jsxs("a", { href: item.to, className: itemClassName, "aria-current": isActive ? "page" : undefined, onClick: (e) => {
                                        e.preventDefault();
                                        onNavigate(item.id);
                                    }, children: [item.icon ? (_jsx("span", { className: "cc-text-navrail__icon", "aria-hidden": true, children: item.icon })) : null, _jsx("span", { className: "cc-text-navrail__label", children: item.label })] }))
                                : undefined })) : null, _jsxs("main", { id: SKIP_TARGET_ID, className: "cc-shell__main", children: [_jsx("a", { href: `#${SKIP_TARGET_ID}`, className: "cc-skip-link", children: "Skip to content" }), crumbs && crumbs.length > 0 ? _jsx(Breadcrumbs, { items: crumbs }) : null, children] })] })] }) }));
}
//# sourceMappingURL=AppShellInternal.js.map