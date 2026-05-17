import * as React from 'react';
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export interface TooltipProps {
    /** Tooltip body. */
    label: React.ReactNode;
    /** Element the tooltip describes. Must be a single focusable child. */
    children: React.ReactElement;
    /** Preferred placement. Default 'top'. */
    placement?: TooltipPlacement;
    /** Open delay in ms. Default 300. */
    delayMs?: number;
    /** Optional id; auto-generated otherwise. */
    id?: string;
    className?: string;
}
/**
 * Lightweight tooltip — hover- and focus-triggered, ESC-dismissible.
 * Uses CSS positioning (no portal) so it inherits typography/contrast
 * naturally. Wraps a single focusable child and wires `aria-describedby`.
 */
export declare function Tooltip({ label, children, placement, delayMs, id, className, }: TooltipProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Tooltip.d.ts.map