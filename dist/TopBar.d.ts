/**
 * @deprecated Internal as of DS-SIMPLIFY 05. Use `AppShell` from
 * `@ds/core/react` instead. TopBar is no longer publicly exported.
 *
 * TopBar — single-row app chrome (brand left, controls right).
 *
 * Composes the existing ThemeToggle, a Cmd+K trigger Button, an optional
 * extras slot, and an identity button rendering initials in a circle.
 * Brand is a free-form ReactNode prop — no hardcoded app name.
 */
import * as React from "react";
export interface TopBarProps {
    /** Brand slot (logo + product name). */
    brand?: React.ReactNode;
    /** Identity initials shown in the right-hand identity button. */
    identity?: string;
    /** Show the Cmd+K trigger. Default true. */
    showCmdK?: boolean;
    /** Click handler for the Cmd+K trigger. */
    onCmdK?: () => void;
    /** Click handler for the identity button. */
    onIdentityClick?: () => void;
    /** Free-form slot rendered between extras and the identity button. */
    extras?: React.ReactNode;
    className?: string;
}
export declare function TopBar({ brand, identity, showCmdK, onCmdK, onIdentityClick, extras, className, }: TopBarProps): React.ReactElement;
//# sourceMappingURL=TopBar.d.ts.map