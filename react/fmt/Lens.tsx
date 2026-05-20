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
  /**
   * When true, the lens additionally drives the `showRaw` FmtContext flag.
   * Switching the lens on enables raw-value rendering; switching it off
   * disables it. When a provider is mounted above, the change is propagated
   * via `setShowRaw`; otherwise the lens uses local state.
   */
  bindShowRaw?: boolean;
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
  bindShowRaw,
  ...overrides
}: LensProps) {
  const fmtCtx = useFmt();
  const [internalOn, setInternalOn] = React.useState(defaultOn);
  const isControlled = controlled !== undefined;
  const on = isControlled ? controlled : internalOn;

  const toggle = () => {
    const next = !on;
    if (!isControlled) setInternalOn(next);
    onChange?.(next);
    if (bindShowRaw) {
      fmtCtx.setShowRaw(next);
    }
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
        <LensProvider overrides={overrides}>{children}</LensProvider>
      ) : (
        children
      )}
    </div>
  );
}

/**
 * Internal wrapper that flips `useFmt().lensActive` to true and sets
 * `html[data-lens-active="true"]` for analytics / theming hooks.
 */
function LensProvider({
  overrides,
  children,
}: {
  overrides: Partial<FmtSettings>;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.lensActive = 'true';
    return () => {
      delete document.documentElement.dataset.lensActive;
    };
  }, []);
  return (
    <FmtProvider lensActive {...overrides}>
      {children}
    </FmtProvider>
  );
}
