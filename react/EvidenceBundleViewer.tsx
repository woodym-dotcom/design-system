/**
 * EvidenceBundleViewer — structured viewer for evidence bundles.
 *
 * Displays a list of evidence files with metadata (type, size, upload date),
 * preview/download actions, and bundle-level summary. Used in KYC, audit,
 * and compliance workflows where document bundles need structured review.
 *
 * Usage:
 *   <EvidenceBundleViewer
 *     bundleId="B-1234"
 *     files={[
 *       { id: 'f1', name: 'passport.pdf', type: 'identity', size: 245000, uploadedAt: new Date() },
 *       { id: 'f2', name: 'utility_bill.jpg', type: 'address', size: 180000, uploadedAt: new Date() },
 *     ]}
 *     onDownload={(file) => download(file.id)}
 *   />
 */
import * as React from "react";
import { Card } from "./Card";

export type EvidenceFileStatus = "pending" | "verified" | "rejected" | "expired";

export interface EvidenceFile {
  id: string;
  /** File name. */
  name: string;
  /** Evidence category, e.g. "identity", "address", "financial". */
  type: string;
  /** File size in bytes. */
  size?: number;
  /** When the file was uploaded. */
  uploadedAt?: Date | string;
  /** Verification status. */
  status?: EvidenceFileStatus;
  /** MIME type for icon hints. */
  mimeType?: string;
}

export interface EvidenceBundleViewerProps {
  /** Bundle identifier. */
  bundleId?: string;
  /** Title. Default: "Evidence Bundle". */
  title?: string;
  /** The evidence files. */
  files: EvidenceFile[];
  /** Called when user clicks download on a file. */
  onDownload?: (file: EvidenceFile) => void;
  /** Called when user clicks preview on a file. */
  onPreview?: (file: EvidenceFile) => void;
  /** Called when user wants to download the entire bundle. */
  onDownloadAll?: () => void;
  className?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString();
}

const STATUS_STYLES: Record<
  EvidenceFileStatus,
  { color: string; label: string }
> = {
  pending: { color: "var(--warning-text)", label: "Pending" },
  verified: { color: "var(--success-text)", label: "Verified" },
  rejected: { color: "var(--error-text)", label: "Rejected" },
  expired: { color: "var(--text-4)", label: "Expired" },
};

export function EvidenceBundleViewer({
  bundleId,
  title = "Evidence Bundle",
  files,
  onDownload,
  onPreview,
  onDownloadAll,
  className,
}: EvidenceBundleViewerProps): React.ReactElement {
  const classes = ["cc-evidence-bundle-viewer", className]
    .filter(Boolean)
    .join(" ");

  const subtitleContent = (
    <>
      {bundleId && (
        <span className="cc-evidence-bundle-viewer__bundle-id">
          {bundleId}
        </span>
      )}
      {" "}
      <span className="cc-evidence-bundle-viewer__count">
        {files.length} file{files.length !== 1 ? "s" : ""}
      </span>
    </>
  );

  const headerActions = onDownloadAll ? (
    <button
      type="button"
      className="cc-evidence-bundle-viewer__download-all"
      onClick={onDownloadAll}
      style={{
        padding: "var(--space-1, 0.25rem) var(--space-3, 0.5rem)",
        borderRadius: "var(--radius-1, 4px)",
        border: "1px solid var(--border-1)",
        background: "transparent",
        cursor: "pointer",
        fontSize: "var(--text-sm, 0.875rem)",
        fontWeight: 500,
      }}
    >
      Download all
    </button>
  ) : undefined;

  return (
    <Card
      title={title}
      subtitle={subtitleContent}
      actions={headerActions}
      padded={false}
      className={classes}
      role="region"
      aria-label={title}
    >
      <ul
        className="cc-evidence-bundle-viewer__list"
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {files.map((file) => {
          const statusMeta = file.status ? STATUS_STYLES[file.status] : null;
          return (
            <li
              key={file.id}
              className="cc-evidence-bundle-viewer__file"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3, 0.5rem)",
                padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
                borderBottom: "1px solid var(--border-1)",
                fontSize: "var(--text-sm, 0.875rem)",
              }}
            >
              <span
                className="cc-evidence-bundle-viewer__file-icon"
                aria-hidden="true"
                style={{ flexShrink: 0, fontSize: "1.25rem" }}
              >
                {file.mimeType?.startsWith("image/") ? "🖼" : "📄"}
              </span>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
                <span
                  className="cc-evidence-bundle-viewer__file-name"
                  style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {file.name}
                </span>
                <span
                  className="cc-evidence-bundle-viewer__file-meta"
                  style={{ fontSize: "var(--text-xs, 0.75rem)", color: "var(--text-3)", display: "flex", gap: "var(--space-2, 0.375rem)" }}
                >
                  <span>{file.type}</span>
                  {file.size !== undefined && <span>{formatSize(file.size)}</span>}
                  {file.uploadedAt && <span>{formatDate(file.uploadedAt)}</span>}
                </span>
              </div>

              {statusMeta && (
                <span
                  className={`cc-evidence-bundle-viewer__status cc-evidence-bundle-viewer__status--${file.status}`}
                  style={{
                    fontSize: "var(--text-xs, 0.75rem)",
                    fontWeight: 600,
                    color: statusMeta.color,
                    flexShrink: 0,
                  }}
                >
                  {statusMeta.label}
                </span>
              )}

              <div style={{ display: "flex", gap: "var(--space-1, 0.25rem)", flexShrink: 0 }}>
                {onPreview && (
                  <button
                    type="button"
                    className="cc-evidence-bundle-viewer__preview"
                    onClick={() => onPreview(file)}
                    aria-label={`Preview ${file.name}`}
                    style={{
                      background: "none",
                      border: "1px solid var(--border-1)",
                      borderRadius: "var(--radius-1, 4px)",
                      padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
                      cursor: "pointer",
                      fontSize: "var(--text-xs, 0.75rem)",
                    }}
                  >
                    Preview
                  </button>
                )}
                {onDownload && (
                  <button
                    type="button"
                    className="cc-evidence-bundle-viewer__download"
                    onClick={() => onDownload(file)}
                    aria-label={`Download ${file.name}`}
                    style={{
                      background: "none",
                      border: "1px solid var(--border-1)",
                      borderRadius: "var(--radius-1, 4px)",
                      padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
                      cursor: "pointer",
                      fontSize: "var(--text-xs, 0.75rem)",
                    }}
                  >
                    Download
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
