/**
 * Field primitive kit — all wired to EntityFormHandle.
 * Each primitive:
 *  - Uses name prop as React key (stable, never value/error-derived).
 *  - Always-mounted error slot (min-height reserved in CSS) — G4 invariant.
 *  - No conditional unmount based on value/error.
 */
export { TextField } from './TextField';
export { NumberField } from './NumberField';
export { SelectField } from './SelectField';
export { MultiSelectField } from './MultiSelectField';
export { DateField } from './DateField';
export { MoneyField } from './MoneyField';
export { EntityReferenceField } from './EntityReferenceField';
export { RichTextField } from './RichTextField';
export { registerFieldType, getFieldTypeComponent } from './registry';
//# sourceMappingURL=index.js.map