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
import { FmtProvider, type FmtSettings } from "./fmt/Fmt";
import { State } from "./State";
import { TopBar } from "./TopBar";
import { NavRail, type NavRailItem } from "./NavRail";
import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";

export interface AppShellInternalProps {
  /** Brand slot rendered in the TopBar. */
  brand?: React.ReactNode;
  /** Identity initials for the TopBar identity button. */
  identity?: string;
  /** Initials chip rendered next to identity when no groupSwitcher supplied. */
  groupInitials?: string;
  /** Sidebar nav items (NavRail). */
  navItems?: NavRailItem[];
  /** Items pinned to the bottom of the NavRail (e.g. Settings, Help). */
  navFooterItems?: NavRailItem[];
  /** Accessible label for the navigation rail. */
  navAriaLabel?: string;
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

function useOnlineStatus(): boolean {
  const [online, setOnline] = React.useState<boolean>(
    typeof navigator === "undefined" ? true : navigator.onLine !== false,
  );
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

export function AppShellInternal({
  brand,
  identity,
  groupInitials,
  navItems,
  navFooterItems,
  navAriaLabel,
  activeId,
  onNavigate,
  crumbs,
  onCmdK,
  onIdentityClick,
  topBarExtras,
  activity,
  groupSwitcher,
  fmtSettings,
  children,
  className,
}: AppShellInternalProps): React.ReactElement {
  const online = useOnlineStatus();

  // Build NavRailItem with isActive bound to activeId.
  const items = (navItems ?? []).map((item) => ({
    ...item,
    isActive: activeId !== undefined ? item.id === activeId : item.isActive,
  }));

  // Compose TopBar extras: activity + groupSwitcher (or groupInitials chip)
  // + user-supplied extras.
  const groupChip =
    groupSwitcher ??
    (groupInitials ? (
      <span className="cc-shell__group" aria-label="Active group">
        {groupInitials}
      </span>
    ) : null);
  const extras = (
    <>
      {activity}
      {groupChip}
      {topBarExtras}
    </>
  );

  return (
    <FmtProvider {...(fmtSettings ?? {})}>
      <div className={["cc-shell", className].filter(Boolean).join(" ")}>
        {!online && <State variant="offline" density="banner" />}
        <TopBar
          brand={brand}
          identity={identity}
          onCmdK={onCmdK}
          onIdentityClick={onIdentityClick}
          extras={extras}
        />
        <div className="cc-shell__body">
          {items.length > 0 ? (
            <NavRail
              items={items}
              footerItems={navFooterItems}
              ariaLabel={navAriaLabel}
              renderItem={
                onNavigate
                  ? ({ item, isActive, className: itemClassName }) => (
                      <a
                        href={item.to}
                        className={itemClassName}
                        aria-current={isActive ? "page" : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(item.id);
                        }}
                      >
                        {item.icon ? (
                          <span className="cc-text-navrail__icon" aria-hidden>
                            {item.icon}
                          </span>
                        ) : null}
                        <span className="cc-text-navrail__label">
                          {item.label}
                        </span>
                      </a>
                    )
                  : undefined
              }
            />
          ) : null}
          <main id={SKIP_TARGET_ID} className="cc-shell__main">
            <a href={`#${SKIP_TARGET_ID}`} className="cc-skip-link">
              Skip to content
            </a>
            {crumbs && crumbs.length > 0 ? <Breadcrumbs items={crumbs} /> : null}
            {children}
          </main>
        </div>
      </div>
    </FmtProvider>
  );
}
