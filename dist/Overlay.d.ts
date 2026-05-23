/**
 * Overlay — the single overlay primitive that subsumes the legacy stack
 * (Modal, Drawer, DetailPane, ExpandableDetailPane, ArtefactDetailPane,
 * DrilldownLayout, FullScreenDetail).
 *
 * Behaviour is selected by the `placement` discriminator (see
 * `Overlay.types.ts` for the union). Owns:
 *
 *  - focus trap (via `useFocusTrap`) for modal-class placements
 *  - ESC + backdrop dismissal, gated by `dismissible`
 *  - body scroll lock for modal/drawer
 *  - drag-to-resize for resizable placements
 *  - expandable → fullscreen toggle
 *  - portal mount to <body>
 *  - ARIA role: `dialog` (modal/drawer), `complementary` (detail/drilldown),
 *    `region` (fullscreen)
 *
 * The legacy primitives remain as `@deprecated` re-exports until SIMPLIFY 14.
 */
import * as React from "react";
import type { OverlayProps } from "./Overlay.types";
export type { OverlayPlacement, OverlayProps, OverlaySection, OverlaySize, } from "./Overlay.types";
export declare function Overlay(props: OverlayProps): React.ReactElement | null;
//# sourceMappingURL=Overlay.d.ts.map