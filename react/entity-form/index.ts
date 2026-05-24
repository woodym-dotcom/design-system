// Schema + types
export { buildEntitySchema, setOrchestratorBridge, getOrchestratorBridge } from './schema';

// JSON Schema bridge (DS-MIG P1-06)
export { fromJsonSchema } from './fromJsonSchema';
export type { JsonSchema, JsonSchemaProperty, FromJsonSchemaResult } from './fromJsonSchema';
export type {
  EntitySchema,
  FieldType,
  FieldMeta,
  AsyncValidator,
  AiReviewInput,
  AiReviewOutput,
  AiReviewSuggestion,
  AiReviewQuestion,
  AiReviewBlocker,
  OrchestratorBridge,
} from './schema';

// Hook
export { useEntityForm } from './useEntityForm';
export type { EntityFormHandle } from './useEntityForm';

// Component
export { EntityForm } from './EntityForm';
export type {
  EntityFormProps,
  WizardStepDef,
  WizardStepRenderCtx,
  AiReviewConfig,
} from './EntityForm';

// Registry + extension point (remains public — needed to register custom field types)
export { registerFieldType, getFieldTypeComponent } from './fields/registry';
export type { FieldPrimitiveProps } from './fields/types';

// Field-specific types are still exported for consumers that need them in type
// positions, even though the component implementations are no longer public.
export type { SelectOption } from './fields/SelectField';
export type { MoneyValue } from './fields/MoneyField';
export type { SearchResult } from './fields/EntityReferenceField';

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
