/**
 * <SectionHeader> — consistent h2 section header with optional description,
 * trailing metadata, and action slot.
 *
 * Enforces visual hierarchy: h2 title (t-h2) > description (t-body).
 * Replaces ad-hoc flex+heading patterns that each hardcode their own
 * type scale and spacing.
 */
import * as React from 'react';

export interface SectionHeaderProps {
  /** Section heading text. Rendered as h2. */
  title: string;
  /** Optional supporting copy rendered below the title. */
  description?: string;
  /**
   * Optional ReactNode rendered INSIDE the heading element next to the title
   * text (e.g. a small chip or pill that belongs visually to the title).
   * Stays inside the heading tag so screen readers treat it as part of the
   * heading.
   */
  titleExtras?: React.ReactNode;
  /**
   * Trailing metadata slot. Typically a <MetadataChip> but accepts any node.
   * Positioned at the right end of the heading row.
   */
  metadata?: React.ReactNode;
  /**
   * Actions slot — buttons, toggles, links. Positioned right of metadata.
   */
  actions?: React.ReactNode;
  className?: string;
  /** Override the heading level. Defaults to 'h2'. */
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionHeader({
  title,
  description,
  titleExtras,
  metadata,
  actions,
  className,
  as: Heading = 'h2',
}: SectionHeaderProps) {
  const headingClass = Heading === 'h1' ? 't-h1' : Heading === 'h3' ? 't-h3' : 't-h2';

  return (
    <header className={['cc-section-header', className].filter(Boolean).join(' ')}>
      <div className="cc-section-header__row">
        <Heading className={`cc-section-header__title ${headingClass}`}>
          {title}
          {titleExtras ? (
            <span className="cc-section-header__title-extras">{titleExtras}</span>
          ) : null}
        </Heading>
        {(metadata || actions) && (
          <div className="cc-section-header__trailing">
            {metadata}
            {actions}
          </div>
        )}
      </div>
      {description && (
        <p className="cc-section-header__description t-body">{description}</p>
      )}
    </header>
  );
}
