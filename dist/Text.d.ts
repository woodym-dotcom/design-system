/**
 * Text — typography primitive.
 *
 * Maps size props to --text-* tokens from type-scale.css.
 * Maps tone props to existing --text-* / semantic color tokens.
 * Supports single-line and multi-line truncation via CSS.
 */
import * as React from 'react';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextTone = 'default' | 'muted' | 'subtle' | 'success' | 'warning' | 'danger';
export type TextAs = 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
export interface TextProps {
    size?: TextSize;
    weight?: TextWeight;
    tone?: TextTone;
    as?: TextAs;
    truncate?: boolean | number;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}
export declare function Text({ size, weight, tone, as: Tag, truncate, className, style, children, }: TextProps): React.ReactElement;
//# sourceMappingURL=Text.d.ts.map