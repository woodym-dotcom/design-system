/**
 * LifecycleStateBadge — maps governance lifecycle status strings to colour-coded badges.
 *
 * @deprecated Use `Tag` from `@ds/core/react` with an explicit `tone` prop instead.
 * Map the status → TagTone at the call site and pass `variant="badge"`.
 * Note: the legacy `'danger'` tone is accepted by Tag as a back-compat alias for `'error'`.
 * Cutover: DS-SIMPLIFY 14.
 */
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