import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
export function Row({ gap = 'md', align = 'center', justify = 'start', wrap = false, as: Tag = 'div', density = 'default', title, subtitle, trailing, href, onClick, isSelected, className, style, children, ...rest }) {
    // ── Compact list-row mode ────────────────────────────────────────────────
    if (density === 'compact') {
        const classes = ['cc-compact-row', isSelected ? 'is-selected' : '', className]
            .filter(Boolean)
            .join(' ');
        const inner = (_jsxs(_Fragment, { children: [_jsxs("span", { className: "cc-compact-row__main", children: [_jsx("span", { className: "cc-compact-row__title", children: title }), subtitle ? _jsx("span", { className: "cc-compact-row__subtitle", children: subtitle }) : null] }), trailing ? _jsx("span", { className: "cc-compact-row__trailing", children: trailing }) : null] }));
        if (href) {
            return (_jsx("a", { href: href, className: classes, children: inner }));
        }
        if (onClick) {
            return (_jsx("button", { type: "button", className: classes, onClick: onClick, children: inner }));
        }
        return _jsx("div", { className: classes, children: inner });
    }
    // ── Default flex-row mode ────────────────────────────────────────────────
    const rootStyle = {
        display: 'flex',
        flexDirection: 'row',
        gap: GAP_MAP[gap],
        alignItems: ALIGN_MAP[align],
        justifyContent: JUSTIFY_MAP[justify],
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
    };
    return (_jsx(Tag, { className: className, style: rootStyle, ...rest, children: children }));
}
//# sourceMappingURL=Row.js.map