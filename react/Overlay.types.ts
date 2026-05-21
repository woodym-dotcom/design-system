/**
 * Overlay — discriminated-union prop types.
 *
 * One `placement` discriminator selects between 6 overlay surfaces:
 *
 *   - 'modal'        → centred modal dialog with backdrop (was Modal)
 *   - 'drawer-right' → edge-anchored slide-in from the right (was Drawer right)
 *   - 'drawer-left'  → edge-anchored slide-in from the left (was Drawer left)
 *   - 'detail-right' → non-modal detail pane that shifts page content
 *                       (was DetailPane / ExpandableDetailPane / ArtefactDetailPane)
 *   - 'drilldown'    → split-pane list/detail layout (was DrilldownLayout)
 *   - 'fullscreen'   → full-viewport detail surface (was FullScreenDetail)
 *
 * TypeScript prop narrowing: `resizable` and `onResize` are only valid on
 * `drawer-right`, `drawer-left`, and `detail-right`. `expandable` is only
 * valid on `drawer-right`, `detail-right`, and `fullscreen`. Other combos
 * are rejected at compile time via the discriminated union below.
 */
import type * as React from "react";

export type OverlayPlacement =
  | "modal"
  | "drawer-right"
  | "drawer-left"
  | "detail-right"
  | "drilldown"
  | "fullscreen";

export type OverlaySize = "sm" | "md" | "lg" | "xl" | "auto";

export interface OverlaySection {
  heading?: React.ReactNode;
  content: React.ReactNode;
}

/** Shared base props common to all placements. */
interface OverlayBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: OverlaySize;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  /**
   * Optional structured content. Each section renders with its heading
   * and content stacked vertically. Mutually exclusive with `children` —
   * if both are passed, `sections` wins.
   */
  sections?: OverlaySection[];
  /** Alternative to `sections` — render arbitrary content in the body. */
  children?: React.ReactNode;
  /** Defaults to true. When false, ESC + backdrop click do not close. */
  dismissible?: boolean;
  ariaLabel?: string;
  /** §18 audit metadata when content is AI-generated. */
  source?: { model?: string; promptVersion?: string };
  className?: string;
}

// ── per-placement constraints ────────────────────────────────────────────────

interface ModalProps extends OverlayBaseProps {
  placement: "modal";
  /** Not supported on modal — modal width is fixed by `size`. */
  resizable?: never;
  onResize?: never;
  /** Not supported on modal. Use `placement: 'fullscreen'` for full-viewport. */
  expandable?: never;
}

interface DrawerRightProps extends OverlayBaseProps {
  placement: "drawer-right";
  resizable?: boolean;
  onResize?: (widthPx: number) => void;
  expandable?: boolean;
}

interface DrawerLeftProps extends OverlayBaseProps {
  placement: "drawer-left";
  resizable?: boolean;
  onResize?: (widthPx: number) => void;
  /** Not supported on left drawer. */
  expandable?: never;
}

interface DetailRightProps extends OverlayBaseProps {
  placement: "detail-right";
  resizable?: boolean;
  onResize?: (widthPx: number) => void;
  expandable?: boolean;
}

interface DrilldownProps extends OverlayBaseProps {
  placement: "drilldown";
  /** Left pane content for drilldown placement. */
  listSlot?: React.ReactNode;
  /** Initial left pane percentage (20–80). Default 42. */
  defaultLeftPercent?: number;
  resizable?: never;
  onResize?: never;
  expandable?: never;
}

interface FullScreenProps extends OverlayBaseProps {
  placement: "fullscreen";
  /** Not supported on fullscreen — already maximised. */
  resizable?: never;
  onResize?: never;
  /** Allow collapsing back from fullscreen to a detail pane. */
  expandable?: boolean;
}

export type OverlayProps =
  | ModalProps
  | DrawerRightProps
  | DrawerLeftProps
  | DetailRightProps
  | DrilldownProps
  | FullScreenProps;
