/**
 * MetaRow -- horizontal metadata display row (label-value pairs).
 *
 * DS-MIG P1-14. The missing layout primitive for displaying inline
 * metadata key-value pairs. Composes with Row and Text internally.
 *
 * Usage:
 *   <MetaRow
 *     items={[
 *       { label: 'Status', value: <Tag tone="success">Active</Tag> },
 *       { label: 'Created', value: '2024-01-15' },
 *       { label: 'Owner', value: 'Jane Doe' },
 *     ]}
 *   />
 *
 * Renders as a horizontal row of label-value pairs separated by a subtle
 * divider. Wraps on small screens.
 */
import * as React from 'react';

export interface MetaRowItem {
  /** Label text (key). */
  label: string;
  /** Value content -- can be text or a React node (e.g. Tag, StatusPill). */
  value: React.ReactNode;
  /** Optional: hide this item. */
  hidden?: boolean;
}

export type MetaRowSize = 'sm' | 'md';
export type MetaRowLayout = 'inline' | 'stacked';

export interface MetaRowProps {
  items: MetaRowItem[];
  /** Size variant. Default: 'md'. */
  size?: MetaRowSize;
  /**
   * Layout of each label-value pair.
   * - 'inline': label and value on the same line (default)
   * - 'stacked': label above value
   */
  layout?: MetaRowLayout;
  /** Show a separator between items. Default: true. */
  separator?: boolean;
  className?: string;
}

const SIZE_MAP: Record<MetaRowSize, { label: string; value: string; gap: string }> = {
  sm: {
    label: 'var(--text-xs, 0.75rem)',
    value: 'var(--text-sm, 0.875rem)',
    gap: 'var(--space-3, 0.5rem)',
  },
  md: {
    label: 'var(--text-sm, 0.875rem)',
    value: 'var(--text-base, 0.875rem)',
    gap: 'var(--space-5, 1rem)',
  },
};

/**
 * MetaRow -- renders a horizontal strip of label: value pairs.
 */
export function MetaRow({
  items,
  size = 'md',
  layout = 'inline',
  separator = true,
  className,
}: MetaRowProps): React.ReactElement {
  const sizeTokens = SIZE_MAP[size];
  const visibleItems = items.filter((item) => !item.hidden);

  return (
    <dl
      className={['cc-meta-row', className].filter(Boolean).join(' ')}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: layout === 'stacked' ? 'flex-start' : 'center',
        gap: sizeTokens.gap,
        margin: 0,
        padding: 0,
      }}
    >
      {visibleItems.map((item, i) => (
        <React.Fragment key={item.label}>
          {separator && i > 0 && (
            <span
              className="cc-meta-row__separator"
              aria-hidden="true"
              style={{
                width: 1,
                height: '1em',
                background: 'var(--border-1)',
                flexShrink: 0,
                alignSelf: 'center',
              }}
            />
          )}
          <div
            className="cc-meta-row__item"
            style={{
              display: 'flex',
              flexDirection: layout === 'stacked' ? 'column' : 'row',
              alignItems: layout === 'stacked' ? 'flex-start' : 'center',
              gap: layout === 'stacked' ? 'var(--space-1, 0.25rem)' : 'var(--space-2, 0.375rem)',
            }}
          >
            <dt
              className="cc-meta-row__label"
              style={{
                margin: 0,
                fontSize: sizeTokens.label,
                fontWeight: 500,
                color: 'var(--text-3)',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </dt>
            <dd
              className="cc-meta-row__value"
              style={{
                margin: 0,
                fontSize: sizeTokens.value,
                color: 'var(--text-1)',
              }}
            >
              {item.value}
            </dd>
          </div>
        </React.Fragment>
      ))}
    </dl>
  );
}
