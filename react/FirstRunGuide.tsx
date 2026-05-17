import * as React from 'react';

export interface FirstRunStep {
  id: string;
  /** Step label. */
  title: string;
  /** Optional supporting copy. */
  description?: string;
  /**
   * Action — primary "Do it" CTA OR a link. Step is auto-marked done
   * after onClick resolves (unless `done` is controlled).
   */
  action?: {
    label: string;
    onClick?: () => void | Promise<void>;
    href?: string;
  };
  /** Optional secondary action — "Skip", "Learn more", etc. */
  secondary?: { label: string; onClick?: () => void; href?: string };
  /** Optional icon. */
  icon?: React.ReactNode;
  /**
   * Controlled completion state. When omitted, the guide tracks
   * "done" internally based on which step's action has been invoked.
   */
  done?: boolean;
  /** Mark step as skippable. */
  skippable?: boolean;
}

export interface FirstRunGuideProps {
  /** Heading shown above the steps. */
  title: string;
  /** Optional supporting copy under the title. */
  description?: string;
  /** Steps, ordered. The first not-done step is auto-expanded. */
  steps: FirstRunStep[];
  /** Called when all steps are done. */
  onComplete?: () => void;
  /** Footer rendered after the steps (e.g. "Skip onboarding" link). */
  footer?: React.ReactNode;
  /** Optional rendered above the title (e.g. a hero illustration). */
  hero?: React.ReactNode;
  className?: string;
}

/**
 * First-run / empty-tenant onboarding pattern. Renders an accordion-style
 * ordered checklist: the first not-done step is expanded, others are
 * collapsed. When every step is `done`, the guide collapses and
 * `onComplete` fires.
 *
 * Composes on `EmptyState` semantics — pair with `<EmptyState>` for the
 * surface body, then drop this guide as the action.
 */
export function FirstRunGuide({
  title,
  description,
  steps,
  onComplete,
  footer,
  hero,
  className,
}: FirstRunGuideProps) {
  // Track internal "done" state per step id when the caller doesn't
  // control it. Cleared when the prop flips back.
  const [internalDone, setInternalDone] = React.useState<Set<string>>(new Set());

  const isDone = React.useCallback(
    (s: FirstRunStep) => (s.done !== undefined ? s.done : internalDone.has(s.id)),
    [internalDone],
  );

  const completedCount = steps.filter(isDone).length;
  const allDone = completedCount === steps.length;
  const completeFiredRef = React.useRef(false);

  React.useEffect(() => {
    if (allDone && !completeFiredRef.current) {
      completeFiredRef.current = true;
      onComplete?.();
    }
    if (!allDone) completeFiredRef.current = false;
  }, [allDone, onComplete]);

  // Open step = first not-done OR the last step when all are done.
  const openIndex = React.useMemo(() => {
    const idx = steps.findIndex((s) => !isDone(s));
    return idx === -1 ? steps.length - 1 : idx;
  }, [steps, isDone]);

  const markDone = React.useCallback((id: string) => {
    setInternalDone((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const runAction = React.useCallback(
    async (step: FirstRunStep) => {
      try {
        if (step.action?.onClick) await step.action.onClick();
      } finally {
        if (step.done === undefined) markDone(step.id);
      }
    },
    [markDone],
  );

  return (
    <section
      className={['cc-first-run', allDone && 'cc-first-run--complete', className]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby="cc-first-run-title"
    >
      {hero && <div className="cc-first-run__hero">{hero}</div>}
      <header className="cc-first-run__header">
        <h2 id="cc-first-run-title" className="cc-first-run__title">{title}</h2>
        {description && <p className="cc-first-run__description">{description}</p>}
        <p className="cc-first-run__progress" role="status">
          {completedCount} of {steps.length} complete
        </p>
      </header>
      <ol className="cc-first-run__steps">
        {steps.map((s, i) => {
          const done = isDone(s);
          const expanded = !done && i === openIndex;
          return (
            <li
              key={s.id}
              className={[
                'cc-first-run__step',
                done && 'is-done',
                expanded && 'is-expanded',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={expanded ? 'step' : undefined}
            >
              <div className="cc-first-run__step-head">
                <span aria-hidden="true" className="cc-first-run__step-marker">
                  {done ? '✓' : i + 1}
                </span>
                <h3 className="cc-first-run__step-title">{s.title}</h3>
                {s.icon && (
                  <span aria-hidden="true" className="cc-first-run__step-icon">{s.icon}</span>
                )}
              </div>
              {expanded && (
                <div className="cc-first-run__step-body">
                  {s.description && (
                    <p className="cc-first-run__step-desc">{s.description}</p>
                  )}
                  <div className="cc-first-run__step-actions">
                    {s.action && (
                      s.action.href ? (
                        <a
                          className="cc-btn cc-btn--primary"
                          href={s.action.href}
                          onClick={() => { if (s.done === undefined) markDone(s.id); }}
                        >
                          {s.action.label}
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="cc-btn cc-btn--primary"
                          onClick={() => { void runAction(s); }}
                        >
                          {s.action.label}
                        </button>
                      )
                    )}
                    {s.secondary && (
                      s.secondary.href ? (
                        <a className="cc-btn cc-btn--ghost" href={s.secondary.href}>
                          {s.secondary.label}
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="cc-btn cc-btn--ghost"
                          onClick={s.secondary.onClick}
                        >
                          {s.secondary.label}
                        </button>
                      )
                    )}
                    {s.skippable && (
                      <button
                        type="button"
                        className="cc-btn cc-btn--ghost"
                        onClick={() => markDone(s.id)}
                      >
                        Skip
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {footer && <footer className="cc-first-run__footer">{footer}</footer>}
    </section>
  );
}
