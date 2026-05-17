import * as React from 'react';

export interface BulkBarAction {
  id: string;
  label: string;
  onClick: () => void;
  /** Visual tone. 'danger' is rendered in error palette. */
  tone?: 'default' | 'primary' | 'danger';
  /** Disable the action (e.g. selection invalid for it). */
  disabled?: boolean;
  /** Optional icon. */
  icon?: React.ReactNode;
}

export interface BulkBarProps {
  /** Number of items currently selected. Hidden when 0. */
  count: number;
  /** Called when the user clicks the clear-selection control. */
  onClear: () => void;
  /** Bulk actions. */
  actions: BulkBarAction[];
  /** Optional rendered above the actions (e.g. "Selected across 3 pages"). */
  meta?: React.ReactNode;
  /** Sticky position. Default 'bottom'. */
  position?: 'bottom' | 'top';
  className?: string;
}

/**
 * Sticky action bar that appears when a list has a non-zero selection.
 * Pair with `useMultiSelect`:
 *
 *   const sel = useMultiSelect({ items, getKey });
 *   ...
 *   <BulkBar
 *     count={sel.count}
 *     onClear={sel.clear}
 *     actions={[
 *       { id: 'archive', label: 'Archive', onClick: () => archive(sel.selectedItems) },
 *       { id: 'delete', label: 'Delete', tone: 'danger', onClick: () => del(sel.selectedItems) },
 *     ]}
 *   />
 */
export function BulkBar({
  count,
  onClear,
  actions,
  meta,
  position = 'bottom',
  className,
}: BulkBarProps) {
  if (count === 0) return null;
  return (
    <div
      className={['cc-bulkbar', `cc-bulkbar--${position}`, className]
        .filter(Boolean)
        .join(' ')}
      role="region"
      aria-label={`${count} item${count === 1 ? '' : 's'} selected`}
    >
      <div className="cc-bulkbar__summary">
        <span className="cc-bulkbar__count">{count} selected</span>
        {meta && <span className="cc-bulkbar__meta">{meta}</span>}
        <button
          type="button"
          className="cc-bulkbar__clear"
          onClick={onClear}
        >
          Clear
        </button>
      </div>
      <div className="cc-bulkbar__actions">
        {actions.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`cc-bulkbar__action cc-bulkbar__action--${a.tone ?? 'default'}`}
            onClick={a.onClick}
            disabled={a.disabled}
          >
            {a.icon && <span className="cc-bulkbar__action-icon" aria-hidden="true">{a.icon}</span>}
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
