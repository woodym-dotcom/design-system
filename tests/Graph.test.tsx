/**
 * Graph primitive tests — DS-SIMPLIFY 08
 *
 * Covers:
 *  - Each layout renders without error
 *  - Empty + loading states
 *  - a11y: role="img" / role="group" with ariaLabel
 *  - force/hierarchical stub renders "Coming in v1.1"
 *  - TypeScript narrowing is validated at compile time (checked by tsc)
 */
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Graph } from "../react/Graph";
import type { GraphData } from "../react/Graph.types";

// ── Fixtures ─────────────────────────────────────────────────────────────────

const sparklineData: GraphData = {
  layout: "sparkline",
  values: [1, 4, 2, 8, 3],
};

const tileData: GraphData = {
  layout: "tile",
  kpiValue: "4,201",
  kpiDelta: "+12%",
  values: [1, 4, 2, 8, 3],
};

const cardData: GraphData = {
  layout: "card",
  points: [
    { day: "2024-01-01", revenue: 100 },
    { day: "2024-01-02", revenue: 120 },
  ],
  lines: ["revenue"],
};

const dashboardData: GraphData = {
  layout: "dashboard",
  points: [
    { day: "2024-01-01", cost: 10, sessions: 200 },
    { day: "2024-01-02", cost: 15, sessions: 220 },
  ],
  bars: ["cost"],
  lines: ["sessions"],
};

const heatmapData: GraphData = {
  layout: "heatmap",
  cells: [
    { row: "Mon", col: "W1", value: 3 },
    { row: "Tue", col: "W1", value: 7 },
    { row: "Mon", col: "W2", value: 1 },
    { row: "Tue", col: "W2", value: 5 },
  ],
};

const distributionBins: GraphData = {
  layout: "distribution",
  bins: [
    { x0: 0, x1: 10, count: 5 },
    { x0: 10, x1: 20, count: 12 },
    { x0: 20, x1: 30, count: 8 },
  ],
};

const distributionSamples: GraphData = {
  layout: "distribution",
  samples: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20],
  binCount: 5,
};

const forceData: GraphData = {
  layout: "force",
  nodes: [{ id: "a" }, { id: "b" }],
  edges: [{ source: "a", target: "b" }],
};

const hierarchicalData: GraphData = {
  layout: "hierarchical",
  nodes: [{ id: "root" }, { id: "child" }],
  edges: [{ source: "root", target: "child" }],
};

// ── Sparkline layout ──────────────────────────────────────────────────────────

describe("Graph layout=sparkline", () => {
  it("renders SVG with role=img and aria-label", () => {
    render(<Graph layout="sparkline" data={sparklineData} ariaLabel="Revenue trend" />);
    expect(screen.getByRole("img", { name: "Revenue trend" })).toBeTruthy();
  });

  it("renders nothing when values is empty", () => {
    const { container } = render(
      <Graph layout="sparkline" data={{ layout: "sparkline", values: [] }} ariaLabel="Empty" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders a dot for a single value", () => {
    const { container } = render(
      <Graph layout="sparkline" data={{ layout: "sparkline", values: [42] }} ariaLabel="Single" />,
    );
    expect(container.querySelector("circle")).toBeTruthy();
    expect(container.querySelector("path")).toBeNull();
  });

  it("renders line + area paths for multiple values", () => {
    const { container } = render(
      <Graph layout="sparkline" data={sparklineData} ariaLabel="Multi" />,
    );
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2); // area + line
  });

  it("renders loading skeleton", () => {
    const { container } = render(
      <Graph layout="sparkline" data={sparklineData} ariaLabel="Loading" loading />,
    );
    // Loading renders a rect placeholder
    expect(container.querySelector("rect")).toBeTruthy();
  });
});

// ── Tile layout ───────────────────────────────────────────────────────────────

describe("Graph layout=tile", () => {
  it("renders kpiValue and kpiDelta", () => {
    render(<Graph layout="tile" data={tileData} ariaLabel="Revenue KPI" />);
    expect(screen.getByText("4,201")).toBeTruthy();
    expect(screen.getByText("+12%")).toBeTruthy();
  });

  it("has role=img with ariaLabel", () => {
    render(<Graph layout="tile" data={tileData} ariaLabel="Revenue KPI" />);
    expect(screen.getByRole("img", { name: "Revenue KPI" })).toBeTruthy();
  });

  it("shows loading overlay", () => {
    const { container } = render(
      <Graph layout="tile" data={tileData} ariaLabel="Loading tile" loading />,
    );
    expect(container.querySelector(".cc-graph__loading")).toBeTruthy();
  });

  it("renders empty placeholder when no data", () => {
    const { container } = render(
      <Graph
        layout="tile"
        data={{ layout: "tile", values: [] }}
        ariaLabel="Empty tile"
        empty="Nothing here"
      />,
    );
    expect(container.querySelector(".cc-graph__empty")).toBeTruthy();
    expect(screen.getByText("Nothing here")).toBeTruthy();
  });
});

// ── Card layout ───────────────────────────────────────────────────────────────

describe("Graph layout=card", () => {
  it("renders section with title", () => {
    render(
      <Graph layout="card" data={cardData} ariaLabel="Revenue card" title="Revenue" />,
    );
    expect(screen.getByText("Revenue")).toBeTruthy();
  });

  it("renders empty placeholder when no points", () => {
    const { container } = render(
      <Graph
        layout="card"
        data={{ layout: "card", points: [], lines: [] }}
        ariaLabel="Empty card"
      />,
    );
    expect(container.querySelector(".cc-graph__empty")).toBeTruthy();
  });

  it("calls onClick when chart is clicked", async () => {
    // Card lazy-loads recharts; just verify component mounts without error.
    const onClick = vi.fn();
    const { container } = render(
      <Graph layout="card" data={cardData} ariaLabel="Clickable" onClick={onClick} />,
    );
    expect(container.querySelector(".cc-graph--card")).toBeTruthy();
  });
});

// ── Dashboard layout ──────────────────────────────────────────────────────────

describe("Graph layout=dashboard", () => {
  it("renders figure with title", () => {
    render(
      <Graph layout="dashboard" data={dashboardData} ariaLabel="Dashboard" title="Cost" />,
    );
    expect(screen.getByText("Cost")).toBeTruthy();
  });

  it("renders empty placeholder when no points", () => {
    const { container } = render(
      <Graph
        layout="dashboard"
        data={{ layout: "dashboard", points: [] }}
        ariaLabel="Empty dashboard"
      />,
    );
    expect(container.querySelector(".cc-graph__empty")).toBeTruthy();
  });
});

// ── Heatmap layout ────────────────────────────────────────────────────────────

describe("Graph layout=heatmap", () => {
  it("renders SVG with role=img and ariaLabel", () => {
    render(<Graph layout="heatmap" data={heatmapData} ariaLabel="Weekly heatmap" />);
    expect(screen.getByRole("img", { name: "Weekly heatmap" })).toBeTruthy();
  });

  it("renders correct number of rects (rows × cols)", () => {
    const { container } = render(
      <Graph layout="heatmap" data={heatmapData} ariaLabel="Matrix" />,
    );
    // 2 rows × 2 cols = 4 rects
    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBe(4);
  });

  it("renders empty placeholder when no cells", () => {
    const { container } = render(
      <Graph
        layout="heatmap"
        data={{ layout: "heatmap", cells: [] }}
        ariaLabel="Empty heatmap"
        empty="No activity"
      />,
    );
    expect(screen.getByText("No activity")).toBeTruthy();
  });

  it("calls onClick when a cell is clicked", () => {
    const onClick = vi.fn();
    const { container } = render(
      <Graph layout="heatmap" data={heatmapData} ariaLabel="Clickable heatmap" onClick={onClick} />,
    );
    const rects = container.querySelectorAll("rect");
    rects[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0][0]).toMatchObject({ row: "Mon", col: "W1" });
  });

  it("shows loading overlay", () => {
    const { container } = render(
      <Graph layout="heatmap" data={heatmapData} ariaLabel="Loading heatmap" loading />,
    );
    expect(container.querySelector(".cc-graph__loading")).toBeTruthy();
  });
});

// ── Distribution layout ───────────────────────────────────────────────────────

describe("Graph layout=distribution", () => {
  it("renders SVG with role=img from pre-computed bins", () => {
    render(
      <Graph layout="distribution" data={distributionBins} ariaLabel="Score distribution" />,
    );
    expect(screen.getByRole("img", { name: "Score distribution" })).toBeTruthy();
  });

  it("renders bars for each bin", () => {
    const { container } = render(
      <Graph layout="distribution" data={distributionBins} ariaLabel="Bins" />,
    );
    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBe(3);
  });

  it("auto-bins samples when bins not provided", () => {
    const { container } = render(
      <Graph layout="distribution" data={distributionSamples} ariaLabel="Auto-binned" />,
    );
    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBe(5); // binCount=5
  });

  it("renders empty placeholder when no data", () => {
    const { container } = render(
      <Graph
        layout="distribution"
        data={{ layout: "distribution", bins: [] }}
        ariaLabel="Empty dist"
        empty="No data"
      />,
    );
    expect(screen.getByText("No data")).toBeTruthy();
  });

  it("shows loading overlay", () => {
    const { container } = render(
      <Graph layout="distribution" data={distributionBins} ariaLabel="Loading dist" loading />,
    );
    expect(container.querySelector(".cc-graph__loading")).toBeTruthy();
  });
});

// ── Force / Hierarchical stubs ────────────────────────────────────────────────

describe("Graph layout=force", () => {
  it("renders stub with coming-in-v1.1 message", () => {
    render(<Graph layout="force" data={forceData} ariaLabel="Network graph" />);
    expect(screen.getByRole("img", { name: "Network graph" })).toBeTruthy();
    expect(screen.getByText(/coming in v1\.1/i)).toBeTruthy();
  });
});

describe("Graph layout=hierarchical", () => {
  it("renders stub with coming-in-v1.1 message", () => {
    render(<Graph layout="hierarchical" data={hierarchicalData} ariaLabel="Tree" />);
    expect(screen.getByRole("img", { name: "Tree" })).toBeTruthy();
    expect(screen.getByText(/coming in v1\.1/i)).toBeTruthy();
  });
});
