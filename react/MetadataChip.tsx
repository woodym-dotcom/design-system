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

/**
 * Staleness state for the trigger icon dot and panel line.
 *  - 'fresh'   — green dot (default, no dot rendered for fresh to keep it quiet)
 *  - 'stale'   — yellow dot on the trigger icon; "Stale" line in the panel
 *  - 'missing' — grey dot on the trigger icon; "No data" line in the panel
 */
export type MetadataChipStaleness = 'fresh' | 'stale' | 'missing';

export interface MetadataChipProps {
  /** Freshness delta — e.g. { value: 3, unit: 'm' } renders "3m". */
  freshness?: MetadataChipFreshness;
  /** Privacy status. Rendered as a pill when present. */
  privacy?: 'private' | 'shared';
  /** If provided, renders an "Inspect" anchor pointing here. */
  inspectHref?: string;
  /**
   * Optional inline inspect content (React node). Rendered inside the panel
   * under an "Inspect" heading when expanded. Use instead of `inspectHref`
   * when the raw data should be shown inline rather than linked externally.
   */
  inspectContent?: React.ReactNode;
  /** Optional ISO date string for "Last updated: …" line. */
  lastUpdated?: string;
  /**
   * Data staleness. When 'stale' a yellow dot appears on the trigger and
   * the panel shows a "Stale" warning. When 'missing' the dot is grey and
   * the panel shows "No data". Fresh state (default) renders no dot.
   */
  staleness?: MetadataChipStaleness;
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

function stalenessLabel(s: MetadataChipStaleness): string {
  if (s === 'stale') return 'Stale';
  if (s === 'missing') return 'No data';
  return '';
}

function stalenessDotColor(s: MetadataChipStaleness): string {
  if (s === 'stale') return 'var(--status-warning, #eab308)';
  if (s === 'missing') return 'var(--text-3, #9ca3af)';
  return '';
}

export function MetadataChip({
  freshness,
  privacy,
  inspectHref,
  inspectContent,
  lastUpdated,
  staleness,
  align = 'left',
  className,
}: MetadataChipProps) {
  const [open, setOpen] = React.useState(false);
  const [inspectOpen, setInspectOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const showDot = staleness && staleness !== 'fresh';

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

  const hasContent = !!(freshness || privacy || inspectHref || inspectContent || lastUpdated || staleness);
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
        {showDot && (
          <span
            className="cc-metadata-chip__staleness-dot"
            aria-hidden="true"
            style={{ background: stalenessDotColor(staleness!) }}
          />
        )}
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
          {staleness && staleness !== 'fresh' && (
            <span className={`cc-metadata-chip__item cc-metadata-chip__item--${staleness}`}>
              <span className="cc-metadata-chip__label">Status</span>
              <span className={`cc-metadata-chip__badge cc-metadata-chip__badge--${staleness}`}>
                {stalenessLabel(staleness)}
              </span>
            </span>
          )}
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
          {inspectContent && (
            <span className="cc-metadata-chip__item cc-metadata-chip__item--inspect-inline">
              <button
                type="button"
                className="cc-metadata-chip__inspect"
                onClick={() => setInspectOpen((v) => !v)}
              >
                {inspectOpen ? 'Hide inspect' : 'Inspect'}
              </button>
              {inspectOpen && (
                <span className="cc-metadata-chip__inspect-content">{inspectContent}</span>
              )}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
