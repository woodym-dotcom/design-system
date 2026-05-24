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

// ── Public types ──────────────────────────────────────────────────────────────

export interface ThreadMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string | Date;
  direction: "inbound" | "outbound";
  status?: "sent" | "delivered" | "read" | "failed";
}

export interface ThreadViewProps {
  /** Messages in chronological order. */
  messages: ThreadMessage[];
  /** Called when the user submits a message from the input area. */
  onSend?: (content: string) => void;
  /** When true, renders a typing indicator at the bottom of the message list. */
  isLoading?: boolean;
  /** Rendered when messages is empty. */
  emptyState?: React.ReactNode;
  /** Slot rendered above the message list (e.g. conversation subject, participant info). */
  headerSlot?: React.ReactNode;
  /** Placeholder text for the compose input. */
  inputPlaceholder?: string;
  /** Max height of the message list area — enables scrolling. */
  maxHeight?: string | number;
}

// ── Internal helpers ─────────────────────────────────────────────────────────

function toIso(ts: Date | string): string {
  if (ts instanceof Date) return ts.toISOString();
  return ts;
}

function formatTime(ts: Date | string): string {
  try {
    const d = new Date(toIso(ts));
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(ts);
  }
}

const STATUS_ICON: Record<NonNullable<ThreadMessage["status"]>, string> = {
  sent: "✓",
  delivered: "✓✓",
  read: "✓✓",
  failed: "!",
};

// ── MessageBubble ────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: ThreadMessage;
}

function MessageBubble({ message }: MessageBubbleProps): React.ReactElement {
  const isOutbound = message.direction === "outbound";
  const iso = toIso(message.timestamp);

  return (
    <li
      data-testid="thread-message"
      data-direction={message.direction}
      className={`cc-thread-view__message cc-thread-view__message--${message.direction}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isOutbound ? "flex-end" : "flex-start",
        padding: "0.15rem 0",
      }}
    >
      {/* Sender label */}
      <span
        className="cc-thread-view__sender"
        style={{
          fontSize: "0.68rem",
          fontWeight: 600,
          color: "var(--text-2)",
          marginBottom: "0.1rem",
          paddingInline: "0.25rem",
        }}
      >
        {message.sender}
      </span>

      {/* Bubble */}
      <div
        className="cc-thread-view__bubble"
        style={{
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
        }}
      >
        {message.content}
      </div>

      {/* Meta row: timestamp + status */}
      <span
        className="cc-thread-view__meta"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          fontSize: "0.62rem",
          color: "var(--text-2)",
          marginTop: "0.1rem",
          paddingInline: "0.25rem",
        }}
      >
        <time dateTime={iso}>{formatTime(message.timestamp)}</time>
        {isOutbound && message.status && (
          <span
            className="cc-thread-view__status"
            data-status={message.status}
            aria-label={`Message ${message.status}`}
            style={{
              color:
                message.status === "failed"
                  ? "var(--status-critical, #dc2626)"
                  : message.status === "read"
                    ? "var(--accent-1, #2563eb)"
                    : "var(--text-2)",
            }}
          >
            {STATUS_ICON[message.status]}
          </span>
        )}
      </span>
    </li>
  );
}

// ── TypingIndicator ──────────────────────────────────────────────────────────

function TypingIndicator(): React.ReactElement {
  return (
    <div
      data-testid="thread-typing-indicator"
      className="cc-thread-view__typing"
      aria-label="Someone is typing"
      style={{
        display: "flex",
        gap: "0.2rem",
        padding: "0.4rem 0.6rem",
        alignItems: "center",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "0.35rem",
            height: "0.35rem",
            borderRadius: "50%",
            background: "var(--text-2, #888)",
            opacity: 0.6,
            animation: `cc-thread-dot-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── ComposeInput ─────────────────────────────────────────────────────────────

interface ComposeInputProps {
  onSend: (content: string) => void;
  placeholder: string;
}

function ComposeInput({ onSend, placeholder }: ComposeInputProps): React.ReactElement {
  const [draft, setDraft] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form
      className="cc-thread-view__compose"
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "0.35rem",
        padding: "0.5rem",
        borderTop: "1px solid var(--border-1)",
        background: "var(--surface-1, #fff)",
      }}
    >
      <textarea
        className="cc-thread-view__input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        aria-label={placeholder}
        style={{
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
        }}
      />
      <button
        type="submit"
        className="cc-btn cc-btn--primary cc-btn--sm"
        disabled={draft.trim().length === 0}
        aria-label="Send message"
        style={{
          alignSelf: "flex-end",
        }}
      >
        Send
      </button>
    </form>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

/**
 * ThreadView — a messaging pane for outreach and chat surfaces.
 *
 * Messages are rendered chronologically with inbound messages left-aligned
 * and outbound messages right-aligned. The component auto-scrolls to the
 * bottom when new messages arrive.
 */
export function ThreadView({
  messages,
  onSend,
  isLoading = false,
  emptyState,
  headerSlot,
  inputPlaceholder = "Type a message…",
  maxHeight,
}: ThreadViewProps): React.ReactElement {
  const listRef = React.useRef<HTMLUListElement | null>(null);

  // Auto-scroll to bottom on new messages or when typing indicator appears
  React.useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, isLoading]);

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div
      className="cc-thread-view"
      data-testid="thread-view"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--surface-1, #fff)",
        borderRadius: "0.4rem",
        border: "1px solid var(--border-1)",
        overflow: "hidden",
      }}
    >
      {/* Header slot */}
      {headerSlot && (
        <div
          className="cc-thread-view__header"
          style={{
            padding: "0.5rem 0.6rem",
            borderBottom: "1px solid var(--border-1)",
            fontSize: "0.82rem",
            fontWeight: 600,
          }}
        >
          {headerSlot}
        </div>
      )}

      {/* Message list */}
      {isEmpty ? (
        <div
          className="cc-thread-view__empty"
          data-testid="thread-empty-state"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            color: "var(--text-2)",
            fontSize: "0.88rem",
          }}
        >
          {emptyState ?? (
            <p style={{ margin: 0 }}>No messages yet.</p>
          )}
        </div>
      ) : (
        <ul
          ref={listRef}
          className="cc-thread-view__messages"
          aria-label="Messages"
          style={{
            flex: 1,
            listStyle: "none",
            margin: 0,
            padding: "0.5rem 0.6rem",
            overflowY: "auto",
            ...(maxHeight != null
              ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }
              : {}),
          }}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
        </ul>
      )}

      {/* Compose area */}
      {onSend && (
        <ComposeInput onSend={onSend} placeholder={inputPlaceholder} />
      )}
    </div>
  );
}
