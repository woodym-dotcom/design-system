/**
 * Graph — unified data-visualization primitive (DS-SIMPLIFY 08).
 *
 * One component, eight `layout` variants:
 *   sparkline | tile | card | dashboard | heatmap | distribution | force* | hierarchical*
 *
 * (* force / hierarchical stub to "Coming in v1.1" — @xyflow/react is not a
 *    peer dep; will be added in SIMPLIFY 14 scope.)
 *
 * Timeseries layouts (sparkline/tile/card/dashboard) delegate to the existing
 * Recharts wrappers internally to preserve pixel parity with legacy components.
 * Heatmap and distribution are pure-SVG with no external dependency beyond React.
 *
 * @see Graph.types.ts for full prop / data-shape documentation.
 */
import * as React from "react";
import type { GraphProps } from "./Graph.types";
/**
 * Graph — unified data-visualization primitive.
 *
 * @example
 * // Sparkline
 * <Graph layout="sparkline" data={{ layout: "sparkline", values: [1,4,2,8] }} ariaLabel="Trend" />
 *
 * @example
 * // KPI tile
 * <Graph layout="tile" data={{ layout: "tile", kpiValue: "4,201", kpiDelta: "+12%", values: [1,4,2,8] }} ariaLabel="Revenue" />
 *
 * @example
 * // Heatmap
 * <Graph layout="heatmap" data={{ layout: "heatmap", cells: [{row:"Mon",col:"W1",value:3}] }} ariaLabel="Activity" />
 */
export declare function Graph({ layout, size, data, title, subtitle, legend: _legend, empty, loading, onClick, ariaLabel, source: _source, }: GraphProps): React.ReactElement | null;
//# sourceMappingURL=Graph.d.ts.map