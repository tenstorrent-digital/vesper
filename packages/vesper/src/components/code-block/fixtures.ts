// Covers: keywords, storage types, interfaces, generics, type annotations,
// constants, enums, classes, decorators, functions, async/await, control flow,
// template literals, regex, numbers, strings, comments, operators, JSX,
// typeof, instanceof, try/catch, variable.other.constant, variable.language
export const SAMPLE_CODE_TYPESCRIPT = `/**
 * @module ComponentSystem
 * A comprehensive component system with state management.
 * Demonstrates various TypeScript language features.
 */

// Enum members, numeric constants
enum Status {
  Idle = 0,
  Loading = 1,
  Success = 2,
  Error = 0xff,
}

// Interface with generics, readonly, optional, mapped types
interface EventMap {
  readonly id: string;
  status: Status;
  timestamp?: number;
}

// Conditional types, infer, mapped types, template literal types
type ExtractKeys<T> = T extends Record<infer K, unknown> ? K : never;
type Nullable<T> = { [P in keyof T]: T[P] | null };
type EventName = \`on\${"Change" | "Reset"}\`;

// Constants with various literal types
const MAX_RETRIES = 3;
const PI = 3.14159;
const HEX_MASK = 0x1f;
const BINARY_FLAG = 0b1010;
const OCTAL_VAL = 0o755; // [!code --]
const SCIENTIFIC = 1.5e10; // [!code --]
const GREETING = "Hello, world!"; // [!code --]
const TEMPLATE = \`Status: \${Status.Loading} at \${Date.now()}\`;
const REGEX_PATTERN = /^[a-z]+\\d{2,4}$/gi; // [!code ++]

// Abstract class with decorator-style pattern
abstract class BaseComponent<T extends EventMap> {
  protected state: Nullable<T> | null = null;
  private static instanceCount = 0;

  constructor(readonly name: string) {
    BaseComponent.instanceCount++;
  }

  abstract render(): string;

  // Method with overloads
  emit(event: "change", data: T): void;
  emit(event: "reset"): void;
  emit(event: string, data?: T): void {
    if (typeof data !== "undefined") {
      console.log(\`[\${this.name}] \${event}:\`, data);
    }
  }
}

// Class extending abstract, implements pattern
class StateManager<S extends Record<string, unknown>>
  extends BaseComponent<EventMap>
{
  #internal: Map<string, S> = new Map();

  render(): string {
    return \`<StateManager instances=\${this.#internal.size} />\`;
  }

  async fetchState(url: string): Promise<S | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}\`);
      }
      const data: S = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      return null;
    }
  }

  *entries(): Generator<[string, S], void, undefined> {
    for (const [key, value] of this.#internal) {
      yield [key, value];
    }
  }
}

// Arrow functions, destructuring, spread, rest params
const createHandler = <T,>(
  ...middleware: Array<(ctx: T) => T>
): ((initial: T) => T) => {
  return (initial: T): T => {
    let result = initial;
    for (const fn of middleware) {
      result = fn(result);
    }
    return result;
  };
};

// Switch, type guards, type assertions
function processStatus(input: unknown): string {
  if (input === null || input === undefined) {
    return "empty";
  }

  switch (true) {
    case typeof input === "number":
      return (input as number) > 0 ? "positive" : "non-positive";
    case typeof input === "boolean":
      return input ? "truthy" : "falsy";
    case Array.isArray(input):
      return \`array[\${(input as unknown[]).length}]\`;
    default:
      return String(input);
  }
}

// Async generator, for-await-of
async function* streamEvents(
  count: number,
): AsyncGenerator<EventMap, void, unknown> {
  let i = 0;
  while (i < count) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    yield { id: \`evt_\${i}\`, status: Status.Success, timestamp: Date.now() };
    i++;
  }
}

// Usage with instanceof, delete, void, in operator
export async function main(): Promise<void> {
  const manager = new StateManager<{ value: number }>("app");

  if (manager instanceof BaseComponent) {
    manager.emit("change", {
      id: "init",
      status: Status.Idle,
      timestamp: Date.now(),
    });
  }

  for await (const event of streamEvents(MAX_RETRIES)) {
    if ("timestamp" in event && event.timestamp !== undefined) {
      void processStatus(event.status);
    }
  }

  const handler = createHandler<{ count: number }>(
    (ctx) => ({ ...ctx, count: ctx.count + 1 }),
    (ctx) => ({ ...ctx, count: ctx.count * 2 }),
  );

  const { count } = handler({ count: 0 });
  delete (manager as Record<string, unknown>)["temp"];
  console.log(\`Final count: \${count}\`);
}`;

// Covers: CSS selectors (tag, class, id), pseudo-classes, pseudo-elements,
// property names, vendor-prefixed properties, values, units, colors,
// CSS variables, media queries, keyframes, calc(), CSS functions
export const SAMPLE_CODE_CSS = `/* CSS Component Styles */
:root {
  --primary-color: #4eb3d4;
  --spacing-unit: 0.5rem;
  --font-stack: "Inter", system-ui, sans-serif;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

body {
  font-family: var(--font-stack);
  font-size: 16px;
  line-height: 1.6;
  color: oklch(0.9 0.01 180);
  background-color: hsl(170, 30%, 5%);
}

/* Class and ID selectors */
.container {
  max-width: 1200px;
  margin-inline: auto;
  padding: calc(var(--spacing-unit) * 4);
}

#main-header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Pseudo-classes and pseudo-elements */
a:hover,
a:focus-visible {
  color: var(--primary-color);
  text-decoration-thickness: 2px;
}

button:not(:disabled):active {
  transform: scale(0.98);
}

.tooltip::after {
  content: attr(data-tip);
  position: absolute;
  opacity: 0;
  transition: opacity 200ms ease-in-out;
}

/* Nesting, has(), media queries */
.card {
  border-radius: 8px;
  box-shadow: var(--shadow);

  &:has(img) {
    overflow: hidden;
  }

  & > .card-title {
    font-weight: 700;
    font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@layer components {
  .btn-primary {
    background: linear-gradient(135deg, #4eb3d4, #39c6ac);
    border: none;
    padding: 0.75em 1.5em;
    border-radius: 9999px;
    color: white;
    cursor: pointer;
  }
}`;

// Covers: JSON keys, string values, numbers, booleans, null, nested objects/arrays
export const SAMPLE_CODE_JSON = `{
  "name": "@vesper/design-system",
  "version": "2.4.0",
  "private": true,
  "description": "A modern design system with accessible components",
  "keywords": ["react", "components", "design-system", "accessibility"],
  "author": {
    "name": "Vesper Team",
    "email": "team@vesper.dev",
    "url": "https://vesper.dev"
  },
  "license": "MIT",
  "engines": {
    "node": ">=20.0.0"
  },
  "config": {
    "port": 3000,
    "debug": false,
    "verbose": true,
    "timeout": null,
    "retries": 3,
    "ratio": 1.618,
    "features": {
      "darkMode": true,
      "animations": true,
      "ssr": false
    }
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}`;

// Covers: headings, bold, italic, strikethrough, links, images, code (inline & fenced),
// blockquotes, ordered/unordered lists, horizontal rules, tables, task lists
export const SAMPLE_CODE_MARKDOWN = `# Design System Documentation

## Getting Started

Install the package using your preferred **package manager**:

\`\`\`bash
yarn add @vesper/design-system
\`\`\`

### Basic Usage

Import components _directly_ from the package. Each component supports
~~legacy props~~ the new **slot-based** API.

> **Note:** All components are fully accessible and follow
> WAI-ARIA guidelines for keyboard navigation.

## Components

| Component | Status | Version |
|-----------|--------|---------|
| Button    | Stable | 2.0.0   |
| Dialog    | Beta   | 1.9.0   |
| Tooltip   | Alpha  | 0.5.0   |

### Features

- [x] Fully typed with TypeScript
- [x] Tree-shakeable exports
- [ ] CSS-in-JS support
- [ ] React Server Components

1. Install dependencies
2. Configure your theme
3. Import and use components

---

For more details, visit [the docs](https://vesper.dev/docs) or check the
![badge](https://img.shields.io/badge/coverage-98%25-green) on GitHub.

Use inline code like \`<Button variant="primary" />\` in your JSX files.`;

// Covers: shell commands, variables, pipes, redirects, subshells,
// conditionals, loops, functions, heredocs, globs, quoting
export const SAMPLE_CODE_BASH = `#!/usr/bin/env bash
# Build and deploy script for the design system

set -euo pipefail

# Variables and string interpolation
PROJECT_ROOT="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="\${PROJECT_ROOT}/dist"
VERSION=$(node -p "require('./package.json').version")
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Function definition
build_package() {
  local package_name="$1"
  local outdir="\${BUILD_DIR}/\${package_name}"

  echo "Building \${package_name} v\${VERSION}..."

  if [[ -d "$outdir" ]]; then
    rm -rf "$outdir"
  fi

  mkdir -p "$outdir"

  # Pipe and redirect
  npx tsc --project "./packages/\${package_name}/tsconfig.json" \\
    2>&1 | tee "\${BUILD_DIR}/build_\${TIMESTAMP}.log"

  local exit_code=$?
  if (( exit_code != 0 )); then
    echo "Error: Build failed with exit code \${exit_code}" >&2
    return 1
  fi

  # Array and glob
  local -a files=("\${outdir}"/*.js)
  echo "Generated \${#files[@]} files"
}

# Conditional and loop
deploy() {
  local env="\${1:-staging}"

  case "$env" in
    production)
      echo "Deploying to production..."
      ;;
    staging|dev)
      echo "Deploying to \${env}..."
      ;;
    *)
      echo "Unknown environment: $env" >&2
      exit 1
      ;;
  esac

  for pkg in packages/*/; do
    [[ -f "\${pkg}package.json" ]] || continue
    build_package "$(basename "$pkg")"
  done

  # Command substitution and arithmetic
  local total_size=$(du -sh "$BUILD_DIR" | cut -f1)
  local file_count=$(($(find "$BUILD_DIR" -type f | wc -l)))

  cat <<EOF
Deploy Summary
==============
Environment: $env
Total Size:  $total_size
File Count:  $file_count
EOF
}

# Main execution
deploy "\${1:-staging}"`;

// ANSI escape sequences for terminal output rendering
// Covers: all 8 standard colors, all 8 bright colors, bold, italic,
// underline, strikethrough, dim, reverse, and combinations
const ESC = "\x1b";
export const SAMPLE_CODE_ANSI = [
  `${ESC}[1;36m● vesper${ESC}[0m ${ESC}[2mv2.4.0${ESC}[0m`,
  ``,
  `${ESC}[1m  Standard Colors${ESC}[0m`,
  `  ${ESC}[30m■ black${ESC}[0m   ${ESC}[31m■ red${ESC}[0m     ${ESC}[32m■ green${ESC}[0m   ${ESC}[33m■ yellow${ESC}[0m`,
  `  ${ESC}[34m■ blue${ESC}[0m    ${ESC}[35m■ magenta${ESC}[0m  ${ESC}[36m■ cyan${ESC}[0m    ${ESC}[37m■ white${ESC}[0m`,
  ``,
  `${ESC}[1m  Bright Colors${ESC}[0m`,
  `  ${ESC}[90m■ brBlack${ESC}[0m  ${ESC}[91m■ brRed${ESC}[0m    ${ESC}[92m■ brGreen${ESC}[0m  ${ESC}[93m■ brYellow${ESC}[0m`,
  `  ${ESC}[94m■ brBlue${ESC}[0m   ${ESC}[95m■ brMagenta${ESC}[0m ${ESC}[96m■ brCyan${ESC}[0m   ${ESC}[97m■ brWhite${ESC}[0m`,
  ``,
  `${ESC}[1m  Decorations${ESC}[0m`,
  `  ${ESC}[1mbold text${ESC}[0m   ${ESC}[3mitalic text${ESC}[0m   ${ESC}[4munderlined${ESC}[0m   ${ESC}[9mstrikethrough${ESC}[0m`,
  `  ${ESC}[2mdim text${ESC}[0m    ${ESC}[1;3mbold+italic${ESC}[0m   ${ESC}[1;4mbold+underline${ESC}[0m`,
  ``,
  `${ESC}[1m  Build Output${ESC}[0m`,
  `  ${ESC}[32m✓${ESC}[0m Compiled ${ESC}[1m48${ESC}[0m modules in ${ESC}[33m1.2s${ESC}[0m`,
  `  ${ESC}[32m✓${ESC}[0m Generated type declarations`,
  `  ${ESC}[32m✓${ESC}[0m Bundle size: ${ESC}[36m24.8 kB${ESC}[0m ${ESC}[2m(gzipped: 8.1 kB)${ESC}[0m`,
  `  ${ESC}[33m⚠${ESC}[0m ${ESC}[33mDeprecation:${ESC}[0m ${ESC}[3mlegacyProp${ESC}[0m will be removed in v3.0`,
  `  ${ESC}[31m✗${ESC}[0m ${ESC}[31mError:${ESC}[0m Failed to resolve ${ESC}[4m@vesper/missing-pkg${ESC}[0m`,
  ``,
  `  ${ESC}[1m  Test Results${ESC}[0m`,
  `  ${ESC}[32m  142 passing${ESC}[0m ${ESC}[2m(3.4s)${ESC}[0m`,
  `  ${ESC}[91m    2 failing${ESC}[0m`,
  `  ${ESC}[96m    5 pending${ESC}[0m`,
].join("\n");
