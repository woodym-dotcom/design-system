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
import { type CommandPaletteProps } from './CommandPalette.js';
export type BrandKey = 'companyco' | 'recruitment' | 'customer-lifecycle' | 'automation';
export type AppKey = string;
export interface ModuleDef {
    id: string;
    label: string;
    icon?: React.ReactNode;
    href: string;
    disabled?: boolean;
    disabledReason?: string;
    badge?: string | number;
}
export interface UserDef {
    id: string;
    name: string;
    email?: string;
    /** Initials shown in the avatar. Falls back to `name` initials. */
    initials?: string;
}
export interface CompanyGroup {
    id: string;
    name: string;
}
export interface AppDef {
    key: AppKey;
    label: string;
    url: string;
}
export interface AppShellProps {
    brand: BrandKey;
    modules: ModuleDef[];
    appKey: AppKey;
    user: UserDef;
    /**
     * Optional company-group memberships. When present and length > 1, the
     * <CompanyGroupSwitcher> is mounted in the TopBar; otherwise it is hidden
     * (single-tenant case).
     */
    companyGroups?: CompanyGroup[];
    apps: AppDef[];
    onSignOut: () => void;
    onSwitchApp: (appKey: AppKey, url: string) => void;
    onSwitchCompanyGroup?: (id: string) => void;
    onNavigate?: (moduleId: string) => void;
    children: React.ReactNode;
    topBarSlot?: React.ReactNode;
    navFooterSlot?: React.ReactNode;
    /**
     * When provided, a Cmd+K / Ctrl+K global hotkey opens the CommandPalette.
     * The host must NOT set `open`/`onClose` — those are owned by the shell.
     */
    commandPalette?: Omit<CommandPaletteProps, 'open' | 'onClose'>;
    /** Currently active module id (for NavRail active state). */
    activeModuleId?: string;
    /**
     * Module-rail layout.
     *  - "expanded" (default): icon + text label per module (~200px rail).
     *  - "compact": 52–56px icon-only rail; the label moves to a hover/focus
     *    tooltip (`title` + `aria-label`). Use for dense, many-module admin
     *    surfaces where the horizontal shell leans on the breadcrumb strip for
     *    orientation (the CompanyCo horizontal-shell pattern in DESIGN.md).
     */
    navVariant?: 'expanded' | 'compact';
    className?: string;
}
export declare function AppShell({ brand, modules, appKey, user, companyGroups, apps, onSignOut, onSwitchApp, onSwitchCompanyGroup, onNavigate, children, topBarSlot, navFooterSlot, commandPalette, activeModuleId, navVariant, className, }: AppShellProps): React.ReactElement;
//# sourceMappingURL=AppShell.d.ts.map