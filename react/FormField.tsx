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

export const FormField = React.memo(function FormField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  hint,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  autoComplete,
  className,
}: FormFieldProps) {
  // Stable handler ref — keeps the input's onChange identity stable even when
  // the parent passes a new function literal on each render.
  const onChangeRef = React.useRef(onChange);
  React.useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeRef.current(e.target.value);
  }, []); // dep array intentionally empty — ref always current

  const hasError = Boolean(error);
  const fieldClasses = ['cc-field'];
  if (hasError) fieldClasses.push('cc-field--error');
  if (className) fieldClasses.push(className);

  // The error/hint slot is ALWAYS rendered (never conditionally unmounted).
  // Content is swapped in-place; the slot uses min-height in CSS to prevent
  // layout shift when error text appears or disappears.
  const slotContent = hasError ? error : hint ?? '';

  return (
    <div className={fieldClasses.join(' ')}>
      <label htmlFor={id} className="cc-field__label">
        {label}
        {required ? <span className="cc-field__required" aria-hidden="true"> *</span> : null}
      </label>
      {/* key is ONLY id — never value or error — so React never remounts. */}
      <input
        key={id}
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        aria-invalid={hasError || undefined}
        aria-describedby={`${id}-slot`}
      />
      {/* Always in DOM; aria-live surfaces error text to screen readers. */}
      <p
        id={`${id}-slot`}
        className={hasError ? 'cc-field__error' : 'cc-field__hint'}
        role={hasError ? 'alert' : undefined}
        aria-live={hasError ? 'assertive' : 'polite'}
      >
        {slotContent}
      </p>
    </div>
  );
});
