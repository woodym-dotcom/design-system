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

export interface AppSwitcherApp {
  key: string;
  label: string;
  url: string;
}

export interface AppSwitcherProps {
  apps: AppSwitcherApp[];
  currentAppKey: string;
  onSwitch: (key: string, url: string) => void;
  className?: string;
}

/**
 * AppSwitcher -- dropdown for switching between platform applications.
 * ARIA menu pattern with Escape-to-close and outside-click-to-close.
 */
export function AppSwitcher({
  apps,
  currentAppKey,
  onSwitch,
  className,
}: AppSwitcherProps): React.ReactElement {
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
    <div
      ref={anchorRef}
      className={['cc-menu-anchor cc-app-switcher', className].filter(Boolean).join(' ')}
    >
      <button
        type="button"
        className="cc-btn cc-btn--ghost cc-btn--sm"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `cc-app-switcher-${menuId}` : undefined}
        aria-label={`Switch app (current: ${label})`}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">{label}</span>
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
