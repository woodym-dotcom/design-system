import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
const DEFAULT_REVIEW_LABEL = 'Review';
export function CreationWizard({ steps, initialValues, onSubmit, aiReview, className, submitLabel = 'Submit', }) {
    const [values, setValues] = React.useState(initialValues);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [highWaterMark, setHighWaterMark] = React.useState(0);
    const [submitting, setSubmitting] = React.useState(false);
    const totalSteps = steps.length + (aiReview ? 1 : 0);
    const isReviewStep = aiReview !== undefined && activeIndex === steps.length;
    const isLastStep = activeIndex === totalSteps - 1;
    const stepLabels = React.useMemo(() => {
        const labels = steps.map((step) => step.label);
        if (aiReview)
            labels.push(aiReview.label ?? DEFAULT_REVIEW_LABEL);
        return labels;
    }, [steps, aiReview]);
    const setValuesUpdater = React.useCallback((updater) => setValues((current) => updater(current)), []);
    const goTo = (index) => {
        if (index < 0 || index >= totalSteps)
            return;
        if (index > highWaterMark + 1)
            return;
        setActiveIndex(index);
        if (index > highWaterMark)
            setHighWaterMark(index);
    };
    const handleNext = () => {
        if (activeIndex < totalSteps - 1) {
            const next = activeIndex + 1;
            setActiveIndex(next);
            if (next > highWaterMark)
                setHighWaterMark(next);
        }
    };
    const handleBack = () => {
        if (activeIndex > 0)
            setActiveIndex(activeIndex - 1);
    };
    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await onSubmit(values);
        }
        finally {
            setSubmitting(false);
        }
    };
    const classes = ['cc-wizard'];
    if (className)
        classes.push(className);
    return (_jsxs("section", { className: classes.join(' '), children: [_jsx("nav", { className: "cc-wizard__nav", role: "tablist", "aria-label": "Wizard steps", "aria-orientation": "vertical", children: stepLabels.map((label, index) => {
                    const isActive = index === activeIndex;
                    const isComplete = index < highWaterMark;
                    const reachable = index <= highWaterMark + 1;
                    const cls = ['cc-wizard__step-button'];
                    if (isActive)
                        cls.push('is-active');
                    if (isComplete)
                        cls.push('is-complete');
                    return (_jsxs("button", { type: "button", role: "tab", "aria-selected": isActive, tabIndex: isActive ? 0 : -1, disabled: !reachable, className: cls.join(' '), onClick: () => goTo(index), children: [_jsx("span", { className: "cc-wizard__step-index", "aria-hidden": "true", children: index + 1 }), _jsx("span", { children: label })] }, index));
                }) }), _jsxs("div", { className: "cc-wizard__body", children: [_jsx("div", { className: "cc-wizard__step-header", children: _jsx("h2", { className: "cc-wizard__step-label", children: stepLabels[activeIndex] }) }), _jsx("div", { className: "cc-wizard__step-content", children: isReviewStep && aiReview ? (_jsx(CreationWizardReview, { values: values, reviewer: aiReview.reviewer })) : (steps[activeIndex]?.render({ values, setValues: setValuesUpdater })) }), _jsxs("div", { className: "cc-wizard__footer", children: [_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost", onClick: handleBack, disabled: activeIndex === 0 || submitting, children: "Back" }), isLastStep ? (_jsx("button", { type: "button", className: "cc-btn cc-btn--primary", onClick: handleSubmit, disabled: submitting, children: submitting ? 'Submitting…' : submitLabel })) : (_jsx("button", { type: "button", className: "cc-btn cc-btn--primary", onClick: handleNext, children: "Next" }))] })] })] }));
}
function CreationWizardReview({ values, reviewer, }) {
    const [state, setState] = React.useState({ status: 'idle' });
    React.useEffect(() => {
        let cancelled = false;
        setState({ status: 'loading' });
        reviewer(values)
            .then((result) => {
            if (!cancelled)
                setState({ status: 'ready', result });
        })
            .catch((error) => {
            if (!cancelled)
                setState({ status: 'error', error: error instanceof Error ? error.message : 'Review failed' });
        });
        return () => {
            cancelled = true;
        };
        // Re-run when values reference changes; consumers should provide stable references between submissions.
    }, [values, reviewer]);
    return (_jsxs("div", { className: "cc-wizard__review", "aria-live": "polite", children: [state.status === 'loading' ? (_jsx("p", { className: "cc-wizard__review-status", children: "Reviewing your inputs\u2026" })) : null, state.status === 'error' ? (_jsxs("p", { className: "cc-wizard__review-status", children: ["Review failed: ", state.error] })) : null, state.status === 'ready' && state.result ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "cc-wizard__review-status", children: state.result.ok ? 'Looks good.' : 'Suggestions to consider before submitting.' }), _jsx("p", { className: "cc-wizard__review-summary", children: state.result.summary }), state.result.suggestions && state.result.suggestions.length ? (_jsx("ul", { className: "cc-wizard__review-suggestions", children: state.result.suggestions.map((suggestion, index) => (_jsx("li", { className: "cc-wizard__review-suggestion", children: suggestion }, index))) })) : null] })) : null] }));
}
//# sourceMappingURL=CreationWizard.js.map