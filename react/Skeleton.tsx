import * as React from 'react';

export type SkeletonShape = 'text' | 'rect' | 'circle';

export interface SkeletonProps {
  /** Shape — defaults to 'text'. */
  shape?: SkeletonShape;
  /** CSS width. For text, defaults to 100%. */
  width?: number | string;
  /** CSS height. For text defaults to 1em; rect defaults to 1rem. */
  height?: number | string;
  /** Number of lines (text only). Default 1. */
  lines?: number;
  /** Disable shimmer animation. Useful for testing or low-motion preference. */
  static?: boolean;
  className?: string;
  /** Accessible label for the loading state. */
  label?: string;
}

/**
 * Loading placeholder. Animated shimmer block that respects
 * `prefers-reduced-motion` automatically via the motion-respect rail in
 * tokens/core.css.
 */
export function Skeleton({
  shape = 'text',
  width,
  height,
  lines = 1,
  static: isStatic,
  className,
  label = 'Loading',
}: SkeletonProps) {
  const classes = (i?: number) =>
    [
      'cc-skeleton',
      `cc-skeleton--${shape}`,
      isStatic && 'cc-skeleton--static',
      className,
    ]
      .filter(Boolean)
      .join(' ') + (i !== undefined && lines > 1 && i === lines - 1 ? ' cc-skeleton--last' : '');

  if (shape === 'text' && lines > 1) {
    return (
      <span role="status" aria-label={label} className="cc-skeleton-stack">
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={classes(i)}
            style={{
              width: i === lines - 1 ? '60%' : width ?? '100%',
              height: height ?? '1em',
            }}
            aria-hidden="true"
          />
        ))}
      </span>
    );
  }

  return (
    <span
      role="status"
      aria-label={label}
      className={classes()}
      style={{
        width: width ?? (shape === 'text' ? '100%' : shape === 'circle' ? '2rem' : '4rem'),
        height: height ?? (shape === 'text' ? '1em' : shape === 'circle' ? '2rem' : '1rem'),
      }}
    />
  );
}
