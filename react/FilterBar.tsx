/**
 * <FilterBar> — active filter chip bar with empty-state enforcement (G10).
 *
 * Contract:
 *  - When no chips are active, renders a .cc-filter-bar__empty span so the
 *    bar never appears blank. The empty-state copy defaults to "Showing all".
 *  - Selected chips use aria-pressed="true" which drives the token-based
 *    selected colour (no hard-coded colours); legible in both light + dark.
 *  - Each chip has an accessible remove button.
 *
 * Layout modes:
 *  - "horizontal" (default): flat chip row.
 *  - "sidebar": sticky 220px left rail; options rendered as grouped pill chips
 *    with "All X" first per group and count badges.
 *  - "responsive": "sidebar" at or above `collapsedAt` px, "horizontal" below.
 *  - "applied": read-only "applied filters" toolbar — renders active filters
 *    as removable chips with an optional "Clear all" affordance. Subsumes
 *    the legacy `AppliedFiltersBar` primitive.
 */
import * as React from 'react';
import { Tag } from './Tag';

export interface FilterChip {
  id: string;
  label: string;
  /** Optional group label for sidebar/responsive layout grouping or applied-mode prefix. */
  group?: string;
  /** Optional count badge shown in sidebar layout. */
  count?: number;
}

export interface FilterBarProps {
  /** Available toggle-able filter options. In `layout="applied"`, this list is the active filters. */
  options: FilterChip[];
  /** Currently active (selected) filter ids. Ignored in `layout="applied"`. */
  activeIds?: string[];
  /** Called when the user toggles a chip. Required outside of applied-mode. */
  onToggle?: (id: string) => void;
  /** Called when the user removes an active chip (default: same as onToggle). */
  onRemove?: (id: string) => void;
  /** applied-mode: called when the user clicks "Clear all" (renders only when > 1 filter). */
  onClearAll?: () => void;
  /** applied-mode: label for the clear-all button. Default: "Clear all". */
  clearAllLabel?: string;
  /** Label shown when no filters are active (non-applied modes). Default: "Showing all". */
  emptyLabel?: string;
  /** Accessible label for the entire bar. Default: "Filters". */
  ariaLabel?: string;
  className?: string;
  /**
   * Visual layout mode.
   *  - "horizontal" (default): flat chip row with toggle + active + empty-state.
   *  - "sidebar": sticky 220px left rail with grouped pill chips.
   *  - "responsive": sidebar ≥ collapsedAt, horizontal below.
   *  - "applied": read-only applied-filters toolbar (subsumes AppliedFiltersBar).
   */
  layout?: 'horizontal' | 'sidebar' | 'responsive' | 'applied';
  /**
   * Viewport breakpoint (px) below which "responsive" collapses to horizontal.
   * Default: 768.
   */
  collapsedAt?: number;
}

// ---------------------------------------------------------------------------
// Horizontal layout (original)
// ---------------------------------------------------------------------------

function HorizontalFilterBar({
  options,
  activeIds = [],
  onToggle,
  onRemove,
  emptyLabel,
  ariaLabel,
  className,
}: Omit<FilterBarProps, 'layout' | 'collapsedAt' | 'onClearAll' | 'clearAllLabel'>) {
  const handleRemove = onRemove ?? onToggle;
  const activeSet = new Set(activeIds);
  const activeChips = options.filter((opt) => activeSet.has(opt.id));
  const isEmpty = activeChips.length === 0;

  const classes = ['cc-filter-bar'];
  if (className) classes.push(className);

  return (
    <div className={classes.join(' ')} role="group" aria-label={ariaLabel}>
      {/* Toggle chips — Tag composition. `cc-chip--button` add-on class keeps
          the token-driven aria-pressed colour without re-implementing chrome. */}
      {options.map((opt) => {
        const isPressed = activeSet.has(opt.id);
        return (
          <Tag
            key={opt.id}
            variant="chip"
            className="cc-chip--button"
            tone={isPressed ? 'accent' : 'neutral'}
            onClick={onToggle ? () => onToggle(opt.id) : undefined}
            aria-pressed={isPressed}
            aria-label={opt.label}
          >
            {opt.label}
          </Tag>
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
                onClick={() => handleRemove?.(chip.id)}
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

// ---------------------------------------------------------------------------
// Applied-filters layout (subsumes AppliedFiltersBar)
// ---------------------------------------------------------------------------

function AppliedFilterBar({
  options,
  onRemove,
  onClearAll,
  clearAllLabel = 'Clear all',
  ariaLabel = 'Applied filters',
  className,
}: Pick<FilterBarProps, 'options' | 'onRemove' | 'onClearAll' | 'clearAllLabel' | 'ariaLabel' | 'className'>) {
  if (options.length === 0) return null;
  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      className={['cc-applied-filters-bar', className].filter(Boolean).join(' ')}
    >
      {options.map((f) => (
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
            onClick={() => onRemove?.(f.id)}
            aria-label={`Remove ${f.group ? `${f.group}: ` : ''}${f.label}`}
          >
            ×
          </button>
        </span>
      ))}
      {onClearAll && options.length > 1 ? (
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

// ---------------------------------------------------------------------------
// Sidebar layout
// ---------------------------------------------------------------------------

interface FilterGroup {
  label: string;
  options: FilterChip[];
}

function groupOptions(options: FilterChip[]): FilterGroup[] {
  const ungrouped: FilterChip[] = [];
  const map = new Map<string, FilterChip[]>();

  for (const opt of options) {
    if (!opt.group) {
      ungrouped.push(opt);
    } else {
      if (!map.has(opt.group)) map.set(opt.group, []);
      map.get(opt.group)!.push(opt);
    }
  }

  const groups: FilterGroup[] = [];
  if (ungrouped.length > 0) groups.push({ label: '', options: ungrouped });
  for (const [label, opts] of map) {
    groups.push({ label, options: opts });
  }
  return groups;
}

/** Special sentinel id representing "All" within a group. */
const ALL_ID_PREFIX = '__all__';

function SidebarFilterBar({
  options,
  activeIds = [],
  onToggle,
  ariaLabel,
  className,
}: Omit<FilterBarProps, 'layout' | 'collapsedAt' | 'onRemove' | 'emptyLabel' | 'onClearAll' | 'clearAllLabel'>) {
  const activeSet = new Set(activeIds);
  const groups = groupOptions(options);

  const handleAllClick = (groupOptions: FilterChip[]) => {
    // Deactivate all chips in this group.
    for (const opt of groupOptions) {
      if (activeSet.has(opt.id)) onToggle?.(opt.id);
    }
  };

  const classes = ['cc-filter-bar cc-filter-bar--sidebar'];
  if (className) classes.push(className);

  return (
    <nav className={classes.join(' ')} aria-label={ariaLabel}>
      {groups.map((group, gi) => {
        const groupActiveCount = group.options.filter((o) => activeSet.has(o.id)).length;
        const allActive = groupActiveCount === 0;
        const allId = `${ALL_ID_PREFIX}${gi}`;

        return (
          <div key={gi} className="cc-filter-bar__group">
            {group.label && (
              <p className="cc-filter-bar__group-label">{group.label}</p>
            )}
            {/* "All X" option first per group — Tag composition. */}
            <Tag
              key={allId}
              variant="chip"
              className="cc-chip--button cc-filter-bar__sidebar-chip"
              tone={allActive ? 'accent' : 'neutral'}
              onClick={() => handleAllClick(group.options)}
              aria-pressed={allActive}
            >
              All {group.label || 'items'}
            </Tag>
            {group.options.map((opt) => {
              const isPressed = activeSet.has(opt.id);
              return (
                <Tag
                  key={opt.id}
                  variant="chip"
                  className="cc-chip--button cc-filter-bar__sidebar-chip"
                  tone={isPressed ? 'accent' : 'neutral'}
                  onClick={onToggle ? () => onToggle(opt.id) : undefined}
                  aria-pressed={isPressed}
                  aria-label={opt.label}
                >
                  <>
                    {opt.label}
                    {opt.count !== undefined && opt.count > 0 && (
                      <span className="cc-filter-bar__count-badge" aria-label={`${opt.count} items`}>
                        {opt.count}
                      </span>
                    )}
                  </>
                </Tag>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Responsive wrapper
// ---------------------------------------------------------------------------

function useWindowWidth(): number {
  const [width, setWidth] = React.useState<number>(
    () => (typeof window !== 'undefined' ? window.innerWidth : 1024),
  );
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

export function FilterBar({
  options,
  activeIds = [],
  onToggle,
  onRemove,
  onClearAll,
  clearAllLabel = 'Clear all',
  emptyLabel = 'Showing all',
  ariaLabel,
  className,
  layout = 'horizontal',
  collapsedAt = 768,
}: FilterBarProps) {
  const windowWidth = useWindowWidth();

  if (layout === 'applied') {
    return (
      <AppliedFilterBar
        options={options}
        onRemove={onRemove}
        onClearAll={onClearAll}
        clearAllLabel={clearAllLabel}
        ariaLabel={ariaLabel ?? 'Applied filters'}
        className={className}
      />
    );
  }

  const resolvedAriaLabel = ariaLabel ?? 'Filters';

  const effectiveLayout =
    layout === 'responsive'
      ? windowWidth >= collapsedAt
        ? 'sidebar'
        : 'horizontal'
      : layout;

  if (effectiveLayout === 'sidebar') {
    return (
      <SidebarFilterBar
        options={options}
        activeIds={activeIds}
        onToggle={onToggle}
        ariaLabel={resolvedAriaLabel}
        className={className}
      />
    );
  }

  return (
    <HorizontalFilterBar
      options={options}
      activeIds={activeIds}
      onToggle={onToggle}
      onRemove={onRemove}
      emptyLabel={emptyLabel}
      ariaLabel={resolvedAriaLabel}
      className={className}
    />
  );
}
