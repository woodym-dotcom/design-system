import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { FmtProvider } from "./fmt/Fmt";
import { OfflineBanner } from "./OfflineBanner";
import { TopBar } from "./TopBar";
import { NavRail } from "./NavRail";
import { Breadcrumbs } from "./Breadcrumbs";
const SKIP_TARGET_ID = "cc-shell-main";
export function AppShell({ brand, identity, groupInitials, navItems, activeId, onNavigate, crumbs, onCmdK, onIdentityClick, topBarExtras, activity, groupSwitcher, fmtSettings, children, className, }) {
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
    return (_jsx(FmtProvider, { ...(fmtSettings ?? {}), children: _jsxs("div", { className: ["cc-shell", className].filter(Boolean).join(" "), children: [_jsx(OfflineBanner, {}), _jsx(TopBar, { brand: brand, identity: identity, onCmdK: onCmdK, onIdentityClick: onIdentityClick, extras: extras }), _jsxs("div", { className: "cc-shell__body", children: [items.length > 0 ? (_jsx(NavRail, { items: items, renderItem: onNavigate
                                ? ({ item, isActive, className: itemClassName }) => (_jsxs("a", { href: item.to, className: itemClassName, "aria-current": isActive ? "page" : undefined, onClick: (e) => {
                                        e.preventDefault();
                                        onNavigate(item.id);
                                    }, children: [item.icon ? (_jsx("span", { className: "cc-text-navrail__icon", "aria-hidden": true, children: item.icon })) : null, _jsx("span", { className: "cc-text-navrail__label", children: item.label })] }))
                                : undefined })) : null, _jsxs("main", { id: SKIP_TARGET_ID, className: "cc-shell__main", children: [_jsx("a", { href: `#${SKIP_TARGET_ID}`, className: "cc-skip-link", children: "Skip to content" }), crumbs && crumbs.length > 0 ? _jsx(Breadcrumbs, { items: crumbs }) : null, children] })] })] }) }));
}
//# sourceMappingURL=AppShell.js.map