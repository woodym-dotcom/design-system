/**
 * Graph stories — DS-SIMPLIFY 08
 *
 * One canonical story per layout for visual baselines.
 * Timeseries stories use self-contained fixtures; recharts is loaded lazily.
 */
import * as React from "react";
import { Graph } from "../react/Graph";

export default {
  title: "Primitives/Graph",
  component: Graph,
};

const TIMESERIES_POINTS = [
  { day: "2024-01-01", revenue: 420, cost: 120 },
  { day: "2024-01-02", revenue: 530, cost: 140 },
  { day: "2024-01-03", revenue: 490, cost: 130 },
  { day: "2024-01-04", revenue: 610, cost: 160 },
  { day: "2024-01-05", revenue: 580, cost: 150 },
  { day: "2024-01-06", revenue: 720, cost: 180 },
  { day: "2024-01-07", revenue: 690, cost: 170 },
];

const SPARK_VALUES = TIMESERIES_POINTS.map((p) => p.revenue);

// ── Sparkline ─────────────────────────────────────────────────────────────────

export function SparklineDefault() {
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>xs</div>
        <Graph layout="sparkline" size="xs" data={{ layout: "sparkline", values: SPARK_VALUES }} ariaLabel="Revenue trend xs" />
      </div>
      <div>
        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>sm</div>
        <Graph layout="sparkline" size="sm" data={{ layout: "sparkline", values: SPARK_VALUES }} ariaLabel="Revenue trend sm" />
      </div>
      <div>
        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>md (default)</div>
        <Graph layout="sparkline" size="md" data={{ layout: "sparkline", values: SPARK_VALUES }} ariaLabel="Revenue trend md" />
      </div>
      <div>
        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>lg</div>
        <Graph layout="sparkline" size="lg" data={{ layout: "sparkline", values: SPARK_VALUES }} ariaLabel="Revenue trend lg" />
      </div>
    </div>
  );
}

export function SparklineLoading() {
  return (
    <div style={{ padding: 24 }}>
      <Graph layout="sparkline" size="md" data={{ layout: "sparkline", values: SPARK_VALUES }} ariaLabel="Loading trend" loading />
    </div>
  );
}

// ── Tile ──────────────────────────────────────────────────────────────────────

export function TileDefault() {
  return (
    <div style={{ padding: 24, display: "flex", gap: 24, flexWrap: "wrap" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, minWidth: 120 }}>
          <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 8, textTransform: "uppercase" }}>{size}</div>
          <Graph
            layout="tile"
            size={size}
            data={{ layout: "tile", kpiValue: "4,201", kpiDelta: "+12%", values: SPARK_VALUES }}
            ariaLabel={`Revenue KPI ${size}`}
          />
        </div>
      ))}
    </div>
  );
}

export function TileEmpty() {
  return (
    <div style={{ padding: 24 }}>
      <Graph layout="tile" data={{ layout: "tile", values: [] }} ariaLabel="Empty tile" empty="No data yet" />
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

export function CardDefault() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Graph
        layout="card"
        size="md"
        data={{ layout: "card", points: TIMESERIES_POINTS, xKey: "day", lines: ["revenue", "cost"] }}
        title="Revenue vs Cost"
        subtitle="Daily, Jan 2024"
        ariaLabel="Revenue vs cost card"
      />
    </div>
  );
}

export function CardEmpty() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Graph
        layout="card"
        data={{ layout: "card", points: [] }}
        title="Empty chart"
        ariaLabel="Empty card"
        empty="No data available"
      />
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function DashboardDefault() {
  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <Graph
        layout="dashboard"
        size="md"
        data={{
          layout: "dashboard",
          points: TIMESERIES_POINTS,
          xKey: "day",
          bars: ["cost"],
          lines: ["revenue"],
        }}
        title="Revenue & Cost Dashboard"
        subtitle="Jan 2024"
        ariaLabel="Revenue and cost dashboard"
      />
    </div>
  );
}

// ── Heatmap ───────────────────────────────────────────────────────────────────

const HEATMAP_CELLS = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeks = ["W1", "W2", "W3", "W4"];
  return days.flatMap((row) =>
    weeks.map((col) => ({ row, col, value: Math.floor(Math.random() * 10) })),
  );
})();

export function HeatmapDefault() {
  return (
    <div style={{ padding: 24 }}>
      <Graph
        layout="heatmap"
        size="md"
        data={{ layout: "heatmap", cells: HEATMAP_CELLS }}
        title="Activity heatmap"
        ariaLabel="Weekly activity heatmap"
      />
    </div>
  );
}

export function HeatmapEmpty() {
  return (
    <div style={{ padding: 24 }}>
      <Graph
        layout="heatmap"
        data={{ layout: "heatmap", cells: [] }}
        ariaLabel="Empty heatmap"
        empty="No activity recorded"
      />
    </div>
  );
}

// ── Distribution ──────────────────────────────────────────────────────────────

const DIST_BINS = [
  { x0: 0, x1: 10, count: 3 },
  { x0: 10, x1: 20, count: 8 },
  { x0: 20, x1: 30, count: 15 },
  { x0: 30, x1: 40, count: 12 },
  { x0: 40, x1: 50, count: 6 },
  { x0: 50, x1: 60, count: 2 },
];

export function DistributionDefault() {
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <Graph
        layout="distribution"
        size="md"
        data={{ layout: "distribution", bins: DIST_BINS }}
        title="Score distribution"
        ariaLabel="Score distribution histogram"
      />
    </div>
  );
}

export function DistributionFromSamples() {
  const samples = Array.from({ length: 200 }, () => Math.random() * 100);
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <Graph
        layout="distribution"
        size="lg"
        data={{ layout: "distribution", samples, binCount: 20 }}
        title="Auto-binned samples"
        ariaLabel="Auto-binned distribution"
      />
    </div>
  );
}

// ── Force / Hierarchical stubs ────────────────────────────────────────────────

export function ForceStub() {
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <Graph
        layout="force"
        data={{ layout: "force", nodes: [{ id: "a" }, { id: "b" }], edges: [{ source: "a", target: "b" }] }}
        ariaLabel="Force network (stub)"
      />
    </div>
  );
}

export function HierarchicalStub() {
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <Graph
        layout="hierarchical"
        data={{
          layout: "hierarchical",
          nodes: [{ id: "root" }, { id: "child1" }, { id: "child2" }],
          edges: [{ source: "root", target: "child1" }, { source: "root", target: "child2" }],
        }}
        ariaLabel="Hierarchical tree (stub)"
      />
    </div>
  );
}

// ── Loading + Empty states grid ───────────────────────────────────────────────

export function AllLayoutsGrid() {
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 32 }}>
      <section>
        <h4 style={{ margin: "0 0 12px", fontSize: 13, opacity: 0.6 }}>Sparkline (xs–lg)</h4>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {(["xs", "sm", "md", "lg"] as const).map((s) => (
            <Graph key={s} layout="sparkline" size={s} data={{ layout: "sparkline", values: SPARK_VALUES }} ariaLabel={`Sparkline ${s}`} />
          ))}
        </div>
      </section>

      <section>
        <h4 style={{ margin: "0 0 12px", fontSize: 13, opacity: 0.6 }}>Tile</h4>
        <Graph layout="tile" data={{ layout: "tile", kpiValue: "4,201", kpiDelta: "+12%", values: SPARK_VALUES }} ariaLabel="Tile" />
      </section>

      <section style={{ maxWidth: 480 }}>
        <h4 style={{ margin: "0 0 12px", fontSize: 13, opacity: 0.6 }}>Card</h4>
        <Graph
          layout="card"
          data={{ layout: "card", points: TIMESERIES_POINTS, xKey: "day", lines: ["revenue"] }}
          title="Revenue"
          ariaLabel="Revenue card"
        />
      </section>

      <section style={{ maxWidth: 560 }}>
        <h4 style={{ margin: "0 0 12px", fontSize: 13, opacity: 0.6 }}>Dashboard</h4>
        <Graph
          layout="dashboard"
          data={{ layout: "dashboard", points: TIMESERIES_POINTS, xKey: "day", bars: ["cost"], lines: ["revenue"] }}
          title="Revenue & Cost"
          ariaLabel="Dashboard"
        />
      </section>

      <section>
        <h4 style={{ margin: "0 0 12px", fontSize: 13, opacity: 0.6 }}>Heatmap</h4>
        <Graph layout="heatmap" data={{ layout: "heatmap", cells: HEATMAP_CELLS }} ariaLabel="Heatmap" />
      </section>

      <section style={{ maxWidth: 360 }}>
        <h4 style={{ margin: "0 0 12px", fontSize: 13, opacity: 0.6 }}>Distribution</h4>
        <Graph layout="distribution" data={{ layout: "distribution", bins: DIST_BINS }} ariaLabel="Distribution" />
      </section>

      <section>
        <h4 style={{ margin: "0 0 12px", fontSize: 13, opacity: 0.6 }}>Force / Hierarchical (stubs)</h4>
        <div style={{ display: "flex", gap: 16 }}>
          <Graph layout="force" data={{ layout: "force", nodes: [], edges: [] }} ariaLabel="Force stub" />
          <Graph layout="hierarchical" data={{ layout: "hierarchical", nodes: [], edges: [] }} ariaLabel="Hierarchical stub" />
        </div>
      </section>
    </div>
  );
}
