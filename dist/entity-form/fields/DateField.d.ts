import type { FieldPrimitiveProps } from './types.js';
export interface DateFieldProps extends FieldPrimitiveProps<string> {
    min?: string;
    max?: string;
}
export declare function DateField({ name, form, label, hint, required, disabled, readOnly, min, max }: DateFieldProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DateField.d.ts.map