/**
 * useSplitPane — wires a horizontal resize handle to a left-pane percentage,
 * persisted under `split-pane:${storageKey}` in localStorage.
 *
 * The hook returns:
 *  - containerRef → must be attached to the outer wrapper so the hook can
 *    measure its clientWidth during drag.
 *  - handleProps   → spread onto the drag handle div. Includes role="separator",
 *    aria-orientation="vertical", aria-valuemin/max/now, and the keyboard /
 *    pointer event handlers.
 *  - leftPercent   → current left pane percentage [min, max].
 *
 * Arrow Left/Right on the focused handle nudges by 2% within [min, max].
 */
import * as React from "react";
export interface UseSplitPaneOptions {
    /** Namespace under which the pane percentage is persisted. */
    storageKey: string;
    /** Initial percentage when storage is empty. Default 50. */
    defaultLeftPercent?: number;
    /** Minimum left pane percentage. Default 20. */
    minLeftPercent?: number;
    /** Maximum left pane percentage. Default 80. */
    maxLeftPercent?: number;
}
export interface UseSplitPaneResult {
    containerRef: React.RefObject<HTMLDivElement | null>;
    handleProps: React.HTMLAttributes<HTMLDivElement>;
    leftPercent: number;
}
export declare function useSplitPane({ storageKey, defaultLeftPercent, minLeftPercent, maxLeftPercent, }: UseSplitPaneOptions): UseSplitPaneResult;
//# sourceMappingURL=useSplitPane.d.ts.map