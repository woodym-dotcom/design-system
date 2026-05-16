/**
 * Field type registry — allows consumers to register custom field types.
 * Called at app bootstrap: registerFieldType('party-picker', PartyPickerField).
 */
import * as React from 'react';
import type { FieldPrimitiveProps } from './types.js';
export declare function registerFieldType(type: string, component: React.ComponentType<FieldPrimitiveProps<any>>): void;
export declare function getFieldTypeComponent(type: string): React.ComponentType<FieldPrimitiveProps<any>> | undefined;
//# sourceMappingURL=registry.d.ts.map