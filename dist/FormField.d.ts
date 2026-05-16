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
export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export interface FormFieldProps {
    /** Stable field identifier — used as the HTML id and the React key anchor. */
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: FormFieldType;
    placeholder?: string;
    hint?: string;
    /** When set, displays an error and applies .cc-field--error styling. */
    error?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    autoComplete?: string;
    className?: string;
}
export declare const FormField: React.NamedExoticComponent<FormFieldProps>;
//# sourceMappingURL=FormField.d.ts.map