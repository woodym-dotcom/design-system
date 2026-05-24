/**
 * State — unified state-messaging primitive.
 *
 * Subsumes EmptyState, AwaitingState, StateBanner, OfflineBanner, and
 * StaleDataPill into a single component driven by two orthogonal axes:
 *
 *   variant  — WHAT state (empty, loading, error, offline, stale, …)
 *   density  — WHERE it appears (page hero, banner strip, inline chip)
 *
 * Variant defaults:
 *   empty      → "Nothing here yet"             (page, info tone)
 *   loading    → "Loading…"                     (page, info tone)
 *   error      → "Something went wrong"         (page/banner, error tone)
 *   offline    → "You're offline"               (banner, warning tone)
 *   stale      → "Data may be out of date"      (banner/chip, warning tone)
 *   not-found  → "We couldn't find that"        (page, info tone)
 *   forbidden  → "You don't have access"        (page, warning tone)
 *   degraded   → "Degraded service"             (banner, warning tone)
 */
import * as React from 'react';

export type StateVariant =
  | 'empty'
  | 'loading'
  | 'error'
  | 'offline'
  | 'stale'
  | 'not-found'
  | 'forbidden'
  | 'degraded'
  | 'fail-closed'
  | 'device-mismatch'
  | 'lockout';

export type StateDensity = 'page' | 'banner' | 'chip';

export interface StateProps {
  variant: StateVariant;
  density?: StateDensity;
  /** Override the variant's default title. */
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; href: string };
  /** §18 audit metadata when content is AI-generated. */
  source?: { model?: string; promptVersion?: string };
  className?: string;
}

// ── variant metadata ─────────────────────────────────────────────────────────

type Tone = 'info' | 'warning' | 'error' | 'neutral';

interface VariantMeta {
  title: string;
  description?: string;
  tone: Tone;
  /** ARIA role for banner density. Page uses role="region". Chip uses none. */
  bannerRole: 'alert' | 'status';
  /** Default icon character / emoji when no icon prop is supplied. */
  defaultIcon: string;
}

const VARIANT_META: Record<StateVariant, VariantMeta> = {
  empty: {
    title: 'Nothing here yet',
    description: 'Add items to see them here.',
    tone: 'neutral',
    bannerRole: 'status',
    defaultIcon: '📁',
  },
  loading: {
    title: 'Loading…',
    tone: 'info',
    bannerRole: 'status',
    defaultIcon: '⏳',
  },
  error: {
    title: 'Something went wrong',
    description: 'An error occurred. Please try again.',
    tone: 'error',
    bannerRole: 'alert',
    defaultIcon: '⚠',
  },
  offline: {
    title: "You're offline",
    description: 'Check your connection and try again.',
    tone: 'warning',
    bannerRole: 'alert',
    defaultIcon: '📡',
  },
  stale: {
    title: 'Data may be out of date',
    description: 'Refresh to get the latest information.',
    tone: 'warning',
    bannerRole: 'status',
    defaultIcon: '🕐',
  },
  'not-found': {
    title: "We couldn't find that",
    description: 'The item you are looking for does not exist or has been removed.',
    tone: 'neutral',
    bannerRole: 'status',
    defaultIcon: '🔍',
  },
  forbidden: {
    title: "You don't have access",
    description: 'Contact your administrator to request access.',
    tone: 'warning',
    bannerRole: 'alert',
    defaultIcon: '🔒',
  },
  degraded: {
    title: 'Degraded service',
    description: 'Some features may be unavailable.',
    tone: 'warning',
    bannerRole: 'alert',
    defaultIcon: '⚡',
  },
  'fail-closed': {
    title: 'Fail-closed — access denied by default',
    description: 'The system has entered a fail-closed state. Contact support.',
    tone: 'warning',
    bannerRole: 'alert',
    defaultIcon: '🛑',
  },
  'device-mismatch': {
    title: 'Device mismatch detected',
    description: 'The current device does not match the expected profile.',
    tone: 'warning',
    bannerRole: 'alert',
    defaultIcon: '📱',
  },
  lockout: {
    title: 'Account locked out',
    description: 'Too many failed attempts. Try again later or contact support.',
    tone: 'error',
    bannerRole: 'alert',
    defaultIcon: '🔒',
  },
};

// ── tone → CSS variable mapping (no hardcoded hex) ───────────────────────────

const TONE_VARS: Record<Tone, { bg: string; border: string; text: string }> = {
  info: {
    bg: 'var(--info-light)',
    border: 'var(--info-border)',
    text: 'var(--info-text)',
  },
  warning: {
    bg: 'var(--warning-light)',
    border: 'var(--warning-border)',
    text: 'var(--warning-text)',
  },
  error: {
    bg: 'var(--error-light)',
    border: 'var(--error-border)',
    text: 'var(--error-text)',
  },
  neutral: {
    bg: 'var(--surface-2)',
    border: 'var(--border-1)',
    text: 'var(--text-2)',
  },
};

// ── page density (hero block) ────────────────────────────────────────────────

function PageState({
  meta,
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  className,
}: {
  meta: VariantMeta;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  primaryAction?: StateProps['primaryAction'];
  secondaryAction?: StateProps['secondaryAction'];
  className?: string;
}): React.ReactElement {
  const vars = TONE_VARS[meta.tone];

  return (
    <div
      role="region"
      aria-label={title}
      data-state-density="page"
      className={['cc-state', 'cc-state--page', className].filter(Boolean).join(' ')}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-5, 1rem)',
        padding: 'var(--space-8, 2rem)',
        borderRadius: 'var(--radius-2, 8px)',
        background: vars.bg,
        border: `1px dashed ${vars.border}`,
        color: vars.text,
        textAlign: 'center',
      }}
    >
      <span
        className="cc-state__icon"
        aria-hidden="true"
        style={{ fontSize: '2rem', lineHeight: 1 }}
      >
        {icon ?? meta.defaultIcon}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2, 0.375rem)' }}>
        <p
          className="cc-state__title"
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: 'var(--text-lg, 1.125rem)',
            color: vars.text,
          }}
        >
          {title}
        </p>
        {description && (
          <p
            className="cc-state__description"
            style={{
              margin: 0,
              fontSize: 'var(--text-sm, 0.875rem)',
              color: 'var(--text-3)',
            }}
          >
            {description}
          </p>
        )}
      </div>
      {(primaryAction || secondaryAction) && (
        <div
          className="cc-state__actions"
          style={{ display: 'flex', gap: 'var(--space-3, 0.5rem)', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {primaryAction && (
            <button
              type="button"
              className="cc-state__action cc-state__action--primary"
              onClick={primaryAction.onClick}
              style={{
                padding: 'var(--space-2, 0.375rem) var(--space-4, 0.75rem)',
                borderRadius: 'var(--radius-1, 4px)',
                border: `1px solid ${vars.border}`,
                background: vars.border,
                color: vars.text,
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <a
              href={secondaryAction.href}
              className="cc-state__action cc-state__action--secondary"
              style={{
                padding: 'var(--space-2, 0.375rem) var(--space-4, 0.75rem)',
                borderRadius: 'var(--radius-1, 4px)',
                border: `1px solid ${vars.border}`,
                background: 'transparent',
                color: vars.text,
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {secondaryAction.label}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── banner density (full-width strip) ────────────────────────────────────────

function BannerState({
  variant,
  meta,
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  className,
}: {
  variant: StateVariant;
  meta: VariantMeta;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  primaryAction?: StateProps['primaryAction'];
  secondaryAction?: StateProps['secondaryAction'];
  className?: string;
}): React.ReactElement {
  const vars = TONE_VARS[meta.tone];
  const role = meta.bannerRole;

  return (
    <div
      role={role}
      data-state-density="banner"
      data-variant={variant}
      className={['cc-state', 'cc-state--banner', className].filter(Boolean).join(' ')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3, 0.5rem)',
        padding: 'var(--space-3, 0.5rem) var(--space-5, 1rem)',
        background: vars.bg,
        borderBottom: `1px solid ${vars.border}`,
        color: vars.text,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <span className="cc-state__icon" aria-hidden="true" style={{ flexShrink: 0 }}>
        {icon ?? meta.defaultIcon}
      </span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 'var(--space-2, 0.375rem)', flexWrap: 'wrap' }}>
        <strong className="cc-state__title" style={{ fontWeight: 600, fontSize: 'var(--text-sm, 0.875rem)' }}>
          {title}
        </strong>
        {description && (
          <span className="cc-state__description" style={{ fontSize: 'var(--text-sm, 0.875rem)', color: 'var(--text-3)' }}>
            {description}
          </span>
        )}
      </div>
      {(primaryAction || secondaryAction) && (
        <div style={{ display: 'flex', gap: 'var(--space-2, 0.375rem)', flexShrink: 0 }}>
          {primaryAction && (
            <button
              type="button"
              className="cc-state__action cc-state__action--primary"
              onClick={primaryAction.onClick}
              style={{
                padding: 'var(--space-1, 0.25rem) var(--space-3, 0.5rem)',
                borderRadius: 'var(--radius-1, 4px)',
                border: `1px solid ${vars.border}`,
                background: 'transparent',
                color: vars.text,
                cursor: 'pointer',
                fontSize: 'var(--text-sm, 0.875rem)',
                fontWeight: 500,
              }}
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <a
              href={secondaryAction.href}
              className="cc-state__action cc-state__action--secondary"
              style={{
                padding: 'var(--space-1, 0.25rem) var(--space-3, 0.5rem)',
                borderRadius: 'var(--radius-1, 4px)',
                color: vars.text,
                textDecoration: 'none',
                fontSize: 'var(--text-sm, 0.875rem)',
              }}
            >
              {secondaryAction.label}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── chip density (inline pill) ────────────────────────────────────────────────

function ChipState({
  variant,
  meta,
  title,
  icon,
  className,
}: {
  variant: StateVariant;
  meta: VariantMeta;
  title: string;
  icon?: React.ReactNode;
  className?: string;
}): React.ReactElement {
  const vars = TONE_VARS[meta.tone];

  return (
    <span
      data-state-density="chip"
      data-variant={variant}
      className={['cc-state', 'cc-state--chip', className].filter(Boolean).join(' ')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1, 0.25rem)',
        padding: '0 var(--space-2, 0.375rem)',
        height: '1.5rem',
        borderRadius: '999px',
        background: vars.bg,
        border: `1px solid ${vars.border}`,
        color: vars.text,
        fontSize: 'var(--text-xs, 0.75rem)',
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: '0.7em' }}>
        {icon ?? meta.defaultIcon}
      </span>
      {title}
    </span>
  );
}

// ── public component ──────────────────────────────────────────────────────────

export function State({
  variant,
  density = 'page',
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  className,
}: StateProps): React.ReactElement {
  const meta = VARIANT_META[variant];
  const resolvedTitle = title ?? meta.title;
  const resolvedDescription = description ?? meta.description;

  if (density === 'chip') {
    return (
      <ChipState
        variant={variant}
        meta={meta}
        title={resolvedTitle}
        icon={icon}
        className={className}
      />
    );
  }

  if (density === 'banner') {
    return (
      <BannerState
        variant={variant}
        meta={meta}
        title={resolvedTitle}
        description={resolvedDescription}
        icon={icon}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        className={className}
      />
    );
  }

  return (
    <PageState
      meta={meta}
      title={resolvedTitle}
      description={resolvedDescription}
      icon={icon}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}
