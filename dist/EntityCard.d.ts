/**
 * <EntityCard> — record-card primitive used for shareholders, officers,
 * branches, beneficial owners, and other entity lists inside detail panes.
 *
 * Density variants:
 *  - "standard" (default): padded card with primary + secondary metadata.
 *  - "compact": tighter row, secondary metadata behind a disclosure chevron.
 *               Use when the parent list might grow large (30-100 entries).
 *
 * For very large lists, wrap a parent <EntityCardList virtualised count={n}>
 * which lazy-renders rows above a configurable threshold (default 20). The
 * virtualisation is intentionally simple — a windowed slice on scroll, no
 * variable row heights — because compact rows are uniform.
 */
import * as React from 'react';
export type EntityCardDensity = 'standard' | 'compact';
export interface EntityCardProps {
    /** Primary label, e.g. shareholder name. */
    title: React.ReactNode;
    /** Single-line subtitle rendered next to the title. */
    subtitle?: React.ReactNode;
    /** Optional leading element — avatar, initial, icon. */
    leading?: React.ReactNode;
    /** Optional trailing element — badge, action button. */
    trailing?: React.ReactNode;
    /** Secondary metadata. In compact density this hides behind a chevron. */
    metadata?: React.ReactNode;
    /** Clickable card — renders as a <button>. */
    onClick?: () => void;
    density?: EntityCardDensity;
    className?: string;
}
export declare function EntityCard({ title, subtitle, leading, trailing, metadata, onClick, density, className, }: EntityCardProps): import("react/jsx-runtime").JSX.Element;
export interface EntityCardListProps {
    /**
     * Children should be <EntityCard> nodes. Pass an array, not a fragment, so
     * the list can count and (optionally) virtualise them.
     */
    children: React.ReactElement[];
    /**
     * When set, the list windowed-renders children above this count. Defaults
     * to 20. Pass `0` to disable.
     */
    virtualiseAbove?: number;
    /** Approximate row height in px — used for the virtualisation window. */
    rowHeight?: number;
    /** Max visible rows when virtualised. Default 50. */
    windowSize?: number;
    className?: string;
}
export declare function EntityCardList({ children, virtualiseAbove, rowHeight, windowSize, className, }: EntityCardListProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=EntityCard.d.ts.map