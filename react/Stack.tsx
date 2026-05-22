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

const GAP_MAP: Record<StackGap, string> = {
  none: '0',
  xs: 'var(--space-2)',   // 6px
  sm: 'var(--space-3)',   // 8px
  md: 'var(--space-5)',   // 16px
  lg: 'var(--space-6)',   // 24px
  xl: 'var(--space-7)',   // 32px
};

const ALIGN_MAP: Record<StackAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

export function Stack({
  gap = 'md',
  align = 'stretch',
  divider = false,
  as: Tag = 'div',
  className,
  style,
  children,
  ...rest
}: StackProps): React.ReactElement {
  const childArray = React.Children.toArray(children).filter(Boolean);

  const content = divider
    ? childArray.flatMap((child, i) =>
        i < childArray.length - 1
          ? [
              child,
              <hr
                key={`divider-${i}`}
                style={{
                  border: 'none',
                  borderTop: '1px solid var(--border-1)',
                  margin: 0,
                }}
              />,
            ]
          : [child],
      )
    : childArray;

  const rootStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: GAP_MAP[gap],
    alignItems: ALIGN_MAP[align],
    ...style,
  };

  return (
    <Tag className={className} style={rootStyle} {...rest}>
      {content}
    </Tag>
  );
}
