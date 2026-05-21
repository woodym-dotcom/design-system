/**
 * AuditLogList — backward-compat tests via the deprecated alias.
 *
 * AuditLogList now delegates to ActivityTimeline under the hood.
 * These tests verify that the old API surface still renders correctly
 * through the alias (DS-SIMPLIFY 09 back-compat requirement).
 */
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuditLogList, type AuditEvent } from "../react/AuditLogList";

const events: AuditEvent[] = [
  {
    id: "1",
    timestamp: "2024-03-01T10:00:00.000Z",
    category: "login",
    source: "auth",
    notable: true,
    detail: "user logged in",
  },
  {
    id: "2",
    timestamp: "2024-03-01T11:30:00.000Z",
    category: "logout",
    source: "auth",
    notable: true,
  },
  {
    id: "3",
    timestamp: "2024-03-02T09:00:00.000Z",
    category: "deploy",
    source: "ci",
    notable: true,
    detail: "v1.2.0",
  },
];

describe("AuditLogList — flat (default)", () => {
  it("renders flat list with entries", () => {
    const { container } = render(<AuditLogList events={events} />);
    // AuditLogList now delegates to ActivityTimeline — uses at--flat class
    expect(container.querySelector(".at--flat")).toBeTruthy();
  });

  it("renders empty-state message when no events", () => {
    render(<AuditLogList events={[]} />);
    // ActivityTimeline default empty state
    expect(screen.getByText("No activity yet.")).toBeTruthy();
  });
});

describe("AuditLogList — timeline variant", () => {
  it("groups events by ISO day", () => {
    const { container } = render(
      <AuditLogList events={events} variant="timeline" />,
    );
    // AuditLogList with variant="timeline" calls ActivityTimeline with groupByDay=true
    const headers = container.querySelectorAll(".at-day-header");
    expect(headers).toHaveLength(2);
    expect(headers[0].textContent).toBe("2024-03-01");
    expect(headers[1].textContent).toBe("2024-03-02");
  });

  it("renders a dot per row", () => {
    const { container } = render(
      <AuditLogList events={events} variant="timeline" />,
    );
    // Timeline variant renders .at-dot per entry
    expect(container.querySelectorAll(".at-dot")).toHaveLength(3);
  });

  it("uses <time dateTime> for each timestamp", () => {
    const { container } = render(
      <AuditLogList events={events} variant="timeline" />,
    );
    const times = container.querySelectorAll("time");
    expect(times.length).toBe(3);
    expect(times[0].getAttribute("dateTime")).toBe(events[0].timestamp);
  });
});
