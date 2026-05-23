/**
 * Field primitive kit — all wired to EntityFormHandle.
 * Each primitive:
 *  - Uses name prop as React key (stable, never value/error-derived).
 *  - Always-mounted error slot (min-height reserved in CSS) — G4 invariant.
 *  - No conditional unmount based on value/error.
 */
export { TextField } from './TextField.js';
export { NumberField } from './NumberField.js';
export { SelectField } from './SelectField.js';
export { MultiSelectField } from './MultiSelectField.js';
export { DateField } from './DateField.js';
export { MoneyField } from './MoneyField.js';
export { EntityReferenceField } from './EntityReferenceField.js';
export { RichTextField } from './RichTextField.js';
export { registerFieldType, getFieldTypeComponent } from './registry.js';
//# sourceMappingURL=index.js.map