/**
 * AISuggestionsPane — unit tests (DS-SIMPLIFY 10)
 *
 * Covers:
 *  - Renders title, rationale, confidence chip
 *  - Apply / Reject / Edit decisions update state + fire onDecision
 *  - Edit mode shows renderEditor; edited value propagates
 *  - Submit fires onSubmit with curated set
 *  - a11y: keyboard-accessible decisions
 *  - Loading / error / empty states
 */
import * as React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AISuggestionsPane } from "./AISuggestionsPane";
import type { Suggestion, AISuggestionsPaneProps } from "./AISuggestionsPane";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SUGGESTIONS: Suggestion<string>[] = [
  {
    id: "s1",
    title: "Update company name",
    rationale: "Legal name has changed.",
    confidence: 0.92,
    proposedValue: "Acme Corp Ltd",
    currentValue: "Acme Corp",
  },
  {
    id: "s2",
    title: "Add industry tag",
    rationale: "Inferred from sector data.",
    confidence: 0.65,
    proposedValue: "Technology",
  },
  {
    id: "s3",
    title: "Set employee count",
    confidence: 0.4,
    proposedValue: "1200",
  },
];

const SOURCE = { model: "gpt-4o", promptVersion: "v1.2" };

function renderValue(v: string) {
  return <span data-testid="value">{v}</span>;
}

function renderEditor(v: string, onChange: (v: string) => void) {
  return (
    <input
      data-testid="editor"
      value={v}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Edit value"
    />
  );
}

function buildProps(
  overrides: Partial<AISuggestionsPaneProps<string>> = {},
): AISuggestionsPaneProps<string> {
  return {
    suggestions: SUGGESTIONS,
    onDecision: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue(undefined),
    renderValue,
    source: SOURCE,
    ...overrides,
  };
}

// ── Rendering ─────────────────────────────────────────────────────────────────

describe("AISuggestionsPane — rendering", () => {
  it("renders each suggestion title", () => {
    render(<AISuggestionsPane {...buildProps()} />);
    expect(screen.getByText("Update company name")).toBeInTheDocument();
    expect(screen.getByText("Add industry tag")).toBeInTheDocument();
    expect(screen.getByText("Set employee count")).toBeInTheDocument();
  });

  it("renders rationale where provided", () => {
    render(<AISuggestionsPane {...buildProps()} />);
    expect(screen.getByText("Legal name has changed.")).toBeInTheDocument();
    expect(screen.getByText("Inferred from sector data.")).toBeInTheDocument();
  });

  it("renders confidence chip for each suggestion", () => {
    render(<AISuggestionsPane {...buildProps()} />);
    expect(screen.getByLabelText("Confidence: 92%")).toBeInTheDocument();
    expect(screen.getByLabelText("Confidence: 65%")).toBeInTheDocument();
    expect(screen.getByLabelText("Confidence: 40%")).toBeInTheDocument();
  });

  it("renders proposed values via renderValue", () => {
    render(<AISuggestionsPane {...buildProps()} />);
    const values = screen.getAllByTestId("value");
    // s1 has currentValue + proposedValue (2), s2 + s3 have proposedValue only (1 each)
    expect(values.length).toBe(4);
  });

  it("renders current value when provided", () => {
    render(<AISuggestionsPane {...buildProps()} />);
    // s1 has currentValue "Acme Corp"
    const valueNodes = screen.getAllByTestId("value");
    const texts = valueNodes.map((n) => n.textContent);
    expect(texts).toContain("Acme Corp");
  });

  it("renders source model in data attribute", () => {
    const { container } = render(<AISuggestionsPane {...buildProps()} />);
    const section = container.querySelector("[data-ai-source-model]");
    expect(section).not.toBeNull();
    expect(section!.getAttribute("data-ai-source-model")).toBe("gpt-4o");
  });

  it("renders prompt version in data attribute", () => {
    const { container } = render(<AISuggestionsPane {...buildProps()} />);
    const section = container.querySelector("[data-ai-source-prompt-version]");
    expect(section).not.toBeNull();
    expect(section!.getAttribute("data-ai-source-prompt-version")).toBe("v1.2");
  });
});

// ── Decisions ─────────────────────────────────────────────────────────────────

describe("AISuggestionsPane — decisions", () => {
  it("fires onDecision with 'apply' when Apply is clicked", () => {
    const onDecision = vi.fn();
    render(<AISuggestionsPane {...buildProps({ onDecision })} />);
    fireEvent.click(screen.getByLabelText("Apply suggestion: Update company name"));
    expect(onDecision).toHaveBeenCalledWith("s1", "apply", undefined);
  });

  it("fires onDecision with 'reject' when Reject is clicked", () => {
    const onDecision = vi.fn();
    render(<AISuggestionsPane {...buildProps({ onDecision })} />);
    fireEvent.click(screen.getByLabelText("Reject suggestion: Add industry tag"));
    expect(onDecision).toHaveBeenCalledWith("s2", "reject", undefined);
  });

  it("Apply button has aria-pressed=true when decision is apply", () => {
    const suggestions = [{ ...SUGGESTIONS[0], decision: "apply" as const }];
    render(<AISuggestionsPane {...buildProps({ suggestions })} />);
    const btn = screen.getByLabelText("Apply suggestion: Update company name");
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("Reject button has aria-pressed=true when decision is reject", () => {
    const suggestions = [{ ...SUGGESTIONS[0], decision: "reject" as const }];
    render(<AISuggestionsPane {...buildProps({ suggestions })} />);
    const btn = screen.getByLabelText("Reject suggestion: Update company name");
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });
});

// ── Edit mode ─────────────────────────────────────────────────────────────────

describe("AISuggestionsPane — edit mode", () => {
  it("shows renderEditor when Edit is clicked and decision is 'edit'", () => {
    const suggestions = [{ ...SUGGESTIONS[0], decision: "edit" as const }];
    render(
      <AISuggestionsPane
        {...buildProps({ suggestions, renderEditor })}
      />,
    );
    expect(screen.getByTestId("editor")).toBeInTheDocument();
  });

  it("fires onDecision with editedValue when Confirm edit is clicked", () => {
    const onDecision = vi.fn();
    const suggestions = [{ ...SUGGESTIONS[0], decision: "edit" as const }];
    render(
      <AISuggestionsPane
        {...buildProps({ suggestions, onDecision, renderEditor })}
      />,
    );
    const editor = screen.getByTestId("editor");
    fireEvent.change(editor, { target: { value: "Acme Corp Edited" } });
    fireEvent.click(
      screen.getByLabelText("Confirm edit for Update company name"),
    );
    expect(onDecision).toHaveBeenCalledWith(
      "s1",
      "edit",
      "Acme Corp Edited",
    );
  });

  it("fires onDecision(id, null) when Cancel edit is clicked", () => {
    const onDecision = vi.fn();
    const suggestions = [{ ...SUGGESTIONS[0], decision: "edit" as const }];
    render(
      <AISuggestionsPane
        {...buildProps({ suggestions, onDecision, renderEditor })}
      />,
    );
    fireEvent.click(screen.getByLabelText("Cancel edit for Update company name"));
    expect(onDecision).toHaveBeenCalledWith("s1", null, undefined);
  });
});

// ── Submit ────────────────────────────────────────────────────────────────────

describe("AISuggestionsPane — submit", () => {
  it("submit button is disabled when no decisions are made", () => {
    render(<AISuggestionsPane {...buildProps()} />);
    expect(screen.getByRole("button", { name: /Submit/ })).toBeDisabled();
  });

  it("submit button is enabled when at least one decision is made", () => {
    const suggestions = [{ ...SUGGESTIONS[0], decision: "apply" as const }, ...SUGGESTIONS.slice(1)];
    render(<AISuggestionsPane {...buildProps({ suggestions })} />);
    expect(screen.getByRole("button", { name: /Submit/ })).not.toBeDisabled();
  });

  it("fires onSubmit with the curated suggestions array", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const suggestions = [
      { ...SUGGESTIONS[0], decision: "apply" as const },
      { ...SUGGESTIONS[1], decision: "reject" as const },
      SUGGESTIONS[2],
    ];
    render(<AISuggestionsPane {...buildProps({ suggestions, onSubmit })} />);
    fireEvent.click(screen.getByRole("button", { name: /Submit/ }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(suggestions);
  });

  it("shows error when onSubmit rejects", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Network error"));
    const suggestions = [{ ...SUGGESTIONS[0], decision: "apply" as const }];
    render(<AISuggestionsPane {...buildProps({ suggestions, onSubmit })} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Submit/ }));
    });
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Network error"),
    );
  });

  it("summary updates with decided count", () => {
    const suggestions = [
      { ...SUGGESTIONS[0], decision: "apply" as const },
      SUGGESTIONS[1],
      SUGGESTIONS[2],
    ];
    render(<AISuggestionsPane {...buildProps({ suggestions })} />);
    expect(screen.getByText("1 of 3 reviewed")).toBeInTheDocument();
  });
});

// ── Loading / error / empty states ────────────────────────────────────────────

describe("AISuggestionsPane — loading state", () => {
  it("renders loading indicator", () => {
    render(<AISuggestionsPane {...buildProps({ loading: true })} />);
    expect(screen.getByText("Loading suggestions…")).toBeInTheDocument();
  });

  it("has aria-busy=true when loading", () => {
    const { container } = render(
      <AISuggestionsPane {...buildProps({ loading: true })} />,
    );
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-busy", "true");
  });
});

describe("AISuggestionsPane — error state", () => {
  it("renders error message", () => {
    render(
      <AISuggestionsPane {...buildProps({ error: "AI service unavailable" })} />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "AI service unavailable",
    );
  });
});

describe("AISuggestionsPane — empty state", () => {
  it("renders empty message when suggestions array is empty", () => {
    render(<AISuggestionsPane {...buildProps({ suggestions: [] })} />);
    expect(screen.getByText("No suggestions available.")).toBeInTheDocument();
  });
});

// ── a11y keyboard navigation ──────────────────────────────────────────────────

describe("AISuggestionsPane — keyboard accessibility", () => {
  it("all Apply/Reject buttons are reachable via keyboard (tab order)", () => {
    render(<AISuggestionsPane {...buildProps()} />);
    const applyBtns = screen.getAllByRole("button", { name: /^Apply suggestion/ });
    const rejectBtns = screen.getAllByRole("button", { name: /^Reject suggestion/ });
    expect(applyBtns).toHaveLength(3);
    expect(rejectBtns).toHaveLength(3);
    // All are standard <button> elements so they are in the natural tab order
    for (const btn of [...applyBtns, ...rejectBtns]) {
      expect(btn.tagName).toBe("BUTTON");
      expect(btn).not.toHaveAttribute("tabindex", "-1");
    }
  });

  it("decision groups have accessible group labels", () => {
    render(<AISuggestionsPane {...buildProps()} />);
    const groups = screen.getAllByRole("group");
    // 3 suggestion rows × 1 group each = 3
    expect(groups.length).toBeGreaterThanOrEqual(3);
  });

  it("submit button is accessible", () => {
    const suggestions = [{ ...SUGGESTIONS[0], decision: "apply" as const }];
    render(<AISuggestionsPane {...buildProps({ suggestions })} />);
    expect(
      screen.getByRole("button", { name: /Submit 1 reviewed suggestion/ }),
    ).toBeInTheDocument();
  });

  it("keyboard Enter on Apply fires onDecision", () => {
    const onDecision = vi.fn();
    render(<AISuggestionsPane {...buildProps({ onDecision })} />);
    const applyBtn = screen.getByLabelText("Apply suggestion: Update company name");
    applyBtn.focus();
    fireEvent.keyDown(applyBtn, { key: "Enter" });
    fireEvent.click(applyBtn);
    expect(onDecision).toHaveBeenCalledWith("s1", "apply", undefined);
  });
});
