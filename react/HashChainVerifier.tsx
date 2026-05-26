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
import { Card } from "./Card";

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

function truncateHash(hash: string, len: number): string {
  if (hash.length <= len) return hash;
  return hash.slice(0, len) + "...";
}

function blockStatus(block: ChainBlock): ChainBlockStatus {
  if (block.verified) return "verified";
  return "broken";
}

const STATUS_META: Record<
  ChainBlockStatus,
  { color: string; bg: string; border: string; icon: string; label: string }
> = {
  verified: {
    color: "var(--success-text)",
    bg: "var(--success-light)",
    border: "var(--success-border)",
    icon: "✓",
    label: "Verified",
  },
  broken: {
    color: "var(--error-text)",
    bg: "var(--error-light)",
    border: "var(--error-border)",
    icon: "✕",
    label: "Broken",
  },
  pending: {
    color: "var(--warning-text)",
    bg: "var(--warning-light)",
    border: "var(--warning-border)",
    icon: "?",
    label: "Pending",
  },
  skipped: {
    color: "var(--text-4)",
    bg: "var(--surface-2)",
    border: "var(--border-1)",
    icon: "-",
    label: "Skipped",
  },
};

function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString();
}

export function HashChainVerifier({
  blocks,
  title = "Hash Chain Verification",
  hashDisplayLength = 8,
  onBlockClick,
  showSummary = true,
  className,
}: HashChainVerifierProps): React.ReactElement {
  const classes = ["cc-hash-chain-verifier", className]
    .filter(Boolean)
    .join(" ");

  const verifiedCount = blocks.filter((b) => b.verified).length;
  const brokenCount = blocks.filter((b) => !b.verified).length;
  const allVerified = brokenCount === 0;

  const summaryBadge = showSummary ? (
    <span
      className={`cc-hash-chain-verifier__summary cc-hash-chain-verifier__summary--${allVerified ? "ok" : "broken"}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1, 0.25rem)",
        padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
        borderRadius: "999px",
        fontSize: "var(--text-xs, 0.75rem)",
        fontWeight: 600,
        background: allVerified ? "var(--success-light)" : "var(--error-light)",
        color: allVerified ? "var(--success-text)" : "var(--error-text)",
      }}
    >
      {allVerified
        ? `${verifiedCount}/${blocks.length} verified`
        : `${brokenCount} broken link${brokenCount !== 1 ? "s" : ""}`}
    </span>
  ) : undefined;

  return (
    <Card
      title={title}
      actions={summaryBadge}
      padded
      className={classes}
      role="region"
      aria-label={title}
    >
      <div
        className="cc-hash-chain-verifier__chain"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {blocks.map((block, i) => {
          const status = blockStatus(block);
          const meta = STATUS_META[status];
          const isLast = i === blocks.length - 1;

          return (
            <React.Fragment key={block.index}>
              <div
                className={[
                  "cc-hash-chain-verifier__block",
                  `cc-hash-chain-verifier__block--${status}`,
                  onBlockClick ? "cc-hash-chain-verifier__block--clickable" : null,
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3, 0.5rem)",
                  padding: "var(--space-2, 0.375rem) var(--space-3, 0.5rem)",
                  borderRadius: "var(--radius-1, 4px)",
                  border: `1px solid ${meta.border}`,
                  background: meta.bg,
                  cursor: onBlockClick ? "pointer" : "default",
                }}
                onClick={onBlockClick ? () => onBlockClick(block) : undefined}
                role={onBlockClick ? "button" : undefined}
                tabIndex={onBlockClick ? 0 : undefined}
                onKeyDown={
                  onBlockClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onBlockClick(block);
                        }
                      }
                    : undefined
                }
              >
                <span
                  className="cc-hash-chain-verifier__status-icon"
                  style={{
                    flexShrink: 0,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "var(--text-xs, 0.75rem)",
                    fontWeight: 700,
                    color: meta.color,
                    background: "var(--surface-1)",
                    border: `1px solid ${meta.border}`,
                  }}
                  aria-label={meta.label}
                >
                  {meta.icon}
                </span>

                <span
                  className="cc-hash-chain-verifier__block-index"
                  style={{
                    fontSize: "var(--text-xs, 0.75rem)",
                    fontWeight: 600,
                    color: "var(--text-2)",
                    flexShrink: 0,
                    width: "2rem",
                  }}
                >
                  #{block.index}
                </span>

                <code
                  className="cc-hash-chain-verifier__hash"
                  style={{
                    fontSize: "var(--text-xs, 0.75rem)",
                    fontFamily: "monospace",
                    color: meta.color,
                    flex: 1,
                  }}
                >
                  {truncateHash(block.hash, hashDisplayLength)}
                </code>

                {block.label && (
                  <span
                    className="cc-hash-chain-verifier__block-label"
                    style={{
                      fontSize: "var(--text-xs, 0.75rem)",
                      color: "var(--text-3)",
                    }}
                  >
                    {block.label}
                  </span>
                )}

                {block.timestamp && (
                  <span
                    className="cc-hash-chain-verifier__timestamp"
                    style={{
                      fontSize: "var(--text-xs, 0.75rem)",
                      color: "var(--text-4)",
                      flexShrink: 0,
                    }}
                  >
                    {formatDate(block.timestamp)}
                  </span>
                )}
              </div>

              {/* Chain link connector */}
              {!isLast && (
                <div
                  className="cc-hash-chain-verifier__link"
                  aria-hidden="true"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 16,
                    color: "var(--text-4)",
                    fontSize: "var(--text-xs, 0.75rem)",
                  }}
                >
                  |
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
}
