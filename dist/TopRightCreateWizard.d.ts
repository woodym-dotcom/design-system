import { type CreationWizardProps } from './CreationWizard';
export type TopRightCreateWizardVariant = 'manual' | 'ai';
/**
 * AI variant configuration. Generic on TProcessKey to allow callers to narrow the allowed
 * process key values to a string-literal union (e.g. RegisteredProcessKey from @aa/api-client).
 * The DS itself remains dependency-free from @aa/api-client.
 */
export interface AiCreateConfig<TValues, TProcessKey extends string = string> {
    /**
     * The registered AA Orchestrator process key to invoke. When TProcessKey is narrowed to a
     * string-literal union (RegisteredProcessKey), TypeScript rejects unregistered keys at
     * compile time — the §18 guardrail at the component boundary.
     */
    processKey: TProcessKey;
    /**
     * Async function that fires the process and returns a structured output map.
     * The caller is responsible for wiring this to aaApiClient.aiWizard.run — the wizard
     * itself makes no HTTP calls and imports no provider SDK.
     */
    runProcess: (processKey: TProcessKey, inputs: Record<string, unknown>) => Promise<{
        output: Record<string, unknown>;
        parsedOk: boolean;
    }>;
    /**
     * Project the AI output payload into wizard form values for the human review step.
     * Partial<TValues> so callers may map only the fields they want pre-filled.
     */
    projectResult: (output: Record<string, unknown>) => Partial<TValues>;
    /**
     * Label for the free-text prompt input shown in the AI panel.
     * Default: "Describe what to create"
     */
    promptLabel?: string;
    /**
     * Placeholder text for the prompt input.
     * Default: "e.g. Create a vendor called Acme Corp in the software category"
     */
    promptPlaceholder?: string;
}
export interface TopRightCreateWizardProps<TValues, TProcessKey extends string = string> {
    /**
     * Variant. 'manual' uses the full wizard flow; 'ai' uses AI-assisted creation.
     * Default: 'manual'.
     */
    variant?: TopRightCreateWizardVariant;
    /** Label for the trigger button. Default: "Create". */
    triggerLabel?: string;
    /** Title shown in the modal header. */
    modalTitle: string;
    /** Props forwarded to <CreationWizard> (used as the review/save step in both variants). */
    wizard: Omit<CreationWizardProps<TValues>, 'className'>;
    /**
     * AI variant config. Required when variant='ai'. The generic TProcessKey enables
     * TypeScript enforcement of registered process keys at the call site.
     */
    aiConfig?: AiCreateConfig<TValues, TProcessKey>;
    /** Called after the wizard submits and the modal closes. */
    onComplete?: () => void;
    /** Extra class for the trigger button. */
    className?: string;
}
export declare function TopRightCreateWizard<TValues, TProcessKey extends string = string>({ variant, triggerLabel, modalTitle, wizard, aiConfig, onComplete, className, }: TopRightCreateWizardProps<TValues, TProcessKey>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TopRightCreateWizard.d.ts.map