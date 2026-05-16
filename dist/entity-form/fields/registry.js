const registry = new Map();
export function registerFieldType(type, component) {
    registry.set(type, component);
}
export function getFieldTypeComponent(type) {
    return registry.get(type);
}
//# sourceMappingURL=registry.js.map