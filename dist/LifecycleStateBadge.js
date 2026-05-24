import { jsx as _jsx } from "react/jsx-runtime";
function lifecycleTone(status) {
    switch (status) {
        case 'active':
        case 'approved':
        case 'auto_approved':
        case 'break_glass_post_hoc_approved':
        case 'ratification':
            return 'success';
        case 'proposed':
        case 'queued':
        case 'break_glass_queued':
        case 'draining-version':
            return 'warning';
        case 'draft':
            return 'accent';
        case 'rejected':
        case 'break_glass_post_hoc_rejected':
            return 'danger';
        case 'superseded':
        case 'break_glass_post_hoc_pending_closure':
            return 'neutral';
        default:
            return 'neutral';
    }
}
/**
 * Renders a lifecycle state label as a colour-coded badge.
 *
 * Maps governance case state machine and policy lifecycle states
 * (draft / proposed / active / superseded / rejected) to semantic color tones.
 * Uses the underlying design system tone CSS classes for consistent styling.
 */
export function LifecycleStateBadge({ status, children }) {
    const tone = lifecycleTone(status);
    const displayText = children ?? status;
    // Normalise 'danger' → 'error' for CSS class names (unified tone mapping).
    const cssTone = tone === 'danger' ? 'error' : tone;
    const className = cssTone !== 'neutral' ? `cc-chip cc-chip--${cssTone}` : 'cc-chip';
    return _jsx("span", { className: className, children: displayText });
}
//# sourceMappingURL=LifecycleStateBadge.js.map