/**
 * ModuleTemplate — covers all 7 variants, tabs, a11y, and prop narrowing.
 */
import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  // Clear URL search params so tab-state persistence across tests doesn't leak.
  if (typeof window !== "undefined") {
    window.history.replaceState(null, "", window.location.pathname);
  }
});
import { ModuleTemplate } from "./ModuleTemplate";
import type { ColumnDef, KpiDef, ChartCardDef } from "./ModuleTemplate.types";

interface Row {
  id: string;
  name: string;
}

const columns: ColumnDef<Row>[] = [
  { key: "name", label: "Name", sortable: true, render: (r) => r.name },
];

const rows: Row[] = [
  { id: "1", name: "Alpha" },
  { id: "2", name: "Beta" },
];

// ── Header ────────────────────────────────────────────────────────────────────

describe("ModuleTemplate — header", () => {
  it("renders title, subtitle, breadcrumbs and actions", () => {
    render(
      <ModuleTemplate
        variant="list"
        header={{
          title: "People",
          subtitle: "All directory rows",
          breadcrumbs: [
            { label: "Home", href: "/" },
            { label: "People" },
          ],
          actions: <button type="button">New</button>,
          backHref: "/back",
        }}
        rows={rows}
        columns={columns}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "People" })).toBeTruthy();
    expect(screen.getByText("All directory rows")).toBeTruthy();
    expect(screen.getByRole("button", { name: "New" })).toBeTruthy();
    expect(screen.getByText("← Back").getAttribute("href")).toBe("/back");
    expect(screen.getByRole("navigation").textContent).toContain("Home");
  });
});

// ── List variant ──────────────────────────────────────────────────────────────

describe("ModuleTemplate — list variant", () => {
  it("renders rows and sortable headers", () => {
    render(
      <ModuleTemplate
        variant="list"
        header={{ title: "Items" }}
        rows={rows}
        columns={columns}
      />,
    );
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Beta")).toBeTruthy();
    const th = screen.getByRole("columnheader", { name: /Name/ });
    expect(th.getAttribute("aria-sort")).toBe("none");
  });

  it("fires onSortChange when sortable header clicked", () => {
    const onSortChange = vi.fn();
    render(
      <ModuleTemplate
        variant="list"
        header={{ title: "Items" }}
        rows={rows}
        columns={columns}
        onSortChange={onSortChange}
      />,
    );
    fireEvent.click(screen.getByRole("columnheader", { name: /Name/ }));
    expect(onSortChange).toHaveBeenCalledWith("name", "asc");
  });

  it("supports multi-select with bulk actions", () => {
    const onChange = vi.fn();
    const onRun = vi.fn();
    render(
      <ModuleTemplate
        variant="list"
        header={{ title: "Items" }}
        rows={rows}
        columns={columns}
        selectable="multi"
        selectedIds={[]}
        onSelectionChange={onChange}
        bulkActions={[{ id: "del", label: "Delete", onRun }]}
      />,
    );
    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });
});

// ── Config variant ────────────────────────────────────────────────────────────

describe("ModuleTemplate — config variant", () => {
  it("renders sections with nav", () => {
    render(
      <ModuleTemplate
        variant="config"
        header={{ title: "Settings" }}
        sections={[
          { id: "general", label: "General", render: () => <p>general body</p> },
          { id: "auth", label: "Auth", render: () => <p>auth body</p> },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "General" })).toBeTruthy();
    expect(screen.getByText("general body")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Auth" }));
    expect(screen.getByText("auth body")).toBeTruthy();
  });
});

// ── Monitor variant ───────────────────────────────────────────────────────────

const kpis: KpiDef[] = [
  { id: "kpi1", label: "Active users", value: "1,234", delta: "+12%" },
  { id: "kpi2", label: "Revenue", value: "$5,678" },
];

const chartCards: ChartCardDef[] = [
  { id: "c1", heading: "Trend", render: () => <div data-testid="chart-c1">chart</div> },
];

describe("ModuleTemplate — monitor variant", () => {
  it("renders KPI tiles and chart cards", () => {
    render(
      <ModuleTemplate
        variant="monitor"
        header={{ title: "Health" }}
        kpis={kpis}
        chartCards={chartCards}
      />,
    );
    expect(screen.getByText("Active users")).toBeTruthy();
    expect(screen.getByText("1,234")).toBeTruthy();
    expect(screen.getByText("+12%")).toBeTruthy();
    expect(screen.getByTestId("chart-c1")).toBeTruthy();
  });

  it("falls back to emptyState when no kpis and no chartCards", () => {
    render(
      <ModuleTemplate
        variant="monitor"
        header={{ title: "Health" }}
        emptyState={<p>nothing here</p>}
      />,
    );
    expect(screen.getByText("nothing here")).toBeTruthy();
  });
});

// ── Review variant ────────────────────────────────────────────────────────────

describe("ModuleTemplate — review variant", () => {
  it("invokes onApprove with the original item", () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    render(
      <ModuleTemplate
        variant="review"
        header={{ title: "Pending" }}
        items={[{ id: "x", title: "X item" }]}
        onApprove={onApprove}
        onReject={onReject}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(onApprove).toHaveBeenCalledWith({ id: "x", title: "X item" });
  });

  it("renders custom review actions", () => {
    const customFn = vi.fn();
    render(
      <ModuleTemplate
        variant="review"
        header={{ title: "Pending" }}
        items={[{ id: "x", title: "X item" }]}
        onApprove={() => {}}
        onReject={() => {}}
        reviewActions={[{ id: "snooze", label: "Snooze", onAction: customFn }]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Snooze" }));
    expect(customFn).toHaveBeenCalledWith({ id: "x", title: "X item" });
  });
});

// ── Detail variant ────────────────────────────────────────────────────────────

describe("ModuleTemplate — detail variant", () => {
  it("renders children inside the body", () => {
    render(
      <ModuleTemplate
        variant="detail"
        header={{ title: "Invoice 42" }}
      >
        <p data-testid="detail-body">Body content</p>
      </ModuleTemplate>,
    );
    expect(screen.getByTestId("detail-body")).toBeTruthy();
  });
});

// ── Auth variant ──────────────────────────────────────────────────────────────

describe("ModuleTemplate — auth variant", () => {
  it("renders form, error, footer, and brand attribute", () => {
    const { container } = render(
      <ModuleTemplate
        variant="auth"
        header={{ title: "Sign in" }}
        authBrand="recruitment"
        authError="Invalid credentials"
        authForm={<form><input aria-label="Email" /></form>}
        authFooter={<a href="/forgot">Forgot?</a>}
      />,
    );
    expect(screen.getByRole("alert").textContent).toContain("Invalid credentials");
    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByText("Forgot?")).toBeTruthy();
    expect(
      container.querySelector('[data-brand="recruitment"]'),
    ).toBeTruthy();
  });
});

// ── Home variant ──────────────────────────────────────────────────────────────

describe("ModuleTemplate — home variant", () => {
  it("renders homepage cards filtered by viewer roles", () => {
    render(
      <ModuleTemplate
        variant="home"
        header={{ title: "Welcome" }}
        viewerRoles={["admin"]}
        homepageCards={[
          { id: "a", title: "Admin only", roles: ["admin"], render: () => <p>admin body</p> },
          { id: "b", title: "Manager only", roles: ["manager"], render: () => <p>mgr body</p> },
          { id: "c", title: "Everyone", render: () => <p>everyone body</p> },
        ]}
      />,
    );
    expect(screen.getByText("Admin only")).toBeTruthy();
    expect(screen.queryByText("Manager only")).toBeNull();
    expect(screen.getByText("Everyone")).toBeTruthy();
  });
});

// ── Tabs ──────────────────────────────────────────────────────────────────────

describe("ModuleTemplate — tabs", () => {
  it("renders a tablist with the supplied tabs and shows count badges", () => {
    render(
      <ModuleTemplate
        variant="list"
        header={{ title: "Workspace" }}
        rows={rows}
        columns={columns}
        tabs={[
          { id: "overview", label: "Overview", count: 3, content: <p>overview-body</p> },
          { id: "people", label: "People", content: <p>people-body</p> },
        ]}
      />,
    );
    const tablist = screen.getByRole("tablist");
    expect(tablist.getAttribute("aria-label")).toContain("Workspace");
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("overview-body")).toBeTruthy();
  });

  it("switches active tab on click and panel updates", () => {
    render(
      <ModuleTemplate
        variant="detail"
        header={{ title: "Workspace" }}
        tabs={[
          { id: "a", label: "A", content: <p>panel-a</p> },
          { id: "b", label: "B", content: <p>panel-b</p> },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: "B" }));
    expect(screen.getByText("panel-b")).toBeTruthy();
    expect(screen.queryByText("panel-a")).toBeNull();
  });

  it("supports arrow-key navigation", () => {
    render(
      <ModuleTemplate
        variant="detail"
        header={{ title: "Tabs" }}
        tabs={[
          { id: "a", label: "A", content: <p>a</p> },
          { id: "b", label: "B", content: <p>b</p> },
          { id: "c", label: "C", content: <p>c</p> },
        ]}
      />,
    );
    const tabA = screen.getByRole("tab", { name: "A" });
    fireEvent.keyDown(tabA, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "B" }).getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(screen.getByRole("tab", { name: "B" }), { key: "End" });
    expect(screen.getByRole("tab", { name: "C" }).getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(screen.getByRole("tab", { name: "C" }), { key: "Home" });
    expect(screen.getByRole("tab", { name: "A" }).getAttribute("aria-selected")).toBe("true");
  });
});

// ── Top-level loading/error ───────────────────────────────────────────────────

describe("ModuleTemplate — top-level error", () => {
  it("renders error region instead of the variant body", () => {
    render(
      <ModuleTemplate
        variant="list"
        header={{ title: "Items" }}
        rows={rows}
        columns={columns}
        error="Something broke"
      />,
    );
    expect(screen.getByRole("alert").textContent).toContain("Something broke");
    expect(screen.queryByText("Alpha")).toBeNull();
  });
});

// ── Source metadata ───────────────────────────────────────────────────────────

describe("ModuleTemplate — source metadata", () => {
  it("surfaces source.model and source.promptVersion as data attributes", () => {
    const { container } = render(
      <ModuleTemplate
        variant="detail"
        header={{ title: "Brief" }}
        source={{ model: "claude-opus-4-7", promptVersion: "v3" }}
      >
        <p>body</p>
      </ModuleTemplate>,
    );
    const root = container.querySelector(".cc-module-template");
    expect(root?.getAttribute("data-source-model")).toBe("claude-opus-4-7");
    expect(root?.getAttribute("data-source-prompt-version")).toBe("v3");
  });
});
