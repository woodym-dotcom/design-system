/**
 * AISuggestionsPane stories — DS-SIMPLIFY 10
 *
 * Visual baselines: empty / populated / loading / error / mid-edit
 */
import * as React from "react";
import { AISuggestionsPane } from "../react/AISuggestionsPane";
import type { Suggestion, AISuggestionsPaneProps } from "../react/AISuggestionsPane";

export default {
  title: "Primitives/AISuggestionsPane",
  component: AISuggestionsPane,
};

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SOURCE = { model: "gpt-4o-mini", promptVersion: "v1.3" };

const SUGGESTIONS: Suggestion<string>[] = [
  {
    id: "s1",
    title: "Update company name",
    rationale: "Legal name registered with Companies House has changed.",
    confidence: 0.94,
    proposedValue: "Acme Corp Ltd",
    currentValue: "Acme Corp",
  },
  {
    id: "s2",
    title: "Add industry classification",
    rationale: "Sector inferred from SIC code 6201.",
    confidence: 0.71,
    proposedValue: "Software — B2B SaaS",
  },
  {
    id: "s3",
    title: "Update employee count",
    confidence: 0.48,
    proposedValue: "1 200–2 000",
    currentValue: "500–1 000",
  },
];

function renderValue(v: string) {
  return (
    <span
      style={{
        fontFamily: "monospace",
        fontSize: 13,
        background: "var(--color-surface-2, #f4f4f4)",
        borderRadius: 4,
        padding: "2px 6px",
      }}
    >
      {v}
    </span>
  );
}

function renderEditor(v: string, onChange: (v: string) => void) {
  return (
    <input
      value={v}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Edit value"
      style={{
        fontFamily: "monospace",
        fontSize: 13,
        border: "1px solid var(--color-border, #ccc)",
        borderRadius: 4,
        padding: "2px 6px",
        width: "100%",
      }}
    />
  );
}

// ── Controlled wrapper ────────────────────────────────────────────────────────

function Controlled(
  props: Omit<AISuggestionsPaneProps<string>, "onDecision" | "onSubmit" | "suggestions"> & {
    initial?: Suggestion<string>[];
  },
) {
  const { initial = SUGGESTIONS, ...rest } = props;
  const [items, setItems] = React.useState<Suggestion<string>[]>(initial);

  function onDecision(
    id: string,
    decision: Suggestion<string>["decision"],
    editedValue?: string,
  ) {
    setItems((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, decision, editedValue: editedValue ?? s.editedValue } : s,
      ),
    );
  }

  async function onSubmit(curated: Suggestion<string>[]) {
    // Simulate async
    await new Promise((r) => setTimeout(r, 400));
    console.log("Submitted curated set:", curated);
  }

  return (
    <div style={{ maxWidth: 560, padding: 24 }}>
      <AISuggestionsPane<string>
        {...rest}
        suggestions={items}
        onDecision={onDecision}
        onSubmit={onSubmit}
        renderValue={renderValue}
      />
    </div>
  );
}

// ── Stories ───────────────────────────────────────────────────────────────────

/** Populated — all suggestions undecided */
export function Populated() {
  return <Controlled source={SOURCE} />;
}

/** Empty — no suggestions provided */
export function Empty() {
  const [items] = React.useState<Suggestion<string>[]>([]);
  return (
    <div style={{ maxWidth: 560, padding: 24 }}>
      <AISuggestionsPane<string>
        suggestions={items}
        onDecision={() => {}}
        onSubmit={async () => {}}
        renderValue={renderValue}
        source={SOURCE}
      />
    </div>
  );
}

/** Loading */
export function Loading() {
  return (
    <div style={{ maxWidth: 560, padding: 24 }}>
      <AISuggestionsPane<string>
        suggestions={[]}
        loading
        onDecision={() => {}}
        onSubmit={async () => {}}
        renderValue={renderValue}
        source={SOURCE}
      />
    </div>
  );
}

/** Error */
export function ErrorState() {
  return (
    <div style={{ maxWidth: 560, padding: 24 }}>
      <AISuggestionsPane<string>
        suggestions={[]}
        error="AI service unavailable. Please try again."
        onDecision={() => {}}
        onSubmit={async () => {}}
        renderValue={renderValue}
        source={SOURCE}
      />
    </div>
  );
}

/** Mid-edit — s1 in edit mode with renderEditor */
export function MidEdit() {
  const initial: Suggestion<string>[] = [
    { ...SUGGESTIONS[0], decision: "edit" },
    ...SUGGESTIONS.slice(1),
  ];
  return (
    <Controlled
      source={SOURCE}
      renderEditor={renderEditor}
      initial={initial}
    />
  );
}

/** With decisions — apply + reject set */
export function WithDecisions() {
  const initial: Suggestion<string>[] = [
    { ...SUGGESTIONS[0], decision: "apply" },
    { ...SUGGESTIONS[1], decision: "reject" },
    SUGGESTIONS[2],
  ];
  return <Controlled source={SOURCE} initial={initial} />;
}
