/**
 * Row — horizontal flex container with token-driven gap, alignment, and wrap.
 *
 * Gap values map to --space-* tokens (4pt grid).
 *
 * Compact list-row mode: when `density="compact"` is supplied, Row renders as
 * a dense list-item primitive (`cc-compact-row`) with title/subtitle/trailing
 * slots. This subsumes the older `CompactListRow` component. Pass `href` to
 * render an anchor; pass `onClick` (without `href`) to render a button.
 */
import * as React from 'react';
import type { StackGap } from './Stack.js';
export type RowAlign = 'start' | 'center' | 'end' | 'baseline';
export type RowJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type RowDensity = 'default' | 'compact';
export interface RowProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onClick'> {
    gap?: StackGap;
    align?: RowAlign;
    justify?: RowJustify;
    wrap?: boolean;
    as?: React.ElementType;
    /**
     * Density variant.
     *  - "default" (default): generic horizontal flex container.
     *  - "compact": dense list-item row (title/subtitle/trailing). Subsumes the
     *    legacy `CompactListRow` primitive.
     */
    density?: RowDensity;
    /** compact mode: primary content (title text or node). */
    title?: React.ReactNode;
    /** compact mode: secondary content rendered below the title. */
    subtitle?: React.ReactNode;
    /** compact mode: right-aligned trailing slot. */
    trailing?: React.ReactNode;
    /** compact mode: when provided, the row renders as an <a>. */
    href?: string;
    /** compact mode: when provided (without href), the row renders as a <button>. */
    onClick?: () => void;
    /** compact mode: marks the row as selected/active (applies is-selected). */
    isSelected?: boolean;
    children?: React.ReactNode;
}
export declare function Row({ gap, align, justify, wrap, as: Tag, density, title, subtitle, trailing, href, onClick, isSelected, className, style, children, ...rest }: RowProps): React.ReactElement;
//# sourceMappingURL=Row.d.ts.map