import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { useEntityForm } from './useEntityForm';
import { getOrchestratorBridge } from './schema';
function AiReviewStep({ form, config, onSkip, }) {
    const [state, setState] = React.useState({ status: 'idle' });
    const mountedRef = React.useRef(true);
    React.useEffect(() => () => { mountedRef.current = false; }, []);
    React.useEffect(() => {
        setState({ status: 'loading' });
        const input = config.buildInput(form.values);
        const timeoutId = setTimeout(() => {
            if (mountedRef.current)
                setState({ status: 'timeout' });
        }, 30_000);
        getOrchestratorBridge()
            .startReview(config.agentName, input)
            .then((output) => {
            clearTimeout(timeoutId);
            if (mountedRef.current)
                setState({ status: 'ready', output });
        })
            .catch((err) => {
            clearTimeout(timeoutId);
            if (mountedRef.current) {
                setState({ status: 'error', message: err instanceof Error ? err.message : 'Review failed' });
            }
        });
        return () => clearTimeout(timeoutId);
        // Only run once when the step mounts
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (_jsxs("div", { className: "cc-entity-form__review", "aria-live": "polite", children: [state.status === 'loading' ? (_jsx("p", { className: "cc-entity-form__review-status", children: "Reviewing your inputs with AI\u2026" })) : null, state.status === 'error' ? (_jsxs("p", { className: "cc-entity-form__review-status cc-text-error", children: ["Review failed: ", state.message] })) : null, state.status === 'timeout' ? (_jsxs("div", { children: [_jsx("p", { className: "cc-entity-form__review-status", children: "Review is taking longer than expected." }), _jsx("button", { type: "button", className: "cc-btn cc-btn--ghost", onClick: onSkip, children: "Skip review" })] })) : null, state.status === 'ready' ? (_jsxs("div", { children: [_jsx("p", { className: "cc-entity-form__review-summary", children: state.output.summary }), state.output.blockers.length > 0 ? (_jsxs("div", { className: "cc-entity-form__review-blockers", role: "alert", children: [_jsx("strong", { children: "Blockers \u2014 address before submitting:" }), _jsx("ul", { children: state.output.blockers.map((b, i) => (_jsxs("li", { children: [_jsxs("strong", { children: [b.field, ":"] }), " ", b.reason] }, i))) })] })) : null, state.output.questions.length > 0 ? (_jsxs("div", { className: "cc-entity-form__review-questions", children: [_jsx("strong", { children: "Questions:" }), _jsx("ul", { children: state.output.questions.map((q, i) => (_jsxs("li", { children: [_jsxs("strong", { children: [q.field, ":"] }), " ", q.prompt] }, i))) })] })) : null, state.output.suggestions.length > 0 ? (_jsxs("div", { className: "cc-entity-form__review-suggestions", children: [_jsx("strong", { children: "Suggestions:" }), _jsx("ul", { children: state.output.suggestions.map((s, i) => (_jsxs("li", { children: [_jsxs("strong", { children: [s.field, ":"] }), " ", s.rationale, s.suggested !== undefined ? (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", style: { marginLeft: '8px' }, onClick: () => form.setField(s.field, s.suggested), children: "Apply" })) : null] }, i))) })] })) : null] })) : null] }));
}
// ── Wizard mode ───────────────────────────────────────────────────────────────
function WizardForm({ schema, initialValues, steps, aiReview, onSubmit, submitLabel = 'Submit', className, }) {
    const form = useEntityForm(schema, initialValues);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [highWaterMark, setHighWaterMark] = React.useState(0);
    const [blockReason, setBlockReason] = React.useState();
    const [skipReview, setSkipReview] = React.useState(false);
    const totalSteps = steps.length + (aiReview ? 1 : 0);
    const isReviewStep = aiReview !== undefined && !skipReview && activeIndex === steps.length;
    const isLastStep = activeIndex === totalSteps - 1;
    const stepLabels = React.useMemo(() => {
        const labels = steps.map((s) => s.label);
        if (aiReview)
            labels.push(aiReview.label ?? 'AI review');
        return labels;
    }, [steps, aiReview]);
    const handleAdvance = async () => {
        setBlockReason(undefined);
        if (activeIndex < steps.length) {
            const step = steps[activeIndex];
            if (step.fields.length > 0) {
                const valid = await form.validatePaths(step.fields);
                if (!valid)
                    return;
            }
            if (step.onBeforeAdvance) {
                const result = await step.onBeforeAdvance(form.values);
                if (result === false) {
                    setBlockReason('Could not save. Please try again.');
                    return;
                }
                if (typeof result === 'string' && result.length > 0) {
                    setBlockReason(result);
                    return;
                }
            }
        }
        if (activeIndex < totalSteps - 1) {
            const next = activeIndex + 1;
            setActiveIndex(next);
            if (next > highWaterMark)
                setHighWaterMark(next);
        }
    };
    const blockAdvance = React.useCallback((reason) => {
        setBlockReason(reason ?? 'Cannot advance at this time.');
    }, []);
    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values, form);
    });
    const wrapClasses = ['cc-wizard', className].filter(Boolean).join(' ');
    return (_jsxs("section", { className: wrapClasses, children: [_jsx("nav", { className: "cc-wizard__nav", "aria-label": "Wizard steps", children: stepLabels.map((label, index) => {
                    const isActive = index === activeIndex;
                    const isComplete = index < highWaterMark;
                    const reachable = index <= highWaterMark + 1;
                    const cls = ['cc-wizard__step-button', isActive ? 'is-active' : '', isComplete ? 'is-complete' : '']
                        .filter(Boolean).join(' ');
                    return (_jsxs("button", { type: "button", "aria-current": isActive ? 'step' : undefined, disabled: !reachable, className: cls, onClick: () => {
                            if (index <= highWaterMark + 1) {
                                setActiveIndex(index);
                                if (index > highWaterMark)
                                    setHighWaterMark(index);
                            }
                        }, children: [_jsx("span", { className: "cc-wizard__step-index", "aria-hidden": "true", children: index + 1 }), _jsx("span", { children: label })] }, index));
                }) }), _jsxs("div", { className: "cc-wizard__body", children: [_jsx("div", { className: "cc-wizard__step-header", children: _jsx("h2", { className: "cc-wizard__step-label", children: stepLabels[activeIndex] }) }), blockReason ? (_jsx("p", { className: "cc-entity-form__block-reason cc-text-error", role: "alert", children: blockReason })) : null, _jsx("div", { className: "cc-wizard__step-content", children: isReviewStep && aiReview ? (_jsx(AiReviewStep, { form: form, config: aiReview, onSkip: () => { setSkipReview(true); setActiveIndex(steps.length); } })) : (steps[activeIndex]?.render({ form: form, blockAdvance })) }), _jsxs("div", { className: "cc-wizard__footer", children: [_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost", onClick: () => { if (activeIndex > 0)
                                    setActiveIndex(activeIndex - 1); }, disabled: activeIndex === 0 || form.isSubmitting, children: "Back" }), isLastStep ? (_jsx("button", { type: "button", className: "cc-btn cc-btn--primary", onClick: handleSubmit, disabled: form.isSubmitting, children: form.isSubmitting ? 'Submitting…' : submitLabel })) : (_jsx("button", { type: "button", className: "cc-btn cc-btn--primary", onClick: () => void handleAdvance(), children: "Continue" }))] })] })] }));
}
// ── Edit mode ─────────────────────────────────────────────────────────────────
function EditForm({ schema, initialValues, onSubmit, submitLabel = 'Save', children, className, }) {
    const form = useEntityForm(schema, initialValues);
    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values, form);
    });
    const wrapClasses = ['cc-entity-form--edit', className].filter(Boolean).join(' ');
    return (_jsxs("form", { className: wrapClasses, onSubmit: handleSubmit, noValidate: true, children: [children ? children(form) : (_jsx("p", { style: { color: 'var(--text-3)', fontStyle: 'italic' }, children: 'No fields rendered. Pass children={(form) => ...} to lay out fields.' })), _jsx("div", { className: "cc-entity-form__footer", style: { marginTop: 'var(--space-4)' }, children: _jsx("button", { type: "submit", className: "cc-btn cc-btn--primary", disabled: form.isSubmitting, children: form.isSubmitting ? 'Saving…' : submitLabel }) })] }));
}
// ── Main export ───────────────────────────────────────────────────────────────
export function EntityForm(props) {
    if (props.mode === 'wizard') {
        return _jsx(WizardForm, { ...props });
    }
    return _jsx(EditForm, { ...props });
}
//# sourceMappingURL=EntityForm.js.map