import type { FieldPrimitiveProps } from './types.js';
export interface SelectOption<T extends string = string> {
    value: T;
    label: string;
}
export interface SelectFieldProps<T extends string = string> extends FieldPrimitiveProps<T> {
    options: SelectOption<T>[] | ((values: Record<string, unknown>) => SelectOption<T>[]);
    placeholder?: string;
}
export declare function SelectField<T extends string = string>({ name, form, label, hint, required, disabled, readOnly, options, placeholder, }: SelectFieldProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectField.d.ts.map