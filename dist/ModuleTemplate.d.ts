import type { ModuleTemplateProps } from "./ModuleTemplate.types.js";
export type { ModuleTemplateProps, ModuleTemplateTab, ModuleTemplateHeader, ModuleTemplateVariant, ListVariantProps, ConfigVariantProps, MonitorVariantProps, ReviewVariantProps, DetailVariantProps, AuthVariantProps, HomeVariantProps, ColumnDef, FilterDef, PaginationProps, KpiDef, ChartCardDef, ConfigSection, ReviewActionDef, ReviewItem, ListDetailSlot, SelectionMode, ModuleTemplateBrandKey, } from "./ModuleTemplate.types.js";
/**
 * ModuleTemplate — render any module page surface from a single primitive.
 * See `ModuleTemplate.types.ts` for the discriminated-union prop contract.
 */
export declare function ModuleTemplate<Row extends {
    id: string;
} = {
    id: string;
}>(props: ModuleTemplateProps<Row>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ModuleTemplate.d.ts.map