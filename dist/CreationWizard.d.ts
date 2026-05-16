import * as React from 'react';
export interface CreationWizardStep<TValues> {
    id: string;
    label: string;
    render: (context: CreationWizardStepContext<TValues>) => React.ReactNode;
}
export interface CreationWizardStepContext<TValues> {
    values: TValues;
    setValues: (updater: (current: TValues) => TValues) => void;
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