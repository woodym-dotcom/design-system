import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Sparkline } from "../react/charts/Sparkline";

describe("Sparkline", () => {
  it("returns null when there are no values", () => {
    const { container } = render(<Sparkline values={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a single dot when only one value is provided", () => {
    const { container } = render(<Sparkline values={[10]} ariaLabel="single" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute("aria-label")).toBe("single");
    expect(svg!.getAttribute("role")).toBe("img");
    expect(svg!.querySelector("circle")).toBeTruthy();
  });

  it("renders a line path with multiple values", () => {
    const { container } = render(
      <Sparkline values={[1, 4, 2, 8]} ariaLabel="trend" />,
    );
    const paths = container.querySelectorAll("path");
    // Area path + line path = 2 (showArea default true).
    expect(paths.length).toBe(2);
    expect(screen.getByRole("img", { name: "trend" })).toBeTruthy();
  });

  it("omits area path when showArea=false", () => {
    const { container } = render(
      <Sparkline values={[1, 2, 3]} showArea={false} />,
    );
    expect(container.querySelectorAll("path").length).toBe(1);
  });

  it("applies tone and size classes", () => {
    const { container } = render(
      <Sparkline values={[1, 2]} tone="success" size="lg" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("cc-sparkline--success");
    expect(root.className).toContain("cc-sparkline--lg");
  });
});
