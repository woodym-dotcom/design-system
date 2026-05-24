/**
 * CommanderView — three-pane incident command layout.
 *
 * Provides a structured layout for incident response and entity investigation:
 *   Left pane:   entity list (selectable)
 *   Center pane:  entity detail
 *   Right pane:  activity timeline
 *
 * Each pane accepts arbitrary children; the layout handles sizing, dividers,
 * and responsive collapse behaviour.
 *
 * Usage:
 *   <CommanderView
 *     list={<EntityList items={items} />}
 *     detail={<EntityDetail entity={selected} />}
 *     timeline={<ActivityTimeline entries={events} />}
 *   />
 */
import * as React from "react";
/** Circuit breaker status for the CB overlay. */
export type CircuitBreakerState = "closed" | "open" | "half-open";
/** A vendor cohort lane rendered alongside the three main panes. */
export interface VendorCohortLane {
    id: string;
    label: string;
    content: React.ReactNode;
}
export interface CommanderViewProps {
    /** Left pane — typically an entity list. */
    list: React.ReactNode;
    /** Center pane — entity detail / main content. */
    detail: React.ReactNode;
    /** Right pane — timeline / activity feed. */
    timeline: React.ReactNode;
    /** Relative width ratios for [list, detail, timeline]. Default: [1, 2, 1]. */
    ratios?: [number, number, number];
    /** Minimum width for each pane in px. Default: 200. */
    minPaneWidth?: number;
    /** Panel heading shown above the layout. */
    title?: string;
    /** ARIA label for the landmark region. */
    "aria-label"?: string;
    /**
     * Circuit breaker overlay — renders a status badge in the header
     * and optional detail node when the CB is not closed.
     */
    circuitBreaker?: {
        state: CircuitBreakerState;
        label?: string;
        detail?: React.ReactNode;
    };
    /** Vendor cohort lane columns rendered after the timeline pane. */
    vendorLanes?: VendorCohortLane[];
    className?: string;
}
export declare function CommanderView({ list, detail, timeline, ratios, minPaneWidth, title, circuitBreaker, vendorLanes, className, ...rest }: CommanderViewProps): React.ReactElement;
//# sourceMappingURL=CommanderView.d.ts.map