import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FullScreenDetail } from "../react/FullScreenDetail";

describe("FullScreenDetail", () => {
  it("renders breadcrumbs, title, and body", () => {
    render(
      <FullScreenDetail
        breadcrumbs={[{ label: "Root", href: "/" }, { label: "Detail" }]}
        title="My Page"
      >
        body
      </FullScreenDetail>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "My Page",
    );
    expect(screen.getByText("body")).toBeTruthy();
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeTruthy();
  });

  it("renders tabs when supplied", () => {
    render(
      <FullScreenDetail
        breadcrumbs={[{ label: "x" }]}
        title="t"
        tabs={{
          value: "a",
          items: [
            { value: "a", label: "A" },
            { value: "b", label: "B" },
          ],
        }}
      >
        body
      </FullScreenDetail>,
    );
    expect(screen.getByRole("tablist")).toBeTruthy();
  });

  it("renders sticky bottom bar when provided", () => {
    const { container } = render(
      <FullScreenDetail
        breadcrumbs={[{ label: "x" }]}
        title="t"
        bottomBar={<span>FOOTER</span>}
      >
        body
      </FullScreenDetail>,
    );
    expect(container.querySelector(".cc-fsd__bottom-bar")).toBeTruthy();
    expect(screen.getByText("FOOTER")).toBeTruthy();
  });

  it("fires onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <FullScreenDetail
        breadcrumbs={[{ label: "x" }]}
        title="t"
        onClose={onClose}
      >
        body
      </FullScreenDetail>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });
});
