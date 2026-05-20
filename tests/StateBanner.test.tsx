import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StateBanner } from "../react/StateBanner";

describe("StateBanner", () => {
  it("renders default title for offline kind", () => {
    render(<StateBanner kind="offline" />);
    expect(screen.getByText("You're offline")).toBeTruthy();
  });

  it("uses role=alert for warning tones", () => {
    render(<StateBanner kind="offline" />);
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("uses role=status for info tones", () => {
    render(<StateBanner kind="stale-data" />);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("uses role=status for neutral tones", () => {
    render(<StateBanner kind="permissioned-out" />);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("renders custom title and description", () => {
    render(
      <StateBanner
        kind="degraded"
        title="Custom title"
        description="more info"
      />,
    );
    expect(screen.getByText("Custom title")).toBeTruthy();
    expect(screen.getByText("more info")).toBeTruthy();
  });

  it("renders asOf as <time>", () => {
    const iso = "2024-01-01T00:00:00.000Z";
    render(<StateBanner kind="stale-data" asOf={iso} />);
    const t = screen.getByText(iso);
    expect(t.tagName).toBe("TIME");
    expect(t.getAttribute("dateTime")).toBe(iso);
  });

  it("fires action.onClick", () => {
    const onClick = vi.fn();
    render(
      <StateBanner
        kind="partial"
        action={{ label: "Reload", onClick }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Reload" }));
    expect(onClick).toHaveBeenCalled();
  });
});
