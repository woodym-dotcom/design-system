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
// ── Mapping logic ───────────────────────────────────────────────────────────
function jsonTypeToFieldType(prop) {
    const type = Array.isArray(prop.type) ? prop.type[0] : prop.type;
    if (prop.enum)
        return 'select';
    if (prop.format === 'date' || prop.format === 'date-time')
        return 'date';
    if (type === 'array' && prop.items?.enum)
        return 'multi-select';
    if (type === 'number' || type === 'integer')
        return 'number';
    if (prop.format === 'uri' || prop.format === 'email')
        return 'text';
    if (type === 'string')
        return 'text';
    if (type === 'boolean')
        return 'select'; // Render as Yes/No select
    return 'text';
}
function jsonPropertyToZod(prop, isRequired) {
    const type = Array.isArray(prop.type) ? prop.type[0] : prop.type;
    let schema;
    if (prop.enum) {
        const values = prop.enum.map(String);
        schema = z.enum(values);
    }
    else if (type === 'number' || type === 'integer') {
        let num = z.number();
        if (prop.minimum !== undefined)
            num = num.min(prop.minimum);
        if (prop.maximum !== undefined)
            num = num.max(prop.maximum);
        schema = num;
    }
    else if (type === 'boolean') {
        schema = z.boolean();
    }
    else if (type === 'array') {
        if (prop.items?.enum) {
            const values = prop.items.enum.map(String);
            schema = z.array(z.enum(values));
        }
        else {
            schema = z.array(z.string());
        }
    }
    else {
        // Default: string
        let str = z.string();
        if (prop.minLength !== undefined)
            str = str.min(prop.minLength);
        if (prop.maxLength !== undefined)
            str = str.max(prop.maxLength);
        if (prop.pattern)
            str = str.regex(new RegExp(prop.pattern));
        schema = str;
    }
    if (!isRequired) {
        schema = schema.optional();
    }
    return schema;
}
// ── Public API ──────────────────────────────────────────────────────────────
/**
 * Convert a JSON Schema to EntityForm-compatible field definitions.
 *
 * @param schema - A JSON Schema object (draft-07 subset).
 * @returns An object with `zodShape` and `fieldMeta` for buildEntitySchema().
 */
export function fromJsonSchema(schema) {
    const properties = schema.properties ?? {};
    const required = new Set(schema.required ?? []);
    const zodShape = {};
    const fieldMeta = {};
    for (const [key, prop] of Object.entries(properties)) {
        const isRequired = required.has(key);
        zodShape[key] = jsonPropertyToZod(prop, isRequired);
        fieldMeta[key] = {
            label: prop.title ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
            hint: prop.description,
            required: isRequired,
            fieldType: jsonTypeToFieldType(prop),
        };
    }
    return { zodShape, fieldMeta };
}
//# sourceMappingURL=fromJsonSchema.js.map