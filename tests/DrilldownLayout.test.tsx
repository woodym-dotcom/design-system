import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DrilldownLayout } from "../react/DrilldownLayout";

describe("DrilldownLayout", () => {
  beforeEach(() => window.localStorage.clear());

  it("renders list and detail slots", () => {
    render(
      <DrilldownLayout
        listSlot={<div>LIST</div>}
        detailSlot={<div>DETAIL</div>}
      />,
    );
    expect(screen.getByText("LIST")).toBeTruthy();
    expect(screen.getByText("DETAIL")).toBeTruthy();
  });

  it("does not render Expand button without selectedId", () => {
    const onExpand = vi.fn();
    render(
      <DrilldownLayout
        listSlot={<div />}
        detailSlot={<div />}
        onExpandFullScreen={onExpand}
      />,
    );
    expect(screen.queryByRole("button", { name: "Expand" })).toBeNull();
  });

  it("does not render Expand without callback", () => {
    render(
      <DrilldownLayout
        listSlot={<div />}
        detailSlot={<div />}
        selectedId="a"
      />,
    );
    expect(screen.queryByRole("button", { name: "Expand" })).toBeNull();
  });

  it("clicking Expand fires onExpandFullScreen with selectedId", () => {
    const onExpand = vi.fn();
    render(
      <DrilldownLayout
        listSlot={<div />}
        detailSlot={<div />}
        selectedId="row-7"
        onExpandFullScreen={onExpand}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Expand" }));
    expect(onExpand).toHaveBeenCalledWith("row-7");
  });

  it("exposes a separator handle with arrow-key nudge", () => {
    render(
      <DrilldownLayout listSlot={<div />} detailSlot={<div />} />,
    );
    const sep = screen.getByRole("separator");
    expect(sep.getAttribute("aria-orientation")).toBe("vertical");
    const before = sep.getAttribute("aria-valuenow");
    fireEvent.keyDown(sep, { key: "ArrowRight" });
    expect(sep.getAttribute("aria-valuenow")).not.toBe(before);
  });
});
