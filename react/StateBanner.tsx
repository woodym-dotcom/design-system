/**
 * StateBanner — per-kind status banner for offline / rate-limit /
 * permissions / staleness / partial / degraded surfaces.
 *
 * Defaults to role="status"; warning/error tones promote to role="alert".
 * `asOf` renders as <time dateTime={iso}>.
 */
import * as React from "react";

export type StateBannerKind =
  | "offline"
  | "rate-limited"
  | "permissioned-out"
  | "stale-data"
  | "partial"
  | "degraded";

export interface StateBannerAction {
  label: string;
  onClick: () => void;
}

export interface StateBannerProps {
  kind: StateBannerKind;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: StateBannerAction;
  asOf?: Date | string;
  className?: string;
}

interface KindMeta {
  title: string;
  tone: "info" | "warning" | "neutral";
}

const KIND: Record<StateBannerKind, KindMeta> = {
  offline: { title: "You're offline", tone: "warning" },
  "rate-limited": { title: "Rate-limited — slow down", tone: "warning" },
  "permissioned-out": {
    title: "You don't have access to this view",
    tone: "neutral",
  },
  "stale-data": { title: "Data is stale", tone: "info" },
  partial: { title: "Partial data shown", tone: "info" },
  degraded: { title: "Degraded service", tone: "warning" },
};

function isoOf(value: Date | string | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function StateBanner({
  kind,
  title,
  description,
  action,
  asOf,
  className,
}: StateBannerProps): React.ReactElement {
  const meta = KIND[kind];
  const role = meta.tone === "warning" ? "alert" : "status";
  const iso = isoOf(asOf);

  return (
    <div
      role={role}
      className={[
        "cc-state-banner",
        `cc-state-banner--${kind}`,
        `cc-state-banner--${meta.tone}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="cc-state-banner__body">
        <strong className="cc-state-banner__title">
          {title ?? meta.title}
        </strong>
        {description ? (
          <span className="cc-state-banner__description"> {description}</span>
        ) : null}
        {iso ? (
          <span className="cc-state-banner__asof">
            {" "}as of <time dateTime={iso}>{iso}</time>
          </span>
        ) : null}
      </div>
      {action ? (
        <button
          type="button"
          className="cc-state-banner__action"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
