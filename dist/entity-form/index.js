// Schema + types
export { buildEntitySchema, setOrchestratorBridge, getOrchestratorBridge } from './schema.js';
// JSON Schema bridge (DS-MIG P1-06)
export { fromJsonSchema } from './fromJsonSchema.js';
// Hook
export { useEntityForm } from './useEntityForm.js';
// Component
export { EntityForm } from './EntityForm.js';
// Registry + extension point (remains public — needed to register custom field types)
export { registerFieldType, getFieldTypeComponent } from './fields/registry.js';
/**
 * @deprecated Individual field components (TextField, NumberField, SelectField,
 * MultiSelectField, DateField, MoneyField, EntityReferenceField, RichTextField)
 * are no longer part of the public API.
 *
 * Use <EntityForm schema={...}> (schema-driven) or <FormField as="shell"> for
 * arbitrary child inputs instead. Direct component imports will be removed in
 * v1.0 (DS-SIMPLIFY 14).
 *
 * Internal barrel export — kept for EntityForm's own rendering; do NOT import
 * these from consuming apps.
 */
export { TextField } from './fields/TextField.js';
export { NumberField } from './fields/NumberField.js';
export { SelectField } from './fields/SelectField.js';
export { MultiSelectField } from './fields/MultiSelectField.js';
export { DateField } from './fields/DateField.js';
export { MoneyField } from './fields/MoneyField.js';
export { EntityReferenceField } from './fields/EntityReferenceField.js';
export { RichTextField } from './fields/RichTextField.js';
//# sourceMappingURL=index.js.map