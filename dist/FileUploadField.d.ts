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
export declare const FileUploadField: React.NamedExoticComponent<FileUploadFieldProps>;
//# sourceMappingURL=FileUploadField.d.ts.map