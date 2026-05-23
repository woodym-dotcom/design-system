import type { FieldPrimitiveProps } from './types';
export interface SearchResult {
    value: string;
    label: string;
}
export interface EntityReferenceFieldProps extends FieldPrimitiveProps<string> {
    search: (query: string) => Promise<SearchResult[]>;
    placeholder?: string;
    /** Pre-resolved label for an existing `value` (edit mode). */
    initialLabel?: string;
}
export declare function EntityReferenceField({ name, form, label, hint, required, disabled, search, placeholder, initialLabel }: EntityReferenceFieldProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=EntityReferenceField.d.ts.map