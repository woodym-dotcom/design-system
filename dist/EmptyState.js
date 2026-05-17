import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const VARIANT_ROLE = {
    empty: 'status',
    loading: 'status',
    stale: 'status',
    partial: 'status',
    offline: 'alert',
    'rate-limited': 'alert',
    error: 'alert',
    'permissioned-out': 'note',
};
export function EmptyState({ title, description, action, icon, variant = 'empty', className, }) {
    const actions = action ? (Array.isArray(action) ? action : [action]) : [];
    const role = VARIANT_ROLE[variant];
    return (_jsxs("div", { className: ['cc-empty-state', `cc-empty-state--${variant}`, className]
            .filter(Boolean)
            .join(' '), role: role === 'note' ? undefined : role, "data-variant": variant, children: [icon && (_jsx("span", { className: "cc-empty-state__icon", "aria-hidden": "true", children: icon })), _jsx("p", { className: "cc-empty-state__title", children: title }), description && _jsx("p", { className: "cc-empty-state__description", children: description }), actions.length > 0 && (_jsx("div", { className: "cc-empty-state__actions", children: actions.map((a, i) => {
                    const tone = a.tone ?? (i === 0 ? 'primary' : 'secondary');
                    const cls = `cc-empty-state__cta cc-empty-state__cta--${tone}`;
                    return a.href ? (_jsx("a", { href: a.href, className: cls, children: a.label }, i)) : (_jsx("button", { type: "button", className: cls, onClick: a.onClick, children: a.label }, i));
                }) }))] }));
}
//# sourceMappingURL=EmptyState.js.map