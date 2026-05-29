/**
 * @deprecated Use `<State variant="…" density="…">` from `./State` instead.
 *
 * <EmptyState> — long-tail state placeholder.
 *
 * Renders a dashed container with title, optional description, optional
 * icon, and 0+ CTAs. The `variant` prop covers the long-tail family used
 * across every list/detail surface:
 *
 *  - 'empty'           : no records yet (default; matches legacy usage)
 *  - 'offline'         : network down / no connectivity
 *  - 'rate-limited'    : upstream throttled
 *  - 'permissioned-out': user lacks the role to see this surface
 *  - 'stale'           : data is older than the freshness window
 *  - 'partial'         : a subset of sources answered; surface is incomplete
 *  - 'error'           : unrecoverable load failure
 *  - 'loading'         : in-flight placeholder; pair with `<Skeleton/>` for rows
 */
import * as React from 'react';

export type EmptyStateVariant =
  | 'empty'
  | 'offline'
  | 'rate-limited'
  | 'permissioned-out'
  | 'stale'
  | 'partial'
  | 'error'
  | 'loading';

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  /** Visual emphasis. Defaults to 'secondary'. */
  tone?: 'primary' | 'secondary';
}

export interface EmptyStateProps {
  /** Primary message. Required; keep it short. */
  title: string;
  /** Supporting copy. Optional. */
  description?: string;
  /**
   * Optional CTA. Either a single action or an array of actions
   * (max 2 — primary + secondary).
   */
  action?: EmptyStateAction | EmptyStateAction[];
  /** Optional icon rendered above the title. */
  icon?: React.ReactNode;
  /** State variant — drives surface tone and default ARIA role. */
  variant?: EmptyStateVariant;
  className?: string;
}

const VARIANT_ROLE: Record<EmptyStateVariant, 'status' | 'alert' | 'note'> = {
  empty: 'status',
  loading: 'status',
  stale: 'status',
  partial: 'status',
  offline: 'alert',
  'rate-limited': 'alert',
  error: 'alert',
  'permissioned-out': 'note',
};

export function EmptyState({
  title,
  description,
  action,
  icon,
  variant = 'empty',
  className,
}: EmptyStateProps) {
  const actions = action ? (Array.isArray(action) ? action : [action]) : [];
  const role = VARIANT_ROLE[variant];

  return (
    <div
      className={['cc-empty-state', `cc-empty-state--${variant}`, className]
        .filter(Boolean)
        .join(' ')}
      role={role === 'note' ? undefined : role}
      data-variant={variant}
    >
      {icon && (
        <span className="cc-empty-state__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <p className="cc-empty-state__title">{title}</p>
      {description && <p className="cc-empty-state__description">{description}</p>}
      {actions.length > 0 && (
        <div className="cc-empty-state__actions">
          {actions.map((a, i) => {
            const tone = a.tone ?? (i === 0 ? 'primary' : 'secondary');
            const cls = `cc-empty-state__cta cc-empty-state__cta--${tone}`;
            return a.href ? (
              <a key={i} href={a.href} className={cls}>
                {a.label}
              </a>
            ) : (
              <button key={i} type="button" className={cls} onClick={a.onClick}>
                {a.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
