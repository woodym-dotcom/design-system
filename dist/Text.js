import { jsx as _jsx } from "react/jsx-runtime";
const SIZE_MAP = {
    xs: 'var(--text-xs)', // 12px
    sm: 'var(--text-sm)', // 13px
    md: 'var(--text-base)', // 14px
    lg: 'var(--text-md)', // 16px
    xl: 'var(--text-lg)', // 18px
};
const WEIGHT_MAP = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
};
const TONE_MAP = {
    default: 'var(--text-1)',
    muted: 'var(--text-3)',
    subtle: 'var(--text-4)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--error)',
};
function truncateStyle(truncate) {
    if (truncate === true || truncate === 1) {
        return {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        };
    }
    const lines = truncate;
    return {
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
    };
}
export function Text({ size = 'md', weight = 'normal', tone = 'default', as: Tag = 'span', truncate, className, style, children, ...rest }) {
    const computedStyle = {
        fontSize: SIZE_MAP[size],
        fontWeight: WEIGHT_MAP[weight],
        color: TONE_MAP[tone],
        ...(truncate != null ? truncateStyle(truncate) : {}),
        ...style,
    };
    return (_jsx(Tag, { className: className, style: computedStyle, ...rest, children: children }));
}
//# sourceMappingURL=Text.js.map