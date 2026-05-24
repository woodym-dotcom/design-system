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
export declare function EvidenceBundleViewer({ bundleId, title, files, onDownload, onPreview, onDownloadAll, className, }: EvidenceBundleViewerProps): React.ReactElement;
//# sourceMappingURL=EvidenceBundleViewer.d.ts.map