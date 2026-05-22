import type { FieldPrimitiveProps } from './types.js';
export interface SelectOption<T extends string = string> {
    value: T;
    label: string;
}
export interface SelectFieldProps<T extends string = string> extends FieldPrimitiveProps<T> {
    options: SelectOption<T>[] | ((values: Record<string, unknown>) => SelectOption<T>[]);
    placeholder?: string;
    /** When true, renders as a combobox with typeahead filtering instead of a plain <select>. */
    searchable?: boolean;
    /**
     * Maximum number of options to show in the searchable dropdown at once.
     * Defaults to 8. Only used when `searchable=true`.
     */
    maxVisible?: number;
    /**
     * Custom filter predicate for the searchable combobox.
     * Receives the option and the current query string; return true to include.
     * Defaults to case-insensitive substring match on option.label.
     */
    filter?: (option: SelectOption<T>, query: string) => boolean;
}
export declare function SelectField<T extends string = string>({ name, form, label, hint, required, disabled, readOnly, options, placeholder, searchable, maxVisible, filter, }: SelectFieldProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectField.d.ts.map