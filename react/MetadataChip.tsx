/**
 * <MetadataChip> — compressed housekeeping metadata cluster.
 *
 * Collapses metadata noise (freshness, privacy badge, inspect link) into a
 * single "ⓘ" icon trigger. Tap/hover reveals the full cluster in an inline
 * expanded row (no position:fixed, stays in flow — viewport-safe).
 *
 * Accessibility:
 *  - The trigger button has aria-label="Show metadata" and aria-expanded.
 *  - The popover panel has role="region" with an accessible label.
 *  - Keyboard: Enter/Space toggles, Escape closes.
 *  - Touch target: the trigger is ≥ 44×44px via padding.
 */
import * as React from 'react';

export interface MetadataChipFreshness {
  value: number;
  unit: 'm' | 'h' | 'd';
}

export interface MetadataChipProps {
  /** Freshness delta — e.g. { value: 3, unit: 'm' } renders "3m". */
  freshness?: MetadataChipFreshness;
  /** Privacy status. Rendered as a pill when present. */
  privacy?: 'private' | 'shared';
  /** If provided, renders an "Inspect" anchor pointing here. */
  inspectHref?: string;
  /** Optional ISO date string for "Last updated: …" line. */
  lastUpdated?: string;
  /** Align the expanded panel. Default is 'left'. */
  align?: 'left' | 'right';
  className?: string;
}

function freshnessLabel(f: MetadataChipFreshness): string {
  return `${f.value}${f.unit}`;
}

function formatLastUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function MetadataChip({
  freshness,
  privacy,
  inspectHref,
  lastUpdated,
  align = 'left',
  className,
}: MetadataChipProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const hasContent = !!(freshness || privacy || inspectHref || lastUpdated);
  const panelId = React.useId();

  return (
    <span className={['cc-metadata-chip', className].filter(Boolean).join(' ')}>
      <button
        ref={triggerRef}
        type="button"
        className="cc-metadata-chip__trigger"
        aria-label={open ? 'Hide metadata' : 'Show metadata'}
        aria-expanded={open}
        aria-controls={hasContent ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true" className="cc-metadata-chip__icon">ⓘ</span>
      </button>

      {open && hasContent && (
        <span
          id={panelId}
          role="region"
          aria-label="Item metadata"
          className={[
            'cc-metadata-chip__panel',
            align === 'right' ? 'cc-metadata-chip__panel--right' : '',
          ].filter(Boolean).join(' ')}
        >
          {freshness && (
            <span className="cc-metadata-chip__item">
              <span className="cc-metadata-chip__label">Freshness</span>
              <span className="cc-metadata-chip__value">{freshnessLabel(freshness)}</span>
            </span>
          )}
          {privacy && (
            <span className="cc-metadata-chip__item">
              <span className="cc-metadata-chip__label">Privacy</span>
              <span className={`cc-metadata-chip__badge cc-metadata-chip__badge--${privacy}`}>
                {privacy}
              </span>
            </span>
          )}
          {lastUpdated && (
            <span className="cc-metadata-chip__item">
              <span className="cc-metadata-chip__label">Updated</span>
              <span className="cc-metadata-chip__value">{formatLastUpdated(lastUpdated)}</span>
            </span>
          )}
          {inspectHref && (
            <span className="cc-metadata-chip__item">
              <a
                href={inspectHref}
                className="cc-metadata-chip__inspect"
                target="_blank"
                rel="noopener noreferrer"
              >
                Inspect ↗
              </a>
            </span>
          )}
        </span>
      )}
    </span>
  );
}
