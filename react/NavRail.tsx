/**
 * @deprecated Internal as of DS-SIMPLIFY 05. Use `AppShell` from
 * `@ds/core/react` instead. NavRail is no longer publicly exported.
 *
 * <NavRail> — text-label vertical navigation rail (G2 / NavRail extraction).
 *
 * Third nav primitive alongside cc-navrail (icon-only) and cc-sidebar (72px).
 * Extracted from customer-lifecycle/frontend/src/components/ModuleShell.tsx NavRail (lines 122–165).
 *
 * G2 contract:
 *  (a) Selected state legible in both light + dark via design tokens
 *      (cc-text-navrail__item.is-active → accent-soft bg, accent-text fg).
 *  (b) Each item is independently routable / deep-linkable (href required).
 *  (c) Navigation never collapses on selection (nav always visible).
 *
 * Router-agnostic: renders <a> tags by default. Consumers using a router
 * (React Router, TanStack Router, Next.js) pass a `renderItem` render-prop
 * that receives the item and active state and returns their router <Link>.
 * Wave 2 will switch customer-lifecycle/frontend's import to this component.
 */
import * as React from 'react';

export interface NavRailItem {
  /** Unique stable key. */
  id: string;
  /** URL for the item — used as the <a> href and for the default active match. */
  to: string;
  /** Display label. */
  label: string;
  /**
   * Custom active-state predicate. When provided, takes precedence over the
   * default prefix-match against the current pathname. Consumers using a router
   * should pass their router's active detection here or via renderItem.
   */
  isActive?: boolean;
  /**
   * Optional icon node.
   *  - In `variant="compact"`, the icon replaces the single-letter initial.
   *  - In `variant="expanded"`, the icon is rendered adjacent to the label.
   */
  icon?: React.ReactNode;
  /**
   * When true, the item is rendered with disabled styling and is non-interactive.
   * The link is replaced with a span and aria-disabled is set.
   */
  disabled?: boolean;
}

export interface NavRailRenderItemContext {
  item: NavRailItem;
  isActive: boolean;
  className: string;
}

export interface NavRailProps {
  items: NavRailItem[];
  /**
   * Optional items pinned to the bottom of the rail (Settings, account, theme
   * toggle, etc.). Rendered in a separate `<div>` group with a divider above
   * and the same active-state styling as the main items. Deduplicated by id;
   * if a footer item shares an id with a main item, the footer entry wins.
   */
  footerItems?: NavRailItem[];
  /**
   * Current pathname used for the default active detection (prefix-match).
   * Pass `window.location.pathname` or your router's current path.
   * Ignored when an item supplies its own `isActive` boolean.
   */
  currentPathname?: string;
  /**
   * Optional render-prop for items. Use to swap the <a> for your router's
   * <Link> without coupling the DS to any router package.
   *
   * @example
   * renderItem={({ item, isActive, className }) => (
   *   <RouterLink to={item.to} className={className} aria-current={isActive ? 'page' : undefined}>
   *     {item.label}
   *   </RouterLink>
   * )}
   */
  renderItem?: (ctx: NavRailRenderItemContext) => React.ReactNode;
  /** Accessible label for the nav element. Default: "Modules". */
  ariaLabel?: string;
  /**
   * Rail layout density.
   *  - "expanded" (default): renders the text label inline; no tooltip.
   *  - "compact": renders the label as a `title` tooltip only — items show
   *    their icon/initial and the label appears on hover via the browser
   *    tooltip. Eliminates the static-label + hover-label duplication.
   */
  variant?: 'expanded' | 'compact';
  className?: string;
}

/**
 * Compute which item wins the active state via pathname matching.
 *
 * Multi-select fix: when multiple items prefix-match the current pathname
 * (e.g. /vendors and /vendors/risks both match /vendors/risks/acme) we take
 * the item whose `to` path is the longest (most-specific) match. This means
 * at most one item can win from pathname matching — multi-select eliminated.
 *
 * Items that supply their own `isActive` boolean bypass this logic entirely
 * and are handled individually (consumer controls their own active state).
 */
function resolveActiveId(
  items: NavRailItem[],
  currentPathname: string | undefined,
): string | null {
  if (currentPathname === undefined) return null;

  // Items with an explicit isActive override are consumer-controlled; skip here.
  const candidateItems = items.filter((item) => item.isActive === undefined);

  let bestId: string | null = null;
  let bestLength = -1;

  for (const item of candidateItems) {
    if (
      currentPathname === item.to ||
      currentPathname.startsWith(`${item.to}/`)
    ) {
      if (item.to.length > bestLength) {
        bestLength = item.to.length;
        bestId = item.id;
      }
    }
  }

  return bestId;
}

export function NavRail({
  items,
  footerItems,
  currentPathname,
  renderItem,
  ariaLabel = 'Modules',
  variant = 'expanded',
  className,
}: NavRailProps) {
  const navClasses = ['cc-text-navrail'];
  if (variant === 'compact') navClasses.push('cc-text-navrail--compact');
  if (className) navClasses.push(className);

  // Dedupe: footer items take precedence over main items with the same id.
  // This handles consumers that accidentally pass "Settings" in both groups —
  // only one entry renders, no double-Settings at the bottom of the rail.
  const footerIds = new Set((footerItems ?? []).map((f) => f.id));
  const mainItems = items.filter((item) => !footerIds.has(item.id));

  // Resolve at most one active item via pathname (multi-select bug fix).
  // Compute against the merged set so an active footer item wins where it
  // would otherwise match against a main-item prefix.
  const allItems = [...mainItems, ...(footerItems ?? [])];
  const pathnameActiveId = resolveActiveId(allItems, currentPathname);

  const renderOne = (item: NavRailItem) => {
    const isActive =
      item.isActive !== undefined
        ? item.isActive
        : item.id === pathnameActiveId;

    const itemClass = [
      'cc-text-navrail__item',
      isActive ? 'is-active' : '',
      item.disabled ? 'is-disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    if (renderItem) {
      return (
        <React.Fragment key={item.id}>
          {renderItem({ item, isActive, className: itemClass })}
        </React.Fragment>
      );
    }

    // Disabled items render as a non-interactive span.
    if (item.disabled) {
      return (
        <span
          key={item.id}
          className={itemClass}
          aria-disabled="true"
          title={item.label}
        >
          {item.icon ? (
            <span className="cc-text-navrail__icon" aria-hidden="true">
              {item.icon}
            </span>
          ) : null}
          <span className="cc-text-navrail__label">{item.label}</span>
        </span>
      );
    }

    // Compact mode shows the label as a native tooltip only — the visible
    // text is the first character/initial OR the supplied icon. This avoids
    // the "label + hover tooltip both show" duplication reported in NavRail
    // consumers.
    if (variant === 'compact') {
      return (
        <a
          key={item.id}
          href={item.to}
          className={itemClass}
          aria-current={isActive ? 'page' : undefined}
          aria-label={item.label}
          title={item.label}
        >
          {item.icon ? (
            <span className="cc-text-navrail__icon" aria-hidden="true">
              {item.icon}
            </span>
          ) : (
            <span aria-hidden="true">{item.label.slice(0, 1).toUpperCase()}</span>
          )}
        </a>
      );
    }

    return (
      <a
        key={item.id}
        href={item.to}
        className={itemClass}
        aria-current={isActive ? 'page' : undefined}
      >
        {item.icon ? (
          <span className="cc-text-navrail__icon" aria-hidden="true">
            {item.icon}
          </span>
        ) : null}
        <span className="cc-text-navrail__label">{item.label}</span>
      </a>
    );
  };

  return (
    <nav aria-label={ariaLabel} className={navClasses.join(' ')}>
      <div className="cc-text-navrail__group cc-text-navrail__group--main">
        {mainItems.map(renderOne)}
      </div>
      {footerItems && footerItems.length > 0 ? (
        <div className="cc-text-navrail__group cc-text-navrail__group--footer">
          {footerItems.map(renderOne)}
        </div>
      ) : null}
    </nav>
  );
}
