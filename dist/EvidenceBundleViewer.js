import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card } from "./Card.js";
function formatSize(bytes) {
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function formatDate(d) {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString();
}
const STATUS_STYLES = {
    pending: { color: "var(--warning-text)", label: "Pending" },
    verified: { color: "var(--success-text)", label: "Verified" },
    rejected: { color: "var(--error-text)", label: "Rejected" },
    expired: { color: "var(--text-4)", label: "Expired" },
};
export function EvidenceBundleViewer({ bundleId, title = "Evidence Bundle", files, onDownload, onPreview, onDownloadAll, className, }) {
    const classes = ["cc-evidence-bundle-viewer", className]
        .filter(Boolean)
        .join(" ");
    const subtitleContent = (_jsxs(_Fragment, { children: [bundleId && (_jsx("span", { className: "cc-evidence-bundle-viewer__bundle-id", children: bundleId })), " ", _jsxs("span", { className: "cc-evidence-bundle-viewer__count", children: [files.length, " file", files.length !== 1 ? "s" : ""] })] }));
    const headerActions = onDownloadAll ? (_jsx("button", { type: "button", className: "cc-evidence-bundle-viewer__download-all", onClick: onDownloadAll, style: {
            padding: "var(--space-1, 0.25rem) var(--space-3, 0.5rem)",
            borderRadius: "var(--radius-1, 4px)",
            border: "1px solid var(--border-1)",
            background: "transparent",
            cursor: "pointer",
            fontSize: "var(--text-sm, 0.875rem)",
            fontWeight: 500,
        }, children: "Download all" })) : undefined;
    return (_jsx(Card, { title: title, subtitle: subtitleContent, actions: headerActions, padded: false, className: classes, role: "region", "aria-label": title, children: _jsx("ul", { className: "cc-evidence-bundle-viewer__list", style: {
                listStyle: "none",
                margin: 0,
                padding: 0,
            }, children: files.map((file) => {
                const statusMeta = file.status ? STATUS_STYLES[file.status] : null;
                return (_jsxs("li", { className: "cc-evidence-bundle-viewer__file", style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-3, 0.5rem)",
                        padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
                        borderBottom: "1px solid var(--border-1)",
                        fontSize: "var(--text-sm, 0.875rem)",
                    }, children: [_jsx("span", { className: "cc-evidence-bundle-viewer__file-icon", "aria-hidden": "true", style: { flexShrink: 0, fontSize: "1.25rem" }, children: file.mimeType?.startsWith("image/") ? "🖼" : "📄" }), _jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }, children: [_jsx("span", { className: "cc-evidence-bundle-viewer__file-name", style: { fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: file.name }), _jsxs("span", { className: "cc-evidence-bundle-viewer__file-meta", style: { fontSize: "var(--text-xs, 0.75rem)", color: "var(--text-3)", display: "flex", gap: "var(--space-2, 0.375rem)" }, children: [_jsx("span", { children: file.type }), file.size !== undefined && _jsx("span", { children: formatSize(file.size) }), file.uploadedAt && _jsx("span", { children: formatDate(file.uploadedAt) })] })] }), statusMeta && (_jsx("span", { className: `cc-evidence-bundle-viewer__status cc-evidence-bundle-viewer__status--${file.status}`, style: {
                                fontSize: "var(--text-xs, 0.75rem)",
                                fontWeight: 600,
                                color: statusMeta.color,
                                flexShrink: 0,
                            }, children: statusMeta.label })), _jsxs("div", { style: { display: "flex", gap: "var(--space-1, 0.25rem)", flexShrink: 0 }, children: [onPreview && (_jsx("button", { type: "button", className: "cc-evidence-bundle-viewer__preview", onClick: () => onPreview(file), "aria-label": `Preview ${file.name}`, style: {
                                        background: "none",
                                        border: "1px solid var(--border-1)",
                                        borderRadius: "var(--radius-1, 4px)",
                                        padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
                                        cursor: "pointer",
                                        fontSize: "var(--text-xs, 0.75rem)",
                                    }, children: "Preview" })), onDownload && (_jsx("button", { type: "button", className: "cc-evidence-bundle-viewer__download", onClick: () => onDownload(file), "aria-label": `Download ${file.name}`, style: {
                                        background: "none",
                                        border: "1px solid var(--border-1)",
                                        borderRadius: "var(--radius-1, 4px)",
                                        padding: "var(--space-1, 0.25rem) var(--space-2, 0.375rem)",
                                        cursor: "pointer",
                                        fontSize: "var(--text-xs, 0.75rem)",
                                    }, children: "Download" }))] })] }, file.id));
            }) }) }));
}
//# sourceMappingURL=EvidenceBundleViewer.js.map