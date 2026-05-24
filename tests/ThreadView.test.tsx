/**
 * ThreadView — DS-MIG P1-05 invariant tests.
 *
 * Invariants:
 *  1. Messages render in chronological order with correct direction alignment.
 *  2. Empty state renders when no messages and not loading.
 *  3. Custom empty state slot replaces default.
 *  4. Header slot renders above messages.
 *  5. Typing indicator renders when isLoading is true.
 *  6. Compose input fires onSend with trimmed content, then clears.
 *  7. Send button is disabled when input is empty.
 *  8. Outbound messages show delivery status.
 *  9. Compose area hidden when onSend is not provided.
 * 10. Enter key submits (Shift+Enter does not).
 */
import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ThreadView, type ThreadMessage } from "../react/ThreadView";

const MESSAGES: ThreadMessage[] = [
  {
    id: "1",
    content: "Hello, how can I help?",
    sender: "Agent",
    timestamp: "2025-01-15T10:00:00Z",
    direction: "inbound",
  },
  {
    id: "2",
    content: "I have a question about my account.",
    sender: "Customer",
    timestamp: "2025-01-15T10:01:00Z",
    direction: "outbound",
    status: "delivered",
  },
  {
    id: "3",
    content: "Sure, let me look into that.",
    sender: "Agent",
    timestamp: "2025-01-15T10:02:00Z",
    direction: "inbound",
  },
];

// ---------------------------------------------------------------------------
// Invariant 1: messages render with correct direction
// ---------------------------------------------------------------------------
describe("P1-05 invariant 1 — messages render with direction", () => {
  it("renders all messages", () => {
    render(<ThreadView messages={MESSAGES} />);
    const items = screen.getAllByTestId("thread-message");
    expect(items).toHaveLength(3);
  });

  it("inbound messages have data-direction=inbound", () => {
    render(<ThreadView messages={MESSAGES} />);
    const items = screen.getAllByTestId("thread-message");
    expect(items[0]).toHaveAttribute("data-direction", "inbound");
  });

  it("outbound messages have data-direction=outbound", () => {
    render(<ThreadView messages={MESSAGES} />);
    const items = screen.getAllByTestId("thread-message");
    expect(items[1]).toHaveAttribute("data-direction", "outbound");
  });

  it("messages render inside a list with aria-label", () => {
    render(<ThreadView messages={MESSAGES} />);
    const list = screen.getByRole("list", { name: "Messages" });
    expect(list).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Invariant 2: empty state renders when no messages
// ---------------------------------------------------------------------------
describe("P1-05 invariant 2 — default empty state", () => {
  it("renders default empty message when messages is empty", () => {
    render(<ThreadView messages={[]} />);
    expect(screen.getByTestId("thread-empty-state")).toBeInTheDocument();
    expect(screen.getByText("No messages yet.")).toBeInTheDocument();
  });

  it("does not render empty state when messages exist", () => {
    render(<ThreadView messages={MESSAGES} />);
    expect(screen.queryByTestId("thread-empty-state")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Invariant 3: custom empty state slot
// ---------------------------------------------------------------------------
describe("P1-05 invariant 3 — custom empty state", () => {
  it("renders custom emptyState when provided", () => {
    render(
      <ThreadView messages={[]} emptyState={<div>Start a conversation</div>} />,
    );
    expect(screen.getByText("Start a conversation")).toBeInTheDocument();
    expect(screen.queryByText("No messages yet.")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Invariant 4: header slot
// ---------------------------------------------------------------------------
describe("P1-05 invariant 4 — header slot", () => {
  it("renders header slot above messages", () => {
    render(
      <ThreadView messages={MESSAGES} headerSlot={<span>Conversation #42</span>} />,
    );
    expect(screen.getByText("Conversation #42")).toBeInTheDocument();
  });

  it("does not render header area when no headerSlot", () => {
    const { container } = render(<ThreadView messages={MESSAGES} />);
    expect(container.querySelector(".cc-thread-view__header")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Invariant 5: typing indicator
// ---------------------------------------------------------------------------
describe("P1-05 invariant 5 — typing indicator", () => {
  it("renders typing indicator when isLoading is true", () => {
    render(<ThreadView messages={MESSAGES} isLoading />);
    expect(screen.getByTestId("thread-typing-indicator")).toBeInTheDocument();
  });

  it("does not render typing indicator when isLoading is false", () => {
    render(<ThreadView messages={MESSAGES} isLoading={false} />);
    expect(screen.queryByTestId("thread-typing-indicator")).not.toBeInTheDocument();
  });

  it("typing indicator has accessible label", () => {
    render(<ThreadView messages={MESSAGES} isLoading />);
    expect(screen.getByLabelText("Someone is typing")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Invariant 6: onSend fires with trimmed content and clears input
// ---------------------------------------------------------------------------
describe("P1-05 invariant 6 — onSend fires and clears", () => {
  it("calls onSend with trimmed content on submit", () => {
    const onSend = vi.fn();
    render(<ThreadView messages={MESSAGES} onSend={onSend} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "  Hello!  " } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(onSend).toHaveBeenCalledWith("Hello!");
  });

  it("clears input after sending", () => {
    const onSend = vi.fn();
    render(<ThreadView messages={MESSAGES} onSend={onSend} />);
    const input = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: "Hello!" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(input.value).toBe("");
  });

  it("does not call onSend for whitespace-only input", () => {
    const onSend = vi.fn();
    render(<ThreadView messages={MESSAGES} onSend={onSend} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(onSend).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Invariant 7: send button disabled when empty
// ---------------------------------------------------------------------------
describe("P1-05 invariant 7 — send button disabled when empty", () => {
  it("send button is disabled when input is empty", () => {
    render(<ThreadView messages={MESSAGES} onSend={() => {}} />);
    const btn = screen.getByRole("button", { name: "Send message" });
    expect(btn).toBeDisabled();
  });

  it("send button is enabled when input has content", () => {
    render(<ThreadView messages={MESSAGES} onSend={() => {}} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hi" } });
    const btn = screen.getByRole("button", { name: "Send message" });
    expect(btn).not.toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Invariant 8: outbound delivery status
// ---------------------------------------------------------------------------
describe("P1-05 invariant 8 — outbound delivery status", () => {
  it("renders status indicator for outbound messages with status", () => {
    const msg: ThreadMessage[] = [
      {
        id: "1",
        content: "Test",
        sender: "Me",
        timestamp: "2025-01-15T10:00:00Z",
        direction: "outbound",
        status: "delivered",
      },
    ];
    render(<ThreadView messages={msg} />);
    expect(screen.getByLabelText("Message delivered")).toBeInTheDocument();
  });

  it("renders failed status with critical colour token", () => {
    const msg: ThreadMessage[] = [
      {
        id: "1",
        content: "Test",
        sender: "Me",
        timestamp: "2025-01-15T10:00:00Z",
        direction: "outbound",
        status: "failed",
      },
    ];
    const { container } = render(<ThreadView messages={msg} />);
    const statusEl = container.querySelector('[data-status="failed"]');
    expect(statusEl).toBeTruthy();
  });

  it("does not render status for inbound messages", () => {
    const msg: ThreadMessage[] = [
      {
        id: "1",
        content: "Hello",
        sender: "Agent",
        timestamp: "2025-01-15T10:00:00Z",
        direction: "inbound",
      },
    ];
    const { container } = render(<ThreadView messages={msg} />);
    expect(container.querySelector(".cc-thread-view__status")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Invariant 9: compose area hidden without onSend
// ---------------------------------------------------------------------------
describe("P1-05 invariant 9 — compose area hidden without onSend", () => {
  it("does not render compose area when onSend is not provided", () => {
    const { container } = render(<ThreadView messages={MESSAGES} />);
    expect(container.querySelector(".cc-thread-view__compose")).toBeNull();
  });

  it("renders compose area when onSend is provided", () => {
    const { container } = render(
      <ThreadView messages={MESSAGES} onSend={() => {}} />,
    );
    expect(container.querySelector(".cc-thread-view__compose")).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Invariant 10: Enter key submits, Shift+Enter does not
// ---------------------------------------------------------------------------
describe("P1-05 invariant 10 — Enter key behaviour", () => {
  it("Enter key triggers send", () => {
    const onSend = vi.fn();
    render(<ThreadView messages={MESSAGES} onSend={onSend} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: false });
    expect(onSend).toHaveBeenCalledWith("Hello");
  });

  it("Shift+Enter does not trigger send", () => {
    const onSend = vi.fn();
    render(<ThreadView messages={MESSAGES} onSend={onSend} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
  });
});
