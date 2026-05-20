import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../react/Button";

describe("Button", () => {
  it("renders a <button> with type=button by default", () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.getAttribute("type")).toBe("button");
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="primary" size="sm">
        Go
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn.className).toContain("cc-btn");
    expect(btn.className).toContain("cc-btn--primary");
    expect(btn.className).toContain("cc-btn--sm");
  });

  it("applies icon class when icon=true", () => {
    render(<Button icon aria-label="settings">⚙</Button>);
    expect(screen.getByRole("button").className).toContain("cc-btn--icon");
  });

  it("renders as <a> when href is set", () => {
    render(<Button href="/x">Link</Button>);
    const link = screen.getByRole("link", { name: "Link" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/x");
  });

  it("disabled link sets aria-disabled and removes href", () => {
    render(
      <Button href="/x" disabled>
        Link
      </Button>,
    );
    const link = screen.getByText("Link");
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBeNull();
    expect(link.getAttribute("aria-disabled")).toBe("true");
  });

  it("fires onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>X</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });

  it("forwards ref to the underlying button", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref as React.Ref<HTMLButtonElement>}>R</Button>);
    expect(ref.current?.tagName).toBe("BUTTON");
  });
});
