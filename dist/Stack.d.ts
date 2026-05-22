/**
 * Stack — vertical flex container with token-driven gap and optional dividers.
 *
 * Gap values map to --space-* tokens (4pt grid).
 * Divider renders <hr> between children using --border-1 token.
 */
import * as React from 'react';
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export interface StackProps extends React.HTMLAttributes<HTMLElement> {
    gap?: StackGap;
    align?: StackAlign;
    divider?: boolean;
    as?: React.ElementType;
    children: React.ReactNode;
}
export declare function Stack({ gap, align, divider, as: Tag, className, style, children, ...rest }: StackProps): React.ReactElement;
//# sourceMappingURL=Stack.d.ts.map