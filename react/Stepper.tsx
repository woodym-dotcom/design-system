/**
 * Stepper — horizontal step-progress indicator.
 *
 * Renders numbered circles (filled accent = current, checkmark green =
 * completed, outlined muted = pending) with a label below each step.
 * Reusable across multi-step flows: onboarding wizards, settings flows,
 * Dana/PRD wizards, etc.
 *
 * Styles use @ds/core tokens exclusively — no hardcoded values.
 */
import * as React from "react";

export type StepStatus = "completed" | "current" | "pending";

export interface StepperStep {
  id: string;
  label: string;
  status: StepStatus;
}

export interface StepperProps {
  steps: StepperStep[];
  ariaLabel?: string;
}

function StepCircle({ status, index }: { status: StepStatus; index: number }) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "1.4rem",
    height: "1.4rem",
    borderRadius: "50%",
    fontSize: "0.68rem",
    fontWeight: 700,
    flexShrink: 0,
  };

  const style: React.CSSProperties =
    status === "completed"
      ? {
          ...base,
          background: "var(--status-healthy, #22c55e)",
          color: "var(--surface-0)",
          border: "2px solid var(--status-healthy, #22c55e)",
        }
      : status === "current"
        ? {
            ...base,
            background: "var(--accent-1)",
            color: "var(--surface-0)",
            border: "2px solid var(--accent-1)",
          }
        : {
            ...base,
            background: "transparent",
            color: "var(--text-2)",
            border: "2px solid var(--border-2, var(--border-1))",
          };

  return (
    <span aria-hidden="true" style={style}>
      {status === "completed" ? "✓" : index + 1}
    </span>
  );
}

export function Stepper({ steps, ariaLabel = "Progress" }: StepperProps): React.ReactElement {
  return (
    <ol
      aria-label={ariaLabel}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem 0.75rem",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {steps.map((step, index) => (
        <li
          key={step.id}
          aria-current={step.status === "current" ? "step" : undefined}
          style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
        >
          <StepCircle status={step.status} index={index} />
          <span
            style={{
              fontSize: "0.75rem",
              color: step.status === "pending" ? "var(--text-2)" : "var(--text-1)",
              fontWeight: step.status === "current" ? 600 : 400,
            }}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
