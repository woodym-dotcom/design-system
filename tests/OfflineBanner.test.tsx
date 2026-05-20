import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { OfflineBanner } from "../react/OfflineBanner";

describe("OfflineBanner", () => {
  let originalOnLine: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalOnLine = Object.getOwnPropertyDescriptor(
      Navigator.prototype,
      "onLine",
    );
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => true,
    });
  });

  afterEach(() => {
    if (originalOnLine) {
      Object.defineProperty(Navigator.prototype, "onLine", originalOnLine);
    }
  });

  it("renders null when online", () => {
    const { container } = render(<OfflineBanner />);
    expect(container.firstChild).toBeNull();
  });

  it("renders banner when offline event fires", () => {
    const { container } = render(<OfflineBanner />);
    expect(container.firstChild).toBeNull();
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => false,
    });
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(screen.getByText("You're offline")).toBeTruthy();
  });
});
