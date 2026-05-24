import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AuthLayout -- canonical authentication page layout.
 *
 * Renders either a split brand+form layout or a centered card layout.
 * All colors use design tokens so it adapts to brand and theme automatically.
 */
export function AuthLayout({ variant = 'centered', logo, headline, tagline, footer, children, className, }) {
    if (variant === 'split') {
        return (_jsxs("div", { className: ['cc-auth', 'cc-auth--split', className].filter(Boolean).join(' '), style: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                minHeight: '100vh',
                background: 'var(--surface-1)',
            }, children: [_jsx("aside", { className: "cc-auth__brand", style: {
                        display: 'grid',
                        placeItems: 'center',
                        background: 'var(--surface-invert, var(--ink-0, #1a1a1a))',
                        color: 'var(--text-on-invert, var(--paper-ink, #f5f0eb))',
                        padding: 'var(--space-8)',
                        position: 'relative',
                        overflow: 'hidden',
                    }, children: _jsxs("div", { className: "cc-auth__brand-inner", style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-5)',
                            maxWidth: 480,
                        }, children: [logo && _jsx("div", { className: "cc-auth__logo", children: logo }), headline && (_jsx("h1", { className: "cc-auth__headline", style: {
                                    margin: 0,
                                    fontSize: 'var(--text-4xl, 2.25rem)',
                                    fontWeight: 700,
                                    lineHeight: 1.1,
                                    letterSpacing: '-0.03em',
                                }, children: headline })), tagline && (_jsx("p", { className: "cc-auth__tagline", style: {
                                    margin: 0,
                                    fontSize: 'var(--text-md, 1rem)',
                                    lineHeight: 1.6,
                                    opacity: 0.65,
                                    maxWidth: 420,
                                }, children: tagline }))] }) }), _jsx("main", { className: "cc-auth__form", style: {
                        display: 'grid',
                        placeItems: 'center',
                        padding: 'var(--space-8)',
                    }, children: _jsxs("div", { className: "cc-auth__form-inner", style: {
                            width: '100%',
                            maxWidth: 380,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-5)',
                        }, children: [children, footer && (_jsx("footer", { className: "cc-auth__footer", style: {
                                    textAlign: 'center',
                                    fontSize: 'var(--text-sm, 0.875rem)',
                                    color: 'var(--text-3)',
                                }, children: footer }))] }) })] }));
    }
    // Centered variant (default)
    return (_jsx("div", { className: ['cc-auth', 'cc-auth--centered', className].filter(Boolean).join(' '), style: {
            display: 'grid',
            placeItems: 'center',
            minHeight: '100vh',
            background: 'var(--surface-1)',
            padding: 'var(--space-8)',
        }, children: _jsxs("main", { className: "cc-auth__card", style: {
                width: '100%',
                maxWidth: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-6)',
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-lg, 12px)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-1)',
                boxShadow: 'var(--shadow-2)',
            }, children: [logo && _jsx("div", { className: "cc-auth__logo", children: logo }), _jsx("div", { className: "cc-auth__form-inner", style: {
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-5)',
                    }, children: children }), footer && (_jsx("footer", { className: "cc-auth__footer", style: {
                        textAlign: 'center',
                        fontSize: 'var(--text-sm, 0.875rem)',
                        color: 'var(--text-3)',
                    }, children: footer }))] }) }));
}
/** Alias for backward compatibility. */
export const AuthScreen = AuthLayout;
//# sourceMappingURL=AuthLayout.js.map