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
export declare function Spinner({ size, label, className, }: SpinnerProps): React.ReactElement;
//# sourceMappingURL=Spinner.d.ts.map