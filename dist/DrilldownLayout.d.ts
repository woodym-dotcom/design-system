/**
 * DrilldownLayout — two-pane list-detail surface with a draggable divider.
 *
 * Built on `useSplitPane` for resize state. The drag handle exposes
 * role="separator" / aria-orientation="vertical" / arrow-key nudge.
 *
 * An "Expand" button at the top of the detail pane fires
 * `onExpandFullScreen(selectedId)` when both prop+selection are present.
 */
import * as React from "react";
export interface DrilldownLayoutProps {
    listSlot: React.ReactNode;
    detailSlot: React.ReactNode;
    /** Id of the currently selected row in the list pane. */
    selectedId?: string;
    /** Called when the user clicks the "Expand" button. */
    onExpandFullScreen?: (id: string) => void;
    /** Pane storage namespace. Default "drilldown". */
    storageKey?: string;
    /** Initial left-pane percentage. Default 42. */
    defaultLeftPercent?: number;
    ariaLabel?: string;
    className?: string;
}
/**
 * @deprecated Since DS-SIMPLIFY 01. Use `<Overlay placement="drilldown">`
 *   instead. Removed at v1.0 (DS-SIMPLIFY 14).
 */
export declare function DrilldownLayout({ listSlot, detailSlot, selectedId, onExpandFullScreen, storageKey, defaultLeftPercent, ariaLabel, className, }: DrilldownLayoutProps): React.ReactElement;
//# sourceMappingURL=DrilldownLayout.d.ts.map