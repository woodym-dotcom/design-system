import * as React from 'react';

export interface BreadcrumbItem {
  /** Display label. */
  label: string;
  /** Optional href — when omitted, item renders as plain text (current page). */
  href?: string;
  /**
   * Optional onClick (overrides href navigation when both provided — useful
   * for router-aware navigation that needs to call `event.preventDefault()`).
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
  /** True for the last/current crumb. Auto-marked when omitted on the tail. */
  current?: boolean;
}

export interface BreadcrumbsProps {
  /** Path items, ordered root → leaf. */
  items: BreadcrumbItem[];
  /** Visual separator between crumbs. Default '/'. */
  separator?: React.ReactNode;
  /**
   * Collapse middle items to '…' when there are more than this many.
   * Default 4 (root … parent leaf).
   */
  collapseAfter?: number;
  /** Optional aria-label. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Breadcrumb trail. Renders an ordered list of crumbs; the last item is
 * marked `aria-current="page"`. Long trails collapse the middle to an
 * ellipsis with the collapsed crumbs preserved in the DOM as an
 * expanded menu (CSS-driven).
 */
export function Breadcrumbs({
  items,
  separator = '/',
  collapseAfter = 4,
  ariaLabel = 'Breadcrumb',
  className,
}: BreadcrumbsProps) {
  const normalised = items.map((it, i) => ({
    ...it,
    current: it.current ?? i === items.length - 1,
  }));

  const collapsed = collapseAfter > 0 && normalised.length > collapseAfter;
  const visibleItems = collapsed
    ? [normalised[0], { __collapsed: true, hidden: normalised.slice(1, -2) }, normalised[normalised.length - 2], normalised[normalised.length - 1]]
    : normalised;

  return (
    <nav aria-label={ariaLabel} className={['cc-breadcrumbs', className].filter(Boolean).join(' ')}>
      <ol className="cc-breadcrumbs__list">
        {visibleItems.map((item, i) => {
          const isLast = i === visibleItems.length - 1;
          if ('__collapsed' in item) {
            return (
              <li key="collapse" className="cc-breadcrumbs__item cc-breadcrumbs__item--collapse">
                <details className="cc-breadcrumbs__collapse">
                  <summary aria-label="Show hidden breadcrumbs">…</summary>
                  <ul className="cc-breadcrumbs__hidden">
                    {(item.hidden as BreadcrumbItem[]).map((h, j) => (
                      <li key={j}>
                        {h.href ? <a href={h.href} onClick={h.onClick}>{h.label}</a> : <span>{h.label}</span>}
                      </li>
                    ))}
                  </ul>
                </details>
                {!isLast && <span className="cc-breadcrumbs__sep" aria-hidden="true">{separator}</span>}
              </li>
            );
          }
          const crumb = item as BreadcrumbItem & { current: boolean };
          return (
            <li key={i} className="cc-breadcrumbs__item">
              {crumb.href && !crumb.current ? (
                <a
                  className="cc-breadcrumbs__link"
                  href={crumb.href}
                  onClick={crumb.onClick}
                >
                  {crumb.icon && <span className="cc-breadcrumbs__icon" aria-hidden="true">{crumb.icon}</span>}
                  {crumb.label}
                </a>
              ) : (
                <span
                  className="cc-breadcrumbs__current"
                  aria-current={crumb.current ? 'page' : undefined}
                >
                  {crumb.icon && <span className="cc-breadcrumbs__icon" aria-hidden="true">{crumb.icon}</span>}
                  {crumb.label}
                </span>
              )}
              {!isLast && <span className="cc-breadcrumbs__sep" aria-hidden="true">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
