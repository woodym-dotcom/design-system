import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useSplitPane } from "../react/hooks/useSplitPane";

function Harness({
  storageKey,
  defaultLeftPercent,
}: {
  storageKey: string;
  defaultLeftPercent?: number;
}) {
  const { containerRef, handleProps, leftPercent } = useSplitPane({
    storageKey,
    defaultLeftPercent,
  });
  return (
    <div ref={containerRef} data-testid="container" style={{ width: 100 }}>
      <span data-testid="pct">{leftPercent}</span>
      <div data-testid="handle" {...handleProps} />
    </div>
  );
}

describe("useSplitPane", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns the default percentage when storage is empty", () => {
    const { getByTestId } = render(
      <Harness storageKey="t1" defaultLeftPercent={42} />,
    );
    expect(getByTestId("pct").textContent).toBe("42");
  });

  it("hydrates from localStorage when present", () => {
    window.localStorage.setItem("split-pane:t2", "65");
    const { getByTestId } = render(
      <Harness storageKey="t2" defaultLeftPercent={42} />,
    );
    expect(getByTestId("pct").textContent).toBe("65");
  });

  it("ArrowLeft and ArrowRight nudge by 2% and persist", () => {
    const { getByTestId } = render(
      <Harness storageKey="t3" defaultLeftPercent={50} />,
    );
    const handle = getByTestId("handle");
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(getByTestId("pct").textContent).toBe("52");
    expect(window.localStorage.getItem("split-pane:t3")).toBe("52");
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    expect(getByTestId("pct").textContent).toBe("48");
  });

  it("clamps to min/max", () => {
    const { getByTestId } = render(
      <Harness storageKey="t4" defaultLeftPercent={21} />,
    );
    const handle = getByTestId("handle");
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    // floor at min=20
    expect(getByTestId("pct").textContent).toBe("20");
  });

  it("handle has role=separator with aria-orientation=vertical", () => {
    const { getByTestId } = render(
      <Harness storageKey="t5" defaultLeftPercent={50} />,
    );
    const handle = getByTestId("handle");
    expect(handle.getAttribute("role")).toBe("separator");
    expect(handle.getAttribute("aria-orientation")).toBe("vertical");
    expect(handle.getAttribute("aria-valuenow")).toBe("50");
    expect(handle.getAttribute("aria-valuemin")).toBe("20");
    expect(handle.getAttribute("aria-valuemax")).toBe("80");
  });
});
