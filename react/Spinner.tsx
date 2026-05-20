/**
 * Spinner — loading indicator with sizes sm/md/lg.
 *
 * CSS-driven rotation. The `prefers-reduced-motion` media query in
 * primitives.css swaps the spin for a static pulse so motion-sensitive users
 * still get a "something is loading" cue without movement.
 *
 * role="status" + aria-label for screen readers.
 */
import * as React from "react";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  /** Size. Defaults to "md" (16px). */
  size?: SpinnerSize;
  /** Accessible label. Defaults to "Loading". */
  label?: string;
  className?: string;
}

export function Spinner({
  size = "md",
  label = "Loading",
  className,
}: SpinnerProps): React.ReactElement {
  const cls = [
    "cc-spinner",
    `cc-spinner--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span
      role="status"
      aria-label={label}
      className={cls}
    >
      <span className="cc-spinner__ring" aria-hidden="true" />
    </span>
  );
}
