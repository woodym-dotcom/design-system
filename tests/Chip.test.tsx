import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Chip, Badge } from "../react/Chip";

describe("Chip", () => {
  it("renders a non-interactive span by default", () => {
    render(<Chip>active</Chip>);
    const el = screen.getByText("active").closest(".cc-chip");
    expect(el?.tagName).toBe("SPAN");
    expect(el?.className).toContain("cc-chip--neutral");
  });

  it("applies tone class", () => {
    render(<Chip tone="success">ok</Chip>);
    expect(
      screen.getByText("ok").closest(".cc-chip")?.className,
    ).toContain("cc-chip--success");
  });

  it("renders as <button> when onClick is provided", () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>click</Chip>);
    const btn = screen.getByRole("button", { name: /click/i });
    expect(btn.tagName).toBe("BUTTON");
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });

  it("renders a remove × button when onRemove is provided", () => {
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>filter</Chip>);
    const removeBtn = screen.getByRole("button", { name: "Remove" });
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalled();
  });

  it("Badge alias is the same component", () => {
    expect(Badge).toBe(Chip);
    render(<Badge tone="info">b</Badge>);
    expect(screen.getByText("b")).toBeTruthy();
  });
});
