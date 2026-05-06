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
 * Layout modes (added by RW lift):
 *  - "horizontal" (default): flat chip row — backward-compatible.
 *  - "sidebar": sticky 220px left rail; options rendered as grouped pill chips
 *    with "All X" first per group and count badges.
 *  - "responsive": "sidebar" at or above `collapsedAt` px, "horizontal" below.
 */
import * as React from 'react';

export interface FilterChip {
  id: string;
  label: string;
  /** Optional group label for sidebar/responsive layout grouping. */
  group?: string;
  /** Optional count badge shown in sidebar layout. */
  count?: number;
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
  /**
   * Visual layout mode.
   *  - "horizontal" (default): flat chip row — backward-compatible.
   *  - "sidebar": sticky 220px left rail with grouped pill chips.
   *  - "responsive": sidebar ≥ collapsedAt, horizontal below.
   */
  layout?: 'horizontal' | 'sidebar' | 'responsive';
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
  activeIds,
  onToggle,
  onRemove,
  emptyLabel,
  ariaLabel,
  className,
}: Omit<FilterBarProps, 'layout' | 'collapsedAt'>) {
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
  activeIds,
  onToggle,
  ariaLabel,
  className,
}: Omit<FilterBarProps, 'layout' | 'collapsedAt' | 'onRemove' | 'emptyLabel'>) {
  const activeSet = new Set(activeIds);
  const groups = groupOptions(options);

  const handleAllClick = (groupOptions: FilterChip[]) => {
    // Deactivate all chips in this group.
    for (const opt of groupOptions) {
      if (activeSet.has(opt.id)) onToggle(opt.id);
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
            {/* "All X" option first per group */}
            <button
              key={allId}
              type="button"
              className="cc-chip cc-chip--button cc-filter-bar__sidebar-chip"
              aria-pressed={allActive}
              onClick={() => handleAllClick(group.options)}
            >
              All {group.label || 'items'}
            </button>
            {group.options.map((opt) => {
              const isPressed = activeSet.has(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  className="cc-chip cc-chip--button cc-filter-bar__sidebar-chip"
                  aria-pressed={isPressed}
                  onClick={() => onToggle(opt.id)}
                >
                  {opt.label}
                  {opt.count !== undefined && opt.count > 0 && (
                    <span className="cc-filter-bar__count-badge" aria-label={`${opt.count} items`}>
                      {opt.count}
                    </span>
                  )}
                </button>
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
  activeIds,
  onToggle,
  onRemove,
  emptyLabel = 'Showing all',
  ariaLabel = 'Filters',
  className,
  layout = 'horizontal',
  collapsedAt = 768,
}: FilterBarProps) {
  const windowWidth = useWindowWidth();

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
        ariaLabel={ariaLabel}
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
      ariaLabel={ariaLabel}
      className={className}
    />
  );
}
