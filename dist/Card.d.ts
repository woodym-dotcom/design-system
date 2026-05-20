/**
 * Card — generic surface shell for dashboard tiles and content cards.
 *
 * The classic API (title + subtitle + children) renders the legacy
 * `card-base` utility chrome and is preserved byte-for-byte so existing
 * consumers see no DOM change.
 *
 * When any of `actions`, `footer`, or `padded` are supplied, the new
 * AA-style BEM structure (<section class="cc-card">) is used:
 *   - cc-card__header (with copy + actions)
 *   - cc-card__body
 *   - cc-card__footer
 * Pass `padded={false}` to remove body padding via cc-card--flush.
 *
 * Styles use @ds/core tokens exclusively — no hardcoded values.
 */
import * as React from "react";
export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
    /** Optional heading text rendered in small-caps above the card body. */
    title?: React.ReactNode;
    /** Optional sub-label appended after the title. */
    subtitle?: React.ReactNode;
    /** Right-aligned slot inside the header (NEW). */
    actions?: React.ReactNode;
    /** Slot rendered after the body (NEW). */
    footer?: React.ReactNode;
    /**
     * Body padding (NEW). Defaults to true. Setting false applies
     * `cc-card--flush`, useful when the card body is itself a table /
     * grid that owns its own gutter.
     */
    padded?: boolean;
    className?: string;
    children: React.ReactNode;
}
export declare function Card({ title, subtitle, actions, footer, padded, className, children, ...rest }: CardProps): React.ReactElement;
//# sourceMappingURL=Card.d.ts.map