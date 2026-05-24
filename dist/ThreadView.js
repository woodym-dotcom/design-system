import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ThreadView — messaging pane for outreach/chat surfaces.
 *
 * DS-MIG P1-05.
 *
 * Features:
 *  - chronological message list with inbound (left) / outbound (right) alignment
 *  - auto-scroll to bottom on new messages
 *  - composable input area with send button
 *  - typing indicator (isLoading)
 *  - custom empty state + header slots
 *  - message delivery status indicator
 */
import * as React from "react";
// ── Internal helpers ─────────────────────────────────────────────────────────
function toIso(ts) {
    if (ts instanceof Date)
        return ts.toISOString();
    return ts;
}
function formatTime(ts) {
    try {
        const d = new Date(toIso(ts));
        return d.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    catch {
        return String(ts);
    }
}
const STATUS_ICON = {
    sent: "✓",
    delivered: "✓✓",
    read: "✓✓",
    failed: "!",
};
function MessageBubble({ message }) {
    const isOutbound = message.direction === "outbound";
    const iso = toIso(message.timestamp);
    return (_jsxs("li", { "data-testid": "thread-message", "data-direction": message.direction, className: `cc-thread-view__message cc-thread-view__message--${message.direction}`, style: {
            display: "flex",
            flexDirection: "column",
            alignItems: isOutbound ? "flex-end" : "flex-start",
            padding: "0.15rem 0",
        }, children: [_jsx("span", { className: "cc-thread-view__sender", style: {
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: "var(--text-2)",
                    marginBottom: "0.1rem",
                    paddingInline: "0.25rem",
                }, children: message.sender }), _jsx("div", { className: "cc-thread-view__bubble", style: {
                    maxWidth: "75%",
                    padding: "0.4rem 0.6rem",
                    borderRadius: isOutbound
                        ? "0.6rem 0.6rem 0.15rem 0.6rem"
                        : "0.6rem 0.6rem 0.6rem 0.15rem",
                    background: isOutbound
                        ? "var(--accent-1, #2563eb)"
                        : "var(--surface-2, #f0f0f0)",
                    color: isOutbound
                        ? "var(--accent-1-text, #fff)"
                        : "var(--text-1)",
                    fontSize: "0.82rem",
                    lineHeight: 1.45,
                    wordBreak: "break-word",
                }, children: message.content }), _jsxs("span", { className: "cc-thread-view__meta", style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.62rem",
                    color: "var(--text-2)",
                    marginTop: "0.1rem",
                    paddingInline: "0.25rem",
                }, children: [_jsx("time", { dateTime: iso, children: formatTime(message.timestamp) }), isOutbound && message.status && (_jsx("span", { className: "cc-thread-view__status", "data-status": message.status, "aria-label": `Message ${message.status}`, style: {
                            color: message.status === "failed"
                                ? "var(--status-critical, #dc2626)"
                                : message.status === "read"
                                    ? "var(--accent-1, #2563eb)"
                                    : "var(--text-2)",
                        }, children: STATUS_ICON[message.status] }))] })] }));
}
// ── TypingIndicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
    return (_jsx("div", { "data-testid": "thread-typing-indicator", className: "cc-thread-view__typing", "aria-label": "Someone is typing", style: {
            display: "flex",
            gap: "0.2rem",
            padding: "0.4rem 0.6rem",
            alignItems: "center",
        }, children: [0, 1, 2].map((i) => (_jsx("span", { "aria-hidden": "true", style: {
                display: "inline-block",
                width: "0.35rem",
                height: "0.35rem",
                borderRadius: "50%",
                background: "var(--text-2, #888)",
                opacity: 0.6,
                animation: `cc-thread-dot-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            } }, i))) }));
}
function ComposeInput({ onSend, placeholder }) {
    const [draft, setDraft] = React.useState("");
    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = draft.trim();
        if (!trimmed)
            return;
        onSend(trimmed);
        setDraft("");
    }
    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }
    return (_jsxs("form", { className: "cc-thread-view__compose", onSubmit: handleSubmit, style: {
            display: "flex",
            gap: "0.35rem",
            padding: "0.5rem",
            borderTop: "1px solid var(--border-1)",
            background: "var(--surface-1, #fff)",
        }, children: [_jsx("textarea", { className: "cc-thread-view__input", value: draft, onChange: (e) => setDraft(e.target.value), onKeyDown: handleKeyDown, placeholder: placeholder, rows: 1, "aria-label": placeholder, style: {
                    flex: 1,
                    resize: "none",
                    border: "1px solid var(--border-1)",
                    borderRadius: "0.4rem",
                    padding: "0.35rem 0.5rem",
                    fontSize: "0.82rem",
                    fontFamily: "inherit",
                    lineHeight: 1.4,
                    background: "var(--surface-0, #fff)",
                    color: "var(--text-1)",
                    outline: "none",
                } }), _jsx("button", { type: "submit", className: "cc-btn cc-btn--primary cc-btn--sm", disabled: draft.trim().length === 0, "aria-label": "Send message", style: {
                    alignSelf: "flex-end",
                }, children: "Send" })] }));
}
// ── Main component ───────────────────────────────────────────────────────────
/**
 * ThreadView — a messaging pane for outreach and chat surfaces.
 *
 * Messages are rendered chronologically with inbound messages left-aligned
 * and outbound messages right-aligned. The component auto-scrolls to the
 * bottom when new messages arrive.
 */
export function ThreadView({ messages, onSend, isLoading = false, emptyState, headerSlot, inputPlaceholder = "Type a message…", maxHeight, }) {
    const listRef = React.useRef(null);
    // Auto-scroll to bottom on new messages or when typing indicator appears
    React.useEffect(() => {
        const el = listRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages.length, isLoading]);
    const isEmpty = messages.length === 0 && !isLoading;
    return (_jsxs("div", { className: "cc-thread-view", "data-testid": "thread-view", style: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: "var(--surface-1, #fff)",
            borderRadius: "0.4rem",
            border: "1px solid var(--border-1)",
            overflow: "hidden",
        }, children: [headerSlot && (_jsx("div", { className: "cc-thread-view__header", style: {
                    padding: "0.5rem 0.6rem",
                    borderBottom: "1px solid var(--border-1)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                }, children: headerSlot })), isEmpty ? (_jsx("div", { className: "cc-thread-view__empty", "data-testid": "thread-empty-state", style: {
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                    color: "var(--text-2)",
                    fontSize: "0.88rem",
                }, children: emptyState ?? (_jsx("p", { style: { margin: 0 }, children: "No messages yet." })) })) : (_jsxs("ul", { ref: listRef, className: "cc-thread-view__messages", "aria-label": "Messages", style: {
                    flex: 1,
                    listStyle: "none",
                    margin: 0,
                    padding: "0.5rem 0.6rem",
                    overflowY: "auto",
                    ...(maxHeight != null
                        ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }
                        : {}),
                }, children: [messages.map((msg) => (_jsx(MessageBubble, { message: msg }, msg.id))), isLoading && _jsx(TypingIndicator, {})] })), onSend && (_jsx(ComposeInput, { onSend: onSend, placeholder: inputPlaceholder }))] }));
}
//# sourceMappingURL=ThreadView.js.map