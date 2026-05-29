/**
 * Card — generic surface shell for dashboard tiles, content cards, and
 * entity-list record cards (variant="entity").
 *
 * The classic API (title + subtitle + children) renders the legacy
 * `card-base` utility chrome and is preserved byte-for-byte so existing
 * consumers see no DOM change.
 *
 * When any of `actions`, `footer`, or `padded` are supplied, the new
 * BEM structure (<section class="cc-card">) is used:
 *   - cc-card__header (with copy + actions)
 *   - cc-card__body
 *   - cc-card__footer
 * Pass `padded={false}` to remove body padding via cc-card--flush.
 *
 * Pass `variant="entity"` to render a record-card with leading/trailing
 * slots, metadata, and optional compact density (chevron-disclosed metadata).
 *
 * Styles use @ds/core tokens exclusively — no hardcoded values.
 */
import * as React from "react";
export type CardVariant = "default" | "entity";
export type CardDensity = "standard" | "compact";
export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onClick"> {
    /** Visual variant. Default: "default". */
    variant?: CardVariant;
    /** Optional heading text / record title. */
    title?: React.ReactNode;
    /** Optional sub-label appended after the title. */
    subtitle?: React.ReactNode;
    /** Right-aligned slot inside the header. */
    actions?: React.ReactNode;
    /** Slot rendered after the body. */
    footer?: React.ReactNode;
    /**
     * Body padding. Defaults to true. Setting false applies `cc-card--flush`,
     * useful when the card body is itself a table / grid that owns its own
     * gutter.
     */
    padded?: boolean;
    /** Entity variant: leading slot (avatar, icon). */
    leading?: React.ReactNode;
    /** Entity variant: trailing slot (badge, action button). */
    trailing?: React.ReactNode;
    /** Entity variant: secondary metadata. In compact density, hides behind a chevron. */
    metadata?: React.ReactNode;
    /** Entity variant: density — "standard" (default) or "compact". */
    density?: CardDensity;
    /** Entity variant: when supplied, the card is a clickable record. */
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}
export declare function Card({ variant, title, subtitle, actions, footer, padded, leading, trailing, metadata, density, onClick, className, children, ...rest }: CardProps): React.ReactElement;
//# sourceMappingURL=Card.d.ts.map