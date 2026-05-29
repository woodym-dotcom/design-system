/**
 * UserMenu -- user popover with role/email/sign-out.
 *
 * DS-MIG P1-13. This is the standalone export of the UserMenu that
 * already exists inside AppShell. Extracted here for consumers
 * that need the user menu outside of the full AppShell.
 *
 * For the standard case, use AppShell which includes UserMenu
 * automatically.
 */
import * as React from 'react';
export interface UserMenuUser {
    id: string;
    name: string;
    email?: string;
    /** Role label displayed below the name. */
    role?: string;
    /** Initials shown in the avatar trigger. Falls back to name initials. */
    initials?: string;
}
export interface UserMenuProps {
    user: UserMenuUser;
    onSignOut: () => void;
    /** Additional menu items rendered before Sign out. */
    extraItems?: Array<{
        id: string;
        label: string;
        onClick: () => void;
    }>;
    className?: string;
}
/**
 * UserMenu -- avatar-triggered dropdown with user info and sign-out.
 * ARIA menu pattern with Escape-to-close and outside-click-to-close.
 */
export declare function UserMenu({ user, onSignOut, extraItems, className, }: UserMenuProps): React.ReactElement;
//# sourceMappingURL=UserMenu.d.ts.map