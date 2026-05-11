/**
 * <EntityCard> — record-card primitive used for shareholders, officers,
 * branches, beneficial owners, and other entity lists inside detail panes.
 *
 * Density variants:
 *  - "standard" (default): padded card with primary + secondary metadata.
 *  - "compact": tighter row, secondary metadata behind a disclosure chevron.
 *               Use when the parent list might grow large (30-100 entries).
 *
 * For very large lists, wrap a parent <EntityCardList virtualised count={n}>
 * which lazy-renders rows above a configurable threshold (default 20). The
 * virtualisation is intentionally simple — a windowed slice on scroll, no
 * variable row heights — because compact rows are uniform.
 */
import * as React from 'react';

export type EntityCardDensity = 'standard' | 'compact';

export interface EntityCardProps {
  /** Primary label, e.g. shareholder name. */
  title: React.ReactNode;
  /** Single-line subtitle rendered next to the title. */
  subtitle?: React.ReactNode;
  /** Optional leading element — avatar, initial, icon. */
  leading?: React.ReactNode;
  /** Optional trailing element — badge, action button. */
  trailing?: React.ReactNode;
  /** Secondary metadata. In compact density this hides behind a chevron. */
  metadata?: React.ReactNode;
  /** Clickable card — renders as a <button>. */
  onClick?: () => void;
  density?: EntityCardDensity;
  className?: string;
}

export function EntityCard({
  title,
  subtitle,
  leading,
  trailing,
  metadata,
  onClick,
  density = 'standard',
  className,
}: EntityCardProps) {
  const [open, setOpen] = React.useState(false);
  const hasMetadata = metadata !== undefined && metadata !== null;
  const isCompact = density === 'compact';
  const bodyId = React.useId();

  const classes = [
    'cc-entity-card',
    isCompact ? 'cc-entity-card--compact' : 'cc-entity-card--standard',
  ];
  if (onClick) classes.push('cc-entity-card--clickable');
  if (open) classes.push('is-open');
  if (className) classes.push(className);

  const headerContent = (
    <>
      {leading ? (
        <span className="cc-entity-card__leading" aria-hidden="true">
          {leading}
        </span>
      ) : null}
      <span className="cc-entity-card__primary">
        <span className="cc-entity-card__title">{title}</span>
        {subtitle ? (
          <span className="cc-entity-card__subtitle">{subtitle}</span>
        ) : null}
      </span>
      {trailing ? (
        <span className="cc-entity-card__trailing">{trailing}</span>
      ) : null}
      {isCompact && hasMetadata ? (
        <button
          type="button"
          className="cc-entity-card__disclosure"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={open ? 'Hide details' : 'Show details'}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
        >
          {open ? '▾' : '▸'}
        </button>
      ) : null}
    </>
  );

  return (
    <article className={classes.join(' ')}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="cc-entity-card__header cc-entity-card__header--clickable"
        >
          {headerContent}
        </button>
      ) : (
        <div className="cc-entity-card__header">{headerContent}</div>
      )}
      {hasMetadata && (!isCompact || open) ? (
        <div id={bodyId} className="cc-entity-card__metadata">
          {metadata}
        </div>
      ) : null}
    </article>
  );
}

// ── EntityCardList ───────────────────────────────────────────────────────────

export interface EntityCardListProps {
  /**
   * Children should be <EntityCard> nodes. Pass an array, not a fragment, so
   * the list can count and (optionally) virtualise them.
   */
  children: React.ReactElement[];
  /**
   * When set, the list windowed-renders children above this count. Defaults
   * to 20. Pass `0` to disable.
   */
  virtualiseAbove?: number;
  /** Approximate row height in px — used for the virtualisation window. */
  rowHeight?: number;
  /** Max visible rows when virtualised. Default 50. */
  windowSize?: number;
  className?: string;
}

const DEFAULT_VIRTUALISE_ABOVE = 20;
const DEFAULT_ROW_HEIGHT = 56;
const DEFAULT_WINDOW_SIZE = 50;

export function EntityCardList({
  children,
  virtualiseAbove = DEFAULT_VIRTUALISE_ABOVE,
  rowHeight = DEFAULT_ROW_HEIGHT,
  windowSize = DEFAULT_WINDOW_SIZE,
  className,
}: EntityCardListProps) {
  const items = React.Children.toArray(children) as React.ReactElement[];
  const shouldVirtualise =
    virtualiseAbove > 0 && items.length > virtualiseAbove;
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [startIndex, setStartIndex] = React.useState(0);

  React.useEffect(() => {
    if (!shouldVirtualise) return;
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.max(0, Math.floor(el.scrollTop / rowHeight));
      setStartIndex(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [shouldVirtualise, rowHeight]);

  const classes = ['cc-entity-card-list'];
  if (className) classes.push(className);

  if (!shouldVirtualise) {
    return <div className={classes.join(' ')}>{items}</div>;
  }

  const endIndex = Math.min(items.length, startIndex + windowSize);
  const before = startIndex * rowHeight;
  const after = (items.length - endIndex) * rowHeight;

  return (
    <div
      ref={containerRef}
      className={`${classes.join(' ')} cc-entity-card-list--virtualised`}
      style={{ maxHeight: rowHeight * Math.min(windowSize, items.length) }}
    >
      {before > 0 ? (
        <div aria-hidden="true" style={{ height: before }} />
      ) : null}
      {items.slice(startIndex, endIndex)}
      {after > 0 ? (
        <div aria-hidden="true" style={{ height: after }} />
      ) : null}
    </div>
  );
}
