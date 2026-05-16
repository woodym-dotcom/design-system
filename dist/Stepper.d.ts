/**
 * Stepper — horizontal step-progress indicator.
 *
 * Renders numbered circles (filled accent = current, checkmark green =
 * completed, outlined muted = pending) with a label below each step.
 * Reusable across multi-step flows: onboarding wizards, settings flows,
 * Dana/PRD wizards, etc.
 *
 * Styles use @ds/core tokens exclusively — no hardcoded values.
 */
import * as React from "react";
export type StepStatus = "completed" | "current" | "pending";
export interface StepperStep {
    id: string;
    label: string;
    status: StepStatus;
}
export interface StepperProps {
    steps: StepperStep[];
    ariaLabel?: string;
}
export declare function Stepper({ steps, ariaLabel }: StepperProps): React.ReactElement;
//# sourceMappingURL=Stepper.d.ts.map