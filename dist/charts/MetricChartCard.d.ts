export type ChartSeriesKind = 'bar' | 'line';
export type ChartRenderKind = 'bar' | 'line' | 'composed';
export interface ChartAxisMeta {
    key?: string;
    unit?: string;
    label?: string;
    isDate?: boolean;
}
export interface ChartSeriesMeta {
    key: string;
    label: string;
    kind: ChartSeriesKind;
    color: string;
    stackId?: string;
    defaultVisible?: boolean;
    unit?: string;
}
export interface MetricMeta {
    id: string;
    title: string;
    source: string;
    freshness: string;
    definition: string;
    info?: string;
    chartKind?: ChartRenderKind;
    axes?: {
        x?: ChartAxisMeta;
        y?: ChartAxisMeta;
    };
    series?: ChartSeriesMeta[];
}
export interface ChartCardData<T = Record<string, unknown>> {
    meta: MetricMeta;
    summary: Record<string, unknown>;
    data: T[];
}
export declare function MetricChartCard({ card, heightClassName, }: {
    card: ChartCardData;
    heightClassName?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MetricChartCard.d.ts.map