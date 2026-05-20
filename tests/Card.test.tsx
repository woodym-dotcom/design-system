import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "../react/Card";

describe("Card (legacy path)", () => {
  it("renders the original <div class=card-base> when no new props are set", () => {
    const { container } = render(
      <Card title="Stats" subtitle="last 7d">
        body
      </Card>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.tagName).toBe("DIV");
    expect(root.className).toContain("card-base");
    expect(root.className).toContain("rounded-2xl");
    expect(screen.getByText("Stats")).toBeTruthy();
    expect(screen.getByText("· last 7d")).toBeTruthy();
  });
});

describe("Card (extended path)", () => {
  it("renders <section class=cc-card> when actions are set", () => {
    const { container } = render(
      <Card
        title="Title"
        subtitle="sub"
        actions={<button>action</button>}
      >
        body
      </Card>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.tagName).toBe("SECTION");
    expect(root.className).toContain("cc-card");
    expect(container.querySelector(".cc-card__header")).toBeTruthy();
    expect(container.querySelector(".cc-card__copy")).toBeTruthy();
    expect(container.querySelector(".cc-card__actions")).toBeTruthy();
    expect(container.querySelector(".cc-card__body")).toBeTruthy();
  });

  it("renders footer slot when footer is set", () => {
    const { container } = render(
      <Card footer={<span>foot</span>}>body</Card>,
    );
    expect(container.querySelector(".cc-card__footer")).toBeTruthy();
    expect(screen.getByText("foot")).toBeTruthy();
  });

  it("applies cc-card--flush when padded={false}", () => {
    const { container } = render(
      <Card padded={false} title="x">
        body
      </Card>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("cc-card--flush");
  });

  it("does not render header when only body is supplied", () => {
    const { container } = render(<Card padded={false}>body only</Card>);
    expect(container.querySelector(".cc-card__header")).toBeNull();
  });
});
