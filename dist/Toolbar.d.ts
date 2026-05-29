/**
 * Toolbar / PrimaryActionBar — minimal toolbar with variant + mode support.
 *
 * Variants:
 *   - "default"         — standard horizontal action bar.
 *   - "queue-position"  — shows a queue position indicator alongside actions.
 *
 * Modes:
 *   - "default" (default) — standard toolbar appearance.
 *   - "bulk" — sticky bottom (or top) bar that surfaces when a list has a
 *     non-zero selection. Subsumes the legacy `BulkBar` primitive. Pair with
 *     `useMultiSelect`. Renders nothing when `selectedCount === 0`.
 */
import * as React from "react";
export type ToolbarVariant = "default" | "queue-position";
export type ToolbarMode = "default" | "bulk";
export type ToolbarBulkPosition = "bottom" | "top";
export interface ToolbarAction {
    id: string;
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    variant?: "primary" | "ghost" | "danger";
    /** bulk mode tone alias for `variant`. Accepts "default" | "primary" | "danger". */
    tone?: "default" | "primary" | "danger";
}
export interface ToolbarProps {
    /** Visual variant. Default: "default". */
    variant?: ToolbarVariant;
    /**
     * Toolbar mode.
     *  - "default" (default): renders as a standard toolbar.
     *  - "bulk": renders only when `selectedCount > 0`; styled as a sticky bulk
     *    action bar with selection count + clear control. Subsumes BulkBar.
     */
    mode?: ToolbarMode;
    /** Action buttons rendered in the bar. */
    actions?: ToolbarAction[];
    /** Queue position number (queue-position variant). */
    queuePosition?: number;
    /** Total queue size (queue-position variant). */
    queueTotal?: number;
    /** Leading content slot (e.g. title, breadcrumb). */
    leading?: React.ReactNode;
    /** Trailing content slot (e.g. status indicators). */
    trailing?: React.ReactNode;
    /** bulk-mode: number of items currently selected. Hidden when 0. */
    selectedCount?: number;
    /** bulk-mode: called when the user clicks the clear-selection control. */
    onClear?: () => void;
    /** bulk-mode: optional meta rendered next to the count. */
    meta?: React.ReactNode;
    /** bulk-mode: sticky position. Default 'bottom'. */
    position?: ToolbarBulkPosition;
    /** ARIA label for the toolbar region. */
    "aria-label"?: string;
    className?: string;
}
export declare function Toolbar({ variant, mode, actions, queuePosition, queueTotal, leading, trailing, selectedCount, onClear, meta, position, className, ...rest }: ToolbarProps): React.ReactElement | null;
//# sourceMappingURL=Toolbar.d.ts.map