import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
import { CreationWizard } from './CreationWizard';
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
function AiPanel({ config, onProjected, }) {
    const [prompt, setPrompt] = React.useState('');
    const [runState, setRunState] = React.useState({ phase: 'idle' });
    const promptId = React.useId();
    const promptLabel = config.promptLabel ?? 'Describe what to create';
    const promptPlaceholder = config.promptPlaceholder ?? 'e.g. Create a vendor called Acme Corp in the software category';
    const handleRun = async () => {
        if (!prompt.trim())
            return;
        setRunState({ phase: 'running' });
        try {
            const inputs = { prompt: prompt.trim() };
            const result = await config.runProcess(config.processKey, inputs);
            const projected = config.projectResult(result.output);
            setRunState({ phase: 'projected', projectedValues: result.output, parsedOk: result.parsedOk });
            onProjected(projected, result.parsedOk);
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'AI process failed';
            setRunState({ phase: 'error', message: msg });
        }
    };
    return (_jsxs("div", { className: "cc-ai-panel", children: [_jsxs("div", { className: "cc-ai-panel__prompt-row", children: [_jsx("label", { className: "cc-ai-panel__label", htmlFor: promptId, children: promptLabel }), _jsx("textarea", { id: promptId, className: "cc-ai-panel__textarea", value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: promptPlaceholder, rows: 3, disabled: runState.phase === 'running' })] }), runState.phase === 'error' ? (_jsx("p", { className: "cc-ai-panel__error", role: "alert", children: runState.message })) : null, runState.phase === 'projected' ? (_jsx("p", { className: "cc-ai-panel__success", role: "status", children: runState.parsedOk
                    ? 'AI result ready — review the pre-filled form below before saving.'
                    : 'AI result projected with low confidence — please review carefully.' })) : null, _jsx("button", { type: "button", className: "cc-btn cc-btn--ai cc-ai-panel__run-btn", onClick: handleRun, disabled: runState.phase === 'running' || !prompt.trim(), "aria-busy": runState.phase === 'running', children: runState.phase === 'running' ? 'Generating…' : 'Generate with AI' }), runState.phase === 'projected' ? (_jsxs("p", { className: "cc-text-muted cc-ai-panel__note", style: { fontSize: 'var(--text-sm)' }, children: ["Process: ", _jsx("code", { children: config.processKey })] })) : null] }));
}
// ── Component ─────────────────────────────────────────────────────────────────
export function TopRightCreateWizard({ variant = 'manual', triggerLabel = 'Create', modalTitle, wizard, aiConfig, onComplete, className, }) {
    const [open, setOpen] = React.useState(false);
    const [aiProjected, setAiProjected] = React.useState(false);
    // When AI projects values, we merge them into the wizard's initial values for the review step.
    const [mergedInitialValues, setMergedInitialValues] = React.useState(wizard.initialValues);
    const dialogRef = React.useRef(null);
    const triggerRef = React.useRef(null);
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
        if (!open || typeof document === 'undefined')
            return;
        const node = dialogRef.current;
        if (node) {
            const focusables = node.querySelectorAll(FOCUSABLE_SELECTOR);
            (focusables[0] ?? node).focus();
        }
    }, [open]);
    // Focus trap + Escape
    React.useEffect(() => {
        if (!open)
            return;
        const onKey = (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                closeModal();
                return;
            }
            if (event.key !== 'Tab')
                return;
            const node = dialogRef.current;
            if (!node)
                return;
            const focusables = Array.from(node.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => !el.hasAttribute('disabled'));
            if (focusables.length === 0) {
                event.preventDefault();
                node.focus();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;
            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, closeModal]);
    const handleSubmit = async (values) => {
        await wizard.onSubmit(values);
        closeModal();
        onComplete?.();
    };
    // Called from AiPanel when a process result is projected
    const handleAiProjected = React.useCallback((projected, _parsedOk) => {
        setMergedInitialValues((prev) => ({ ...prev, ...projected }));
        setAiProjected(true);
    }, []);
    const triggerClasses = ['cc-btn', 'cc-btn--primary', 'cc-create-wizard-trigger'];
    if (className)
        triggerClasses.push(className);
    // In AI variant: show the AI panel first, then the wizard for human review
    const showAiPanel = variant === 'ai' && !aiProjected;
    const showWizard = variant === 'manual' || (variant === 'ai' && aiProjected);
    return (_jsxs(_Fragment, { children: [_jsx("button", { ref: triggerRef, type: "button", className: triggerClasses.join(' '), "aria-haspopup": "dialog", "aria-expanded": open, onClick: openModal, children: triggerLabel }), open ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "cc-scrim", onClick: closeModal, "aria-hidden": "true" }), _jsxs("div", { ref: dialogRef, role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, tabIndex: -1, className: "cc-modal cc-create-wizard-modal", children: [_jsxs("div", { className: "cc-create-wizard-modal__header", children: [_jsx("h2", { id: titleId, className: "cc-create-wizard-modal__title", children: modalTitle }), _jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm cc-btn--icon", "aria-label": "Close", onClick: closeModal, children: "\u2715" })] }), _jsxs("div", { className: "cc-create-wizard-modal__body", children: [showAiPanel && aiConfig ? (_jsx(AiPanel, { config: aiConfig, onProjected: handleAiProjected })) : null, showWizard ? (_jsx(CreationWizard, { ...wizard, initialValues: mergedInitialValues, onSubmit: handleSubmit })) : null] })] })] })) : null] }));
}
//# sourceMappingURL=TopRightCreateWizard.js.map