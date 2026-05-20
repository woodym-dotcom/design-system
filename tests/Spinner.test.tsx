import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Spinner } from "../react/Spinner";

describe("Spinner", () => {
  it("renders with role=status and default label", () => {
    render(<Spinner />);
    const el = screen.getByRole("status");
    expect(el.getAttribute("aria-label")).toBe("Loading");
    expect(el.className).toContain("cc-spinner");
    expect(el.className).toContain("cc-spinner--md");
  });

  it("applies size class", () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole("status").className).toContain("cc-spinner--lg");
  });

  it("uses custom label", () => {
    render(<Spinner label="Fetching" />);
    expect(screen.getByRole("status").getAttribute("aria-label")).toBe(
      "Fetching",
    );
  });
});
