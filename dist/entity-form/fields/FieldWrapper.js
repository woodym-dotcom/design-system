import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function FieldWrapper({ id, label, hint, error, required, children, className, }) {
    const hasError = Boolean(error);
    const fieldClasses = ['cc-field', hasError ? 'cc-field--error' : ''].filter(Boolean).join(' ');
    const wrapClasses = [fieldClasses, className].filter(Boolean).join(' ');
    return (_jsxs("div", { className: wrapClasses, children: [_jsxs("label", { htmlFor: id, className: "cc-field__label", children: [label, required ? _jsx("span", { className: "cc-field__required", "aria-hidden": "true", children: " *" }) : null] }), children, _jsx("p", { id: `${id}-slot`, className: hasError ? 'cc-field__error' : 'cc-field__hint', role: hasError ? 'alert' : undefined, "aria-live": hasError ? 'assertive' : 'polite', children: hasError ? error : (hint ?? '') })] }));
}
//# sourceMappingURL=FieldWrapper.js.map