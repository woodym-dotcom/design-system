import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @deprecated DateField is an internal field primitive; it is no longer part of
 * the public API. Use <EntityForm schema={...}> or <FormField as="shell"> instead.
 * Will be removed from public exports in v1.0 (DS-SIMPLIFY 14).
 *
 * DateField — native date picker with DD-MON-YYYY display format (X-38).
 * Internal value: ISO 8601 string (YYYY-MM-DD).
 * Display: formatted as DD-MON-YYYY.
 */
import { useId } from 'react';
import { FieldWrapper } from './FieldWrapper';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function isoToDdMonYyyy(iso) {
    if (!iso)
        return '';
    // Parse YYYY-MM-DD without time component to avoid timezone offset issues
    const [yearStr, monthStr, dayStr] = iso.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    if (isNaN(year) || isNaN(month) || isNaN(day))
        return iso;
    const dd = String(day).padStart(2, '0');
    const mon = MONTHS[month - 1];
    return `${dd}-${mon}-${year}`;
}
export function DateField({ name, form, label, hint, required, disabled, readOnly, min, max }) {
    const reactId = useId();
    const id = `ef-${reactId}-${name}`;
    const meta = form._schema?._fieldMeta?.[name];
    const resolvedLabel = label ?? meta?.label ?? name;
    const resolvedHint = hint ?? meta?.hint;
    const resolvedRequired = required ?? meta?.required ?? false;
    const value = form.values[name] ?? '';
    const error = form.errors[name];
    // Show formatted value as a readonly text alongside the native picker.
    const formatted = isoToDdMonYyyy(value);
    return (_jsx(FieldWrapper, { id: id, label: resolvedLabel, hint: resolvedHint, error: error, required: resolvedRequired, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }, children: [_jsx("input", { id: id, type: "date", value: value, onChange: (e) => form.setField(name, e.target.value), onBlur: () => form.touchField(name), required: resolvedRequired, disabled: disabled, readOnly: readOnly, min: min, max: max, "aria-invalid": error ? true : undefined, "aria-describedby": `${id}-slot`, style: { maxWidth: '160px' } }, id), value && (_jsx("span", { className: "cc-field__date-display", "aria-hidden": "true", style: { color: 'var(--text-3)', fontSize: 'var(--text-sm)' }, children: formatted }))] }) }));
}
//# sourceMappingURL=DateField.js.map