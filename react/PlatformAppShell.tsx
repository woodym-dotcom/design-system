/**
 * PlatformAppShell — pre-composed, drop-in top-level application chrome.
 *
 * DS-SIMPLIFY 05. One component replaces the seven previously-public shell
 * sub-primitives (AppShell, TopBar, NavRail, CompanyGroupSwitcher, AppSwitcher,
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
import { FmtProvider } from './fmt/Fmt';
import { OfflineBanner } from './OfflineBanner';
import { TopBar } from './TopBar';
import { NavRail, type NavRailItem } from './NavRail';
import { CompanyGroupSwitcher, type CompanyGroupOption } from './CompanyGroupSwitcher';
import { CommandPalette, type CommandPaletteProps } from './CommandPalette';
import { Tooltip } from './Tooltip';

export type BrandKey =
  | 'companyco'
  | 'recruitment'
  | 'customer-lifecycle'
  | 'automation';

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

export interface PlatformAppShellProps {
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
  className?: string;
}

const BRAND_LABEL: Record<BrandKey, string> = {
  companyco: 'CompanyCo',
  recruitment: 'Recruitment Woody',
  'customer-lifecycle': 'Customer Lifecycle',
  automation: 'Automation Armoury',
};

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

const SKIP_TARGET_ID = 'cc-shell-main';

// ── Internal: AppSwitcher ────────────────────────────────────────────────────
interface AppSwitcherProps {
  apps: AppDef[];
  currentAppKey: AppKey;
  onSwitch: (key: AppKey, url: string) => void;
}

function AppSwitcher({ apps, currentAppKey, onSwitch }: AppSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const menuId = React.useId();
  const anchorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
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

  return (
    <div ref={anchorRef} className="cc-menu-anchor cc-platform-shell__appswitcher">
      <button
        type="button"
        className="cc-btn cc-btn--ghost cc-btn--sm"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `cc-app-switcher-${menuId}` : undefined}
        aria-label={`Switch app (current: ${label})`}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">▦ {label}</span>
      </button>
      {open ? (
        <div
          id={`cc-app-switcher-${menuId}`}
          role="menu"
          aria-label="Switch app"
          className="cc-menu"
        >
          {apps.map((app) => (
            <button
              key={app.key}
              type="button"
              role="menuitem"
              className="cc-menu__item"
              aria-current={app.key === currentAppKey ? 'true' : undefined}
              onClick={() => {
                setOpen(false);
                onSwitch(app.key, app.url);
              }}
            >
              {app.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ── Internal: UserMenu ───────────────────────────────────────────────────────
interface UserMenuProps {
  user: UserDef;
  onSignOut: () => void;
}

function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [open, setOpen] = React.useState(false);
  const menuId = React.useId();
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const initials = user.initials ?? initialsFromName(user.name);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={anchorRef} className="cc-menu-anchor cc-platform-shell__usermenu">
      <button
        type="button"
        className="cc-topbar__identity"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `cc-user-menu-${menuId}` : undefined}
        aria-label="Open account menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">{initials}</span>
      </button>
      {open ? (
        <div
          id={`cc-user-menu-${menuId}`}
          role="menu"
          aria-label="Account menu"
          className="cc-menu"
        >
          <div className="cc-menu__label" aria-hidden="true">
            <strong>{user.name}</strong>
            {user.email ? <div>{user.email}</div> : null}
          </div>
          <button
            type="button"
            role="menuitem"
            className="cc-menu__item"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ── Internal: rich module link with disabled-tooltip + badge ────────────────
interface ModuleLinkProps {
  module: ModuleDef;
  isActive: boolean;
  itemClassName: string;
  onNavigate?: (id: string) => void;
}

function ModuleNavLink({ module, isActive, itemClassName, onNavigate }: ModuleLinkProps) {
  const linkClass = [itemClassName, module.disabled ? 'is-disabled' : '']
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {module.icon ? (
        <span className="cc-text-navrail__icon" aria-hidden>
          {module.icon}
        </span>
      ) : null}
      <span className="cc-text-navrail__label">{module.label}</span>
      {module.badge !== undefined && module.badge !== null ? (
        <span className="cc-text-navrail__badge" aria-label={`${module.badge} new`}>
          {module.badge}
        </span>
      ) : null}
    </>
  );

  if (module.disabled) {
    const disabledButton = (
      <button
        type="button"
        className={linkClass}
        disabled
        aria-disabled="true"
        data-module-id={module.id}
      >
        {inner}
      </button>
    );
    if (module.disabledReason) {
      return <Tooltip label={module.disabledReason}>{disabledButton}</Tooltip>;
    }
    return disabledButton;
  }

  return (
    <a
      href={module.href}
      className={linkClass}
      aria-current={isActive ? 'page' : undefined}
      data-module-id={module.id}
      onClick={
        onNavigate
          ? (e) => {
              e.preventDefault();
              onNavigate(module.id);
            }
          : undefined
      }
    >
      {inner}
    </a>
  );
}

export function PlatformAppShell({
  brand,
  modules,
  appKey,
  user,
  companyGroups,
  apps,
  onSignOut,
  onSwitchApp,
  onSwitchCompanyGroup,
  onNavigate,
  children,
  topBarSlot,
  navFooterSlot,
  commandPalette,
  activeModuleId,
  className,
}: PlatformAppShellProps): React.ReactElement {
  // Cmd+K binding owned by the shell when commandPalette is provided.
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  React.useEffect(() => {
    if (!commandPalette) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPalette]);

  // Build NavRail items; renderItem decorates each with disabled/badge/onNavigate.
  const navItems: NavRailItem[] = modules.map((m) => ({
    id: m.id,
    to: m.href,
    label: m.label,
    icon: m.icon,
    isActive: activeModuleId ? m.id === activeModuleId : undefined,
  }));

  const showGroupSwitcher = (companyGroups?.length ?? 0) > 1;
  const groupOptions: CompanyGroupOption[] = (companyGroups ?? []).map((g) => ({
    companyGroupUuid: g.id,
    name: g.name,
  }));
  const groupSwitcher = showGroupSwitcher ? (
    <CompanyGroupSwitcher
      currentGroupUuid={groupOptions[0]?.companyGroupUuid ?? null}
      memberships={groupOptions}
      onChange={(id) => onSwitchCompanyGroup?.(id)}
    />
  ) : null;

  const topBarExtras = (
    <>
      {groupSwitcher}
      {topBarSlot}
      <AppSwitcher apps={apps} currentAppKey={appKey} onSwitch={onSwitchApp} />
      <UserMenu user={user} onSignOut={onSignOut} />
    </>
  );

  const brandLabel = BRAND_LABEL[brand];
  const brandNode = (
    <span className={`cc-platform-shell__brand cc-platform-shell__brand--${brand}`}>
      {brandLabel}
    </span>
  );

  const rootClass = [
    'cc-platform-shell',
    'cc-shell',
    `cc-platform-shell--brand-${brand}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FmtProvider>
      <div className={rootClass} data-brand={brand}>
        <OfflineBanner />
        <TopBar
          brand={brandNode}
          showCmdK={Boolean(commandPalette)}
          onCmdK={commandPalette ? () => setPaletteOpen(true) : undefined}
          extras={topBarExtras}
        />
        <div className="cc-shell__body">
          {modules.length > 0 ? (
            <NavRail
              items={navItems}
              footerItems={
                navFooterSlot
                  ? // navFooterSlot is rendered as a synthetic footer cell so
                    // a11y nav landmark contains it. We pass a single
                    // pseudo-item that renderItem replaces with the slot.
                    [{ id: '__platform_shell_footer__', to: '#', label: 'footer' }]
                  : undefined
              }
              renderItem={({ item, isActive, className: itemClassName }) => {
                if (item.id === '__platform_shell_footer__') {
                  return (
                    <div className="cc-platform-shell__nav-footer" data-testid="platform-shell-nav-footer">
                      {navFooterSlot}
                    </div>
                  );
                }
                const mod = modules.find((m) => m.id === item.id);
                if (!mod) return null;
                return (
                  <ModuleNavLink
                    module={mod}
                    isActive={isActive}
                    itemClassName={itemClassName}
                    onNavigate={onNavigate}
                  />
                );
              }}
            />
          ) : null}
          <main id={SKIP_TARGET_ID} className="cc-shell__main">
            <a href={`#${SKIP_TARGET_ID}`} className="cc-skip-link">
              Skip to content
            </a>
            {children}
          </main>
        </div>
        {commandPalette ? (
          <CommandPalette
            {...commandPalette}
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
          />
        ) : null}
      </div>
    </FmtProvider>
  );
}
