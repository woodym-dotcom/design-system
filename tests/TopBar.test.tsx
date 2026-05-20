import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TopBar } from "../react/TopBar";

describe("TopBar", () => {
  it("renders brand slot", () => {
    render(<TopBar brand={<span>Acme</span>} />);
    expect(screen.getByText("Acme")).toBeTruthy();
  });

  it("renders identity initials from supplied string", () => {
    render(<TopBar identity="Jane Smith" />);
    expect(screen.getByLabelText("Open account menu")).toHaveTextContent("JA");
  });

  it("fires onCmdK", () => {
    const onCmdK = vi.fn();
    render(<TopBar onCmdK={onCmdK} />);
    fireEvent.click(screen.getByLabelText("Open command palette"));
    expect(onCmdK).toHaveBeenCalled();
  });

  it("hides Cmd+K when showCmdK=false", () => {
    render(<TopBar showCmdK={false} />);
    expect(screen.queryByLabelText("Open command palette")).toBeNull();
  });

  it("renders extras slot", () => {
    render(<TopBar extras={<span data-testid="x">extra</span>} />);
    expect(screen.getByTestId("x")).toBeTruthy();
  });
});
