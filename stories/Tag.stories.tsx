/**
 * Tag stories — variant × tone × size matrix.
 *
 * Subsumes Chip, Badge, StatusPill, LifecycleStateBadge, MetadataChip inline
 * badge patterns into one unified primitive.
 */
import * as React from "react";
import { Tag } from "../react/Tag";
import type { TagVariant, TagTone, TagSize } from "../react/Tag";

export default {
  title: "Primitives/Tag",
  component: Tag,
};

const VARIANTS: TagVariant[] = ["chip", "pill", "badge", "meta"];
const TONES: TagTone[] = ["neutral", "accent", "success", "warning", "error", "info"];
const SIZES: TagSize[] = ["sm", "md", "lg"];

// ── Full matrix ───────────────────────────────────────────────────────────────

export function VariantMatrix() {
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      {VARIANTS.map((variant) => (
        <div key={variant}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 8, opacity: 0.5 }}>
            {variant}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TONES.map((tone) => (
              <Tag key={tone} variant={variant} tone={tone}>
                {tone}
              </Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SizeMatrix() {
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      {SIZES.map((size) => (
        <div key={size}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 8, opacity: 0.5 }}>
            {size}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {TONES.map((tone) => (
              <Tag key={tone} size={size} tone={tone}>
                {tone}
              </Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────

export function WithDot() {
  return (
    <div style={{ padding: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
      {TONES.map((tone) => (
        <Tag key={tone} tone={tone} dot>
          {tone}
        </Tag>
      ))}
    </div>
  );
}

export function WithIcon() {
  const StarIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9l-3 1.5.5-3.5L1 4.5 4.5 4z" />
    </svg>
  );
  return (
    <div style={{ padding: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
      {TONES.map((tone) => (
        <Tag key={tone} tone={tone} icon={<StarIcon />}>
          {tone}
        </Tag>
      ))}
    </div>
  );
}

export function Removable() {
  const [tags, setTags] = React.useState(TONES.slice());
  return (
    <div style={{ padding: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
      {tags.map((tone) => (
        <Tag
          key={tone}
          tone={tone}
          onRemove={() => setTags((t) => t.filter((x) => x !== tone))}
        >
          {tone}
        </Tag>
      ))}
      {tags.length === 0 && (
        <button type="button" onClick={() => setTags(TONES.slice())}>
          Reset
        </button>
      )}
    </div>
  );
}

export function Interactive() {
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {TONES.map((tone) => (
          <Tag key={tone} tone={tone} onClick={() => setLast(tone)}>
            {tone}
          </Tag>
        ))}
      </div>
      {last && <p style={{ fontSize: 12, opacity: 0.6 }}>Last clicked: {last}</p>}
    </div>
  );
}

export function PillVariant() {
  return (
    <div style={{ padding: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
      {TONES.map((tone) => (
        <Tag key={tone} variant="pill" tone={tone} dot>
          {tone}
        </Tag>
      ))}
    </div>
  );
}

export function BadgeVariant() {
  return (
    <div style={{ padding: 24, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      {TONES.map((tone, i) => (
        <Tag key={tone} variant="badge" tone={tone}>
          {i + 1}
        </Tag>
      ))}
    </div>
  );
}

export function MetaVariant() {
  return (
    <div style={{ padding: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
      {TONES.map((tone) => (
        <Tag key={tone} variant="meta" tone={tone}>
          {tone}
        </Tag>
      ))}
    </div>
  );
}
