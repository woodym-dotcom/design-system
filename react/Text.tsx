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
export type TextAs =
  | 'span'
  | 'p'
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'label';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  as?: TextAs;
  truncate?: boolean | number;
  children: React.ReactNode;
}

const SIZE_MAP: Record<TextSize, string> = {
  xs: 'var(--text-xs)',   // 12px
  sm: 'var(--text-sm)',   // 13px
  md: 'var(--text-base)', // 14px
  lg: 'var(--text-md)',   // 16px
  xl: 'var(--text-lg)',   // 18px
};

const WEIGHT_MAP: Record<TextWeight, string | number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const TONE_MAP: Record<TextTone, string> = {
  default: 'var(--text-1)',
  muted: 'var(--text-3)',
  subtle: 'var(--text-4)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--error)',
};

function truncateStyle(truncate: boolean | number): React.CSSProperties {
  if (truncate === true || truncate === 1) {
    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };
  }
  const lines = truncate as number;
  return {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
  };
}

export function Text({
  size = 'md',
  weight = 'normal',
  tone = 'default',
  as: Tag = 'span',
  truncate,
  className,
  style,
  children,
  ...rest
}: TextProps): React.ReactElement {
  const computedStyle: React.CSSProperties = {
    fontSize: SIZE_MAP[size],
    fontWeight: WEIGHT_MAP[weight],
    color: TONE_MAP[tone],
    ...(truncate != null ? truncateStyle(truncate) : {}),
    ...style,
  };

  return (
    <Tag className={className} style={computedStyle} {...rest}>
      {children}
    </Tag>
  );
}
