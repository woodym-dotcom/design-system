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
export declare function Breadcrumbs({ items, separator, collapseAfter, ariaLabel, className, }: BreadcrumbsProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Breadcrumbs.d.ts.map