import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const VARIANT_META = {
    empty: {
        title: 'Nothing here yet',
        description: 'Add items to see them here.',
        tone: 'neutral',
        bannerRole: 'status',
        defaultIcon: '📁',
    },
    loading: {
        title: 'Loading…',
        tone: 'info',
        bannerRole: 'status',
        defaultIcon: '⏳',
    },
    error: {
        title: 'Something went wrong',
        description: 'An error occurred. Please try again.',
        tone: 'error',
        bannerRole: 'alert',
        defaultIcon: '⚠',
    },
    offline: {
        title: "You're offline",
        description: 'Check your connection and try again.',
        tone: 'warning',
        bannerRole: 'alert',
        defaultIcon: '📡',
    },
    stale: {
        title: 'Data may be out of date',
        description: 'Refresh to get the latest information.',
        tone: 'warning',
        bannerRole: 'status',
        defaultIcon: '🕐',
    },
    'not-found': {
        title: "We couldn't find that",
        description: 'The item you are looking for does not exist or has been removed.',
        tone: 'neutral',
        bannerRole: 'status',
        defaultIcon: '🔍',
    },
    forbidden: {
        title: "You don't have access",
        description: 'Contact your administrator to request access.',
        tone: 'warning',
        bannerRole: 'alert',
        defaultIcon: '🔒',
    },
    degraded: {
        title: 'Degraded service',
        description: 'Some features may be unavailable.',
        tone: 'warning',
        bannerRole: 'alert',
        defaultIcon: '⚡',
    },
};
// ── tone → CSS variable mapping (no hardcoded hex) ───────────────────────────
const TONE_VARS = {
    info: {
        bg: 'var(--info-light)',
        border: 'var(--info-border)',
        text: 'var(--info-text)',
    },
    warning: {
        bg: 'var(--warning-light)',
        border: 'var(--warning-border)',
        text: 'var(--warning-text)',
    },
    error: {
        bg: 'var(--error-light)',
        border: 'var(--error-border)',
        text: 'var(--error-text)',
    },
    neutral: {
        bg: 'var(--surface-2)',
        border: 'var(--border-1)',
        text: 'var(--text-2)',
    },
};
// ── page density (hero block) ────────────────────────────────────────────────
function PageState({ meta, title, description, icon, primaryAction, secondaryAction, className, }) {
    const vars = TONE_VARS[meta.tone];
    return (_jsxs("div", { role: "region", "aria-label": title, "data-state-density": "page", className: ['cc-state', 'cc-state--page', className].filter(Boolean).join(' '), style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-5, 1rem)',
            padding: 'var(--space-8, 2rem)',
            borderRadius: 'var(--radius-2, 8px)',
            background: vars.bg,
            border: `1px dashed ${vars.border}`,
            color: vars.text,
            textAlign: 'center',
        }, children: [_jsx("span", { className: "cc-state__icon", "aria-hidden": "true", style: { fontSize: '2rem', lineHeight: 1 }, children: icon ?? meta.defaultIcon }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2, 0.375rem)' }, children: [_jsx("p", { className: "cc-state__title", style: {
                            margin: 0,
                            fontWeight: 600,
                            fontSize: 'var(--text-lg, 1.125rem)',
                            color: vars.text,
                        }, children: title }), description && (_jsx("p", { className: "cc-state__description", style: {
                            margin: 0,
                            fontSize: 'var(--text-sm, 0.875rem)',
                            color: 'var(--text-3)',
                        }, children: description }))] }), (primaryAction || secondaryAction) && (_jsxs("div", { className: "cc-state__actions", style: { display: 'flex', gap: 'var(--space-3, 0.5rem)', flexWrap: 'wrap', justifyContent: 'center' }, children: [primaryAction && (_jsx("button", { type: "button", className: "cc-state__action cc-state__action--primary", onClick: primaryAction.onClick, style: {
                            padding: 'var(--space-2, 0.375rem) var(--space-4, 0.75rem)',
                            borderRadius: 'var(--radius-1, 4px)',
                            border: `1px solid ${vars.border}`,
                            background: vars.border,
                            color: vars.text,
                            cursor: 'pointer',
                            fontWeight: 500,
                        }, children: primaryAction.label })), secondaryAction && (_jsx("a", { href: secondaryAction.href, className: "cc-state__action cc-state__action--secondary", style: {
                            padding: 'var(--space-2, 0.375rem) var(--space-4, 0.75rem)',
                            borderRadius: 'var(--radius-1, 4px)',
                            border: `1px solid ${vars.border}`,
                            background: 'transparent',
                            color: vars.text,
                            textDecoration: 'none',
                            fontWeight: 500,
                        }, children: secondaryAction.label }))] }))] }));
}
// ── banner density (full-width strip) ────────────────────────────────────────
function BannerState({ variant, meta, title, description, icon, primaryAction, secondaryAction, className, }) {
    const vars = TONE_VARS[meta.tone];
    const role = meta.bannerRole;
    return (_jsxs("div", { role: role, "data-state-density": "banner", "data-variant": variant, className: ['cc-state', 'cc-state--banner', className].filter(Boolean).join(' '), style: {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3, 0.5rem)',
            padding: 'var(--space-3, 0.5rem) var(--space-5, 1rem)',
            background: vars.bg,
            borderBottom: `1px solid ${vars.border}`,
            color: vars.text,
            width: '100%',
            boxSizing: 'border-box',
        }, children: [_jsx("span", { className: "cc-state__icon", "aria-hidden": "true", style: { flexShrink: 0 }, children: icon ?? meta.defaultIcon }), _jsxs("div", { style: { flex: 1, display: 'flex', alignItems: 'baseline', gap: 'var(--space-2, 0.375rem)', flexWrap: 'wrap' }, children: [_jsx("strong", { className: "cc-state__title", style: { fontWeight: 600, fontSize: 'var(--text-sm, 0.875rem)' }, children: title }), description && (_jsx("span", { className: "cc-state__description", style: { fontSize: 'var(--text-sm, 0.875rem)', color: 'var(--text-3)' }, children: description }))] }), (primaryAction || secondaryAction) && (_jsxs("div", { style: { display: 'flex', gap: 'var(--space-2, 0.375rem)', flexShrink: 0 }, children: [primaryAction && (_jsx("button", { type: "button", className: "cc-state__action cc-state__action--primary", onClick: primaryAction.onClick, style: {
                            padding: 'var(--space-1, 0.25rem) var(--space-3, 0.5rem)',
                            borderRadius: 'var(--radius-1, 4px)',
                            border: `1px solid ${vars.border}`,
                            background: 'transparent',
                            color: vars.text,
                            cursor: 'pointer',
                            fontSize: 'var(--text-sm, 0.875rem)',
                            fontWeight: 500,
                        }, children: primaryAction.label })), secondaryAction && (_jsx("a", { href: secondaryAction.href, className: "cc-state__action cc-state__action--secondary", style: {
                            padding: 'var(--space-1, 0.25rem) var(--space-3, 0.5rem)',
                            borderRadius: 'var(--radius-1, 4px)',
                            color: vars.text,
                            textDecoration: 'none',
                            fontSize: 'var(--text-sm, 0.875rem)',
                        }, children: secondaryAction.label }))] }))] }));
}
// ── chip density (inline pill) ────────────────────────────────────────────────
function ChipState({ variant, meta, title, icon, className, }) {
    const vars = TONE_VARS[meta.tone];
    return (_jsxs("span", { "data-state-density": "chip", "data-variant": variant, className: ['cc-state', 'cc-state--chip', className].filter(Boolean).join(' '), style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1, 0.25rem)',
            padding: '0 var(--space-2, 0.375rem)',
            height: '1.5rem',
            borderRadius: '999px',
            background: vars.bg,
            border: `1px solid ${vars.border}`,
            color: vars.text,
            fontSize: 'var(--text-xs, 0.75rem)',
            fontWeight: 500,
            lineHeight: 1,
            whiteSpace: 'nowrap',
        }, children: [_jsx("span", { "aria-hidden": "true", style: { fontSize: '0.7em' }, children: icon ?? meta.defaultIcon }), title] }));
}
// ── public component ──────────────────────────────────────────────────────────
export function State({ variant, density = 'page', title, description, icon, primaryAction, secondaryAction, className, }) {
    const meta = VARIANT_META[variant];
    const resolvedTitle = title ?? meta.title;
    const resolvedDescription = description ?? meta.description;
    if (density === 'chip') {
        return (_jsx(ChipState, { variant: variant, meta: meta, title: resolvedTitle, icon: icon, className: className }));
    }
    if (density === 'banner') {
        return (_jsx(BannerState, { variant: variant, meta: meta, title: resolvedTitle, description: resolvedDescription, icon: icon, primaryAction: primaryAction, secondaryAction: secondaryAction, className: className }));
    }
    return (_jsx(PageState, { meta: meta, title: resolvedTitle, description: resolvedDescription, icon: icon, primaryAction: primaryAction, secondaryAction: secondaryAction, className: className }));
}
//# sourceMappingURL=State.js.map