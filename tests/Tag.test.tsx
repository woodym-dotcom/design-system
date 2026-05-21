/**
 * Tag — contract tests.
 *
 * Covers:
 *  (a) All variant × tone × size combinations render with correct CSS classes.
 *  (b) Interactive Tag: button role, Enter/Space activation.
 *  (c) Removable Tag: X shown, onRemove fires on click/Enter/Space, stops propagation.
 *  (d) `dot` renders a leading coloured dot (aria-hidden).
 *  (e) `icon` renders a leading icon slot (aria-hidden wrapper).
 *  (f) a11y: interactive → button; non-interactive → span.
 *  (g) Back-compat: `danger` tone maps to `error`.
 */
import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Tag } from "../react/Tag";
import type { TagVariant, TagTone, TagSize } from "../react/Tag";

// ── (a) Variant × tone × size matrix ────────────────────────────────────────

const VARIANTS: TagVariant[] = ["chip", "pill", "badge", "meta"];
const TONES: TagTone[] = ["neutral", "accent", "success", "warning", "error", "info"];
const SIZES: TagSize[] = ["sm", "md", "lg"];

describe("Tag — variant classes", () => {
  for (const variant of VARIANTS) {
    it(`variant "${variant}" applies cc-tag--${variant}`, () => {
      const { container } = render(<Tag variant={variant}>label</Tag>);
      expect(container.firstElementChild?.className).toContain(`cc-tag--${variant}`);
    });
  }
});

describe("Tag — tone classes", () => {
  for (const tone of TONES) {
    it(`tone "${tone}" applies cc-tag--${tone}`, () => {
      const { container } = render(<Tag tone={tone}>label</Tag>);
      expect(container.firstElementChild?.className).toContain(`cc-tag--${tone}`);
    });
  }
});

describe("Tag — size classes", () => {
  for (const size of SIZES) {
    it(`size "${size}" applies cc-tag--${size}`, () => {
      const { container } = render(<Tag size={size}>label</Tag>);
      expect(container.firstElementChild?.className).toContain(`cc-tag--${size}`);
    });
  }
});

describe("Tag — defaults", () => {
  it("defaults to variant=chip, tone=neutral, size=md", () => {
    const { container } = render(<Tag>label</Tag>);
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("cc-tag--chip");
    expect(cls).toContain("cc-tag--neutral");
    expect(cls).toContain("cc-tag--md");
  });
});

// ── (b) Interactive Tag ──────────────────────────────────────────────────────

describe("Tag — (b) interactive onClick", () => {
  it("renders as <button> when onClick is provided", () => {
    const handler = vi.fn();
    render(<Tag onClick={handler}>click me</Tag>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn.tagName).toBe("BUTTON");
  });

  it("calls onClick on click", () => {
    const handler = vi.fn();
    render(<Tag onClick={handler}>click me</Tag>);
    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls onClick on Enter key", () => {
    const handler = vi.fn();
    render(<Tag onClick={handler}>click me</Tag>);
    const btn = screen.getByRole("button", { name: /click me/i });
    fireEvent.keyDown(btn, { key: "Enter" });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls onClick on Space key", () => {
    const handler = vi.fn();
    render(<Tag onClick={handler}>click me</Tag>);
    const btn = screen.getByRole("button", { name: /click me/i });
    fireEvent.keyDown(btn, { key: " " });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("applies cc-tag--interactive class", () => {
    const { container } = render(<Tag onClick={() => {}}>x</Tag>);
    expect(container.firstElementChild?.className).toContain("cc-tag--interactive");
  });
});

// ── (c) Removable Tag ────────────────────────────────────────────────────────

describe("Tag — (c) onRemove", () => {
  it("renders × button with aria-label Remove", () => {
    render(<Tag onRemove={() => {}}>filter</Tag>);
    expect(screen.getByRole("button", { name: "Remove" })).toBeTruthy();
  });

  it("calls onRemove on × click", () => {
    const handler = vi.fn();
    render(<Tag onRemove={handler}>filter</Tag>);
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls onRemove on Enter key in × button", () => {
    const handler = vi.fn();
    render(<Tag onRemove={handler}>filter</Tag>);
    fireEvent.keyDown(screen.getByRole("button", { name: "Remove" }), { key: "Enter" });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls onRemove on Space key in × button", () => {
    const handler = vi.fn();
    render(<Tag onRemove={handler}>filter</Tag>);
    fireEvent.keyDown(screen.getByRole("button", { name: "Remove" }), { key: " " });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("× button click does not propagate to onClick wrapper", () => {
    const outer = vi.fn();
    const onRemove = vi.fn();
    render(
      <Tag onClick={outer} onRemove={onRemove}>
        filter
      </Tag>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
  });
});

// ── (d) dot ──────────────────────────────────────────────────────────────────

describe("Tag — (d) dot prop", () => {
  it("renders dot element when dot=true", () => {
    const { container } = render(<Tag dot>Status</Tag>);
    const dot = container.querySelector(".cc-tag__dot");
    expect(dot).not.toBeNull();
  });

  it("dot is aria-hidden", () => {
    const { container } = render(<Tag dot tone="success">OK</Tag>);
    const dot = container.querySelector(".cc-tag__dot");
    expect(dot?.getAttribute("aria-hidden")).toBe("true");
  });

  it("dot carries tone modifier class", () => {
    const { container } = render(<Tag dot tone="warning">Warn</Tag>);
    expect(container.querySelector(".cc-tag__dot")?.className).toContain(
      "cc-tag__dot--warning",
    );
  });

  it("does not render dot when dot is false (default)", () => {
    const { container } = render(<Tag>label</Tag>);
    expect(container.querySelector(".cc-tag__dot")).toBeNull();
  });
});

// ── (e) icon ─────────────────────────────────────────────────────────────────

describe("Tag — (e) icon prop", () => {
  it("renders icon slot when icon is provided", () => {
    const { container } = render(
      <Tag icon={<svg data-testid="icon" />}>Label</Tag>,
    );
    expect(container.querySelector(".cc-tag__icon")).not.toBeNull();
    expect(container.querySelector("[data-testid='icon']")).not.toBeNull();
  });

  it("icon slot wrapper is aria-hidden", () => {
    const { container } = render(<Tag icon={<span>★</span>}>Label</Tag>);
    expect(container.querySelector(".cc-tag__icon")?.getAttribute("aria-hidden")).toBe("true");
  });
});

// ── (f) a11y element types ────────────────────────────────────────────────────

describe("Tag — (f) a11y element type", () => {
  it("non-interactive renders as <span>", () => {
    render(<Tag>label</Tag>);
    expect(screen.queryByRole("button")).toBeNull();
    expect(document.querySelector("span.cc-tag")).not.toBeNull();
  });

  it("interactive renders as <button>", () => {
    render(<Tag onClick={() => {}}>label</Tag>);
    expect(document.querySelector("button.cc-tag")).not.toBeNull();
  });
});

// ── (g) back-compat danger → error ───────────────────────────────────────────

describe("Tag — (g) danger tone back-compat", () => {
  it("maps danger to error tone class", () => {
    // @ts-expect-error — testing deprecated runtime value
    const { container } = render(<Tag tone="danger">error</Tag>);
    expect(container.firstElementChild?.className).toContain("cc-tag--error");
    expect(container.firstElementChild?.className).not.toContain("cc-tag--danger");
  });
});
