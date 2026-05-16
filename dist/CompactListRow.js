import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function CompactListRow({ title, subtitle, trailing, href, onClick, isSelected, className, }) {
    const classes = [
        'cc-compact-row',
        isSelected ? 'is-selected' : '',
        className,
    ].filter(Boolean).join(' ');
    const inner = (_jsxs(_Fragment, { children: [_jsxs("span", { className: "cc-compact-row__main", children: [_jsx("span", { className: "cc-compact-row__title", children: title }), subtitle && _jsx("span", { className: "cc-compact-row__subtitle", children: subtitle })] }), trailing && (_jsx("span", { className: "cc-compact-row__trailing", children: trailing }))] }));
    if (href) {
        return (_jsx("a", { href: href, className: classes, children: inner }));
    }
    if (onClick) {
        return (_jsx("button", { type: "button", className: classes, onClick: onClick, children: inner }));
    }
    return (_jsx("div", { className: classes, children: inner }));
}
//# sourceMappingURL=CompactListRow.js.map