/**
 * FullScreenDetail — sticky-header + scrollable-body layout for full-screen
 * detail surfaces (drilldown expansion, modal-equivalent pages).
 *
 * Composes Breadcrumbs at the top of the sticky header, the title +
 * eyebrow + actions row, optional sticky tabs strip, the scrollable body,
 * and an optional sticky bottom bar.
 */
import * as React from "react";
import { type BreadcrumbItem } from "./Breadcrumbs.js";
import { type TabItem } from "./Tabs.js";
export interface FullScreenDetailProps<T extends string = string> {
    breadcrumbs: BreadcrumbItem[];
    title: React.ReactNode;
    eyebrow?: React.ReactNode;
    actions?: React.ReactNode;
    headerMeta?: React.ReactNode;
    tabs?: {
        items: TabItem<T>[];
        value: T;
        onChange?: (next: T) => void;
    };
    children: React.ReactNode;
    bottomBar?: React.ReactNode;
    onClose?: () => void;
    className?: string;
}
/**
 * @deprecated Since DS-SIMPLIFY 01. Use `<Overlay placement="fullscreen">`
 *   instead. Removed at v1.0 (DS-SIMPLIFY 14).
 */
export declare function FullScreenDetail<T extends string = string>({ breadcrumbs, title, eyebrow, actions, headerMeta, tabs, children, bottomBar, onClose, className, }: FullScreenDetailProps<T>): React.ReactElement;
//# sourceMappingURL=FullScreenDetail.d.ts.map