/**
 * Field type registry — allows consumers to register custom field types.
 * Called at app bootstrap: registerFieldType('party-picker', PartyPickerField).
 */
import * as React from 'react';
import type { FieldPrimitiveProps } from './types';

const registry = new Map<string, React.ComponentType<FieldPrimitiveProps<any>>>();

export function registerFieldType(
  type: string,
  component: React.ComponentType<FieldPrimitiveProps<any>>,
): void {
  registry.set(type, component);
}

export function getFieldTypeComponent(
  type: string,
): React.ComponentType<FieldPrimitiveProps<any>> | undefined {
  return registry.get(type);
}
