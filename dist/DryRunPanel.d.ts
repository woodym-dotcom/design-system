/**
 * DryRunPanel — blast-radius preview panel.
 *
 * Shows affected entities grouped by risk level with confirm/cancel actions.
 * Used before destructive or wide-reaching operations to give users a
 * visual preview of what will change and how risky the change is.
 *
 * Usage:
 *   <DryRunPanel
 *     title="Apply policy change"
 *     entities={[
 *       { id: '1', label: 'Acme Corp', risk: 'high' },
 *       { id: '2', label: 'Widget Ltd', risk: 'low' },
 *     ]}
 *     onConfirm={() => apply()}
 *     onCancel={() => dismiss()}
 *   />
 */
import * as React from "react";
export type DryRunRiskLevel = "low" | "medium" | "high" | "critical";
export interface DryRunEntity {
    id: string;
    label: string;
    risk: DryRunRiskLevel;
    /** Optional description of the change for this entity. */
    description?: string;
}
export interface DryRunPanelProps {
    /** Panel heading. */
    title: string;
    /** Description of the operation being previewed. */
    description?: string;
    /** Affected entities with their risk levels. */
    entities: DryRunEntity[];
    /** Called when user confirms the operation. */
    onConfirm: () => void;
    /** Called when user cancels. */
    onCancel: () => void;
    /** Label for the confirm button. Default: "Confirm". */
    confirmLabel?: string;
    /** Label for the cancel button. Default: "Cancel". */
    cancelLabel?: string;
    /** Disable confirm (e.g. while processing). */
    confirmDisabled?: boolean;
    className?: string;
}
export declare function DryRunPanel({ title, description, entities, onConfirm, onCancel, confirmLabel, cancelLabel, confirmDisabled, className, }: DryRunPanelProps): React.ReactElement;
//# sourceMappingURL=DryRunPanel.d.ts.map