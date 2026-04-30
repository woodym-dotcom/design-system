/**
 * <NavRail> — text-label vertical navigation rail (G2 / NavRail extraction).
 *
 * Third nav primitive alongside cc-navrail (icon-only) and cc-sidebar (72px).
 * Extracted from cl-frontend/src/components/ModuleShell.tsx NavRail (lines 122–165).
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
 * Wave 2 will switch cl-frontend's import to this component.
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
}

export interface NavRailRenderItemContext {
  item: NavRailItem;
  isActive: boolean;
  className: string;
}

export interface NavRailProps {
  items: NavRailItem[];
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
  className?: string;
}

export function NavRail({
  items,
  currentPathname,
  renderItem,
  ariaLabel = 'Modules',
  className,
}: NavRailProps) {
  const navClasses = ['cc-text-navrail'];
  if (className) navClasses.push(className);

  return (
    <nav aria-label={ariaLabel} className={navClasses.join(' ')}>
      {items.map((item) => {
        const isActive =
          item.isActive !== undefined
            ? item.isActive
            : currentPathname !== undefined
              ? currentPathname === item.to || currentPathname.startsWith(`${item.to}/`)
              : false;

        const itemClass = [
          'cc-text-navrail__item',
          isActive ? 'is-active' : '',
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

        return (
          <a
            key={item.id}
            href={item.to}
            className={itemClass}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
