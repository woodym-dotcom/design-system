/**
 * <EmptyState> — "no current X" placeholder pattern.
 *
 * Replaces ad-hoc empty-state divs scattered through the dashboard.
 * Renders a dashed border container with title, optional description,
 * optional icon, and optional CTA. The CTA can be a button (onClick)
 * or an anchor (href).
 */
import * as React from 'react';
export interface EmptyStateAction {
    label: string;
    onClick?: () => void;
    href?: string;
}
export interface EmptyStateProps {
    /** Primary empty-state message. Required; keep it short. */
    title: string;
    /** Supporting copy. Optional. */
    description?: string;
    /**
     * Optional call-to-action. If `href` is provided renders an <a>;
     * otherwise a <button> that fires `onClick`.
     */
    action?: EmptyStateAction;
    /** Optional icon rendered above the title. */
    icon?: React.ReactNode;
    className?: string;
}
export declare function EmptyState({ title, description, action, icon, className }: EmptyStateProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=EmptyState.d.ts.map