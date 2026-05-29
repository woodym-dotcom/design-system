/**
 * AppSwitcher -- cross-app navigation dropdown.
 *
 * DS-MIG P1-12. This is the standalone export of the AppSwitcher that
 * already exists inside AppShell. It is extracted here for
 * consumers that need the app-switching dropdown outside of the full
 * AppShell (e.g., in a custom shell or embedded view).
 *
 * For the standard case, use AppShell which includes AppSwitcher
 * automatically.
 */
import * as React from 'react';
export interface AppSwitcherApp {
    key: string;
    label: string;
    url: string;
}
export interface AppSwitcherProps {
    apps: AppSwitcherApp[];
    currentAppKey: string;
    onSwitch: (key: string, url: string) => void;
    className?: string;
}
/**
 * AppSwitcher -- dropdown for switching between platform applications.
 * ARIA menu pattern with Escape-to-close and outside-click-to-close.
 */
export declare function AppSwitcher({ apps, currentAppKey, onSwitch, className, }: AppSwitcherProps): React.ReactElement;
//# sourceMappingURL=AppSwitcher.d.ts.map