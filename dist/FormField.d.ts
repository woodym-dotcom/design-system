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
 *
 * Extended to support multiple control kinds via the `as` prop
 * ("input" | "textarea" | "select" | "checkbox"). The default `as="input"`
 * preserves the original DOM exactly; alternative kinds wrap the same
 * cc-field outer chrome around the matching native element.
 */
import * as React from 'react';
export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type FormFieldAs = 'input' | 'textarea' | 'select' | 'checkbox';
export interface FormFieldProps {
    /** Stable field identifier — used as the HTML id and the React key anchor. */
    id: string;
    label: string;
    /** Current value. For `as="checkbox"`, see `checked`. */
    value?: string;
    /**
     * Change handler. Receives the new string value for input/textarea/select,
     * and the boolean checked state (cast to string "true"/"false") for the
     * checkbox shape — when `as="checkbox"`, the second argument is also passed
     * for callers that need the raw boolean.
     */
    onChange: (value: string, checked?: boolean) => void;
    /**
     * Element kind. Defaults to "input". The default path is byte-identical to
     * the original FormField implementation; alternative paths add new
     * cc-form-field__* element classes.
     */
    as?: FormFieldAs;
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
    /** Inline modifier (puts the label on the same row as the control). */
    inline?: boolean;
    rows?: number;
    cols?: number;
    children?: React.ReactNode;
    checked?: boolean;
    min?: number | string;
    max?: number | string;
    step?: number | string;
    pattern?: string;
    maxLength?: number;
}
export declare const FormField: React.MemoExoticComponent<(props: FormFieldProps) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=FormField.d.ts.map