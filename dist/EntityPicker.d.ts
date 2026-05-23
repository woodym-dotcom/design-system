/**
 * EntityPicker — standalone search + inline-create combobox primitive.
 *
 * DS-SIMPLIFY 07.
 *
 * Supports single and multi-select typeahead with optional inline entity
 * creation via Overlay (placement='modal') + EntityForm. On submit, the
 * new entity is auto-selected.
 *
 * ARIA: combobox pattern (role="combobox" input + role="listbox" popup).
 * Focus trap is owned by Overlay when the create modal is open.
 */
import * as React from 'react';
import type { EntitySchema } from './entity-form/schema';
export interface EntityPickerProps<E> {
    search: (query: string) => Promise<E[]>;
    renderOption: (e: E) => React.ReactNode;
    value: E | E[] | null;
    onChange: (v: E | E[] | null) => void;
    multi?: boolean;
    allowCreate?: boolean;
    createSchema?: EntitySchema<any>;
    onCreate?: (draft: Partial<E>) => Promise<E>;
    placeholder?: string;
    emptyText?: string;
}
export declare function EntityPicker<E>(props: EntityPickerProps<E>): React.ReactElement;
//# sourceMappingURL=EntityPicker.d.ts.map