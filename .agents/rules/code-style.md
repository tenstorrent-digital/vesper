---
paths:
  - "**/*.{ts,tsx}"
---

# Code Style and Documentation

## Code Style

- Prefer functional components - avoid class components
- Do not use barrel exports (index.ts), prefer semantic file names
- Prefer explicit imports over wildcard imports (`* as`)
- All functions must be typed. Prefer `interface`
- All filenames (and directories) must be kebab-case

## Documentation

- All functions must have a JSDoc comment (docstring) describing their use. Example:
  ```ts
  /**
   * Adds 'bar' to string
   */
  export const foo = (a: string) => {
    return `${a}bar`;
  };
  ```
- Optionally, the following JSDoc tags may be used in addition to the above
  - `@description` - for long descriptions
  - `@example` - for example usage for complex functions
  - `@deprecated` - for deprecated functions that are marked for removal
  - `@see` - for references to other documentation
