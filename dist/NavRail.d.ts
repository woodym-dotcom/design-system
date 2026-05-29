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
export declare function NavRail({ items, footerItems, currentPathname, renderItem, ariaLabel, variant, className, }: NavRailProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=NavRail.d.ts.map