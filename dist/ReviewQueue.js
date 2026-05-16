import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ── Component ─────────────────────────────────────────────────────────────────
export function ReviewQueue({ items, onApprove, onReject, onEscalate, customActions, isLoading = false, emptyState, className, }) {
    const classes = ['cc-review-queue'];
    if (className)
        classes.push(className);
    if (isLoading) {
        return (_jsx("div", { className: classes.join(' '), "aria-busy": "true", children: _jsx("div", { className: "cc-review-queue__loading", "aria-label": "Loading review queue", children: "Loading\u2026" }) }));
    }
    if (items.length === 0) {
        return (_jsx("div", { className: classes.join(' '), children: _jsx("div", { className: "cc-review-queue__empty", children: emptyState ?? 'No items to review.' }) }));
    }
    return (_jsx("div", { className: classes.join(' '), children: _jsx("ul", { className: "cc-review-queue__list", role: "list", children: items.map((item) => (_jsxs("li", { className: "cc-review-queue__item", children: [_jsxs("div", { className: "cc-review-queue__item-body", children: [_jsx("p", { className: "cc-review-queue__item-title", children: item.title }), item.meta ? (_jsx("p", { className: "cc-review-queue__item-meta", children: item.meta })) : null] }), _jsxs("div", { className: "cc-review-queue__item-actions", children: [_jsx("button", { type: "button", className: "cc-btn cc-btn--primary cc-btn--sm", onClick: () => onApprove(item), children: "Approve" }), _jsx("button", { type: "button", className: "cc-btn cc-btn--danger cc-btn--sm", onClick: () => onReject(item), children: "Reject" }), onEscalate ? (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", onClick: () => onEscalate(item), children: "Escalate" })) : null, customActions?.map((action) => {
                                const disabled = action.isDisabled?.(item) ?? false;
                                return (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", disabled: disabled, "aria-disabled": disabled, onClick: () => { if (!disabled)
                                        action.onAction(item); }, children: action.label }, action.label));
                            })] })] }, item.id))) }) }));
}
//# sourceMappingURL=ReviewQueue.js.map