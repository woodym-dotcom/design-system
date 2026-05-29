import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppShellInternal } from "../react/AppShellInternal";

describe("AppShellInternal", () => {
  it("renders brand, identity, and children", () => {
    render(
      <AppShellInternal brand={<span>Brand</span>} identity="AA">
        <p>page</p>
      </AppShellInternal>,
    );
    expect(screen.getByText("Brand")).toBeTruthy();
    expect(screen.getByLabelText("Open account menu")).toHaveTextContent("AA");
    expect(screen.getByText("page")).toBeTruthy();
  });

  it("renders skip-to-content link", () => {
    render(<AppShellInternal>x</AppShellInternal>);
    expect(screen.getByText("Skip to content")).toBeTruthy();
  });

  it("renders breadcrumbs when crumbs provided", () => {
    render(
      <AppShellInternal crumbs={[{ label: "Home", href: "/" }, { label: "Page" }]}>
        body
      </AppShellInternal>,
    );
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeTruthy();
  });

  it("calls onNavigate when a nav item is clicked", () => {
    const onNavigate = vi.fn();
    render(
      <AppShellInternal
        navItems={[
          { id: "home", to: "/home", label: "Home" },
          { id: "settings", to: "/settings", label: "Settings" },
        ]}
        activeId="home"
        onNavigate={onNavigate}
      >
        body
      </AppShellInternal>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Settings" }));
    expect(onNavigate).toHaveBeenCalledWith("settings");
  });

  it("renders groupSwitcher slot when provided", () => {
    render(
      <AppShellInternal groupSwitcher={<span data-testid="g">SW</span>}>x</AppShellInternal>,
    );
    expect(screen.getByTestId("g")).toBeTruthy();
  });
});
