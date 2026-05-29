/**
 * UserMenu -- user popover with role/email/sign-out.
 *
 * DS-MIG P1-13. This is the standalone export of the UserMenu that
 * already exists inside AppShell. Extracted here for consumers
 * that need the user menu outside of the full AppShell.
 *
 * For the standard case, use AppShell which includes UserMenu
 * automatically.
 */
import * as React from 'react';

export interface UserMenuUser {
  id: string;
  name: string;
  email?: string;
  /** Role label displayed below the name. */
  role?: string;
  /** Initials shown in the avatar trigger. Falls back to name initials. */
  initials?: string;
}

export interface UserMenuProps {
  user: UserMenuUser;
  onSignOut: () => void;
  /** Additional menu items rendered before Sign out. */
  extraItems?: Array<{
    id: string;
    label: string;
    onClick: () => void;
  }>;
  className?: string;
}

function initialsFromName(name: string): string {
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
export function UserMenu({
  user,
  onSignOut,
  extraItems,
  className,
}: UserMenuProps): React.ReactElement {
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
    <div
      ref={anchorRef}
      className={['cc-menu-anchor cc-user-menu', className].filter(Boolean).join(' ')}
    >
      <button
        type="button"
        className="cc-topbar__identity"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `cc-user-menu-${menuId}` : undefined}
        aria-label="Open account menu"
        onClick={() => setOpen((o) => !o)}
        style={{
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
        }}
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
            {user.role && <div style={{ fontSize: 'var(--text-xs, 0.75rem)', color: 'var(--text-3)' }}>{user.role}</div>}
            {user.email && <div style={{ fontSize: 'var(--text-xs, 0.75rem)', color: 'var(--text-3)' }}>{user.email}</div>}
          </div>
          {extraItems?.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className="cc-menu__item"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
            >
              {item.label}
            </button>
          ))}
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
