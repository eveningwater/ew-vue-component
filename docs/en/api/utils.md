# Utils API

Utility functions and helpers for EwVueComponent.

## isString

Checks if a value is a string.

### Type Signature

```typescript
function isString(value: unknown): value is string
```

### Parameters

- `value` - The value to check

### Returns

`boolean` - `true` if the value is a string, `false` otherwise

### Example

```typescript
import { isString } from 'ew-vue-component';

console.log(isString('hello')); // true
console.log(isString(123)); // false
console.log(isString(null)); // false
```

### Use Cases

This utility is commonly used for:
- Type checking in render functions
- Validating component props
- Runtime type assertions

```typescript
// Example in component logic
const MyComponent = {
  props: ['is'],
  render() {
    if (isString(this.is)) {
      // Handle string component
      return h(this.is, this.$attrs, this.$slots.default?.());
    }
    // Handle other component types
    return h(this.is, this.$attrs, this.$slots.default?.());
  }
};
```

## warn

Development warning utility for debugging and error reporting.

### Type Signature

```typescript
function warn(message: string, ...args: any[]): void
```

### Parameters

- `message` - The warning message
- `...args` - Additional arguments to log

### Returns

`void`

### Example

```typescript
import { warn } from 'ew-vue-component';

warn('Component failed to render', { component: 'MyComponent' });
// Console output: [EwVueComponent warn]: Component failed to render { component: 'MyComponent' }
```

### Behavior

- **Development**: Logs warnings to console with `[EwVueComponent warn]` prefix
- **Production**: No-op (warnings are stripped out)

### Use Cases

This utility is used for:
- Development debugging
- Component error reporting  
- Plugin development warnings

```typescript
// Example in plugin development
const myPlugin = {
  name: 'my-plugin',
  beforeRender(component, props, context) {
    if (!component) {
      warn('No component provided to render');
      return;
    }
    // Continue with render logic
  }
};
```

## Internal Utilities

These utilities are used internally by EwVueComponent and are exposed for advanced use cases:

### Type Guards

```typescript
// Check if value is a Vue component
function isComponent(value: unknown): boolean

// Check if value is a VNode
function isVNode(value: unknown): boolean

// Check if value is a function component
function isFunctionComponent(value: unknown): boolean
```

### Error Handling

```typescript
// Safe component rendering
function safeRender(component: Component, props: any, slots: any): VNode

// Error boundary utilities
function createErrorBoundary(fallback: Component): Component
```

## TypeScript Support

All utilities are fully typed and provide excellent TypeScript support:

```typescript
import type { UtilityFunction } from 'ew-vue-component';

// Type-safe usage
const checkString: UtilityFunction<string> = isString;
const value: unknown = 'hello';

if (isString(value)) {
  // TypeScript knows 'value' is string here
  console.log(value.toUpperCase());
}
```

## Best Practices

### 1. Use Type Guards

Always use `isString` for type checking instead of `typeof`:

```typescript
// ✅ Good
if (isString(component)) {
  return h(component);
}

// ❌ Avoid
if (typeof component === 'string') {
  return h(component);
}
```

### 2. Development Warnings

Use `warn` for development feedback:

```typescript
// ✅ Good - helps debugging
if (!props.is) {
  warn('Missing required prop "is"');
  return null;
}

// ❌ Avoid - silent failures
if (!props.is) {
  return null;
}
```

### 3. Error Handling

Combine utilities for robust error handling:

```typescript
const renderComponent = (component: unknown) => {
  if (isString(component)) {
    return h(component);
  }
  
  if (isComponent(component)) {
    return h(component);
  }
  
  warn('Invalid component type provided', { component });
  return null;
};
```

## 相关链接

- [Component API](/en/api/component) - Main component documentation
- [Plugin API](/en/api/plugin) - Plugin system documentation
- [Advanced Features](/en/guide/advanced-features) - Advanced usage patterns 