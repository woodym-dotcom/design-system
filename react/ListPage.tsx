/**
 * ListPage — renders DIRECTLY inside a ModuleShell tab panel.
 * No surrounding card or box — content is flush with the panel (G7 literal).
 *
 * Composes <CreateMenu> and <FilterBar> from the DS.
 */
import * as React from 'react';
import { CreateMenu, type CreateMenuProps } from './CreateMenu';
import { FilterBar, type FilterChip } from './FilterBar';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ListPageProps {
  /** Page heading */
  heading: string;
  /** Optional subtitle */
  subtitle?: string;
  /**
   * CreateMenu configuration. Omit to hide the create button.
   */
  createMenu?: Pick<CreateMenuProps, 'items' | 'triggerLabel'>;
  /**
   * Filter chips. When provided, renders a FilterBar.
   */
  filterOptions?: FilterChip[];
  activeFilterIds?: string[];
  onFilterToggle?: (id: string) => void;
  onFilterRemove?: (id: string) => void;
  /**
   * Main list content — render a table, virtual list, etc.
   */
  children?: React.ReactNode;
  /**
   * Rendered when children is absent or the list is explicitly empty.
   */
  emptyState?: React.ReactNode;
  /**
   * Pagination controls rendered below the list.
   */
  pagination?: React.ReactNode;
  /**
   * Detail pane render-prop. Called with the selected item id (or null).
   */
  detailPane?: (selectedId: string | null) => React.ReactNode;
  /**
   * Currently selected item id — drives detailPane.
   */
  selectedId?: string | null;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ListPage({
  heading,
  subtitle,
  createMenu,
  filterOptions,
  activeFilterIds = [],
  onFilterToggle,
  onFilterRemove,
  children,
  emptyState,
  pagination,
  detailPane,
  selectedId = null,
  className,
}: ListPageProps) {
  const classes = ['cc-list-page'];
  if (className) classes.push(className);

  const hasContent = React.Children.count(children) > 0;

  return (
    <div className={classes.join(' ')}>
      <div className="cc-list-page__header">
        <div className="cc-list-page__heading-group">
          <h2 className="cc-list-page__heading">{heading}</h2>
          {subtitle ? <p className="cc-list-page__subtitle">{subtitle}</p> : null}
        </div>
        {createMenu ? (
          <CreateMenu
            items={createMenu.items}
            triggerLabel={createMenu.triggerLabel}
          />
        ) : null}
      </div>

      {filterOptions && filterOptions.length > 0 ? (
        <div className="cc-list-page__filters">
          <FilterBar
            options={filterOptions}
            activeIds={activeFilterIds}
            onToggle={onFilterToggle ?? (() => {})}
            onRemove={onFilterRemove}
          />
        </div>
      ) : null}

      <div className="cc-list-page__body">
        {hasContent ? children : (emptyState ?? null)}
      </div>

      {pagination ? (
        <div className="cc-list-page__pagination">{pagination}</div>
      ) : null}

      {detailPane ? (
        <aside className="cc-list-page__detail-pane">
          {detailPane(selectedId)}
        </aside>
      ) : null}
    </div>
  );
}
