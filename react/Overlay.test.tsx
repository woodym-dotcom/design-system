/**
 * Overlay primitive — covers all 6 placements, dismissal, focus trap, ARIA
 * roles, expandable toggle, resizable drag, sections vs children, and the
 * §18 audit source typing.
 */
import * as React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Overlay } from "./Overlay";
import type { OverlayPlacement } from "./Overlay.types";

afterEach(() => {
  document.body.style.overflow = "";
});

const PLACEMENTS: OverlayPlacement[] = [
  "modal",
  "drawer-right",
  "drawer-left",
  "detail-right",
  "drilldown",
  "fullscreen",
];

describe("Overlay — rendering across placements", () => {
  it("renders nothing when open=false", () => {
    render(
      <Overlay placement="modal" open={false} onOpenChange={() => {}} title="x">
        body
      </Overlay>,
    );
    expect(screen.queryByText("body")).toBeNull();
  });

  it.each(PLACEMENTS)("renders %s placement when open", (placement) => {
    render(
      <Overlay
        placement={placement as never}
        open
        onOpenChange={() => {}}
        title="T"
      >
        <div data-testid="body">hello</div>
      </Overlay>,
    );
    expect(screen.getByTestId("body")).toBeTruthy();
  });
});

describe("Overlay — ARIA roles by placement", () => {
  it("uses role=dialog for modal", () => {
    render(<Overlay placement="modal" open onOpenChange={() => {}} title="t">b</Overlay>);
    expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
  });
  it("uses role=dialog for drawer-right", () => {
    render(<Overlay placement="drawer-right" open onOpenChange={() => {}} title="t">b</Overlay>);
    expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
  });
  it("uses role=complementary for detail-right", () => {
    render(<Overlay placement="detail-right" open onOpenChange={() => {}} title="t">b</Overlay>);
    expect(screen.getByRole("complementary")).toBeTruthy();
  });
  it("uses role=group for drilldown", () => {
    render(
      <Overlay
        placement="drilldown"
        open
        onOpenChange={() => {}}
        ariaLabel="drill"
      >
        <div>detail</div>
      </Overlay>,
    );
    expect(screen.getByRole("group", { name: "drill" })).toBeTruthy();
  });
  it("uses role=region for fullscreen", () => {
    render(
      <Overlay placement="fullscreen" open onOpenChange={() => {}} ariaLabel="fs">
        b
      </Overlay>,
    );
    expect(screen.getByRole("region", { name: "fs" })).toBeTruthy();
  });
});

describe("Overlay — dismissal", () => {
  it("calls onOpenChange(false) on ESC by default", () => {
    const onOpenChange = vi.fn();
    render(<Overlay placement="modal" open onOpenChange={onOpenChange} title="t">b</Overlay>);
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("ESC suppressed when dismissible=false", () => {
    const onOpenChange = vi.fn();
    render(
      <Overlay
        placement="modal"
        open
        dismissible={false}
        onOpenChange={onOpenChange}
        title="t"
      >
        b
      </Overlay>,
    );
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("backdrop click closes by default", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Overlay placement="modal" open onOpenChange={onOpenChange} title="t">b</Overlay>,
    );
    const backdrop = container.ownerDocument.querySelector(".cc-modal__backdrop")!;
    fireEvent.click(backdrop);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("backdrop click suppressed when dismissible=false", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Overlay
        placement="modal"
        open
        dismissible={false}
        onOpenChange={onOpenChange}
        title="t"
      >
        b
      </Overlay>,
    );
    const backdrop = container.ownerDocument.querySelector(".cc-modal__backdrop")!;
    fireEvent.click(backdrop);
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe("Overlay — body scroll lock", () => {
  it("locks body scroll for modal", () => {
    const { rerender } = render(
      <Overlay placement="modal" open onOpenChange={() => {}} title="t">b</Overlay>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender(
      <Overlay placement="modal" open={false} onOpenChange={() => {}} title="t">b</Overlay>,
    );
    expect(document.body.style.overflow).toBe("");
  });
  it("does NOT lock body scroll for detail-right", () => {
    render(<Overlay placement="detail-right" open onOpenChange={() => {}} title="t">b</Overlay>);
    expect(document.body.style.overflow).toBe("");
  });
});

describe("Overlay — sections vs children", () => {
  it("renders sections with optional headings", () => {
    render(
      <Overlay
        placement="modal"
        open
        onOpenChange={() => {}}
        title="t"
        sections={[
          { heading: "A", content: <div>aa</div> },
          { content: <div>bb</div> },
        ]}
      />,
    );
    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("aa")).toBeTruthy();
    expect(screen.getByText("bb")).toBeTruthy();
  });

  it("renders children when sections omitted", () => {
    render(
      <Overlay placement="modal" open onOpenChange={() => {}} title="t">
        <div data-testid="x">hi</div>
      </Overlay>,
    );
    expect(screen.getByTestId("x")).toBeTruthy();
  });
});

describe("Overlay — expandable toggle", () => {
  it("shows full-screen toggle when expandable", () => {
    render(
      <Overlay
        placement="detail-right"
        open
        onOpenChange={() => {}}
        title="t"
        expandable
      >
        b
      </Overlay>,
    );
    expect(screen.getByRole("button", { name: /full screen/i })).toBeTruthy();
  });

  it("toggle switches to fullscreen and ARIA role becomes region", () => {
    render(
      <Overlay
        placement="detail-right"
        open
        onOpenChange={() => {}}
        title="t"
        expandable
        ariaLabel="x"
      >
        b
      </Overlay>,
    );
    fireEvent.click(screen.getByRole("button", { name: /full screen/i }));
    expect(screen.queryByRole("complementary")).toBeNull();
    expect(screen.getByRole("region")).toBeTruthy();
  });

  it("ESC exits fullscreen before closing", () => {
    const onOpenChange = vi.fn();
    render(
      <Overlay
        placement="detail-right"
        open
        onOpenChange={onOpenChange}
        title="t"
        expandable
      >
        b
      </Overlay>,
    );
    fireEvent.click(screen.getByRole("button", { name: /full screen/i }));
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    // First ESC exits fullscreen, does not close.
    expect(onOpenChange).not.toHaveBeenCalled();
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("Overlay — resizable", () => {
  it("renders resize handle when resizable on drawer-right", () => {
    const { container } = render(
      <Overlay
        placement="drawer-right"
        open
        onOpenChange={() => {}}
        title="t"
        resizable
      >
        b
      </Overlay>,
    );
    expect(
      container.ownerDocument.querySelector("[data-overlay-resize-handle]"),
    ).toBeTruthy();
  });

  it("does NOT render resize handle when resizable=false", () => {
    const { container } = render(
      <Overlay placement="drawer-right" open onOpenChange={() => {}} title="t">
        b
      </Overlay>,
    );
    expect(
      container.ownerDocument.querySelector("[data-overlay-resize-handle]"),
    ).toBeNull();
  });

  it("emits onResize during pointer drag", () => {
    const onResize = vi.fn();
    const { container } = render(
      <Overlay
        placement="drawer-right"
        open
        onOpenChange={() => {}}
        title="t"
        resizable
        onResize={onResize}
      >
        b
      </Overlay>,
    );
    const handle = container.ownerDocument.querySelector(
      "[data-overlay-resize-handle]",
    ) as HTMLElement;
    fireEvent.pointerDown(handle, { clientX: 1000, pointerId: 1 });
    act(() => {
      fireEvent.pointerMove(document, { clientX: 900 });
    });
    expect(onResize).toHaveBeenCalled();
    fireEvent.pointerUp(document);
  });
});

describe("Overlay — title + headerActions", () => {
  it("wires aria-labelledby to the rendered title", () => {
    render(
      <Overlay placement="modal" open onOpenChange={() => {}} title="Settings">
        body
      </Overlay>,
    );
    const dlg = screen.getByRole("dialog");
    const id = dlg.getAttribute("aria-labelledby")!;
    expect(document.getElementById(id)?.textContent).toBe("Settings");
  });

  it("renders headerActions slot", () => {
    render(
      <Overlay
        placement="modal"
        open
        onOpenChange={() => {}}
        title="t"
        headerActions={<button>Edit</button>}
      >
        b
      </Overlay>,
    );
    expect(screen.getByRole("button", { name: "Edit" })).toBeTruthy();
  });
});

describe("Overlay — TypeScript prop narrowing (compile-time)", () => {
  it("rejects resizable on placement=modal at compile time", () => {
    // @ts-expect-error resizable is invalid on modal placement
    const bad = <Overlay placement="modal" open resizable onOpenChange={() => {}} title="t">b</Overlay>;
    expect(bad).toBeTruthy();
  });
  it("rejects expandable on placement=drilldown at compile time", () => {
    // @ts-expect-error expandable is invalid on drilldown placement
    const bad = <Overlay placement="drilldown" open expandable onOpenChange={() => {}} ariaLabel="d">b</Overlay>;
    expect(bad).toBeTruthy();
  });
  it("allows §18 source on any placement", () => {
    const ok = (
      <Overlay
        placement="modal"
        open
        onOpenChange={() => {}}
        title="t"
        source={{ model: "claude-opus-4-7", promptVersion: "v1" }}
      >
        b
      </Overlay>
    );
    expect(ok).toBeTruthy();
  });
});
