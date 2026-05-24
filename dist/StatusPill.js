import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const STATUS_DOT_SHAPES = {
    ok: 'cc-status-pill__dot--round',
    warning: 'cc-status-pill__dot--diamond',
    error: 'cc-status-pill__dot--square',
    info: 'cc-status-pill__dot--round',
    neutral: 'cc-status-pill__dot--round',
    'sms-provider-health': 'cc-status-pill__dot--round',
    'band-drift': 'cc-status-pill__dot--diamond',
    crosswalk: 'cc-status-pill__dot--round',
};
export function StatusPill({ status, label, size = 'md', onClick, className }) {
    const classes = [
        'cc-status-pill',
        `cc-status-pill--${status}`,
        `cc-status-pill--${size}`,
        className,
    ].filter(Boolean).join(' ');
    const dotClass = ['cc-status-pill__dot', STATUS_DOT_SHAPES[status]].join(' ');
    const inner = (_jsxs(_Fragment, { children: [_jsx("span", { className: dotClass, "aria-hidden": "true" }), _jsx("span", { className: "cc-status-pill__label", children: label })] }));
    if (onClick) {
        return (_jsx("button", { type: "button", className: classes, onClick: onClick, children: inner }));
    }
    return (_jsx("span", { className: classes, children: inner }));
}
//# sourceMappingURL=StatusPill.js.map