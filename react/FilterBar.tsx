/**
 * <FilterBar> — active filter chip bar with empty-state enforcement (G10).
 *
 * Contract:
 *  - When no chips are active, renders a .cc-filter-bar__empty span so the
 *    bar never appears blank. The empty-state copy defaults to "Showing all".
 *  - Selected chips use aria-pressed="true" which drives the token-based
 *    selected colour (no hard-coded colours); legible in both light + dark.
 *  - Each chip has an accessible remove button.
 */
import * as React from 'react';

export interface FilterChip {
  id: string;
  label: string;
}

export interface FilterBarProps {
  /** Available toggle-able filter options. */
  options: FilterChip[];
  /** Currently active (selected) filter ids. */
  activeIds: string[];
  /** Called when the user toggles a chip. */
  onToggle: (id: string) => void;
  /** Called when the user removes an active chip (default: same as onToggle). */
  onRemove?: (id: string) => void;
  /** Label shown when no filters are active. Default: "Showing all". */
  emptyLabel?: string;
  /** Accessible label for the entire bar. Default: "Filters". */
  ariaLabel?: string;
  className?: string;
}

export function FilterBar({
  options,
  activeIds,
  onToggle,
  onRemove,
  emptyLabel = 'Showing all',
  ariaLabel = 'Filters',
  className,
}: FilterBarProps) {
  const handleRemove = onRemove ?? onToggle;
  const activeSet = new Set(activeIds);
  const activeChips = options.filter((opt) => activeSet.has(opt.id));
  const isEmpty = activeChips.length === 0;

  const classes = ['cc-filter-bar'];
  if (className) classes.push(className);

  return (
    <div className={classes.join(' ')} role="group" aria-label={ariaLabel}>
      {/* Toggle buttons (all options) */}
      {options.map((opt) => {
        const isPressed = activeSet.has(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            className="cc-chip cc-chip--button"
            aria-pressed={isPressed}
            onClick={() => onToggle(opt.id)}
          >
            {opt.label}
          </button>
        );
      })}

      {/* Active chip pills with remove affordance — only when filters active */}
      {!isEmpty ? (
        <div className="cc-filter-bar__chips" role="list" aria-label="Active filters">
          {activeChips.map((chip) => (
            <span key={chip.id} className="cc-filter-bar__chip" role="listitem">
              {chip.label}
              <button
                type="button"
                className="cc-filter-bar__chip-remove"
                onClick={() => handleRemove(chip.id)}
                aria-label={`Remove ${chip.label}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {/* Empty state — always present when nothing is active (G10 invariant). */}
      {isEmpty ? (
        <span className="cc-filter-bar__empty">{emptyLabel}</span>
      ) : null}
    </div>
  );
}
