import * as React from 'react';
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
    render: (ctx: {
        loading: boolean;
    }) => React.ReactNode;
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
        action?: {
            label: string;
            onClick?: () => void;
            href?: string;
        };
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
export declare function HomepageCards({ viewerRoles, cards, loading, heading, subtitle, emptyState, columns, className, }: HomepageCardsProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=HomepageCards.d.ts.map