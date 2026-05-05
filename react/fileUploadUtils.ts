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
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Check whether a single file satisfies the accept pattern.
 *
 * The `accept` attribute uses comma-separated MIME types or extensions:
 *   "image/*", "image/png,image/jpeg", ".pdf,.docx"
 *
 * Returns true if accept is empty/undefined.
 */
export function fileMatchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const patterns = accept.split(',').map((s) => s.trim().toLowerCase());
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) {
      return fileName.endsWith(pattern);
    }
    if (pattern.endsWith('/*')) {
      const baseType = pattern.slice(0, -2);
      return fileType.startsWith(baseType + '/');
    }
    return fileType === pattern;
  });
}
