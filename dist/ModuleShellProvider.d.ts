/**
 * @deprecated The wider primitives that consume this provider (ListPage,
 * ConfigurationsPage, ModuleShell, ModuleTemplate) all read the same router
 * adapter via `useModuleShellRouter`. Until SIMPLIFY 14 deletes the legacy
 * primitives we keep this file available; new code should rely on the
 * ModuleTemplate API instead. (DS-SIMPLIFY 04)
 *
 * ModuleShellProvider — router adapter context for ModuleShell + friends.
 *
 * Consumers provide a ModuleShellRouterAdapter so the shell can read/write
 * the active tab from the router (TanStack, React Router, etc.) rather than
 * raw window.location.search.
 *
 * If no adapter is provided, the shell falls back to window.location.search.
 */
import * as React from 'react';
export interface ModuleShellRouterAdapter {
    /** Read the current value of a search param. */
    getParam: (name: string) => string | null;
    /** Write a search param without full navigation. */
    setParam: (name: string, value: string) => void;
    /** Subscribe to param changes; return an unsubscribe function. */
    subscribe: (callback: () => void) => () => void;
}
export interface ModuleShellProviderProps {
    adapter: ModuleShellRouterAdapter;
    children: React.ReactNode;
}
export declare function ModuleShellProvider({ adapter, children }: ModuleShellProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useModuleShellRouter(): ModuleShellRouterAdapter | null;
//# sourceMappingURL=ModuleShellProvider.d.ts.map