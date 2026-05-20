import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Diff, diffLines } from "../react/Diff";

describe("diffLines", () => {
  it("returns all context when strings match", () => {
    const out = diffLines("a\nb\nc", "a\nb\nc");
    expect(out.every((l) => l.type === "context")).toBe(true);
    expect(out).toHaveLength(3);
  });

  it("flags additions", () => {
    const out = diffLines("a\nc", "a\nb\nc");
    const added = out.filter((l) => l.type === "add");
    expect(added).toHaveLength(1);
    expect(added[0].text).toBe("b");
  });

  it("flags removals", () => {
    const out = diffLines("a\nb\nc", "a\nc");
    const removed = out.filter((l) => l.type === "remove");
    expect(removed).toHaveLength(1);
    expect(removed[0].text).toBe("b");
  });

  it("handles full replacement", () => {
    const out = diffLines("x", "y");
    expect(out.filter((l) => l.type === "remove")).toHaveLength(1);
    expect(out.filter((l) => l.type === "add")).toHaveLength(1);
  });
});

describe("Diff component", () => {
  it("renders +/- counts", () => {
    const lines = diffLines("a\nb", "a\nc\nd");
    render(<Diff lines={lines} mode="unified" />);
    expect(screen.getByText("+2")).toBeTruthy();
    expect(screen.getByText("-1")).toBeTruthy();
  });

  it('renders "No differences" when empty diff', () => {
    const lines = diffLines("a", "a");
    render(<Diff lines={lines} />);
    expect(screen.getByText("No differences")).toBeTruthy();
  });

  it("noEmpty=true returns null on empty diff", () => {
    const lines = diffLines("a", "a");
    const { container } = render(<Diff lines={lines} noEmpty />);
    expect(container.firstChild).toBeNull();
  });

  it("split mode renders two panes", () => {
    const lines = diffLines("a\nb", "a\nc");
    const { container } = render(<Diff lines={lines} mode="split" />);
    expect(container.querySelectorAll(".cc-diff__pane").length).toBe(2);
  });

  it("unified mode renders one pane", () => {
    const lines = diffLines("a\nb", "a\nc");
    const { container } = render(<Diff lines={lines} mode="unified" />);
    expect(container.querySelectorAll(".cc-diff__pane").length).toBe(1);
  });
});
