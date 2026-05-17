import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Loading placeholder. Animated shimmer block that respects
 * `prefers-reduced-motion` automatically via the motion-respect rail in
 * tokens/core.css.
 */
export function Skeleton({ shape = 'text', width, height, lines = 1, static: isStatic, className, label = 'Loading', }) {
    const classes = (i) => [
        'cc-skeleton',
        `cc-skeleton--${shape}`,
        isStatic && 'cc-skeleton--static',
        className,
    ]
        .filter(Boolean)
        .join(' ') + (i !== undefined && lines > 1 && i === lines - 1 ? ' cc-skeleton--last' : '');
    if (shape === 'text' && lines > 1) {
        return (_jsx("span", { role: "status", "aria-label": label, className: "cc-skeleton-stack", children: Array.from({ length: lines }, (_, i) => (_jsx("span", { className: classes(i), style: {
                    width: i === lines - 1 ? '60%' : width ?? '100%',
                    height: height ?? '1em',
                }, "aria-hidden": "true" }, i))) }));
    }
    return (_jsx("span", { role: "status", "aria-label": label, className: classes(), style: {
            width: width ?? (shape === 'text' ? '100%' : shape === 'circle' ? '2rem' : '4rem'),
            height: height ?? (shape === 'text' ? '1em' : shape === 'circle' ? '2rem' : '1rem'),
        } }));
}
//# sourceMappingURL=Skeleton.js.map