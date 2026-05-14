/**
 * <CompactListRow> — single-row list pattern.
 *
 * Handles Tasks, Research items, audit log entries, and similar dense
 * vertical lists. Key properties:
 *
 *  - Touch target ≥ 44×44px on mobile (WCAG 2.5.5 / iOS HIG). The component
 *    achieves this by enforcing min-height: 44px and appropriate padding.
 *  - Hover and focus-visible states via token-driven CSS.
 *  - When `href` is provided the whole row is an anchor.
 *  - When `onClick` is provided (without href) the row is a button.
 *  - When neither is provided the row is a <div> (static / read-only list).
 *  - `trailing` slot renders flush-right; accepts StatusPill, MetadataChip,
 *    badges, or any ReactNode.
 */
import * as React from 'react';

export interface CompactListRowProps {
  /** Primary content — title text or any node. */
  title: React.ReactNode;
  /** Secondary supporting text rendered below the title. */
  subtitle?: React.ReactNode;
  /**
   * Trailing slot — right-aligned. Use StatusPill, MetadataChip, badge chips,
   * or plain text.
   */
  trailing?: React.ReactNode;
  /** If provided, the row renders as an <a> tag. */
  href?: string;
  /** If provided (and href is absent), the row renders as a <button>. */
  onClick?: () => void;
  /** Marks the row as selected/active. */
  isSelected?: boolean;
  className?: string;
}

export function CompactListRow({
  title,
  subtitle,
  trailing,
  href,
  onClick,
  isSelected,
  className,
}: CompactListRowProps) {
  const classes = [
    'cc-compact-row',
    isSelected ? 'is-selected' : '',
    className,
  ].filter(Boolean).join(' ');

  const inner = (
    <>
      <span className="cc-compact-row__main">
        <span className="cc-compact-row__title">{title}</span>
        {subtitle && <span className="cc-compact-row__subtitle">{subtitle}</span>}
      </span>
      {trailing && (
        <span className="cc-compact-row__trailing">{trailing}</span>
      )}
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

  return (
    <div className={classes}>
      {inner}
    </div>
  );
}
