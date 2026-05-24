import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: classes, role: "region", "aria-label": title, style: {
            display: "flex",
            flexDirection: "column",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius-2, 8px)",
            background: "var(--surface-1)",
        }, children: [_jsxs("header", { className: "cc-evidence-bundle-viewer__header", style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "var(--space-3, 0.5rem) var(--space-4, 0.75rem)",
                    borderBottom: "1px solid var(--border-1)",
                }, children: [_jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "var(--space-2, 0.375rem)" }, children: [_jsx("h3", { className: "cc-evidence-bundle-viewer__title", style: { margin: 0, fontSize: "var(--text-base, 1rem)", fontWeight: 600 }, children: title }), bundleId && (_jsx("span", { className: "cc-evidence-bundle-viewer__bundle-id", style: { fontSize: "var(--text-xs, 0.75rem)", color: "var(--text-3)" }, children: bundleId })), _jsxs("span", { className: "cc-evidence-bundle-viewer__count", style: { fontSize: "var(--text-xs, 0.75rem)", color: "var(--text-3)" }, children: [files.length, " file", files.length !== 1 ? "s" : ""] })] }), onDownloadAll && (_jsx("button", { type: "button", className: "cc-evidence-bundle-viewer__download-all", onClick: onDownloadAll, style: {
                            padding: "var(--space-1, 0.25rem) var(--space-3, 0.5rem)",
                            borderRadius: "var(--radius-1, 4px)",
                            border: "1px solid var(--border-1)",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "var(--text-sm, 0.875rem)",
                            fontWeight: 500,
                        }, children: "Download all" }))] }), _jsx("ul", { className: "cc-evidence-bundle-viewer__list", style: {
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
                }) })] }));
}
//# sourceMappingURL=EvidenceBundleViewer.js.map