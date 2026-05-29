// ── EntityForm public surface ───────────────────────────────────────────────
//
// Functions: schema builders, orchestrator bridge, JSON-Schema adapter, hook,
// component, and the custom-field-type registry. Types are deliberately
// minimised — only the six most-used are exported. Internal types remain in
// the source files but are not part of the public API.

// Schema + orchestrator bridge
export { buildEntitySchema, setOrchestratorBridge, getOrchestratorBridge } from './schema';

// JSON Schema bridge
export { fromJsonSchema } from './fromJsonSchema';

// Hook
export { useEntityForm } from './useEntityForm';

// Component
export { EntityForm } from './EntityForm';

// Registry + extension point
export { registerFieldType, getFieldTypeComponent } from './fields/registry';

// ── Public type surface (6 types) ───────────────────────────────────────────
export type { EntityFormProps } from './EntityForm';
export type { EntityFormHandle } from './useEntityForm';
export type { EntitySchema, FieldType, FieldMeta } from './schema';
export type { SelectOption } from './fields/SelectField';

// Internal field-component barrel — re-exported so EntityForm's renderer can
// import them via this barrel. They are NOT part of the public API. Consumers
// should use <EntityForm schema={...}> or <FormField as="shell"> instead.
export { TextField } from './fields/TextField';
export { NumberField } from './fields/NumberField';
export { SelectField } from './fields/SelectField';
export { MultiSelectField } from './fields/MultiSelectField';
export { DateField } from './fields/DateField';
export { MoneyField } from './fields/MoneyField';
export { EntityReferenceField } from './fields/EntityReferenceField';
export { RichTextField } from './fields/RichTextField';
