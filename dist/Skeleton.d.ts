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
export declare function Skeleton({ shape, width, height, lines, static: isStatic, className, label, }: SkeletonProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Skeleton.d.ts.map