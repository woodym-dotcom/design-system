import type { FieldPrimitiveProps } from './types';
export interface RichTextFieldProps extends FieldPrimitiveProps<string> {
    rows?: number;
    placeholder?: string;
    aiSuggest?: {
        agentName: string;
        buildInput: (value: string, formValues: Record<string, unknown>) => Record<string, unknown>;
    };
}
export declare function RichTextField({ name, form, label, hint, required, disabled, readOnly, rows, placeholder }: RichTextFieldProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=RichTextField.d.ts.map