import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
/**
 * First-run / empty-tenant onboarding pattern. Renders an accordion-style
 * ordered checklist: the first not-done step is expanded, others are
 * collapsed. When every step is `done`, the guide collapses and
 * `onComplete` fires.
 *
 * Composes on `EmptyState` semantics — pair with `<EmptyState>` for the
 * surface body, then drop this guide as the action.
 */
export function FirstRunGuide({ title, description, steps, onComplete, footer, hero, className, }) {
    // Track internal "done" state per step id when the caller doesn't
    // control it. Cleared when the prop flips back.
    const [internalDone, setInternalDone] = React.useState(new Set());
    const isDone = React.useCallback((s) => (s.done !== undefined ? s.done : internalDone.has(s.id)), [internalDone]);
    const completedCount = steps.filter(isDone).length;
    const allDone = completedCount === steps.length;
    const completeFiredRef = React.useRef(false);
    React.useEffect(() => {
        if (allDone && !completeFiredRef.current) {
            completeFiredRef.current = true;
            onComplete?.();
        }
        if (!allDone)
            completeFiredRef.current = false;
    }, [allDone, onComplete]);
    // Open step = first not-done OR the last step when all are done.
    const openIndex = React.useMemo(() => {
        const idx = steps.findIndex((s) => !isDone(s));
        return idx === -1 ? steps.length - 1 : idx;
    }, [steps, isDone]);
    const markDone = React.useCallback((id) => {
        setInternalDone((prev) => {
            if (prev.has(id))
                return prev;
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    }, []);
    const runAction = React.useCallback(async (step) => {
        try {
            if (step.action?.onClick)
                await step.action.onClick();
        }
        finally {
            if (step.done === undefined)
                markDone(step.id);
        }
    }, [markDone]);
    return (_jsxs("section", { className: ['cc-first-run', allDone && 'cc-first-run--complete', className]
            .filter(Boolean)
            .join(' '), "aria-labelledby": "cc-first-run-title", children: [hero && _jsx("div", { className: "cc-first-run__hero", children: hero }), _jsxs("header", { className: "cc-first-run__header", children: [_jsx("h2", { id: "cc-first-run-title", className: "cc-first-run__title", children: title }), description && _jsx("p", { className: "cc-first-run__description", children: description }), _jsxs("p", { className: "cc-first-run__progress", role: "status", children: [completedCount, " of ", steps.length, " complete"] })] }), _jsx("ol", { className: "cc-first-run__steps", children: steps.map((s, i) => {
                    const done = isDone(s);
                    const expanded = !done && i === openIndex;
                    return (_jsxs("li", { className: [
                            'cc-first-run__step',
                            done && 'is-done',
                            expanded && 'is-expanded',
                        ]
                            .filter(Boolean)
                            .join(' '), "aria-current": expanded ? 'step' : undefined, children: [_jsxs("div", { className: "cc-first-run__step-head", children: [_jsx("span", { "aria-hidden": "true", className: "cc-first-run__step-marker", children: done ? '✓' : i + 1 }), _jsx("h3", { className: "cc-first-run__step-title", children: s.title }), s.icon && (_jsx("span", { "aria-hidden": "true", className: "cc-first-run__step-icon", children: s.icon }))] }), expanded && (_jsxs("div", { className: "cc-first-run__step-body", children: [s.description && (_jsx("p", { className: "cc-first-run__step-desc", children: s.description })), _jsxs("div", { className: "cc-first-run__step-actions", children: [s.action && (s.action.href ? (_jsx("a", { className: "cc-btn cc-btn--primary", href: s.action.href, onClick: () => { if (s.done === undefined)
                                                    markDone(s.id); }, children: s.action.label })) : (_jsx("button", { type: "button", className: "cc-btn cc-btn--primary", onClick: () => { void runAction(s); }, children: s.action.label }))), s.secondary && (s.secondary.href ? (_jsx("a", { className: "cc-btn cc-btn--ghost", href: s.secondary.href, children: s.secondary.label })) : (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost", onClick: s.secondary.onClick, children: s.secondary.label }))), s.skippable && (_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost", onClick: () => markDone(s.id), children: "Skip" }))] })] }))] }, s.id));
                }) }), footer && _jsx("footer", { className: "cc-first-run__footer", children: footer })] }));
}
//# sourceMappingURL=FirstRunGuide.js.map