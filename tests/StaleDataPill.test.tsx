import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StaleDataPill } from "../react/StaleDataPill";

describe("StaleDataPill", () => {
  it("returns null when data is still fresh", () => {
    const { container } = render(
      <StaleDataPill dataUpdatedAt={new Date()} staleAfterMs={60_000} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders chip when data is stale", () => {
    const past = Date.now() - 10 * 60 * 1000;
    render(<StaleDataPill dataUpdatedAt={past} staleAfterMs={5 * 60 * 1000} />);
    expect(screen.getByText(/Last refreshed/i)).toBeTruthy();
  });

  it("renders refresh button when onRefresh provided", () => {
    const onRefresh = vi.fn();
    const past = Date.now() - 10 * 60 * 1000;
    render(
      <StaleDataPill
        dataUpdatedAt={past}
        staleAfterMs={5 * 60 * 1000}
        onRefresh={onRefresh}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /refresh/i }));
    expect(onRefresh).toHaveBeenCalled();
  });
});
