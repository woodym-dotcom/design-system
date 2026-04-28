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

const DEFAULT_REVIEW_LABEL = 'Review';

export function CreationWizard<TValues>({
  steps,
  initialValues,
  onSubmit,
  aiReview,
  className,
  submitLabel = 'Submit',
}: CreationWizardProps<TValues>) {
  const [values, setValues] = React.useState<TValues>(initialValues);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [highWaterMark, setHighWaterMark] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);

  const totalSteps = steps.length + (aiReview ? 1 : 0);
  const isReviewStep = aiReview !== undefined && activeIndex === steps.length;
  const isLastStep = activeIndex === totalSteps - 1;

  const stepLabels = React.useMemo(() => {
    const labels = steps.map((step) => step.label);
    if (aiReview) labels.push(aiReview.label ?? DEFAULT_REVIEW_LABEL);
    return labels;
  }, [steps, aiReview]);

  const setValuesUpdater = React.useCallback(
    (updater: (current: TValues) => TValues) => setValues((current) => updater(current)),
    [],
  );

  const goTo = (index: number) => {
    if (index < 0 || index >= totalSteps) return;
    if (index > highWaterMark + 1) return;
    setActiveIndex(index);
    if (index > highWaterMark) setHighWaterMark(index);
  };

  const handleNext = () => {
    if (activeIndex < totalSteps - 1) {
      const next = activeIndex + 1;
      setActiveIndex(next);
      if (next > highWaterMark) setHighWaterMark(next);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  const classes = ['cc-wizard'];
  if (className) classes.push(className);

  return (
    <section className={classes.join(' ')}>
      <nav
        className="cc-wizard__nav"
        role="tablist"
        aria-label="Wizard steps"
        aria-orientation="vertical"
      >
        {stepLabels.map((label, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < highWaterMark;
          const reachable = index <= highWaterMark + 1;
          const cls = ['cc-wizard__step-button'];
          if (isActive) cls.push('is-active');
          if (isComplete) cls.push('is-complete');
          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              disabled={!reachable}
              className={cls.join(' ')}
              onClick={() => goTo(index)}
            >
              <span className="cc-wizard__step-index" aria-hidden="true">{index + 1}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
      <div className="cc-wizard__body">
        <div className="cc-wizard__step-header">
          <h2 className="cc-wizard__step-label">{stepLabels[activeIndex]}</h2>
        </div>
        <div className="cc-wizard__step-content">
          {isReviewStep && aiReview ? (
            <CreationWizardReview values={values} reviewer={aiReview.reviewer} />
          ) : (
            steps[activeIndex]?.render({ values, setValues: setValuesUpdater })
          )}
        </div>
        <div className="cc-wizard__footer">
          <button
            type="button"
            className="cc-btn cc-btn--ghost"
            onClick={handleBack}
            disabled={activeIndex === 0 || submitting}
          >
            Back
          </button>
          {isLastStep ? (
            <button
              type="button"
              className="cc-btn cc-btn--primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : submitLabel}
            </button>
          ) : (
            <button
              type="button"
              className="cc-btn cc-btn--primary"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

interface ReviewState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  result?: CreationWizardReviewResult;
  error?: string;
}

function CreationWizardReview<TValues>({
  values,
  reviewer,
}: {
  values: TValues;
  reviewer: (values: TValues) => Promise<CreationWizardReviewResult>;
}) {
  const [state, setState] = React.useState<ReviewState>({ status: 'idle' });

  React.useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    reviewer(values)
      .then((result) => {
        if (!cancelled) setState({ status: 'ready', result });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ status: 'error', error: error instanceof Error ? error.message : 'Review failed' });
      });
    return () => {
      cancelled = true;
    };
    // Re-run when values reference changes; consumers should provide stable references between submissions.
  }, [values, reviewer]);

  return (
    <div className="cc-wizard__review" aria-live="polite">
      {state.status === 'loading' ? (
        <p className="cc-wizard__review-status">Reviewing your inputs…</p>
      ) : null}
      {state.status === 'error' ? (
        <p className="cc-wizard__review-status">Review failed: {state.error}</p>
      ) : null}
      {state.status === 'ready' && state.result ? (
        <>
          <p className="cc-wizard__review-status">
            {state.result.ok ? 'Looks good.' : 'Suggestions to consider before submitting.'}
          </p>
          <p className="cc-wizard__review-summary">{state.result.summary}</p>
          {state.result.suggestions && state.result.suggestions.length ? (
            <ul className="cc-wizard__review-suggestions">
              {state.result.suggestions.map((suggestion, index) => (
                <li key={index} className="cc-wizard__review-suggestion">{suggestion}</li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
