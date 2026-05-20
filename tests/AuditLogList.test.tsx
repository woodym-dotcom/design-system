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
  it("renders flat list with timestamps", () => {
    const { container } = render(<AuditLogList events={events} />);
    expect(container.querySelector(".cc-audit-log--timeline")).toBeNull();
  });

  it("renders empty-state message when no events", () => {
    render(<AuditLogList events={[]} />);
    expect(screen.getByText("No audit events yet.")).toBeTruthy();
  });
});

describe("AuditLogList — timeline variant", () => {
  it("groups events by ISO day", () => {
    const { container } = render(
      <AuditLogList events={events} variant="timeline" />,
    );
    expect(container.querySelector(".cc-audit-log--timeline")).toBeTruthy();
    const markers = container.querySelectorAll(".cc-audit-log__day-marker");
    expect(markers).toHaveLength(2);
    expect(markers[0].textContent).toBe("2024-03-01");
    expect(markers[1].textContent).toBe("2024-03-02");
  });

  it("renders a dot per row", () => {
    const { container } = render(
      <AuditLogList events={events} variant="timeline" />,
    );
    expect(container.querySelectorAll(".cc-audit-log__dot")).toHaveLength(3);
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
