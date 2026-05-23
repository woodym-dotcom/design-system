import type { EntityFormHandle } from '../useEntityForm';
export interface FieldPrimitiveProps<_T = unknown> {
    name: string;
    form: EntityFormHandle<any>;
    label?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
}
//# sourceMappingURL=types.d.ts.map