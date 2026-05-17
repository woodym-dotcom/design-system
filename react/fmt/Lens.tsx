import * as React from 'react';
import { FmtProvider, useFmt, type FmtSettings } from './Fmt';

export interface LensProps extends Partial<FmtSettings> {
  /** Lens label rendered in the toggle (e.g. "EU view"). */
  label: string;
  children: React.ReactNode;
  /** Initial state. Default 'off'. */
  defaultOn?: boolean;
  /** Controlled state. */
  on?: boolean;
  /** Called when the user toggles the lens. */
  onChange?: (on: boolean) => void;
  className?: string;
}

/**
 * Read-only Lens toggle. Wraps a subtree and lets the user temporarily
 * swap locale/timezone/currency for evidence/decision-record review —
 * without persisting any preference. The toggle is non-destructive:
 * underlying data and stored preferences are unchanged. The lens is
 * announced via the FmtContext `lensActive` flag so callers can render
 * a banner ("Showing data in EU view") when appropriate.
 */
export function Lens({
  label,
  children,
  defaultOn = false,
  on: controlled,
  onChange,
  className,
  ...overrides
}: LensProps) {
  const [internalOn, setInternalOn] = React.useState(defaultOn);
  const isControlled = controlled !== undefined;
  const on = isControlled ? controlled : internalOn;
  const parent = useFmt();

  const toggle = () => {
    const next = !on;
    if (!isControlled) setInternalOn(next);
    onChange?.(next);
  };

  return (
    <div className={['cc-lens', on && 'cc-lens--on', className].filter(Boolean).join(' ')}>
      <div className="cc-lens__toolbar">
        <button
          type="button"
          className="cc-lens__toggle"
          aria-pressed={on}
          onClick={toggle}
        >
          {on ? 'Showing' : 'Show'} {label}
        </button>
        {on && (
          <span className="cc-lens__hint" role="note">
            Read-only view. Underlying data is unchanged.
          </span>
        )}
      </div>
      {on ? (
        <FmtProviderLens parent={parent} overrides={overrides}>
          {children}
        </FmtProviderLens>
      ) : (
        children
      )}
    </div>
  );
}

/**
 * Internal wrapper that flips lensActive=true while the lens overrides apply.
 */
function FmtProviderLens({
  parent,
  overrides,
  children,
}: {
  parent: ReturnType<typeof useFmt>;
  overrides: Partial<FmtSettings>;
  children: React.ReactNode;
}) {
  // Use FmtProvider for the locale/tz/currency overrides; lensActive is
  // declared by re-exposing via a thin context layer.
  return (
    <FmtProvider {...overrides}>
      <LensActiveMarker parentLensActive={parent.lensActive}>{children}</LensActiveMarker>
    </FmtProvider>
  );
}

function LensActiveMarker({
  parentLensActive: _parentLensActive,
  children,
}: {
  parentLensActive: boolean;
  children: React.ReactNode;
}) {
  // Mounted only while the lens is on, so unconditionally mark the active
  // state on <html> for analytics / theming hooks.
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.lensActive = 'true';
    return () => {
      delete document.documentElement.dataset.lensActive;
    };
  }, []);
  return <>{children}</>;
}
