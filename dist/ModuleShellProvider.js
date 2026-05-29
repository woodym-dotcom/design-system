import { jsx as _jsx } from "react/jsx-runtime";
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
// ── Context ───────────────────────────────────────────────────────────────────
const ModuleShellRouterCtx = React.createContext(null);
export function ModuleShellProvider({ adapter, children }) {
    return (_jsx(ModuleShellRouterCtx.Provider, { value: adapter, children: children }));
}
export function useModuleShellRouter() {
    return React.useContext(ModuleShellRouterCtx);
}
//# sourceMappingURL=ModuleShellProvider.js.map