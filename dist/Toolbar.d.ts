/**
 * Toolbar / PrimaryActionBar — minimal toolbar with variant support.
 *
 * Variants:
 *   - "default"         — standard horizontal action bar.
 *   - "queue-position"  — shows a queue position indicator alongside actions.
 */
import * as React from "react";
export type ToolbarVariant = "default" | "queue-position";
export interface ToolbarAction {
    id: string;
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    variant?: "primary" | "ghost" | "danger";
}
export interface ToolbarProps {
    /** Visual variant. Default: "default". */
    variant?: ToolbarVariant;
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
    /** ARIA label for the toolbar region. */
    "aria-label"?: string;
    className?: string;
}
export declare function Toolbar({ variant, actions, queuePosition, queueTotal, leading, trailing, className, ...rest }: ToolbarProps): React.ReactElement;
/** Alias for backward-compat naming. */
export declare const PrimaryActionBar: typeof Toolbar;
export type PrimaryActionBarProps = ToolbarProps;
//# sourceMappingURL=Toolbar.d.ts.map