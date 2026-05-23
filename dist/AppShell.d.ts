/**
 * @deprecated Internal as of DS-SIMPLIFY 05. Use `PlatformAppShell` from
 * `@ds/core/react` instead — it pre-composes AppShell, TopBar, NavRail,
 * CompanyGroupSwitcher, AppSwitcher, UserMenu, and CreateMenu into one drop-in
 * shell. This file remains for internal composition only; it is no longer in
 * the public barrel or `package.json#exports` map. Will be removed in v1.0.
 *
 * AppShell — outermost layout chrome.
 *
 * Composes:
 *   <FmtProvider>          (B.6)
 *     <OfflineBanner />    (C.9)
 *     <TopBar />           (C.14)
 *     <div cc-shell>
 *       <NavRail />        (B.5 — icon-aware)
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
import { type FmtSettings } from "./fmt/Fmt.js";
import { type NavRailItem } from "./NavRail.js";
import { type BreadcrumbItem } from "./Breadcrumbs.js";
export interface AppShellProps {
    /** Brand slot rendered in the TopBar. */
    brand?: React.ReactNode;
    /** Identity initials for the TopBar identity button. */
    identity?: string;
    /** Initials chip rendered next to identity when no groupSwitcher supplied. */
    groupInitials?: string;
    /** Sidebar nav items (NavRail). */
    navItems?: NavRailItem[];
    /** id of the active nav item. */
    activeId?: string;
    /** Click handler for nav item activation (router bridge). */
    onNavigate?: (id: string) => void;
    /** Breadcrumb trail for the current route. */
    crumbs?: BreadcrumbItem[];
    /** Cmd+K trigger handler. */
    onCmdK?: () => void;
    /** Identity-button click handler. */
    onIdentityClick?: () => void;
    /** Extras slot for the TopBar. */
    topBarExtras?: React.ReactNode;
    /** Right-hand activity slot (notifications etc.). */
    activity?: React.ReactNode;
    /** Replaces groupInitials when provided. */
    groupSwitcher?: React.ReactNode;
    /** FmtProvider settings overrides. */
    fmtSettings?: Partial<FmtSettings>;
    /** Page content. */
    children: React.ReactNode;
    className?: string;
}
export declare function AppShell({ brand, identity, groupInitials, navItems, activeId, onNavigate, crumbs, onCmdK, onIdentityClick, topBarExtras, activity, groupSwitcher, fmtSettings, children, className, }: AppShellProps): React.ReactElement;
//# sourceMappingURL=AppShell.d.ts.map