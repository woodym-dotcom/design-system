/**
 * Shared field wrapper — renders label, input slot, and always-mounted error/hint slot.
 * G4 invariant: error slot is ALWAYS in the DOM; text is swapped in-place.
 */
import * as React from 'react';

interface FieldWrapperProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FieldWrapper({
  id,
  label,
  hint,
  error,
  required,
  children,
  className,
}: FieldWrapperProps) {
  const hasError = Boolean(error);
  const fieldClasses = ['cc-field', hasError ? 'cc-field--error' : ''].filter(Boolean).join(' ');
  const wrapClasses = [fieldClasses, className].filter(Boolean).join(' ');

  return (
    <div className={wrapClasses}>
      <label htmlFor={id} className="cc-field__label">
        {label}
        {required ? <span className="cc-field__required" aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {/* Always in DOM — G4 invariant; min-height reserved in primitives.css */}
      <p
        id={`${id}-slot`}
        className={hasError ? 'cc-field__error' : 'cc-field__hint'}
        role={hasError ? 'alert' : undefined}
        aria-live={hasError ? 'assertive' : 'polite'}
      >
        {hasError ? error : (hint ?? '')}
      </p>
    </div>
  );
}
