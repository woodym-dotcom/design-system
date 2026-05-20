import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AwaitingState } from "../react/AwaitingState";

describe("AwaitingState", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("renders default copy for awaiting state", () => {
    render(<AwaitingState state="awaiting" />);
    expect(
      screen.getByText("Waiting for the upstream system to respond."),
    ).toBeTruthy();
  });

  it("uses role=status with aria-live=polite", () => {
    const { container } = render(<AwaitingState state="opening" />);
    const root = container.querySelector(".cc-awaiting")!;
    expect(root.getAttribute("role")).toBe("status");
    expect(root.getAttribute("aria-live")).toBe("polite");
  });

  it("shows idempotency key", () => {
    render(<AwaitingState state="retrying" idempotencyKey="abc-123" />);
    expect(screen.getByText("abc-123").tagName).toBe("CODE");
  });

  it("renders a live countdown that decreases each second", () => {
    const future = new Date(Date.now() + 3000);
    render(<AwaitingState state="rate_limited" retryAfter={future} />);
    expect(screen.getByText(/Retry in [23]s/)).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText(/Retry in [01]s/)).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("Retrying now")).toBeTruthy();
  });

  it("renders error tone chip for invalid", () => {
    render(<AwaitingState state="invalid" />);
    expect(
      screen.getByText("Invalid").closest(".cc-chip")?.className,
    ).toContain("cc-chip--error");
  });
});
