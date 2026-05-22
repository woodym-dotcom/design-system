/**
 * @deprecated Use `<ModuleTemplate variant="home">` from `./ModuleTemplate`
 * (DS-SIMPLIFY 04). Will be removed in v1.0 (SIMPLIFY 14).
 */
import * as React from 'react';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export interface HomepageCard {
  id: string;
  /** Visible card title. */
  title: string;
  /** Optional supporting line. */
  subtitle?: string;
  /**
   * Roles this card is visible to. Card is hidden when the viewer's
   * role isn't in the set. Omit to make the card visible to everyone.
   */
  roles?: ReadonlyArray<string>;
  /** Optional icon. */
  icon?: React.ReactNode;
  /** Priority — higher numbers sort first. Defaults to 0. */
  priority?: number;
  /**
   * Render the card body. Receives `loading` so the renderer can decide
   * to show a skeleton, or rely on the built-in `loadingSlot`.
   */
  render: (ctx: { loading: boolean }) => React.ReactNode;
  /** Skeleton shape rendered when `loading` is true and no body fallback. */
  loadingSlot?: React.ReactNode;
  /** Optional href — wraps the card in an anchor. */
  href?: string;
  /** Optional click handler. */
  onClick?: () => void;
}

export interface HomepageCardsProps {
  /** Viewer's role(s). Cards with `roles` are filtered by this set. */
  viewerRoles: ReadonlyArray<string>;
  /** Cards to render — order is by `priority` desc, then array order. */
  cards: ReadonlyArray<HomepageCard>;
  /** Loading flag — when true, all cards render skeletons. */
  loading?: boolean;
  /** Heading rendered above the grid. */
  heading?: React.ReactNode;
  /** Optional subtitle under the heading. */
  subtitle?: React.ReactNode;
  /** Empty-state copy when no cards are visible after filtering. */
  emptyState?: {
    title: string;
    description?: string;
    action?: { label: string; onClick?: () => void; href?: string };
  };
  /** CSS column count (responsive — adjust by viewport in host CSS). */
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * Role-aware homepage cards. Renders a grid of cards, filtered to those
 * the viewer can see based on `viewerRoles`. Composes:
 *   - `<Skeleton>` for per-card loading state
 *   - `<EmptyState>` when no cards remain after role filtering
 *   - density modes via the shared --density-* tokens
 *
 * The DS doesn't know about your role model — pass a flat list of role
 * strings and a `roles` array per card; matching is set-intersection.
 */
export function HomepageCards({
  viewerRoles,
  cards,
  loading = false,
  heading,
  subtitle,
  emptyState,
  columns = 3,
  className,
}: HomepageCardsProps) {
  const visible = React.useMemo(() => {
    const viewer = new Set(viewerRoles);
    return cards
      .filter((c) => !c.roles || c.roles.length === 0 || c.roles.some((r) => viewer.has(r)))
      .slice()
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }, [cards, viewerRoles]);

  return (
    <section
      className={['cc-homepage-cards', `cc-homepage-cards--cols-${columns}`, className]
        .filter(Boolean)
        .join(' ')}
    >
      {(heading || subtitle) && (
        <header className="cc-homepage-cards__header">
          {heading && <h2 className="cc-homepage-cards__heading">{heading}</h2>}
          {subtitle && <p className="cc-homepage-cards__subtitle">{subtitle}</p>}
        </header>
      )}

      {visible.length === 0 && !loading ? (
        emptyState ? (
          <EmptyState
            title={emptyState.title}
            description={emptyState.description}
            action={emptyState.action}
            variant="permissioned-out"
          />
        ) : null
      ) : (
        <ul className="cc-homepage-cards__grid" role="list">
          {visible.map((c) => {
            const inner = loading
              ? (c.loadingSlot ?? (
                  <>
                    <Skeleton shape="text" lines={2} />
                    <Skeleton shape="rect" height={32} width={120} />
                  </>
                ))
              : c.render({ loading: false });

            const body = (
              <>
                <div className="cc-homepage-cards__card-head">
                  {c.icon && (
                    <span aria-hidden="true" className="cc-homepage-cards__icon">{c.icon}</span>
                  )}
                  <div className="cc-homepage-cards__card-title-wrap">
                    <h3 className="cc-homepage-cards__card-title">{c.title}</h3>
                    {c.subtitle && <p className="cc-homepage-cards__card-subtitle">{c.subtitle}</p>}
                  </div>
                </div>
                <div className="cc-homepage-cards__card-body">{inner}</div>
              </>
            );

            const cardClass = 'cc-homepage-cards__card';
            if (c.href) {
              return (
                <li key={c.id} className="cc-homepage-cards__cell">
                  <a className={cardClass} href={c.href} onClick={c.onClick}>{body}</a>
                </li>
              );
            }
            if (c.onClick) {
              return (
                <li key={c.id} className="cc-homepage-cards__cell">
                  <button type="button" className={cardClass} onClick={c.onClick}>{body}</button>
                </li>
              );
            }
            return (
              <li key={c.id} className="cc-homepage-cards__cell">
                <article className={cardClass}>{body}</article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
