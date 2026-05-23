import type { FieldPrimitiveProps } from './types';
export interface NumberFieldProps extends FieldPrimitiveProps<number> {
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
}
export declare function NumberField({ name, form, label, hint, required, disabled, readOnly, min, max, step, placeholder }: NumberFieldProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=NumberField.d.ts.map