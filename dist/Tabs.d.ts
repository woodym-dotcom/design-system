/**
 * Tabs — generic tablist with roving tabindex and arrow-key navigation.
 *
 * "Activate on focus": arrow keys move focus AND fire onChange. Home/End
 * jump to the first/last enabled tab. Disabled tabs are skipped.
 *
 * Tabs is purely presentational — it does not own panel rendering. Pair it
 * with your own conditional render of the active panel keyed by `value`.
 */
import * as React from "react";
export interface TabItem<T extends string = string> {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
    /** Optional count badge rendered after the label. */
    count?: number;
}
export interface TabsProps<T extends string = string> {
    items: TabItem<T>[];
    value: T;
    onChange?: (next: T) => void;
    ariaLabel?: string;
    className?: string;
    /** Optional id, used to associate panels via aria-controls. */
    id?: string;
}
export declare function Tabs<T extends string = string>({ items, value, onChange, ariaLabel, className, id, }: TabsProps<T>): React.ReactElement;
//# sourceMappingURL=Tabs.d.ts.map