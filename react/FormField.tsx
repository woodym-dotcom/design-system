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
  // textarea-specific
  rows?: number;
  cols?: number;
  // select-specific
  children?: React.ReactNode;
  // checkbox-specific
  checked?: boolean;
  // numeric / text constraints (input / textarea)
  min?: number | string;
  max?: number | string;
  step?: number | string;
  pattern?: string;
  maxLength?: number;
}

const FormFieldImpl = function FormField(props: FormFieldProps) {
  const {
    id,
    label,
    value,
    onChange,
    as = 'input',
    type = 'text',
    placeholder,
    hint,
    error,
    required = false,
    disabled = false,
    readOnly = false,
    autoComplete,
    className,
    inline,
    rows,
    cols,
    children,
    checked,
    min,
    max,
    step,
    pattern,
    maxLength,
  } = props;

  // Stable handler ref — keeps the input's onChange identity stable even when
  // the parent passes a new function literal on each render.
  const onChangeRef = React.useRef(onChange);
  React.useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeRef.current(e.target.value);
    },
    [],
  );
  const handleTextareaChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeRef.current(e.target.value);
    },
    [],
  );
  const handleSelectChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChangeRef.current(e.target.value);
    },
    [],
  );
  const handleCheckboxChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeRef.current(String(e.target.checked), e.target.checked);
    },
    [],
  );

  const hasError = Boolean(error);
  const fieldClasses = ['cc-field'];
  if (hasError) fieldClasses.push('cc-field--error');
  if (inline) fieldClasses.push('cc-form-field--inline');
  if (className) fieldClasses.push(className);

  // The error/hint slot is ALWAYS rendered (never conditionally unmounted).
  // Content is swapped in-place; the slot uses min-height in CSS to prevent
  // layout shift when error text appears or disappears.
  const slotContent = hasError ? error : hint ?? '';

  // Default "input" path renders the EXACT original markup so the G4
  // regression suite continues to pass byte-for-byte.
  if (as === 'input') {
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
          value={value ?? ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          maxLength={maxLength}
          aria-invalid={hasError || undefined}
          aria-describedby={`${id}-slot`}
        />
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
  }

  // Shared label + slot wrapper for non-input variants.
  if (as === 'checkbox') {
    return (
      <div className={fieldClasses.join(' ')}>
        <label htmlFor={id} className="cc-field__label cc-form-field__checkbox-label">
          <input
            key={id}
            id={id}
            type="checkbox"
            checked={checked ?? false}
            onChange={handleCheckboxChange}
            disabled={disabled}
            required={required}
            className="cc-form-field__checkbox"
            aria-invalid={hasError || undefined}
            aria-describedby={`${id}-slot`}
          />
          <span>{label}</span>
          {required ? <span className="cc-field__required" aria-hidden="true"> *</span> : null}
        </label>
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
  }

  if (as === 'textarea') {
    return (
      <div className={fieldClasses.join(' ')}>
        <label htmlFor={id} className="cc-field__label">
          {label}
          {required ? <span className="cc-field__required" aria-hidden="true"> *</span> : null}
        </label>
        <textarea
          key={id}
          id={id}
          className="cc-form-field__textarea"
          value={value ?? ''}
          onChange={handleTextareaChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          cols={cols}
          maxLength={maxLength}
          aria-invalid={hasError || undefined}
          aria-describedby={`${id}-slot`}
        />
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
  }

  // select
  return (
    <div className={fieldClasses.join(' ')}>
      <label htmlFor={id} className="cc-field__label">
        {label}
        {required ? <span className="cc-field__required" aria-hidden="true"> *</span> : null}
      </label>
      <select
        key={id}
        id={id}
        className="cc-form-field__select"
        value={value ?? ''}
        onChange={handleSelectChange}
        required={required}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        aria-describedby={`${id}-slot`}
      >
        {children}
      </select>
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
};

export const FormField = React.memo(FormFieldImpl);
