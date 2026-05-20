import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Tabs, type TabItem } from "../react/Tabs";

const items: TabItem<"overview" | "details" | "audit">[] = [
  { value: "overview", label: "Overview" },
  { value: "details", label: "Details" },
  { value: "audit", label: "Audit", disabled: true },
];

describe("Tabs", () => {
  it("renders role=tablist and tabs", () => {
    render(<Tabs items={items} value="overview" ariaLabel="Sections" />);
    const list = screen.getByRole("tablist");
    expect(list.getAttribute("aria-label")).toBe("Sections");
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  it("sets aria-selected on the active tab and tabindex roving", () => {
    render(<Tabs items={items} value="details" />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(tabs[1].getAttribute("tabindex")).toBe("0");
    expect(tabs[0].getAttribute("tabindex")).toBe("-1");
  });

  it("calls onChange when a tab is clicked", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="overview" onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("tab")[1]);
    expect(onChange).toHaveBeenCalledWith("details");
  });

  it("does not invoke onChange when a disabled tab is clicked", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="overview" onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("tab")[2]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("ArrowRight activates the next enabled tab", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="overview" onChange={onChange} />);
    const list = screen.getByRole("tablist");
    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("details");
  });

  it("ArrowRight skips disabled tabs", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="details" onChange={onChange} />);
    const list = screen.getByRole("tablist");
    fireEvent.keyDown(list, { key: "ArrowRight" });
    // "audit" is disabled; wraps to "overview".
    expect(onChange).toHaveBeenCalledWith("overview");
  });

  it("Home and End jump to first / last enabled", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="details" onChange={onChange} />);
    const list = screen.getByRole("tablist");
    fireEvent.keyDown(list, { key: "Home" });
    expect(onChange).toHaveBeenCalledWith("overview");
    fireEvent.keyDown(list, { key: "End" });
    // last enabled is "details" because audit is disabled.
    expect(onChange).toHaveBeenCalledWith("details");
  });
});
