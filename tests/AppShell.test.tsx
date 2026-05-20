import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppShell } from "../react/AppShell";

describe("AppShell", () => {
  it("renders brand, identity, and children", () => {
    render(
      <AppShell brand={<span>Brand</span>} identity="AA">
        <p>page</p>
      </AppShell>,
    );
    expect(screen.getByText("Brand")).toBeTruthy();
    expect(screen.getByLabelText("Open account menu")).toHaveTextContent("AA");
    expect(screen.getByText("page")).toBeTruthy();
  });

  it("renders skip-to-content link", () => {
    render(<AppShell>x</AppShell>);
    expect(screen.getByText("Skip to content")).toBeTruthy();
  });

  it("renders breadcrumbs when crumbs provided", () => {
    render(
      <AppShell crumbs={[{ label: "Home", href: "/" }, { label: "Page" }]}>
        body
      </AppShell>,
    );
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeTruthy();
  });

  it("calls onNavigate when a nav item is clicked", () => {
    const onNavigate = vi.fn();
    render(
      <AppShell
        navItems={[
          { id: "home", to: "/home", label: "Home" },
          { id: "settings", to: "/settings", label: "Settings" },
        ]}
        activeId="home"
        onNavigate={onNavigate}
      >
        body
      </AppShell>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Settings" }));
    expect(onNavigate).toHaveBeenCalledWith("settings");
  });

  it("renders groupSwitcher slot when provided", () => {
    render(
      <AppShell groupSwitcher={<span data-testid="g">SW</span>}>x</AppShell>,
    );
    expect(screen.getByTestId("g")).toBeTruthy();
  });
});
