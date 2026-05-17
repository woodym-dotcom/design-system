import * as React from 'react';
export type LiveRegionPoliteness = 'polite' | 'assertive';
export interface LiveRegionProps {
    /** Message announced to AT. Set to '' to clear. */
    message: string;
    /** ARIA live politeness. */
    politeness?: LiveRegionPoliteness;
    /** Auto-clear the message after this many ms (default: 1500). 0 disables. */
    clearAfterMs?: number;
    /** Optional aria-atomic override. Defaults to true. */
    atomic?: boolean;
    className?: string;
}
/**
 * Visually-hidden ARIA live region for announcing transient changes (toast
 * fired, item deleted, undo available). Mount once near the app root and
 * drive via `useAnnounce` — multiple `LiveRegion`s are valid but discouraged.
 */
export declare function LiveRegion({ message, politeness, clearAfterMs, atomic, className, }: LiveRegionProps): import("react/jsx-runtime").JSX.Element;
interface AnnounceContextValue {
    announce: (message: string, politeness?: LiveRegionPoliteness) => void;
}
export interface AnnounceProviderProps {
    children: React.ReactNode;
}
/**
 * Hosts two live regions (polite + assertive) and exposes `useAnnounce` so
 * descendants can announce changes from anywhere in the tree.
 */
export declare function AnnounceProvider({ children }: AnnounceProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useAnnounce(): AnnounceContextValue['announce'];
export {};
//# sourceMappingURL=LiveRegion.d.ts.map