import * as React from 'react';
import { type FmtSettings } from './Fmt.js';
export interface LensProps extends Partial<FmtSettings> {
    /** Lens label rendered in the toggle (e.g. "EU view"). */
    label: string;
    children: React.ReactNode;
    /** Initial state. Default 'off'. */
    defaultOn?: boolean;
    /** Controlled state. */
    on?: boolean;
    /** Called when the user toggles the lens. */
    onChange?: (on: boolean) => void;
    className?: string;
    /**
     * When true, the lens additionally drives the `showRaw` FmtContext flag.
     * Switching the lens on enables raw-value rendering; switching it off
     * disables it. When a provider is mounted above, the change is propagated
     * via `setShowRaw`; otherwise the lens uses local state.
     */
    bindShowRaw?: boolean;
}
/**
 * Read-only Lens toggle. Wraps a subtree and lets the user temporarily
 * swap locale/timezone/currency for evidence/decision-record review —
 * without persisting any preference. The toggle is non-destructive:
 * underlying data and stored preferences are unchanged. The lens is
 * announced via the FmtContext `lensActive` flag so callers can render
 * a banner ("Showing data in EU view") when appropriate.
 */
export declare function Lens({ label, children, defaultOn, on: controlled, onChange, className, bindShowRaw, ...overrides }: LensProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Lens.d.ts.map