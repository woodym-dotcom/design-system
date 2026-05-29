/**
 * Row — horizontal flex container with token-driven gap, alignment, and wrap.
 *
 * Gap values map to --space-* tokens (4pt grid).
 *
 * Compact list-row mode: when `density="compact"` is supplied, Row renders as
 * a dense list-item primitive (`cc-compact-row`) with title/subtitle/trailing
 * slots. This subsumes the older `CompactListRow` component. Pass `href` to
 * render an anchor; pass `onClick` (without `href`) to render a button.
 */
import * as React from 'react';
import type { StackGap } from './Stack';

export type RowAlign = 'start' | 'center' | 'end' | 'baseline';
export type RowJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type RowDensity = 'default' | 'compact';

export interface RowProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onClick'> {
  gap?: StackGap;
  align?: RowAlign;
  justify?: RowJustify;
  wrap?: boolean;
  as?: React.ElementType;
  /**
   * Density variant.
   *  - "default" (default): generic horizontal flex container.
   *  - "compact": dense list-item row (title/subtitle/trailing). Subsumes the
   *    legacy `CompactListRow` primitive.
   */
  density?: RowDensity;
  /** compact mode: primary content (title text or node). */
  title?: React.ReactNode;
  /** compact mode: secondary content rendered below the title. */
  subtitle?: React.ReactNode;
  /** compact mode: right-aligned trailing slot. */
  trailing?: React.ReactNode;
  /** compact mode: when provided, the row renders as an <a>. */
  href?: string;
  /** compact mode: when provided (without href), the row renders as a <button>. */
  onClick?: () => void;
  /** compact mode: marks the row as selected/active (applies is-selected). */
  isSelected?: boolean;
  children?: React.ReactNode;
}

const GAP_MAP: Record<StackGap, string> = {
  none: '0',
  xs: 'var(--space-2)',
  sm: 'var(--space-3)',
  md: 'var(--space-5)',
  lg: 'var(--space-6)',
  xl: 'var(--space-7)',
};

const ALIGN_MAP: Record<RowAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  baseline: 'baseline',
};

const JUSTIFY_MAP: Record<RowJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

export function Row({
  gap = 'md',
  align = 'center',
  justify = 'start',
  wrap = false,
  as: Tag = 'div',
  density = 'default',
  title,
  subtitle,
  trailing,
  href,
  onClick,
  isSelected,
  className,
  style,
  children,
  ...rest
}: RowProps): React.ReactElement {
  // ── Compact list-row mode ────────────────────────────────────────────────
  if (density === 'compact') {
    const classes = ['cc-compact-row', isSelected ? 'is-selected' : '', className]
      .filter(Boolean)
      .join(' ');

    const inner = (
      <>
        <span className="cc-compact-row__main">
          <span className="cc-compact-row__title">{title}</span>
          {subtitle ? <span className="cc-compact-row__subtitle">{subtitle}</span> : null}
        </span>
        {trailing ? <span className="cc-compact-row__trailing">{trailing}</span> : null}
      </>
    );

    if (href) {
      return (
        <a href={href} className={classes}>
          {inner}
        </a>
      );
    }
    if (onClick) {
      return (
        <button type="button" className={classes} onClick={onClick}>
          {inner}
        </button>
      );
    }
    return <div className={classes}>{inner}</div>;
  }

  // ── Default flex-row mode ────────────────────────────────────────────────
  const rootStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: GAP_MAP[gap],
    alignItems: ALIGN_MAP[align],
    justifyContent: JUSTIFY_MAP[justify],
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...style,
  };

  return (
    <Tag className={className} style={rootStyle} {...rest}>
      {children}
    </Tag>
  );
}
