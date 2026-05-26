import * as React from 'react';

export interface AppliedFilter {
  id: string;
  label: string;
  group?: string;
}

export interface AppliedFiltersBarProps {
  filters: AppliedFilter[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
  ariaLabel?: string;
  clearAllLabel?: string;
  className?: string;
}

export function AppliedFiltersBar({
  filters,
  onRemove,
  onClearAll,
  ariaLabel = 'Applied filters',
  clearAllLabel = 'Clear all',
  className,
}: AppliedFiltersBarProps) {
  if (filters.length === 0) return null;

  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      className={['cc-applied-filters-bar', className].filter(Boolean).join(' ')}
    >
      {filters.map((f) => (
        <span
          key={f.id}
          className="cc-applied-filters-bar__chip"
          data-testid={`applied-filter-${f.id}`}
        >
          {f.group ? (
            <span className="cc-applied-filters-bar__group">{f.group}:</span>
          ) : null}
          <span className="cc-applied-filters-bar__label">{f.label}</span>
          <button
            type="button"
            className="cc-applied-filters-bar__remove"
            onClick={() => onRemove(f.id)}
            aria-label={`Remove ${f.group ? `${f.group}: ` : ''}${f.label}`}
          >
            ×
          </button>
        </span>
      ))}
      {onClearAll && filters.length > 1 ? (
        <button
          type="button"
          className="cc-applied-filters-bar__clear-all"
          onClick={onClearAll}
        >
          {clearAllLabel}
        </button>
      ) : null}
    </div>
  );
}
