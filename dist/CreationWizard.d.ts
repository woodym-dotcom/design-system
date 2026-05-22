import * as React from 'react';
export interface CreationWizardStep<TValues> {
    id: string;
    label: string;
    render: (context: CreationWizardStepContext<TValues>) => React.ReactNode;
}
export interface CreationWizardStepContext<TValues> {
    values: TValues;
    setValues: (updater: (current: TValues) => TValues) => void;
    /** Advance to the next step. No-op on the last step. */
    next: () => void;
    /** Go back to the previous step. No-op on the first step. */
    back: () => void;
    /** Fire the wizard's onSubmit handler. */
    submit: () => Promise<void>;
    /** Zero-based index of the active step. */
    activeIndex: number;
    /** Total number of steps (including AI review step if present). */
    totalSteps: number;
}
export interface CreationWizardReviewResult {
    summary: string;
    suggestions?: string[];
    ok: boolean;
}
export interface CreationWizardProps<TValues> {
    steps: CreationWizardStep<TValues>[];
    initialValues: TValues;
    onSubmit: (values: TValues) => void | Promise<void>;
    /**
     * Optional AI-review final step. When present, an extra step is appended
     * after `steps` that calls `reviewer(values)` (consumer wires this to AA
     * Orchestrator — this primitive does not call any provider SDK).
     */
    aiReview?: {
        label?: string;
        reviewer: (values: TValues) => Promise<CreationWizardReviewResult>;
    };
    className?: string;
    submitLabel?: string;
}
export declare function CreationWizard<TValues>({ steps, initialValues, onSubmit, aiReview, className, submitLabel, }: CreationWizardProps<TValues>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CreationWizard.d.ts.map