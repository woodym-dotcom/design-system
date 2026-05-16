/**
 * <MetadataChip> — compressed housekeeping metadata cluster.
 *
 * Collapses metadata noise (freshness, privacy badge, inspect link) into a
 * single "ⓘ" icon trigger. Tap/hover reveals the full cluster in an inline
 * expanded row (no position:fixed, stays in flow — viewport-safe).
 *
 * Accessibility:
 *  - The trigger button has aria-label="Show metadata" and aria-expanded.
 *  - The popover panel has role="region" with an accessible label.
 *  - Keyboard: Enter/Space toggles, Escape closes.
 *  - Touch target: the trigger is ≥ 44×44px via padding.
 */
import * as React from 'react';
export interface MetadataChipFreshness {
    value: number;
    unit: 'm' | 'h' | 'd';
}
/**
 * Staleness state for the trigger icon dot and panel line.
 *  - 'fresh'   — green dot (default, no dot rendered for fresh to keep it quiet)
 *  - 'stale'   — yellow dot on the trigger icon; "Stale" line in the panel
 *  - 'missing' — grey dot on the trigger icon; "No data" line in the panel
 */
export type MetadataChipStaleness = 'fresh' | 'stale' | 'missing';
export interface MetadataChipProps {
    /** Freshness delta — e.g. { value: 3, unit: 'm' } renders "3m". */
    freshness?: MetadataChipFreshness;
    /** Privacy status. Rendered as a pill when present. */
    privacy?: 'private' | 'shared';
    /** If provided, renders an "Inspect" anchor pointing here. */
    inspectHref?: string;
    /**
     * Optional inline inspect content (React node). Rendered inside the panel
     * under an "Inspect" heading when expanded. Use instead of `inspectHref`
     * when the raw data should be shown inline rather than linked externally.
     */
    inspectContent?: React.ReactNode;
    /** Optional ISO date string for "Last updated: …" line. */
    lastUpdated?: string;
    /**
     * Data staleness. When 'stale' a yellow dot appears on the trigger and
     * the panel shows a "Stale" warning. When 'missing' the dot is grey and
     * the panel shows "No data". Fresh state (default) renders no dot.
     */
    staleness?: MetadataChipStaleness;
    /** Align the expanded panel. Default is 'left'. */
    align?: 'left' | 'right';
    className?: string;
}
export declare function MetadataChip({ freshness, privacy, inspectHref, inspectContent, lastUpdated, staleness, align, className, }: MetadataChipProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MetadataChip.d.ts.map