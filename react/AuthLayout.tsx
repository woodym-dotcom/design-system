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
export function AuthLayout({
  variant = 'centered',
  logo,
  headline,
  tagline,
  footer,
  children,
  className,
}: AuthLayoutProps): React.ReactElement {
  if (variant === 'split') {
    return (
      <div
        className={['cc-auth', 'cc-auth--split', className].filter(Boolean).join(' ')}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '100vh',
          background: 'var(--surface-1)',
        }}
      >
        <aside
          className="cc-auth__brand"
          style={{
            display: 'grid',
            placeItems: 'center',
            background: 'var(--surface-invert, var(--ink-0, #1a1a1a))',
            color: 'var(--text-on-invert, var(--paper-ink, #f5f0eb))',
            padding: 'var(--space-8)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            className="cc-auth__brand-inner"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-5)',
              maxWidth: 480,
            }}
          >
            {logo && <div className="cc-auth__logo">{logo}</div>}
            {headline && (
              <h1
                className="cc-auth__headline"
                style={{
                  margin: 0,
                  fontSize: 'var(--text-4xl, 2.25rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                }}
              >
                {headline}
              </h1>
            )}
            {tagline && (
              <p
                className="cc-auth__tagline"
                style={{
                  margin: 0,
                  fontSize: 'var(--text-md, 1rem)',
                  lineHeight: 1.6,
                  opacity: 0.65,
                  maxWidth: 420,
                }}
              >
                {tagline}
              </p>
            )}
          </div>
        </aside>
        <main
          className="cc-auth__form"
          style={{
            display: 'grid',
            placeItems: 'center',
            padding: 'var(--space-8)',
          }}
        >
          <div
            className="cc-auth__form-inner"
            style={{
              width: '100%',
              maxWidth: 380,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-5)',
            }}
          >
            {children}
            {footer && (
              <footer
                className="cc-auth__footer"
                style={{
                  textAlign: 'center',
                  fontSize: 'var(--text-sm, 0.875rem)',
                  color: 'var(--text-3)',
                }}
              >
                {footer}
              </footer>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Centered variant (default)
  return (
    <div
      className={['cc-auth', 'cc-auth--centered', className].filter(Boolean).join(' ')}
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        background: 'var(--surface-1)',
        padding: 'var(--space-8)',
      }}
    >
      <main
        className="cc-auth__card"
        style={{
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
        }}
      >
        {logo && <div className="cc-auth__logo">{logo}</div>}
        <div
          className="cc-auth__form-inner"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
          }}
        >
          {children}
        </div>
        {footer && (
          <footer
            className="cc-auth__footer"
            style={{
              textAlign: 'center',
              fontSize: 'var(--text-sm, 0.875rem)',
              color: 'var(--text-3)',
            }}
          >
            {footer}
          </footer>
        )}
      </main>
    </div>
  );
}

/** Alias for backward compatibility. */
export const AuthScreen = AuthLayout;
