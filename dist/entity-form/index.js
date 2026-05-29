// ── EntityForm public surface ───────────────────────────────────────────────
//
// Functions: schema builders, orchestrator bridge, JSON-Schema adapter, hook,
// component, and the custom-field-type registry. Types are deliberately
// minimised — only the six most-used are exported. Internal types remain in
// the source files but are not part of the public API.
// Schema + orchestrator bridge
export { buildEntitySchema, setOrchestratorBridge, getOrchestratorBridge } from './schema.js';
// JSON Schema bridge
export { fromJsonSchema } from './fromJsonSchema.js';
// Hook
export { useEntityForm } from './useEntityForm.js';
// Component
export { EntityForm } from './EntityForm.js';
// Registry + extension point
export { registerFieldType, getFieldTypeComponent } from './fields/registry.js';
// Internal field-component barrel — re-exported so EntityForm's renderer can
// import them via this barrel. They are NOT part of the public API. Consumers
// should use <EntityForm schema={...}> or <FormField as="shell"> instead.
export { TextField } from './fields/TextField.js';
export { NumberField } from './fields/NumberField.js';
export { SelectField } from './fields/SelectField.js';
export { MultiSelectField } from './fields/MultiSelectField.js';
export { DateField } from './fields/DateField.js';
export { MoneyField } from './fields/MoneyField.js';
export { EntityReferenceField } from './fields/EntityReferenceField.js';
export { RichTextField } from './fields/RichTextField.js';
//# sourceMappingURL=index.js.map