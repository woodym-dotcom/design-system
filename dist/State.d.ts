/**
 * State — unified state-messaging primitive.
 *
 * Subsumes EmptyState, AwaitingState, StateBanner, OfflineBanner, and
 * StaleDataPill into a single component driven by two orthogonal axes:
 *
 *   variant  — WHAT state (empty, loading, error, offline, stale, …)
 *   density  — WHERE it appears (page hero, banner strip, inline chip)
 *
 * Variant defaults:
 *   empty      → "Nothing here yet"             (page, info tone)
 *   loading    → "Loading…"                     (page, info tone)
 *   error      → "Something went wrong"         (page/banner, error tone)
 *   offline    → "You're offline"               (banner, warning tone)
 *   stale      → "Data may be out of date"      (banner/chip, warning tone)
 *   not-found  → "We couldn't find that"        (page, info tone)
 *   forbidden  → "You don't have access"        (page, warning tone)
 *   degraded   → "Degraded service"             (banner, warning tone)
 */
import * as React from 'react';
export type StateVariant = 'empty' | 'loading' | 'error' | 'offline' | 'stale' | 'not-found' | 'forbidden' | 'degraded' | 'fail-closed' | 'device-mismatch' | 'lockout';
export type StateDensity = 'page' | 'banner' | 'chip';
export interface StateProps {
    variant: StateVariant;
    density?: StateDensity;
    /** Override the variant's default title. */
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    primaryAction?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        href: string;
    };
    /** §18 audit metadata when content is AI-generated. */
    source?: {
        model?: string;
        promptVersion?: string;
    };
    className?: string;
}
export declare function State({ variant, density, title, description, icon, primaryAction, secondaryAction, className, }: StateProps): React.ReactElement;
//# sourceMappingURL=State.d.ts.map