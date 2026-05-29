import * as React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ActivityTimeline, type ActivityEntry } from "../react/ActivityTimeline";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const entries: ActivityEntry[] = [
  {
    id: "1",
    actor: { name: "Alice" },
    action: "created",
    target: "Project Alpha",
    timestamp: "2024-03-01T10:00:00.000Z",
  },
  {
    id: "2",
    actor: { name: "Bob" },
    action: "updated",
    target: "Project Alpha",
    timestamp: "2024-03-01T11:30:00.000Z",
    diff: { before: { status: "draft" }, after: { status: "active" } },
  },
  {
    id: "3",
    actor: { name: "Alice" },
    action: "archived",
    target: "Project Beta",
    timestamp: "2024-03-02T09:00:00.000Z",
  },
];

// ── ActivityTimeline — basic rendering ────────────────────────────────────────

describe("ActivityTimeline — flat (default)", () => {
  it("renders entries", () => {
    render(<ActivityTimeline entries={entries} />);
    expect(screen.getAllByTestId("activity-entry")).toHaveLength(3);
  });

  it("renders each actor name", () => {
    render(<ActivityTimeline entries={entries} />);
    expect(screen.getAllByText("Alice")).toHaveLength(2);
    expect(screen.getByText("Bob")).toBeTruthy();
  });

  it("renders timestamps as <time dateTime>", () => {
    const { container } = render(<ActivityTimeline entries={entries} />);
    const times = container.querySelectorAll("time");
    expect(times).toHaveLength(3);
    expect(times[0].getAttribute("dateTime")).toBe("2024-03-01T10:00:00.000Z");
  });

  it("default empty state when no entries", () => {
    render(<ActivityTimeline entries={[]} />);
    expect(screen.getByText("No activity yet.")).toBeTruthy();
  });

  it("renders custom emptyState", () => {
    render(
      <ActivityTimeline
        entries={[]}
        emptyState={<span data-testid="custom-empty">Custom empty</span>}
      />,
    );
    expect(screen.getByTestId("custom-empty")).toBeTruthy();
  });
});

// ── Variant: timeline ─────────────────────────────────────────────────────────

describe("ActivityTimeline — timeline variant", () => {
  it("renders timeline class", () => {
    const { container } = render(
      <ActivityTimeline entries={entries} variant="timeline" />,
    );
    expect(container.querySelector(".at--timeline")).toBeTruthy();
  });

  it("renders a dot per entry", () => {
    const { container } = render(
      <ActivityTimeline entries={entries} variant="timeline" />,
    );
    expect(container.querySelectorAll(".at-dot")).toHaveLength(3);
  });
});

// ── groupByDay ────────────────────────────────────────────────────────────────

describe("ActivityTimeline — groupByDay", () => {
  it("renders two day headers for two distinct ISO days", () => {
    const { container } = render(
      <ActivityTimeline entries={entries} groupByDay />,
    );
    const headers = container.querySelectorAll(".at-day-header");
    expect(headers).toHaveLength(2);
    expect(headers[0].textContent).toBe("2024-03-01");
    expect(headers[1].textContent).toBe("2024-03-02");
  });

  it("places correct entries under each day", () => {
    const { container } = render(
      <ActivityTimeline entries={entries} groupByDay />,
    );
    const groups = container.querySelectorAll(".at-day-group");
    const firstGroupRows = groups[0]!.querySelectorAll("[data-testid='activity-entry']");
    expect(firstGroupRows).toHaveLength(2);
    const secondGroupRows = groups[1]!.querySelectorAll("[data-testid='activity-entry']");
    expect(secondGroupRows).toHaveLength(1);
  });
});

// ── density ───────────────────────────────────────────────────────────────────

describe("ActivityTimeline — density", () => {
  it("sets data-density on root element", () => {
    const { container } = render(
      <ActivityTimeline entries={entries} density="compact" />,
    );
    expect(
      container.querySelector("[data-density='compact']"),
    ).toBeTruthy();
  });

  it("spacious density sets data-density", () => {
    const { container } = render(
      <ActivityTimeline entries={entries} density="spacious" />,
    );
    expect(
      container.querySelector("[data-density='spacious']"),
    ).toBeTruthy();
  });
});

// ── renderEntry override ──────────────────────────────────────────────────────

describe("ActivityTimeline — renderEntry", () => {
  it("uses the custom renderer for each entry", () => {
    render(
      <ActivityTimeline
        entries={entries}
        renderEntry={(e) => (
          <span data-testid={`custom-${e.id}`}>{e.actor.name} — {e.action}</span>
        )}
      />,
    );
    expect(screen.getByTestId("custom-1")).toBeTruthy();
    expect(screen.getByTestId("custom-2")).toBeTruthy();
    expect(screen.getByTestId("custom-3")).toBeTruthy();
  });
});

// ── expandable diff ───────────────────────────────────────────────────────────

describe("ActivityTimeline — expandable", () => {
  it("shows 'Show diff' button only for entries with diff", () => {
    render(<ActivityTimeline entries={entries} expandable />);
    // Only entry 2 has a diff
    const buttons = screen.getAllByText("Show diff");
    expect(buttons).toHaveLength(1);
  });

  it("expands diff on click and shows 'Hide diff'", () => {
    render(<ActivityTimeline entries={entries} expandable />);
    const showBtn = screen.getByText("Show diff");
    fireEvent.click(showBtn);
    expect(screen.getByText("Hide diff")).toBeTruthy();
  });

  it("renders diff JSON when expanded", () => {
    render(<ActivityTimeline entries={entries} expandable />);
    fireEvent.click(screen.getByText("Show diff"));
    // pre element contains the diff JSON
    expect(screen.getByText(/draft/)).toBeTruthy();
    expect(screen.getByText(/active/)).toBeTruthy();
  });

  it("aria-expanded reflects open/close state", () => {
    render(<ActivityTimeline entries={entries} expandable />);
    const btn = screen.getByText("Show diff").closest("button")!;
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
  });

  it("collapses diff on second click", () => {
    render(<ActivityTimeline entries={entries} expandable />);
    const btn = screen.getByText("Show diff").closest("button")!;
    fireEvent.click(btn);
    fireEvent.click(screen.getByText("Hide diff").closest("button")!);
    expect(screen.queryByText("Hide diff")).toBeNull();
    expect(screen.getByText("Show diff")).toBeTruthy();
  });
});

// ── loading ───────────────────────────────────────────────────────────────────

describe("ActivityTimeline — loading", () => {
  it("renders loading skeleton when loading=true and no entries", () => {
    render(<ActivityTimeline entries={[]} loading />);
    expect(screen.getByTestId("at-loading")).toBeTruthy();
  });

  it("renders 'Loading more' indicator when loading=true and entries exist", () => {
    render(<ActivityTimeline entries={entries} loading />);
    expect(screen.getByTestId("at-loading-more")).toBeTruthy();
  });

  it("does not render skeleton when entries are present and loading=false", () => {
    render(<ActivityTimeline entries={entries} loading={false} />);
    expect(screen.queryByTestId("at-loading")).toBeNull();
  });
});

// ── IntersectionObserver / loadMore ──────────────────────────────────────────

describe("ActivityTimeline — loadMore (IntersectionObserver)", () => {
  let observerCallback: IntersectionObserverCallback | null = null;
  let observeEl: Element | null = null;
  let disconnectFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    disconnectFn = vi.fn();
    // Must use a class (constructor function) because the code calls `new IntersectionObserver(…)`
    class MockIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe(el: Element) {
        observeEl = el;
      }
      disconnect() {
        disconnectFn();
      }
    }
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    observerCallback = null;
    observeEl = null;
  });

  it("renders sentinel element when hasMore + loadMore provided", () => {
    const loadMore = vi.fn().mockResolvedValue(undefined);
    render(
      <ActivityTimeline entries={entries} hasMore loadMore={loadMore} />,
    );
    expect(screen.getByTestId("at-load-more-sentinel")).toBeTruthy();
  });

  it("calls loadMore when sentinel intersects", async () => {
    const loadMore = vi.fn().mockResolvedValue(undefined);
    render(
      <ActivityTimeline entries={entries} hasMore loadMore={loadMore} />,
    );
    expect(observeEl).toBeTruthy();
    // Simulate intersection
    await act(async () => {
      observerCallback!(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it("does not render sentinel when hasMore=false", () => {
    const loadMore = vi.fn().mockResolvedValue(undefined);
    render(
      <ActivityTimeline entries={entries} hasMore={false} loadMore={loadMore} />,
    );
    expect(screen.queryByTestId("at-load-more-sentinel")).toBeNull();
  });
});

// ── Keyboard navigation ───────────────────────────────────────────────────────

describe("ActivityTimeline — keyboard navigation", () => {
  it("diff toggle button is keyboard-focusable", () => {
    render(<ActivityTimeline entries={entries} expandable />);
    const btn = screen.getByText("Show diff").closest("button")!;
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it("Enter key activates diff toggle", () => {
    render(<ActivityTimeline entries={entries} expandable />);
    const btn = screen.getByText("Show diff").closest("button")!;
    fireEvent.keyDown(btn, { key: "Enter", code: "Enter" });
    fireEvent.click(btn);
    expect(screen.getByText("Hide diff")).toBeTruthy();
  });
});

