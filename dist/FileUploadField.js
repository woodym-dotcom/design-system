import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
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
export const FileUploadField = React.memo(function FileUploadField({ id, label, onChange, accept, maxSize, multiple = false, error: externalError, hint, required = false, disabled = false, className, }) {
    const inputRef = React.useRef(null);
    const onChangeRef = React.useRef(onChange);
    React.useLayoutEffect(() => { onChangeRef.current = onChange; });
    const [files, setFiles] = React.useState([]);
    const [internalError, setInternalError] = React.useState();
    const [dragActive, setDragActive] = React.useState(false);
    const activeError = externalError ?? internalError;
    const hasError = Boolean(activeError);
    // ------------------------------------------------------------------
    // Validation
    // ------------------------------------------------------------------
    function validate(incoming) {
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
    function processFiles(incoming) {
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
    const handleInputChange = React.useCallback((e) => {
        const incoming = Array.from(e.target.files ?? []);
        processFiles(incoming);
        // Reset native input so re-selecting same file triggers onChange
        e.target.value = '';
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, multiple, accept, maxSize]);
    const handleDropzoneClick = React.useCallback(() => {
        if (!disabled)
            inputRef.current?.click();
    }, [disabled]);
    const handleKeyDown = React.useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled)
                inputRef.current?.click();
        }
    }, [disabled]);
    const handleDragOver = React.useCallback((e) => {
        e.preventDefault();
        if (e.dataTransfer.types.includes('Files'))
            setDragActive(true);
    }, []);
    const handleDragLeave = React.useCallback(() => {
        setDragActive(false);
    }, []);
    const handleDrop = React.useCallback((e) => {
        e.preventDefault();
        setDragActive(false);
        if (disabled)
            return;
        const incoming = Array.from(e.dataTransfer.files);
        processFiles(incoming);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, multiple, accept, maxSize, disabled]);
    const handleRemove = React.useCallback((index) => {
        const next = files.filter((_, i) => i !== index);
        setFiles(next);
        onChangeRef.current(next);
    }, [files]);
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
    return (_jsxs("div", { className: wrapClasses, children: [_jsxs("label", { htmlFor: id, className: "cc-field__label", children: [label, required ? (_jsxs("span", { className: "cc-field__required", "aria-hidden": "true", children: [' ', "*"] })) : null] }), _jsx("input", { ref: inputRef, id: id, type: "file", accept: accept, multiple: multiple, disabled: disabled, onChange: handleInputChange, style: { display: 'none' }, "aria-hidden": "true", tabIndex: -1 }), _jsx("div", { className: dropzoneClasses, role: "button", "aria-label": dropzoneLabel, "aria-invalid": hasError || undefined, "aria-describedby": `${id}-slot`, tabIndex: disabled ? -1 : 0, onClick: handleDropzoneClick, onKeyDown: handleKeyDown, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, children: _jsx("span", { className: "cc-upload__prompt", "aria-hidden": "true", children: dragActive ? '⬇ Release to upload' : '↑ Drop files here or click to browse' }) }), files.length > 0 && (_jsx("ul", { className: "cc-upload__file-list", "aria-label": "Selected files", children: files.map((file, i) => (_jsxs("li", { className: "cc-upload__file-item", children: [_jsx("span", { className: "cc-upload__file-name", children: file.name }), _jsxs("span", { className: "cc-upload__file-size", "aria-hidden": "true", children: [' ', "(", formatFileSize(file.size), ")"] }), _jsx("button", { type: "button", className: "cc-upload__remove-btn", "aria-label": `Remove ${file.name}`, onClick: () => handleRemove(i), disabled: disabled, children: "\u00D7" })] }, `${file.name}-${i}`))) })), _jsx("p", { id: `${id}-slot`, className: hasError ? 'cc-field__error' : 'cc-field__hint', role: hasError ? 'alert' : undefined, "aria-live": hasError ? 'assertive' : 'polite', children: hasError ? activeError : (hint ?? '') })] }));
});
//# sourceMappingURL=FileUploadField.js.map