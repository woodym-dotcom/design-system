// Schema + types
export { buildEntitySchema, setOrchestratorBridge, getOrchestratorBridge } from './schema';
// Hook
export { useEntityForm } from './useEntityForm';
// Component
export { EntityForm } from './EntityForm';
// Registry + extension point (remains public — needed to register custom field types)
export { registerFieldType, getFieldTypeComponent } from './fields/registry';
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
export { TextField } from './fields/TextField';
export { NumberField } from './fields/NumberField';
export { SelectField } from './fields/SelectField';
export { MultiSelectField } from './fields/MultiSelectField';
export { DateField } from './fields/DateField';
export { MoneyField } from './fields/MoneyField';
export { EntityReferenceField } from './fields/EntityReferenceField';
export { RichTextField } from './fields/RichTextField';
//# sourceMappingURL=index.js.map