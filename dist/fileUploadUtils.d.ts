/**
 * Shared utilities for FileUploadField.
 */
/**
 * Format a byte count into a human-readable string.
 *
 * @example formatFileSize(500)       // "500 B"
 * @example formatFileSize(1536)      // "1.5 KB"
 * @example formatFileSize(2097152)   // "2.0 MB"
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Check whether a single file satisfies the accept pattern.
 *
 * The `accept` attribute uses comma-separated MIME types or extensions:
 *   "image/*", "image/png,image/jpeg", ".pdf,.docx"
 *
 * Returns true if accept is empty/undefined.
 */
export declare function fileMatchesAccept(file: File, accept?: string): boolean;
//# sourceMappingURL=fileUploadUtils.d.ts.map