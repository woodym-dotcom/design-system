/**
 * Card — generic surface shell for dashboard tiles and content cards.
 *
 * Encapsulates the standard card treatment:
 *   background: var(--surface-1), rounded corners, 1px border, padding.
 *
 * Optional title + subtitle slot renders a small-caps heading row above
 * the card body (pattern used by TileShell in the dashboard).
 *
 * Styles use @ds/core tokens exclusively — no hardcoded values.
 */
import * as React from "react";
export interface CardProps {
    /** Optional heading text rendered in small-caps above the card body. */
    title?: string;
    /** Optional sub-label appended after the title. */
    subtitle?: string;
    className?: string;
    children: React.ReactNode;
}
export declare function Card({ title, subtitle, className, children }: CardProps): React.ReactElement;
//# sourceMappingURL=Card.d.ts.map