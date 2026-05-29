/**
 * @deprecated Use `<State variant="…" density="…">` from `./State` instead.
 *
 * <EmptyState> — long-tail state placeholder.
 *
 * Renders a dashed container with title, optional description, optional
 * icon, and 0+ CTAs. The `variant` prop covers the long-tail family used
 * across every list/detail surface:
 *
 *  - 'empty'           : no records yet (default; matches legacy usage)
 *  - 'offline'         : network down / no connectivity
 *  - 'rate-limited'    : upstream throttled
 *  - 'permissioned-out': user lacks the role to see this surface
 *  - 'stale'           : data is older than the freshness window
 *  - 'partial'         : a subset of sources answered; surface is incomplete
 *  - 'error'           : unrecoverable load failure
 *  - 'loading'         : in-flight placeholder; pair with `<Skeleton/>` for rows
 */
import * as React from 'react';
export type EmptyStateVariant = 'empty' | 'offline' | 'rate-limited' | 'permissioned-out' | 'stale' | 'partial' | 'error' | 'loading';
export interface EmptyStateAction {
    label: string;
    onClick?: () => void;
    href?: string;
    /** Visual emphasis. Defaults to 'secondary'. */
    tone?: 'primary' | 'secondary';
}
export interface EmptyStateProps {
    /** Primary message. Required; keep it short. */
    title: string;
    /** Supporting copy. Optional. */
    description?: string;
    /**
     * Optional CTA. Either a single action or an array of actions
     * (max 2 — primary + secondary).
     */
    action?: EmptyStateAction | EmptyStateAction[];
    /** Optional icon rendered above the title. */
    icon?: React.ReactNode;
    /** State variant — drives surface tone and default ARIA role. */
    variant?: EmptyStateVariant;
    className?: string;
}
export declare function EmptyState({ title, description, action, icon, variant, className, }: EmptyStateProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=EmptyState.d.ts.map