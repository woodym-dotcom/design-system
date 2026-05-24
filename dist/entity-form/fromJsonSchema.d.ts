/**
 * fromJsonSchema -- RJSF bridge for EntityForm.
 *
 * DS-MIG P1-06. Converts a JSON Schema object into EntityForm field
 * definitions (FieldMeta map + Zod shape) so consumers with existing
 * JSON Schema can adopt EntityForm without manual field definitions.
 *
 * Usage:
 *   import { fromJsonSchema } from '@ds/core/react/EntityForm';
 *   const { zodShape, fieldMeta } = fromJsonSchema(jsonSchema);
 *   const schema = buildEntitySchema(zodShape, { fieldMeta });
 *
 * Supported JSON Schema types:
 *   string, number, integer, boolean, array (of strings -> multi-select)
 *
 * Unsupported features fall back to 'text' field type.
 */
import { z } from 'zod';
import type { FieldMeta } from './schema.js';
export interface JsonSchemaProperty {
    type?: string | string[];
    title?: string;
    description?: string;
    enum?: unknown[];
    format?: string;
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    items?: {
        type?: string;
        enum?: unknown[];
    };
    default?: unknown;
    /** RJSF-specific: UI schema hints. */
    'ui:widget'?: string;
}
export interface JsonSchema {
    type?: string;
    title?: string;
    description?: string;
    properties?: Record<string, JsonSchemaProperty>;
    required?: string[];
    additionalProperties?: boolean;
}
export interface FromJsonSchemaResult {
    /** Zod raw shape suitable for buildEntitySchema(). */
    zodShape: Record<string, z.ZodTypeAny>;
    /** FieldMeta map suitable for buildEntitySchema({ fieldMeta }). */
    fieldMeta: Record<string, FieldMeta>;
}
/**
 * Convert a JSON Schema to EntityForm-compatible field definitions.
 *
 * @param schema - A JSON Schema object (draft-07 subset).
 * @returns An object with `zodShape` and `fieldMeta` for buildEntitySchema().
 */
export declare function fromJsonSchema(schema: JsonSchema): FromJsonSchemaResult;
//# sourceMappingURL=fromJsonSchema.d.ts.map