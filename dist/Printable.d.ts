/**
 * Printable region + PrintHeader / PrintFooter + ShareableSnapshotButton.
 *
 * Adopt on any surface that needs to be exported (printed, PDF'd, or
 * shared as a read-only signed URL):
 *
 *   <Printable
 *     header={<PrintHeader title="Decision Record" generatedAt={now} />}
 *     footer={<PrintFooter generatedBy={user.name} version={record.version} />}
 *   >
 *     <DecisionRecordBody ... />
 *   </Printable>
 *
 * The @ds/core print stylesheet at `tokens/print.css` keys off
 * `[data-print-target]` to hide app chrome and reflow this region for print.
 *
 * ShareableSnapshotButton mints a signed read-only URL via an injected
 * `onMintToken` async callback — @ds/core does not call the backend
 * itself; the consumer wires the mint endpoint (e.g. POST
 * /v1/shared-snapshots — filed as a separate backend ticket).
 */
import * as React from 'react';
export interface PrintableProps {
    /** Optional header region (typically <PrintHeader>) */
    header?: React.ReactNode;
    /** Optional footer region (typically <PrintFooter>) */
    footer?: React.ReactNode;
    /** Export hint surfaced as a data-attribute for tooling/CSS. */
    exportFormat?: 'print' | 'pdf';
    /** Body content of the printable region. */
    children: React.ReactNode;
    className?: string;
}
export declare function Printable({ header, footer, exportFormat, children, className, }: PrintableProps): import("react/jsx-runtime").JSX.Element;
export interface PrintHeaderProps {
    /** Document title. */
    title: React.ReactNode;
    /** When the document was generated. Rendered as a <time> for provenance. */
    generatedAt?: Date;
    /** Optional org logo node (img / svg). */
    logo?: React.ReactNode;
    /** Current page within the printed output (1-based). */
    pageNumber?: number;
    /** Total page count of the printed output. */
    totalPages?: number;
}
export declare function PrintHeader({ title, generatedAt, logo, pageNumber, totalPages, }: PrintHeaderProps): import("react/jsx-runtime").JSX.Element;
export interface PrintFooterProps {
    /** Who generated the document (e.g. operator name or ID). */
    generatedBy: React.ReactNode;
    /** Document version (e.g. "v3.7" or a hash). */
    version?: React.ReactNode;
    /** Optional extra footer slot (e.g. confidentiality stamp). */
    extra?: React.ReactNode;
}
export declare function PrintFooter({ generatedBy, version, extra }: PrintFooterProps): import("react/jsx-runtime").JSX.Element;
export interface SnapshotMintRequest {
    /** Human-readable label for the resource being shared (audit + UI). */
    resourceLabel: string;
    /** Requested expiry in days (1–90). */
    expiryDays: number;
    /** Optional recipient email — captured for audit log. */
    recipientEmail?: string;
    /** Optional permission scope (free-form string the consumer interprets). */
    scope?: string;
}
export interface SnapshotMintResult {
    /** The signed read-only URL to share. */
    url: string;
    /** ISO timestamp the URL expires (provided by the mint endpoint). */
    expiresAt: string;
    /** Optional token id for audit/revocation. */
    tokenId?: string;
}
export interface ShareableSnapshotButtonProps {
    /** Callback to mint a token. Consumer wires this to the backend. */
    onMintToken: (req: SnapshotMintRequest) => Promise<SnapshotMintResult>;
    /** Resource label shown in the modal title. */
    resourceLabel: string;
    /** Default expiry in days when the modal opens. Default 14. */
    defaultExpiryDays?: number;
    /** Visible button label. Default 'Share read-only'. */
    label?: string;
    /** Called once the URL is generated; useful for analytics. */
    onMinted?: (result: SnapshotMintResult) => void;
    className?: string;
}
export declare function ShareableSnapshotButton({ onMintToken, resourceLabel, defaultExpiryDays, label, onMinted, className, }: ShareableSnapshotButtonProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Printable.d.ts.map