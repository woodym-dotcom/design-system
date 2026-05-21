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
import { useSplitPane } from "./hooks/useSplitPane";
import { Button } from "./Button";

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
export function DrilldownLayout({
  listSlot,
  detailSlot,
  selectedId,
  onExpandFullScreen,
  storageKey = "drilldown",
  defaultLeftPercent = 42,
  ariaLabel,
  className,
}: DrilldownLayoutProps): React.ReactElement {
  const { containerRef, handleProps, leftPercent } = useSplitPane({
    storageKey,
    defaultLeftPercent,
  });

  const canExpand = Boolean(selectedId && onExpandFullScreen);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={ariaLabel}
      className={["cc-drilldown", className].filter(Boolean).join(" ")}
      style={{ gridTemplateColumns: `${leftPercent}% 6px 1fr` }}
    >
      <div className="cc-drilldown__list">{listSlot}</div>
      <div className="cc-drilldown__handle" {...handleProps} />
      <div className="cc-drilldown__detail">
        {canExpand ? (
          <div className="cc-drilldown__detail-toolbar">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onExpandFullScreen?.(selectedId!)}
            >
              Expand
            </Button>
          </div>
        ) : null}
        <div className="cc-drilldown__detail-body">{detailSlot}</div>
      </div>
    </div>
  );
}
