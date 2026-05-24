/**
 * AuthLayout / AuthScreen -- login / signup / SSO callback layout.
 *
 * DS-MIG P1-01. Centered card layout with logo slot, form slot, and footer.
 * Based on the ui_kits/product/auth.jsx pattern but as a proper React
 * primitive with token-driven styling.
 *
 * Usage:
 *   <AuthLayout logo={<img src="..." />} footer="2024 CompanyCo">
 *     <LoginForm />
 *   </AuthLayout>
 *
 * Variants:
 *   - 'split'   -- brand panel left, form right (desktop default)
 *   - 'centered' -- single centered card (SSO callback, MFA, etc.)
 */
import * as React from 'react';
export type AuthLayoutVariant = 'split' | 'centered';
export interface AuthLayoutProps {
    /** Visual layout variant. Default: 'centered'. */
    variant?: AuthLayoutVariant;
    /** Logo or brand node rendered above the form area. */
    logo?: React.ReactNode;
    /** Headline text (only used in 'split' variant brand panel). */
    headline?: string;
    /** Tagline text (only used in 'split' variant brand panel). */
    tagline?: string;
    /** Footer content rendered below the form area. */
    footer?: React.ReactNode;
    /** The form content (children). */
    children: React.ReactNode;
    className?: string;
}
/**
 * AuthLayout -- canonical authentication page layout.
 *
 * Renders either a split brand+form layout or a centered card layout.
 * All colors use design tokens so it adapts to brand and theme automatically.
 */
export declare function AuthLayout({ variant, logo, headline, tagline, footer, children, className, }: AuthLayoutProps): React.ReactElement;
/** Alias for backward compatibility. */
export declare const AuthScreen: typeof AuthLayout;
//# sourceMappingURL=AuthLayout.d.ts.map