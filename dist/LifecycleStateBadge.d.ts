import type { ReactNode } from 'react';
export type ChipTone = 'neutral' | 'accent' | 'success' | 'warning' | 'info' | 'danger';
export type LifecycleStateBadgeProps = {
    status: string;
    children?: ReactNode;
};
/**
 * Renders a lifecycle state label as a colour-coded badge.
 *
 * Maps governance case state machine and policy lifecycle states
 * (draft / proposed / active / superseded / rejected) to semantic color tones.
 * Uses the underlying design system tone CSS classes for consistent styling.
 */
export declare function LifecycleStateBadge({ status, children }: LifecycleStateBadgeProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=LifecycleStateBadge.d.ts.map