/**
 * Row — horizontal flex container with token-driven gap, alignment, and wrap.
 *
 * Gap values map to --space-* tokens (4pt grid).
 */
import * as React from 'react';
import type { StackGap } from './Stack';
export type RowAlign = 'start' | 'center' | 'end' | 'baseline';
export type RowJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export interface RowProps extends React.HTMLAttributes<HTMLElement> {
    gap?: StackGap;
    align?: RowAlign;
    justify?: RowJustify;
    wrap?: boolean;
    as?: React.ElementType;
    children: React.ReactNode;
}
export declare function Row({ gap, align, justify, wrap, as: Tag, className, style, children, ...rest }: RowProps): React.ReactElement;
//# sourceMappingURL=Row.d.ts.map