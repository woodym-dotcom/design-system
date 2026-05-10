/**
 * <FileUploadField> — @ds/core primitive
 *
 * Features:
 *  - Drag-and-drop + click-to-browse
 *  - Client-side file-type validation (accept list)
 *  - Client-side max-size validation
 *  - multiple file support
 *  - File list with per-file remove buttons
 *  - Full G4 accessibility: aria-label, role=button, role=alert for errors,
 *    aria-invalid, keyboard activation (Enter / Space)
 *
 * No new top-level deps — HTML5 native drag-and-drop only.
 */
import * as React from 'react';
import { formatFileSize, fileMatchesAccept } from './fileUploadUtils';

export interface FileUploadFieldProps {
  /** Stable field id — wired to the hidden <input> and aria-describedby. */
  id: string;
  label: string;
  onChange: (files: File[]) => void;
  /** Comma-separated MIME types or extensions forwarded to <input accept>. */
  accept?: string;
  /** Maximum file size in bytes. Validated on drop / input change. */
  maxSize?: number;
  multiple?: boolean;
  /** External (form-level) error string. Shown via role=alert. */
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FileUploadField = React.memo(function FileUploadField({
  id,
  label,
  onChange,
  accept,
  maxSize,
  multiple = false,
  error: externalError,
  hint,
  required = false,
  disabled = false,
  className,
}: FileUploadFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const onChangeRef = React.useRef(onChange);
  React.useLayoutEffect(() => { onChangeRef.current = onChange; });

  const [files, setFiles] = React.useState<File[]>([]);
  const [internalError, setInternalError] = React.useState<string | undefined>();
  const [dragActive, setDragActive] = React.useState(false);

  const activeError = externalError ?? internalError;
  const hasError = Boolean(activeError);

  // ------------------------------------------------------------------
  // Validation
  // ------------------------------------------------------------------
  function validate(incoming: File[]): { valid: File[]; error?: string } {
    const invalid = incoming.find((f) => !fileMatchesAccept(f, accept));
    if (invalid) {
      return {
        valid: [],
        error: accept
          ? `File type not allowed. Accepted: ${accept}`
          : 'File type not allowed.',
      };
    }
    if (maxSize !== undefined) {
      const tooBig = incoming.find((f) => f.size > maxSize);
      if (tooBig) {
        return {
          valid: [],
          error: `File too large. Max size: ${formatFileSize(maxSize)}`,
        };
      }
    }
    return { valid: incoming };
  }

  function processFiles(incoming: File[]) {
    // In single-file mode, the native <input> with multiple=false would only
    // ever pass one file, but drag-and-drop bypasses that gate. Truncate so
    // dropping multiple files behaves the same as picking via the input.
    const limited = multiple ? incoming : incoming.slice(0, 1);
    const { valid, error } = validate(limited);
    if (error) {
      setInternalError(error);
      return;
    }
    setInternalError(undefined);
    const next = multiple ? [...files, ...valid] : valid;
    setFiles(next);
    onChangeRef.current(next);
  }

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const incoming = Array.from(e.target.files ?? []);
      processFiles(incoming);
      // Reset native input so re-selecting same file triggers onChange
      e.target.value = '';
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, multiple, accept, maxSize]
  );

  const handleDropzoneClick = React.useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!disabled) inputRef.current?.click();
      }
    },
    [disabled]
  );

  const handleDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) setDragActive(true);
  }, []);

  const handleDragLeave = React.useCallback(() => {
    setDragActive(false);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      if (disabled) return;
      const incoming = Array.from(e.dataTransfer.files);
      processFiles(incoming);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, multiple, accept, maxSize, disabled]
  );

  const handleRemove = React.useCallback(
    (index: number) => {
      const next = files.filter((_, i) => i !== index);
      setFiles(next);
      onChangeRef.current(next);
    },
    [files]
  );

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  const dropzoneClasses = [
    'cc-upload__dropzone',
    dragActive ? 'cc-upload__dropzone--drag-active' : '',
    hasError ? 'cc-upload__dropzone--error' : '',
    disabled ? 'cc-upload__dropzone--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const wrapClasses = ['cc-field', hasError ? 'cc-field--error' : '', className]
    .filter(Boolean)
    .join(' ');

  const dropzoneLabel = dragActive
    ? 'Release to upload'
    : 'Drop files here or click to browse';

  return (
    <div className={wrapClasses}>
      {/* Label */}
      <label htmlFor={id} className="cc-field__label">
        {label}
        {required ? (
          <span className="cc-field__required" aria-hidden="true">
            {' '}*
          </span>
        ) : null}
      </label>

      {/* Hidden native file input */}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        style={{ display: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Visible drag-drop affordance */}
      <div
        className={dropzoneClasses}
        role="button"
        aria-label={dropzoneLabel}
        aria-invalid={hasError || undefined}
        aria-describedby={`${id}-slot`}
        tabIndex={disabled ? -1 : 0}
        onClick={handleDropzoneClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className="cc-upload__prompt" aria-hidden="true">
          {dragActive ? '⬇ Release to upload' : '↑ Drop files here or click to browse'}
        </span>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="cc-upload__file-list" aria-label="Selected files">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="cc-upload__file-item">
              <span className="cc-upload__file-name">{file.name}</span>
              <span className="cc-upload__file-size" aria-hidden="true">
                {' '}({formatFileSize(file.size)})
              </span>
              <button
                type="button"
                className="cc-upload__remove-btn"
                aria-label={`Remove ${file.name}`}
                onClick={() => handleRemove(i)}
                disabled={disabled}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Error / hint slot — always in DOM (G4 invariant) */}
      <p
        id={`${id}-slot`}
        className={hasError ? 'cc-field__error' : 'cc-field__hint'}
        role={hasError ? 'alert' : undefined}
        aria-live={hasError ? 'assertive' : 'polite'}
      >
        {hasError ? activeError : (hint ?? '')}
      </p>
    </div>
  );
});
