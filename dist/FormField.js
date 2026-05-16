import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * <FormField> — stable form-field wrapper that satisfies all G4 invariants:
 *
 *  1. Input is NEVER conditionally unmounted based on its own value/error.
 *  2. The error/hint slot is always in the DOM (min-height reserved in CSS);
 *     text is swapped in-place, not via conditional mount.
 *  3. The key prop on the input is derived only from `id` — never from value,
 *     error string, or submit count — so React never remounts it.
 *  4. The `onChange` callback handle is stable across renders via useCallback
 *     with an empty dep array; the parent-supplied handler is forwarded via a
 *     ref so consumers that pass new function literals on every render do not
 *     trigger remounts.
 */
import * as React from 'react';
export const FormField = React.memo(function FormField({ id, label, value, onChange, type = 'text', placeholder, hint, error, required = false, disabled = false, readOnly = false, autoComplete, className, }) {
    // Stable handler ref — keeps the input's onChange identity stable even when
    // the parent passes a new function literal on each render.
    const onChangeRef = React.useRef(onChange);
    React.useLayoutEffect(() => {
        onChangeRef.current = onChange;
    });
    const handleChange = React.useCallback((e) => {
        onChangeRef.current(e.target.value);
    }, []); // dep array intentionally empty — ref always current
    const hasError = Boolean(error);
    const fieldClasses = ['cc-field'];
    if (hasError)
        fieldClasses.push('cc-field--error');
    if (className)
        fieldClasses.push(className);
    // The error/hint slot is ALWAYS rendered (never conditionally unmounted).
    // Content is swapped in-place; the slot uses min-height in CSS to prevent
    // layout shift when error text appears or disappears.
    const slotContent = hasError ? error : hint ?? '';
    return (_jsxs("div", { className: fieldClasses.join(' '), children: [_jsxs("label", { htmlFor: id, className: "cc-field__label", children: [label, required ? _jsx("span", { className: "cc-field__required", "aria-hidden": "true", children: " *" }) : null] }), _jsx("input", { id: id, type: type, value: value, onChange: handleChange, placeholder: placeholder, required: required, disabled: disabled, readOnly: readOnly, autoComplete: autoComplete, "aria-invalid": hasError || undefined, "aria-describedby": `${id}-slot` }, id), _jsx("p", { id: `${id}-slot`, className: hasError ? 'cc-field__error' : 'cc-field__hint', role: hasError ? 'alert' : undefined, "aria-live": hasError ? 'assertive' : 'polite', children: slotContent })] }));
});
//# sourceMappingURL=FormField.js.map