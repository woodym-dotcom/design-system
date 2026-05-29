/**
 * Tag — unified tone-coded text-indicator primitive.
 *
 * Subsumes Chip, Badge, StatusPill, LifecycleStateBadge, and MetadataChip's
 * inline badge usage into a single `variant × tone × size` API.
 *
 * Variants:
 *  - `chip`  — small rounded rectangle (current Chip shape)
 *  - `pill`  — pill-shape (current StatusPill shape)
 *  - `badge` — tight number/dot badge for counts
 *  - `meta`  — subtle inline indicator (current MetadataChip inline usage)
 *
 * Tones: neutral | accent | success | warning | error | info
 * The legacy tone value `'danger'` is accepted as a back-compat alias and
 * mapped to `'error'` during the deprecation window.
 *
 * Accessibility contract:
 *  - Interactive tags (onClick) render as <button> with Enter/Space activation.
 *  - Non-interactive tags render as <span>.
 *  - The remove button has an aria-label and suppresses event propagation.
 *  - The leading dot is aria-hidden.
 */
import * as React from "react";
export type TagVariant = "chip" | "pill" | "badge" | "meta";
export type TagTone = "neutral" | "accent" | "success" | "warning" | "error" | "info";
export type TagSize = "sm" | "md" | "lg";
/** Back-compat: `'danger'` maps to `'error'` during the deprecation window. */
type TagToneInput = TagTone | "danger";
export interface TagProps {
    /** Visual shape variant. Default: `'chip'`. */
    variant?: TagVariant;
    /** Colour tone. Default: `'neutral'`. Also accepts `'danger'` (deprecated → maps to `'error'`). */
    tone?: TagToneInput;
    /** Size variant. Default: `'md'`. */
    size?: TagSize;
    /** Render a small leading colour dot. */
    dot?: boolean;
    /** Leading icon node (rendered before the label). */
    icon?: React.ReactNode;
    /** When provided, renders a trailing × button that calls this handler. */
    onRemove?: () => void;
    /** When provided, the tag renders as a <button> with this click handler. */
    onClick?: () => void;
    /** Tag label / content. */
    children: React.ReactNode;
    /** Accessible label override. */
    "aria-label"?: string;
    /** When set on an interactive tag, reflects toggle state for chip/filter use. */
    "aria-pressed"?: boolean;
    className?: string;
}
export declare function Tag({ variant, tone: toneProp, size, dot, icon, onRemove, onClick, children, className, ...rest }: TagProps): React.ReactElement;
export {};
//# sourceMappingURL=Tag.d.ts.map