/**
 * HashChainVerifier — hash chain integrity verification display.
 *
 * Shows a sequential chain of hashed blocks with verification status.
 * Used for audit-log integrity verification, blockchain-style immutability
 * proof, and tamper-detection UIs.
 *
 * Usage:
 *   <HashChainVerifier
 *     blocks={[
 *       { index: 0, hash: 'abc123...', prevHash: null, verified: true, timestamp: new Date() },
 *       { index: 1, hash: 'def456...', prevHash: 'abc123...', verified: true, timestamp: new Date() },
 *       { index: 2, hash: 'ghi789...', prevHash: 'TAMPERED', verified: false, timestamp: new Date() },
 *     ]}
 *   />
 */
import * as React from "react";
export type ChainBlockStatus = "verified" | "broken" | "pending" | "skipped";
export interface ChainBlock {
    /** Block index / sequence number. */
    index: number;
    /** Current block hash (truncated for display). */
    hash: string;
    /** Previous block hash (null for genesis). */
    prevHash: string | null;
    /** Whether this block's hash chain is verified. */
    verified: boolean;
    /** Block timestamp. */
    timestamp?: Date | string;
    /** Optional label for this block (e.g. event description). */
    label?: string;
}
export interface HashChainVerifierProps {
    /** Ordered chain blocks (genesis first). */
    blocks: ChainBlock[];
    /** Title. Default: "Hash Chain Verification". */
    title?: string;
    /** Number of hash characters to display. Default: 8. */
    hashDisplayLength?: number;
    /** Called when a block is clicked for detail inspection. */
    onBlockClick?: (block: ChainBlock) => void;
    /** Whether to show the overall chain status summary. Default: true. */
    showSummary?: boolean;
    className?: string;
}
export declare function HashChainVerifier({ blocks, title, hashDisplayLength, onBlockClick, showSummary, className, }: HashChainVerifierProps): React.ReactElement;
//# sourceMappingURL=HashChainVerifier.d.ts.map