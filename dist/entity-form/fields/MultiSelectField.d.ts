import type { FieldPrimitiveProps } from './types';
import type { SelectOption } from './SelectField';
export interface MultiSelectFieldProps extends FieldPrimitiveProps<string[]> {
    options: SelectOption[];
    placeholder?: string;
}
export declare function MultiSelectField({ name, form, label, hint, required, disabled, options, placeholder }: MultiSelectFieldProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MultiSelectField.d.ts.map