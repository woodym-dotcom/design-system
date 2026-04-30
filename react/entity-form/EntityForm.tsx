/**
 * <EntityForm> — unified wizard + edit form primitive (G3).
 *
 * Design C from the spec: Zod schema + step slots + field-primitive kit.
 * One schema drives both wizard mode (multi-step creation) and edit mode
 * (single-page edit). Consumers own layout; the primitive owns validation
 * lifecycle, step navigation, AI-review orchestration, and G4 stability.
 *
 * AI-review: calls getOrchestratorBridge().startReview(agentName, input).
 * No provider SDK imported (CLAUDE.md §18). Bridge is stubbed in tests via
 * setOrchestratorBridge().
 *
 * Decisions Log corrections applied:
 * - Process name: creation-wizard-review.v1
 * - AiReviewInput: entityType, entityDraft, contextRefs[]
 * - AiReviewOutput: summary, suggestions[], questions[], blockers[], finalDraft
 */
import * as React from 'react';
import { z } from 'zod';
import { useEntityForm, type EntityFormHandle } from './useEntityForm';
import { getOrchestratorBridge, type EntitySchema, type AiReviewInput, type AiReviewOutput } from './schema';

// ── Wizard step definition ────────────────────────────────────────────────────

export interface WizardStepDef<TValues> {
  id: string;
  label: string;
  fields: Array<string>;
  render: (ctx: WizardStepRenderCtx<TValues>) => React.ReactNode;
}

export interface WizardStepRenderCtx<TValues> {
  form: EntityFormHandle<TValues>;
  blockAdvance: (reason?: string) => void;
}

// ── AI-review config ──────────────────────────────────────────────────────────

export interface AiReviewConfig<TValues> {
  agentName: string;
  buildInput: (values: TValues) => AiReviewInput;
  label?: string;
  blockOnError?: boolean;
}

// ── EntityForm props ──────────────────────────────────────────────────────────

type BaseProps<S extends EntitySchema<any>> = {
  schema: S;
  initialValues: z.infer<S['_zodSchema']>;
  onSubmit: (values: z.infer<S['_zodSchema']>) => void | Promise<void>;
  className?: string;
};

type WizardProps<S extends EntitySchema<any>> = BaseProps<S> & {
  mode: 'wizard';
  steps: WizardStepDef<z.infer<S['_zodSchema']>>[];
  aiReview?: AiReviewConfig<z.infer<S['_zodSchema']>>;
  submitLabel?: string;
};

type EditProps<S extends EntitySchema<any>> = BaseProps<S> & {
  mode: 'edit';
  submitLabel?: string;
  children?: (form: EntityFormHandle<z.infer<S['_zodSchema']>>) => React.ReactNode;
};

export type EntityFormProps<S extends EntitySchema<any>> = WizardProps<S> | EditProps<S>;

// ── AI-review step ────────────────────────────────────────────────────────────

type ReviewState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; output: AiReviewOutput }
  | { status: 'error'; message: string }
  | { status: 'timeout' };

function AiReviewStep<TValues>({
  form,
  config,
  onSkip,
}: {
  form: EntityFormHandle<TValues>;
  config: AiReviewConfig<TValues>;
  onSkip: () => void;
}) {
  const [state, setState] = React.useState<ReviewState>({ status: 'idle' });
  const mountedRef = React.useRef(true);
  React.useEffect(() => () => { mountedRef.current = false; }, []);

  React.useEffect(() => {
    setState({ status: 'loading' });
    const input = config.buildInput(form.values);
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) setState({ status: 'timeout' });
    }, 30_000);

    getOrchestratorBridge()
      .startReview(config.agentName, input)
      .then((output) => {
        clearTimeout(timeoutId);
        if (mountedRef.current) setState({ status: 'ready', output });
      })
      .catch((err: unknown) => {
        clearTimeout(timeoutId);
        if (mountedRef.current) {
          setState({ status: 'error', message: err instanceof Error ? err.message : 'Review failed' });
        }
      });

    return () => clearTimeout(timeoutId);
    // Only run once when the step mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cc-entity-form__review" aria-live="polite">
      {state.status === 'loading' ? (
        <p className="cc-entity-form__review-status">Reviewing your inputs with AI…</p>
      ) : null}

      {state.status === 'error' ? (
        <p className="cc-entity-form__review-status cc-text-error">Review failed: {state.message}</p>
      ) : null}

      {state.status === 'timeout' ? (
        <div>
          <p className="cc-entity-form__review-status">Review is taking longer than expected.</p>
          <button type="button" className="cc-btn cc-btn--ghost" onClick={onSkip}>Skip review</button>
        </div>
      ) : null}

      {state.status === 'ready' ? (
        <div>
          <p className="cc-entity-form__review-summary">{state.output.summary}</p>

          {state.output.blockers.length > 0 ? (
            <div className="cc-entity-form__review-blockers" role="alert">
              <strong>Blockers — address before submitting:</strong>
              <ul>
                {state.output.blockers.map((b, i) => (
                  <li key={i}>
                    <strong>{b.field}:</strong> {b.reason}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {state.output.questions.length > 0 ? (
            <div className="cc-entity-form__review-questions">
              <strong>Questions:</strong>
              <ul>
                {state.output.questions.map((q, i) => (
                  <li key={i}>
                    <strong>{q.field}:</strong> {q.prompt}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {state.output.suggestions.length > 0 ? (
            <div className="cc-entity-form__review-suggestions">
              <strong>Suggestions:</strong>
              <ul>
                {state.output.suggestions.map((s, i) => (
                  <li key={i}>
                    <strong>{s.field}:</strong> {s.rationale}
                    {s.suggested !== undefined ? (
                      <button
                        type="button"
                        className="cc-btn cc-btn--ghost cc-btn--sm"
                        style={{ marginLeft: '8px' }}
                        onClick={() => form.setField(s.field, s.suggested)}
                      >
                        Apply
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ── Wizard mode ───────────────────────────────────────────────────────────────

function WizardForm<S extends EntitySchema<any>>({
  schema,
  initialValues,
  steps,
  aiReview,
  onSubmit,
  submitLabel = 'Submit',
  className,
}: WizardProps<S>) {
  const form = useEntityForm(schema, initialValues);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [highWaterMark, setHighWaterMark] = React.useState(0);
  const [blockReason, setBlockReason] = React.useState<string | undefined>();
  const [skipReview, setSkipReview] = React.useState(false);

  const totalSteps = steps.length + (aiReview ? 1 : 0);
  const isReviewStep = aiReview !== undefined && !skipReview && activeIndex === steps.length;
  const isLastStep = activeIndex === totalSteps - 1;

  const stepLabels = React.useMemo(() => {
    const labels = steps.map((s) => s.label);
    if (aiReview) labels.push(aiReview.label ?? 'AI review');
    return labels;
  }, [steps, aiReview]);

  const handleAdvance = async () => {
    setBlockReason(undefined);
    if (activeIndex < steps.length) {
      const step = steps[activeIndex];
      if (step.fields.length > 0) {
        const valid = await form.validatePaths(step.fields);
        if (!valid) return;
      }
    }
    if (activeIndex < totalSteps - 1) {
      const next = activeIndex + 1;
      setActiveIndex(next);
      if (next > highWaterMark) setHighWaterMark(next);
    }
  };

  const blockAdvance = React.useCallback((reason?: string) => {
    setBlockReason(reason ?? 'Cannot advance at this time.');
  }, []);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values as z.infer<S['_zodSchema']>);
  });

  const wrapClasses = ['cc-wizard', className].filter(Boolean).join(' ');

  return (
    <section className={wrapClasses}>
      {/* Step nav */}
      <nav className="cc-wizard__nav" role="tablist" aria-label="Wizard steps" aria-orientation="vertical">
        {stepLabels.map((label, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < highWaterMark;
          const reachable = index <= highWaterMark + 1;
          const cls = ['cc-wizard__step-button', isActive ? 'is-active' : '', isComplete ? 'is-complete' : '']
            .filter(Boolean).join(' ');
          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              disabled={!reachable}
              className={cls}
              onClick={() => {
                if (index <= highWaterMark + 1) {
                  setActiveIndex(index);
                  if (index > highWaterMark) setHighWaterMark(index);
                }
              }}
            >
              <span className="cc-wizard__step-index" aria-hidden="true">{index + 1}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Step body */}
      <div className="cc-wizard__body">
        <div className="cc-wizard__step-header">
          <h2 className="cc-wizard__step-label">{stepLabels[activeIndex]}</h2>
        </div>

        {blockReason ? (
          <p className="cc-entity-form__block-reason cc-text-error" role="alert">{blockReason}</p>
        ) : null}

        <div className="cc-wizard__step-content">
          {isReviewStep && aiReview ? (
            <AiReviewStep
              form={form as unknown as EntityFormHandle<z.infer<S['_zodSchema']>>}
              config={aiReview}
              onSkip={() => { setSkipReview(true); setActiveIndex(steps.length); }}
            />
          ) : (
            steps[activeIndex]?.render({ form: form as unknown as EntityFormHandle<z.infer<S['_zodSchema']>>, blockAdvance })
          )}
        </div>

        <div className="cc-wizard__footer">
          <button
            type="button"
            className="cc-btn cc-btn--ghost"
            onClick={() => { if (activeIndex > 0) setActiveIndex(activeIndex - 1); }}
            disabled={activeIndex === 0 || form.isSubmitting}
          >
            Back
          </button>

          {isLastStep ? (
            <button
              type="button"
              className="cc-btn cc-btn--primary"
              onClick={handleSubmit as unknown as () => void}
              disabled={form.isSubmitting}
            >
              {form.isSubmitting ? 'Submitting…' : submitLabel}
            </button>
          ) : (
            <button
              type="button"
              className="cc-btn cc-btn--primary"
              onClick={() => void handleAdvance()}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Edit mode ─────────────────────────────────────────────────────────────────

function EditForm<S extends EntitySchema<any>>({
  schema,
  initialValues,
  onSubmit,
  submitLabel = 'Save',
  children,
  className,
}: EditProps<S>) {
  const form = useEntityForm(schema, initialValues);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values as z.infer<S['_zodSchema']>);
  });

  const wrapClasses = ['cc-entity-form--edit', className].filter(Boolean).join(' ');

  return (
    <form className={wrapClasses} onSubmit={handleSubmit} noValidate>
      {children ? children(form as unknown as EntityFormHandle<z.infer<S['_zodSchema']>>) : (
        <p style={{ color: 'var(--text-3)', fontStyle: 'italic' }}>
          {'No fields rendered. Pass children={(form) => ...} to lay out fields.'}
        </p>
      )}
      <div className="cc-entity-form__footer" style={{ marginTop: 'var(--space-4)' }}>
        <button
          type="submit"
          className="cc-btn cc-btn--primary"
          disabled={form.isSubmitting}
        >
          {form.isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function EntityForm<S extends EntitySchema<any>>(props: EntityFormProps<S>): React.ReactElement {
  if (props.mode === 'wizard') {
    return <WizardForm {...props} />;
  }
  return <EditForm {...props} />;
}
