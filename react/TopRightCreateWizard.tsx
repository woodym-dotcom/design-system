/**
 * <TopRightCreateWizard> — top-right Create button that opens a wizard modal/drawer.
 *
 * §14 L2: composes CreateMenu (trigger) + CreationWizard (the stepped form)
 * from the existing DS exports. Does NOT re-implement either primitive.
 *
 * Two variants:
 *  - 'manual'  — standard form flow via CreationWizard steps.
 *  - 'ai'      — AI-assisted creation flow (Phase 6.1).
 *               User enters a prompt → aiConfig.runProcess fires → result projected into
 *               wizard form values via aiConfig.projectResult → user reviews & saves.
 *               Manual review step is always preserved before commit.
 *
 * AI variant architectural contract (§18):
 *  The aiConfig.runProcess callback is the ONLY injection point. The component itself
 *  contains zero provider SDK calls. Callers in AA wire this to aaApiClient.aiWizard.run,
 *  typed against RegisteredProcessKey. The generic type parameter TProcessKey (default: string)
 *  enables callers to narrow the processKey to a string-literal union at the call site:
 *
 *    <TopRightCreateWizard<VendorValues, RegisteredProcessKey>
 *      aiConfig={{
 *        processKey: "echo-v1",            // ← fails type-check if not in the union
 *        runProcess: (key, inputs) => aaApiClient.aiWizard.run({ processKey: key, inputs }),
 *        projectResult: (output) => ({ name: String(output.name ?? '') }),
 *      }}
 *    />
 *
 * Accessibility:
 *  - Modal uses role="dialog" aria-modal aria-labelledby.
 *  - Focus trapped within modal; Escape closes.
 *  - Trigger button has aria-haspopup="dialog".
 */
import * as React from 'react';
import { CreationWizard, type CreationWizardProps } from './CreationWizard';

// ── Types ─────────────────────────────────────────────────────────────────────

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
  runProcess: (
    processKey: TProcessKey,
    inputs: Record<string, unknown>,
  ) => Promise<{ output: Record<string, unknown>; parsedOk: boolean }>;
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

// ── AI variant run state ──────────────────────────────────────────────────────

type AiRunState =
  | { phase: 'idle' }
  | { phase: 'running' }
  | { phase: 'projected'; projectedValues: Record<string, unknown>; parsedOk: boolean }
  | { phase: 'error'; message: string };

// ── Focus trap helpers ────────────────────────────────────────────────────────

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex="0"]',
  '[contenteditable=true]',
].join(', ');

// ── AI Panel ──────────────────────────────────────────────────────────────────

interface AiPanelProps<TValues, TProcessKey extends string> {
  config: AiCreateConfig<TValues, TProcessKey>;
  onProjected: (values: Partial<TValues>, parsedOk: boolean) => void;
}

function AiPanel<TValues, TProcessKey extends string>({
  config,
  onProjected,
}: AiPanelProps<TValues, TProcessKey>) {
  const [prompt, setPrompt] = React.useState('');
  const [runState, setRunState] = React.useState<AiRunState>({ phase: 'idle' });

  const promptLabel = config.promptLabel ?? 'Describe what to create';
  const promptPlaceholder =
    config.promptPlaceholder ?? 'e.g. Create a vendor called Acme Corp in the software category';

  const handleRun = async () => {
    if (!prompt.trim()) return;
    setRunState({ phase: 'running' });
    try {
      const inputs: Record<string, unknown> = { prompt: prompt.trim() };
      const result = await config.runProcess(config.processKey, inputs);
      const projected = config.projectResult(result.output);
      setRunState({ phase: 'projected', projectedValues: result.output, parsedOk: result.parsedOk });
      onProjected(projected, result.parsedOk);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI process failed';
      setRunState({ phase: 'error', message: msg });
    }
  };

  return (
    <div className="cc-ai-panel">
      <div className="cc-ai-panel__prompt-row">
        <label className="cc-ai-panel__label" htmlFor="cc-ai-prompt">
          {promptLabel}
        </label>
        <textarea
          id="cc-ai-prompt"
          className="cc-ai-panel__textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={promptPlaceholder}
          rows={3}
          disabled={runState.phase === 'running'}
        />
      </div>

      {runState.phase === 'error' ? (
        <p className="cc-ai-panel__error" role="alert">
          {runState.message}
        </p>
      ) : null}

      {runState.phase === 'projected' ? (
        <p className="cc-ai-panel__success" role="status">
          {runState.parsedOk
            ? 'AI result ready — review the pre-filled form below before saving.'
            : 'AI result projected with low confidence — please review carefully.'}
        </p>
      ) : null}

      <button
        type="button"
        className="cc-btn cc-btn--ai cc-ai-panel__run-btn"
        onClick={handleRun}
        disabled={runState.phase === 'running' || !prompt.trim()}
        aria-busy={runState.phase === 'running'}
      >
        {runState.phase === 'running' ? 'Generating…' : 'Generate with AI'}
      </button>

      {runState.phase === 'projected' ? (
        <p className="cc-text-muted cc-ai-panel__note" style={{ fontSize: 'var(--text-sm)' }}>
          Process: <code>{config.processKey}</code>
        </p>
      ) : null}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TopRightCreateWizard<TValues, TProcessKey extends string = string>({
  variant = 'manual',
  triggerLabel = 'Create',
  modalTitle,
  wizard,
  aiConfig,
  onComplete,
  className,
}: TopRightCreateWizardProps<TValues, TProcessKey>) {
  const [open, setOpen] = React.useState(false);
  const [aiProjected, setAiProjected] = React.useState(false);
  // When AI projects values, we merge them into the wizard's initial values for the review step.
  const [mergedInitialValues, setMergedInitialValues] = React.useState<TValues>(
    wizard.initialValues,
  );
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const titleId = React.useId();

  const openModal = () => {
    setAiProjected(false);
    setMergedInitialValues(wizard.initialValues);
    setOpen(true);
  };
  const closeModal = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Focus first focusable element when modal opens
  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const node = dialogRef.current;
    if (node) {
      const focusables = node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? node).focus();
    }
  }, [open]);

  // Focus trap + Escape
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeModal();
        return;
      }
      if (event.key !== 'Tab') return;
      const node = dialogRef.current;
      if (!node) return;
      const focusables = Array.from(
        node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusables.length === 0) {
        event.preventDefault();
        node.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeModal]);

  const handleSubmit = async (values: TValues) => {
    await wizard.onSubmit(values);
    closeModal();
    onComplete?.();
  };

  // Called from AiPanel when a process result is projected
  const handleAiProjected = React.useCallback(
    (projected: Partial<TValues>, _parsedOk: boolean) => {
      setMergedInitialValues((prev) => ({ ...prev, ...projected }));
      setAiProjected(true);
    },
    [],
  );

  const triggerClasses = ['cc-btn', 'cc-btn--primary', 'cc-create-wizard-trigger'];
  if (className) triggerClasses.push(className);

  // In AI variant: show the AI panel first, then the wizard for human review
  const showAiPanel = variant === 'ai' && !aiProjected;
  const showWizard = variant === 'manual' || (variant === 'ai' && aiProjected);

  return (
    <>
      {/* Trigger — always top-right by layout convention; parent positions it */}
      <button
        ref={triggerRef}
        type="button"
        className={triggerClasses.join(' ')}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openModal}
      >
        {triggerLabel}
      </button>

      {/* Modal overlay */}
      {open ? (
        <>
          <div
            className="cc-scrim"
            onClick={closeModal}
            aria-hidden="true"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="cc-modal cc-create-wizard-modal"
          >
            <div className="cc-create-wizard-modal__header">
              <h2
                id={titleId}
                className="cc-create-wizard-modal__title"
              >
                {modalTitle}
              </h2>
              <button
                type="button"
                className="cc-btn cc-btn--ghost cc-btn--sm cc-btn--icon"
                aria-label="Close"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>
            <div className="cc-create-wizard-modal__body">
              {showAiPanel && aiConfig ? (
                <AiPanel<TValues, TProcessKey>
                  config={aiConfig}
                  onProjected={handleAiProjected}
                />
              ) : null}
              {showWizard ? (
                <CreationWizard
                  {...wizard}
                  initialValues={mergedInitialValues}
                  onSubmit={handleSubmit}
                />
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
