/**
 * @deprecated The wider primitives that consume this provider (ListPage,
 * ConfigurationsPage, ModuleShell, Page) all read the same router adapter via
 * `useModuleShellRouter`. New code should rely on the Page API instead; this
 * file remains for legacy primitives.
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

// ── Router adapter interface ──────────────────────────────────────────────────

export interface ModuleShellRouterAdapter {
  /** Read the current value of a search param. */
  getParam: (name: string) => string | null;
  /** Write a search param without full navigation. */
  setParam: (name: string, value: string) => void;
  /** Subscribe to param changes; return an unsubscribe function. */
  subscribe: (callback: () => void) => () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const ModuleShellRouterCtx = React.createContext<ModuleShellRouterAdapter | null>(null);

export interface ModuleShellProviderProps {
  adapter: ModuleShellRouterAdapter;
  children: React.ReactNode;
}

export function ModuleShellProvider({ adapter, children }: ModuleShellProviderProps) {
  return (
    <ModuleShellRouterCtx.Provider value={adapter}>
      {children}
    </ModuleShellRouterCtx.Provider>
  );
}

export function useModuleShellRouter(): ModuleShellRouterAdapter | null {
  return React.useContext(ModuleShellRouterCtx);
}
