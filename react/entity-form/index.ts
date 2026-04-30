// Schema + types
export { buildEntitySchema, setOrchestratorBridge, getOrchestratorBridge } from './schema';
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

// Field primitives
export { TextField } from './fields/TextField';
export { NumberField } from './fields/NumberField';
export { SelectField } from './fields/SelectField';
export { MultiSelectField } from './fields/MultiSelectField';
export { DateField } from './fields/DateField';
export { MoneyField } from './fields/MoneyField';
export { EntityReferenceField } from './fields/EntityReferenceField';
export { RichTextField } from './fields/RichTextField';
export { registerFieldType, getFieldTypeComponent } from './fields/registry';
export type { FieldPrimitiveProps } from './fields/types';
export type { SelectOption } from './fields/SelectField';
export type { MoneyValue } from './fields/MoneyField';
export type { SearchResult } from './fields/EntityReferenceField';
