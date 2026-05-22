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

const GAP_MAP: Record<StackGap, string> = {
  none: '0',
  xs: 'var(--space-2)',
  sm: 'var(--space-3)',
  md: 'var(--space-5)',
  lg: 'var(--space-6)',
  xl: 'var(--space-7)',
};

const ALIGN_MAP: Record<RowAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  baseline: 'baseline',
};

const JUSTIFY_MAP: Record<RowJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

export function Row({
  gap = 'md',
  align = 'center',
  justify = 'start',
  wrap = false,
  as: Tag = 'div',
  className,
  style,
  children,
  ...rest
}: RowProps): React.ReactElement {
  const rootStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: GAP_MAP[gap],
    alignItems: ALIGN_MAP[align],
    justifyContent: JUSTIFY_MAP[justify],
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...style,
  };

  return (
    <Tag className={className} style={rootStyle} {...rest}>
      {children}
    </Tag>
  );
}
