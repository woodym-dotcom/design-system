/**
 * Fmt.DateTime + useFmt strict + provider showRaw extensions (B.6).
 */
import * as React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FmtProvider, useFmt, Fmt } from "../react/fmt/Fmt";
import { Lens } from "../react/fmt/Lens";

describe("Fmt.DateTime", () => {
  it("renders <time> with dateTime + title", () => {
    render(
      <FmtProvider locale="en-GB" timezone="UTC">
        <Fmt.DateTime value="2026-05-17T15:30:00Z" mode="absolute" />
      </FmtProvider>,
    );
    const t = document.querySelector("time")!;
    expect(t.getAttribute("dateTime")).toBe("2026-05-17T15:30:00.000Z");
    expect(t.getAttribute("title")).toBe("2026-05-17T15:30:00.000Z");
  });

  it("mode=both renders relative AND absolute", () => {
    render(
      <FmtProvider locale="en-GB" timezone="UTC">
        <Fmt.DateTime value={new Date(Date.now() - 60_000)} mode="both" />
      </FmtProvider>,
    );
    expect(document.querySelector("time")?.textContent).toMatch(/\(.*\)/);
  });

  it("returns em-dash for invalid input", () => {
    render(<Fmt.DateTime value="not-a-date" />);
    expect(screen.getByText("—")).toBeTruthy();
  });
});

describe("useFmt strict", () => {
  function Probe({ strict }: { strict?: boolean }) {
    useFmt({ strict });
    return <span>ok</span>;
  }

  it("returns defaults silently when no provider and not strict", () => {
    render(<Probe />);
    expect(screen.getByText("ok")).toBeTruthy();
  });

  it("throws when no provider and strict=true", () => {
    // Suppress React error logging for this test.
    const spy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    expect(() => render(<Probe strict />)).toThrow(/strict/);
    spy.mockRestore();
  });
});

describe("FmtProvider showRaw context", () => {
  function Probe() {
    const { showRaw, setShowRaw } = useFmt();
    return (
      <>
        <span data-testid="state">{String(showRaw)}</span>
        <button onClick={() => setShowRaw(!showRaw)}>toggle</button>
      </>
    );
  }

  it("defaults to false when no defaultShowRaw is set", () => {
    render(
      <FmtProvider>
        <Probe />
      </FmtProvider>,
    );
    expect(screen.getByTestId("state").textContent).toBe("false");
  });

  it("respects defaultShowRaw", () => {
    render(
      <FmtProvider defaultShowRaw>
        <Probe />
      </FmtProvider>,
    );
    expect(screen.getByTestId("state").textContent).toBe("true");
  });

  it("setShowRaw flips the context value", () => {
    render(
      <FmtProvider>
        <Probe />
      </FmtProvider>,
    );
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("state").textContent).toBe("true");
  });

  it("when showRaw is true, Fmt.Money renders the raw value alongside", () => {
    render(
      <FmtProvider defaultShowRaw>
        <Fmt.Money value={12.5} currency="GBP" />
      </FmtProvider>,
    );
    expect(screen.getByText("12.5 GBP")).toBeTruthy();
  });
});

describe("Lens with bindShowRaw", () => {
  it("toggles the provider showRaw via setShowRaw", () => {
    render(
      <FmtProvider>
        <Lens label="raw" bindShowRaw>
          <Fmt.Money value={1} currency="GBP" />
        </Lens>
      </FmtProvider>,
    );
    expect(screen.queryByText("1 GBP")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /raw/i }));
    expect(screen.getByText("1 GBP")).toBeTruthy();
  });
});

// vitest globals — bring in spyOn / vi.
import { vi } from "vitest";
