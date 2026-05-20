/**
 * Chip — inline tag / badge primitive.
 *
 * Tones (neutral/success/warning/error/info/accent) drive the colour
 * treatment via tokenised CSS variables. Pass `onClick` to render an
 * interactive chip (renders as a <button>); pass `onRemove` to add a small
 * "×" button at the end.
 *
 * Re-exported as `Badge` for callers that prefer that name; the API is
 * identical.
 */
import * as React from "react";
export type ChipTone = "neutral" | "success" | "warning" | "error" | "info" | "accent";
export interface ChipProps {
    /** Tone. Defaults to "neutral". */
    tone?: ChipTone;
    /** Chip label / contents. */
    children: React.ReactNode;
    /** Optional leading icon (rendered before the label). */
    icon?: React.ReactNode;
    /** When set, renders a trailing × button that calls this handler. */
    onRemove?: () => void;
    /**
     * When set, the chip is rendered as a <button> with this click handler.
     * Without this prop the chip is a non-interactive <span>.
     */
    onClick?: () => void;
    /** Accessible label override (for icon-only chips, etc.). */
    "aria-label"?: string;
    className?: string;
}
export declare function Chip({ tone, children, icon, onRemove, onClick, className, ...rest }: ChipProps): React.ReactElement;
/** Alias — `Badge` is the same component as `Chip`. */
export declare const Badge: typeof Chip;
export type BadgeProps = ChipProps;
//# sourceMappingURL=Chip.d.ts.map