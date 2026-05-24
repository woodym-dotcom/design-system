import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
function truncateHash(hash, len) {
    if (hash.length <= len)
        return hash;
    return hash.slice(0, len) + "...";
}
function blockStatus(block) {
    if (block.verified)
        return "verified";
    return "broken";
}
const STATUS_META = {
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
function formatDate(d) {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleString();
}
export function HashChainVerifier({ blocks, title = "Hash Chain Verification", hashDisplayLength = 8, onBlockClick, showSummary = true, className, }) {
    const classes = ["cc-hash-chain-verifier", className]
        .filter(Boolean)
        .join(" ");
    const verifiedCount = blocks.filter((b) => b.verified).length;
    const brokenCount = blocks.filter((b) => !b.verified).length;
    const allVerified = brokenCount === 0;
    return (_jsxs("div", { className: classes, role: "region", "aria-label": title, style: {
            display: "flex",
            flexDirection: "column",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius-2, 8px)",
            background: "var(--surface-1)",
        }, children: [_jsxs("header", { className: "cc-hash-chain-verifier__header", style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
                    borderBottom: "1px solid var(--border-1)",
                }, children: [_jsx("h3", { className: "cc-hash-chain-verifier__title", style: { margin: 0, fontSize: "var(--text-base, 1rem)", fontWeight: 600 }, children: title }), showSummary && (_jsx("span", { className: `cc-hash-chain-verifier__summary cc-hash-chain-verifier__summary--${allVerified ? "ok" : "broken"}`, style: {
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "var(--space-1, 0.25rem)",
                            padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
                            borderRadius: "999px",
                            fontSize: "var(--text-xs, 0.75rem)",
                            fontWeight: 600,
                            background: allVerified ? "var(--success-light)" : "var(--error-light)",
                            color: allVerified ? "var(--success-text)" : "var(--error-text)",
                        }, children: allVerified
                            ? `${verifiedCount}/${blocks.length} verified`
                            : `${brokenCount} broken link${brokenCount !== 1 ? "s" : ""}` }))] }), _jsx("div", { className: "cc-hash-chain-verifier__chain", style: {
                    display: "flex",
                    flexDirection: "column",
                    padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
                    gap: 0,
                }, children: blocks.map((block, i) => {
                    const status = blockStatus(block);
                    const meta = STATUS_META[status];
                    const isLast = i === blocks.length - 1;
                    return (_jsxs(React.Fragment, { children: [_jsxs("div", { className: [
                                    "cc-hash-chain-verifier__block",
                                    `cc-hash-chain-verifier__block--${status}`,
                                    onBlockClick ? "cc-hash-chain-verifier__block--clickable" : null,
                                ]
                                    .filter(Boolean)
                                    .join(" "), style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--space-3, 0.5rem)",
                                    padding: "var(--space-2, 0.375rem) var(--space-3, 0.5rem)",
                                    borderRadius: "var(--radius-1, 4px)",
                                    border: `1px solid ${meta.border}`,
                                    background: meta.bg,
                                    cursor: onBlockClick ? "pointer" : "default",
                                }, onClick: onBlockClick ? () => onBlockClick(block) : undefined, role: onBlockClick ? "button" : undefined, tabIndex: onBlockClick ? 0 : undefined, onKeyDown: onBlockClick
                                    ? (e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            onBlockClick(block);
                                        }
                                    }
                                    : undefined, children: [_jsx("span", { className: "cc-hash-chain-verifier__status-icon", style: {
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
                                        }, "aria-label": meta.label, children: meta.icon }), _jsxs("span", { className: "cc-hash-chain-verifier__block-index", style: {
                                            fontSize: "var(--text-xs, 0.75rem)",
                                            fontWeight: 600,
                                            color: "var(--text-2)",
                                            flexShrink: 0,
                                            width: "2rem",
                                        }, children: ["#", block.index] }), _jsx("code", { className: "cc-hash-chain-verifier__hash", style: {
                                            fontSize: "var(--text-xs, 0.75rem)",
                                            fontFamily: "monospace",
                                            color: meta.color,
                                            flex: 1,
                                        }, children: truncateHash(block.hash, hashDisplayLength) }), block.label && (_jsx("span", { className: "cc-hash-chain-verifier__block-label", style: {
                                            fontSize: "var(--text-xs, 0.75rem)",
                                            color: "var(--text-3)",
                                        }, children: block.label })), block.timestamp && (_jsx("span", { className: "cc-hash-chain-verifier__timestamp", style: {
                                            fontSize: "var(--text-xs, 0.75rem)",
                                            color: "var(--text-4)",
                                            flexShrink: 0,
                                        }, children: formatDate(block.timestamp) }))] }), !isLast && (_jsx("div", { className: "cc-hash-chain-verifier__link", "aria-hidden": "true", style: {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: 16,
                                    color: "var(--text-4)",
                                    fontSize: "var(--text-xs, 0.75rem)",
                                }, children: "|" }))] }, block.index));
                }) })] }));
}
//# sourceMappingURL=HashChainVerifier.js.map