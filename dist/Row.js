import { jsx as _jsx } from "react/jsx-runtime";
const GAP_MAP = {
    none: '0',
    xs: 'var(--space-2)',
    sm: 'var(--space-3)',
    md: 'var(--space-5)',
    lg: 'var(--space-6)',
    xl: 'var(--space-7)',
};
const ALIGN_MAP = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    baseline: 'baseline',
};
const JUSTIFY_MAP = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
};
export function Row({ gap = 'md', align = 'center', justify = 'start', wrap = false, as: Tag = 'div', className, style, children, }) {
    const rootStyle = {
        display: 'flex',
        flexDirection: 'row',
        gap: GAP_MAP[gap],
        alignItems: ALIGN_MAP[align],
        justifyContent: JUSTIFY_MAP[justify],
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
    };
    return (_jsx(Tag, { className: className, style: rootStyle, children: children }));
}
//# sourceMappingURL=Row.js.map