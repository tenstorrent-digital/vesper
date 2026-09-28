/*
  Generates the `withVesper` tailwind-merge plugin and its tests from the theme
  variables and utilities in our tailwind stylesheets:

    src/styles/tailwind.css            (`@theme` variables)
    src/styles/tailwind-utilities.css  (`@utility` rules)
      -> src/utils/tailwind-merge.ts
      -> src/utils/tailwind-merge.test.ts

  How theme variable namespaces and CSS properties map onto tailwind-merge's
  config can't be inferred from the stylesheets, so it's configured below (see
  `NAMESPACES` and `PROPERTIES`). This script throws when it finds a namespace,
  property, or syntax it doesn't know how to handle, rather than silently
  generating an incomplete plugin.
*/

import { type TokenOrValue, transform, type UnknownAtRule } from "lightningcss";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  DefaultClassGroupIds,
  DefaultThemeGroupIds,
} from "tailwind-merge";

import { getGeneratedCodeWarning } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tailwind-merge",
);

const SOURCE_FILES = [
  "src/styles/tailwind.css",
  "src/styles/tailwind-utilities.css",
];

const OUTPUT_FILE = "src/utils/tailwind-merge.ts";
const OUTPUT_TEST_FILE = "src/utils/tailwind-merge.test.ts";

// ---------------------------------------------------------------------------
// configuration
// ---------------------------------------------------------------------------

type TestCase = [input: string, expected: string];

type BaseNamespace<N extends string, V> = {
  [Name in N]: V;
} & {
  /**
   * test cases for a variable in the namespace, where `name` is the variable
   * name without its `--{namespace}-vesper-` prefix (eg. `stone-500`)
   */
  tests: (name: string) => TestCase[];
};

/**
 * tailwind-merge class groups which the namespace's variables are added
 * to (for namespaces without a tailwind-merge theme scale), as a map of
 * class group ID -> class prefix
 *
 * eg. `{ "border-w-x": "border-x" }` adds `border-x-vesper-*` classes to
 * the `border-w-x` class group
 */
type ClassGroupsNamespace = BaseNamespace<
  "classGroups",
  Partial<Record<DefaultClassGroupIds, string>>
>;

function isClassGroupsNamespace(n: Namespace): n is ClassGroupsNamespace {
  return "classGroups" in n;
}

/**
 * tailwind-merge theme scale which the namespace's variables are added to
 *
 * tailwind-merge's theme scales share their names with tailwind's theme
 * variable namespaces, so this is usually the name of the namespace
 */
type ThemeNamespace = BaseNamespace<"theme", DefaultThemeGroupIds>;

function isThemeNamespace(n: Namespace): n is ThemeNamespace {
  return "theme" in n;
}

type Namespace = ClassGroupsNamespace | ThemeNamespace;

/**
 * theme variable namespaces used in `tailwind.css`, and how they map onto
 * tailwind-merge's config
 *
 * @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
 */
const NAMESPACES: Record<string, Namespace> = {
  color: {
    theme: "color",
    tests: (name) => [
      [`text-red-500 text-vesper-${name}`, `text-vesper-${name}`],
      [`bg-red-500 bg-vesper-${name}`, `bg-vesper-${name}`],
      [
        `border-vesper-base border-vesper-${name}`,
        `border-vesper-base border-vesper-${name}`,
      ],
    ],
  },
  spacing: {
    theme: "spacing",
    tests: (name) => [
      [`p-1 p-vesper-${name}`, `p-vesper-${name}`],
      [`p-vesper-${name} px-1`, `p-vesper-${name} px-1`],
      [`-mt-1 -mt-vesper-${name}`, `-mt-vesper-${name}`],
    ],
  },
  "border-width": {
    classGroups: {
      "border-w": "border",
      "border-w-x": "border-x",
      "border-w-y": "border-y",
      "border-w-s": "border-s",
      "border-w-e": "border-e",
      "border-w-bs": "border-bs",
      "border-w-be": "border-be",
      "border-w-t": "border-t",
      "border-w-r": "border-r",
      "border-w-b": "border-b",
      "border-w-l": "border-l",
      "divide-x": "divide-x",
      "divide-y": "divide-y",
    },
    tests: (name) => [
      [`border-2 border-vesper-${name}`, `border-vesper-${name}`],
      [`border-x-2 border-x-vesper-${name}`, `border-x-vesper-${name}`],
      [`divide-y-2 divide-y-vesper-${name}`, `divide-y-vesper-${name}`],
      [
        `border-vesper-${name} border-vesper-border-primary`,
        `border-vesper-${name} border-vesper-border-primary`,
      ],
    ],
  },
  "outline-width": {
    classGroups: { "outline-w": "outline" },
    tests: (name) => [
      [`outline-2 outline-vesper-${name}`, `outline-vesper-${name}`],
      [
        `outline-vesper-${name} outline-vesper-border-focus`,
        `outline-vesper-${name} outline-vesper-border-focus`,
      ],
    ],
  },
  radius: {
    theme: "radius",
    tests: (name) => [
      [`rounded-md rounded-vesper-${name}`, `rounded-vesper-${name}`],
      [`rounded-t-md rounded-t-vesper-${name}`, `rounded-t-vesper-${name}`],
    ],
  },
  tracking: {
    theme: "tracking",
    tests: (name) => [
      [`tracking-wide tracking-vesper-${name}`, `tracking-vesper-${name}`],
    ],
  },
  leading: {
    theme: "leading",
    tests: (name) => [
      [`leading-5 leading-vesper-${name}`, `leading-vesper-${name}`],
    ],
  },
  font: {
    theme: "font",
    tests: (name) => [
      [`font-mono font-vesper-${name}`, `font-vesper-${name}`],
      [`font-vesper-${name} font-bold`, `font-vesper-${name} font-bold`],
    ],
  },
  shadow: {
    theme: "shadow",
    tests: (name) => [
      [`shadow-md shadow-vesper-${name}`, `shadow-vesper-${name}`],
      [
        `shadow-vesper-${name} shadow-vesper-stone-500`,
        `shadow-vesper-${name} shadow-vesper-stone-500`,
      ],
    ],
  },
  "transition-duration": {
    classGroups: { duration: "duration" },
    tests: (name) => [
      [`duration-100 duration-vesper-${name}`, `duration-vesper-${name}`],
    ],
  },
};

interface Property {
  /** tailwind-merge class group which sets (only) this CSS property */
  classGroup: DefaultClassGroupIds;
  /** a class from the class group, for tests */
  example: string;
}

/**
 * CSS properties set by the utilities in `tailwind-utilities.css`, and the
 * tailwind-merge class groups which set them
 *
 * used to work out which class groups conflict with each utility
 */
const PROPERTIES: Record<string, Property> = {
  "background-color": { classGroup: "bg-color", example: "bg-red-500" },
  "background-image": { classGroup: "bg-image", example: "bg-none" },
  "background-position": { classGroup: "bg-position", example: "bg-bottom" },
  "background-repeat": { classGroup: "bg-repeat", example: "bg-repeat-x" },
};

// ---------------------------------------------------------------------------
// parsing
// ---------------------------------------------------------------------------

interface Rule {
  name: string;
  prelude: TokenOrValue[];
  block: TokenOrValue[];
  /** location of the rule in its source file, for error messages */
  location: string;
}

interface Declaration {
  property: string;
  value: TokenOrValue[];
}

interface Utility {
  /** name of the utility, or its root for functional utilities (eg. `bg-vesper-dot-pattern`) */
  name: string;
  /** theme variable namespace whose values a functional utility accepts */
  namespace: string | null;
  /** CSS properties set by the utility */
  properties: string[];
}

const isToken = (token: TokenOrValue, type: string) =>
  token.type === "token" && token.value.type === type;

const isInsignificant = (token: TokenOrValue) =>
  isToken(token, "white-space") || isToken(token, "comment");

const getIdent = (token: TokenOrValue | undefined) => {
  if (token?.type === "dashed-ident") return token.value;
  if (token?.type === "token" && token.value.type === "ident") {
    return token.value.value;
  }
};

/** collects the `@theme` and `@utility` rules from each source file */
const parseRules = () => {
  const rules: Rule[] = [];

  for (const file of SOURCE_FILES) {
    transform({
      filename: file,
      code: fs.readFileSync(path.resolve(__dirname, "..", file)),
      visitor: {
        Rule: {
          unknown(rule: UnknownAtRule) {
            if (rule.name === "theme" || rule.name === "utility") {
              rules.push({
                name: rule.name,
                prelude: rule.prelude,
                block: rule.block ?? [],
                location: `${file}:${rule.loc.line}`,
              });
            }
          },
        },
      },
    });
  }

  return rules;
};

/** splits the block of an `@theme` or `@utility` rule into its declarations */
const parseDeclarations = ({ block, location }: Rule) => {
  const declarations: Declaration[] = [];
  let tokens: TokenOrValue[] = [];

  const flush = () => {
    if (tokens.length === 0) return;

    const [name, colon, ...value] = tokens;
    const property = getIdent(name);

    if (!property || !colon || !isToken(colon, "colon")) {
      throw new Error(
        `${location}: unsupported declaration (only "property: value" declarations are supported)`,
      );
    }

    declarations.push({ property, value });
    tokens = [];
  };

  for (const token of block) {
    if (isToken(token, "curly-bracket-block")) {
      throw new Error(`${location}: nested rules are not supported`);
    }

    if (isToken(token, "semicolon")) {
      flush();
    } else if (!isInsignificant(token)) {
      tokens.push(token);
    }
  }

  flush();

  return declarations;
};

/**
 * gets the theme variables from `@theme` rules, as a map of namespace -> names
 *
 * eg. `--color-vesper-stone-500` -> `{ color: ["stone-500"] }`
 */
const parseThemeVariables = (rules: Rule[]) => {
  const variables = new Map<string, string[]>();

  for (const rule of rules.filter(({ name }) => name === "theme")) {
    for (const { property } of parseDeclarations(rule)) {
      const [, namespace, name] =
        property.match(/^--([a-z0-9-]+?)-vesper-([a-z0-9-]+)$/) ?? [];

      if (!namespace || !name) {
        throw new Error(
          `${rule.location}: theme variable "${property}" does not follow the "--{namespace}-vesper-{name}" naming convention`,
        );
      }

      if (!(namespace in NAMESPACES)) {
        throw new Error(
          `${rule.location}: unsupported theme variable namespace "--${namespace}-vesper-*", add it to \`NAMESPACES\` in ${path.relative(process.cwd(), __filename)}`,
        );
      }

      variables.set(namespace, [...(variables.get(namespace) ?? []), name]);
    }
  }

  return variables;
};

/** recursively finds calls to the function `name` in a declaration value */
const findFunctionCalls = (value: unknown, name: string): TokenOrValue[][] => {
  if (typeof value !== "object" || value === null) return [];

  const calls = Object.values(value).flatMap((child) =>
    findFunctionCalls(child, name),
  );

  if (
    "type" in value &&
    value.type === "function" &&
    "value" in value &&
    typeof value.value === "object" &&
    value.value !== null &&
    "name" in value.value &&
    "arguments" in value.value &&
    value.value.name === name
  ) {
    calls.push(value.value.arguments as TokenOrValue[]);
  }

  return calls;
};

/** gets the utilities from `@utility` rules */
const parseUtilities = (
  rules: Rule[],
  themeVariables: Map<string, string[]>,
) => {
  const utilities: Utility[] = [];

  for (const rule of rules.filter(({ name }) => name === "utility")) {
    const { location } = rule;
    const prelude = rule.prelude.filter((token) => !isInsignificant(token));
    const name = getIdent(prelude[0]);
    const isFunctional =
      prelude.length === 2 &&
      prelude[1]?.type === "token" &&
      prelude[1].value.type === "delim" &&
      prelude[1].value.value === "*" &&
      !!name?.endsWith("-");

    if (!name || (prelude.length !== 1 && !isFunctional)) {
      throw new Error(`${location}: unsupported utility name`);
    }

    const utility = isFunctional ? `${name}*` : name;
    const declarations = parseDeclarations(rule);

    for (const { property } of declarations) {
      if (!(property in PROPERTIES)) {
        throw new Error(
          `${location}: unsupported property "${property}" in utility "${utility}", add it to \`PROPERTIES\` in ${path.relative(process.cwd(), __filename)}`,
        );
      }
    }

    if (findFunctionCalls(declarations, "--modifier").length > 0) {
      throw new Error(`${location}: "--modifier()" is not supported`);
    }

    // functional utilities (eg. `bg-vesper-dot-pattern-*`) must accept values
    // from a single vesper theme variable namespace, eg. `--value(--color-vesper-*)`
    const namespaces = new Set(
      findFunctionCalls(declarations, "--value").map((args) => {
        const [variable, wildcard, ...rest] = args.filter(
          (token) => !isInsignificant(token),
        );
        const [, namespace] =
          getIdent(variable)?.match(/^--([a-z0-9-]+?)-vesper-$/) ?? [];

        if (
          !namespace ||
          !wildcard ||
          !isToken(wildcard, "delim") ||
          rest.length > 0 ||
          !themeVariables.has(namespace)
        ) {
          throw new Error(
            `${location}: unsupported "--value()" in utility "${utility}" (only "--value(--{namespace}-vesper-*)" is supported)`,
          );
        }

        return namespace;
      }),
    );

    if (isFunctional !== (namespaces.size === 1)) {
      throw new Error(
        `${location}: functional utilities must use "--value(--{namespace}-vesper-*)" with a single namespace, and static utilities must not use "--value()"`,
      );
    }

    utilities.push({
      name: isFunctional ? name.slice(0, -1) : name,
      namespace: [...namespaces][0] ?? null,
      properties: [...new Set(declarations.map(({ property }) => property))],
    });
  }

  return utilities;
};

// ---------------------------------------------------------------------------
// class groups
// ---------------------------------------------------------------------------

interface ClassGroup {
  id: string;
  properties: string[];
  /** a class from the class group, for tests */
  example: string;
  /** utilities in the class group (only for vesper class groups) */
  utilities: Utility[];
}

const isSubset = (a: string[], b: string[]) =>
  a.every((property) => b.includes(property));

/** longest common prefix of class names, by their dash-separated parts */
const getCommonPrefix = (names: string[]) => {
  const [first = [], ...rest] = names.map((name) => name.split("-"));
  const length = first.findIndex((part, index) =>
    rest.some((parts) => parts[index] !== part),
  );

  return first.slice(0, length === -1 ? undefined : length).join("-");
};

/**
 * utilities which set the same CSS properties completely override each other,
 * so they're grouped into the same class group
 */
const getUtilityClassGroups = (
  utilities: Utility[],
  themeVariables: Map<string, string[]>,
) => {
  const utilitiesByProperties = new Map<string, Utility[]>();

  for (const utility of utilities) {
    const key = [...utility.properties].sort().join();
    utilitiesByProperties.set(key, [
      ...(utilitiesByProperties.get(key) ?? []),
      utility,
    ]);
  }

  return [...utilitiesByProperties.values()].map((utilities): ClassGroup => {
    const [first] = utilities as [Utility];
    const prefix = getCommonPrefix(utilities.map(({ name }) => name));

    return {
      id: `vesper.${prefix || first.name}`,
      properties: first.properties,
      example: first.namespace
        ? `${first.name}-${themeVariables.get(first.namespace)?.[0]}`
        : first.name,
      utilities,
    };
  });
};

/**
 * gets conflicting class groups, where class group A overrides class group B
 * when B's properties are a subset of A's
 */
const getConflictingClassGroups = (utilityClassGroups: ClassGroup[]) => {
  const defaultClassGroups = Object.entries(PROPERTIES).map(
    ([property, { classGroup, example }]): ClassGroup => ({
      id: classGroup,
      properties: [property],
      example,
      utilities: [],
    }),
  );

  const conflicts = new Map<ClassGroup, ClassGroup[]>();

  for (const a of [...utilityClassGroups, ...defaultClassGroups]) {
    for (const b of utilityClassGroups.includes(a)
      ? [...utilityClassGroups, ...defaultClassGroups]
      : utilityClassGroups) {
      if (a !== b && isSubset(b.properties, a.properties)) {
        conflicts.set(a, [...(conflicts.get(a) ?? []), b]);
      }
    }
  }

  return { conflicts, defaultClassGroups };
};

// ---------------------------------------------------------------------------
// code generation
// ---------------------------------------------------------------------------

const toConstantName = (namespace: string) =>
  namespace.toUpperCase().replaceAll("-", "_");

const toValidatorName = (namespace: string) =>
  `isVesper${namespace
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")}`;

const toList = (values: string[]) =>
  values.map((value) => JSON.stringify(value)).join(",\n");

/**
 * template literal for a test case, where `${variable}` placeholders are
 * interpolated in the generated test (or just the variable, if that's all it is)
 */
const toTemplate = (value: string) =>
  value.match(/^\$\{(\w+)\}$/)?.[1] ?? `\`${value}\``;

const generatePlugin = (
  themeVariables: Map<string, string[]>,
  utilityClassGroups: ClassGroup[],
  conflicts: Map<ClassGroup, ClassGroup[]>,
) => {
  const namespaces = [...themeVariables.keys()];

  const constants = namespaces.map(
    (namespace) => `
      /** \`--${namespace}-vesper-*\` */
      const ${toConstantName(namespace)}: ReadonlySet<string> = new Set([
        ${toList(themeVariables.get(namespace)!)}
      ]);`,
  );

  const validators = namespaces.map(
    (namespace) =>
      `const ${toValidatorName(namespace)} = (value: string) => ${toConstantName(namespace)}.has(value);`,
  );

  const validatorMappings = namespaces.reduce<{
    theme: string[];
    classGroups: string[];
  }>(
    (acc, namespace) => {
      const config = NAMESPACES[namespace];
      if (isThemeNamespace(config)) {
        const space = JSON.stringify(config.theme);
        const validatorName = toValidatorName(namespace);
        const validator = `${space}: [{ vesper: [${validatorName}] }],`;

        acc.theme.push(validator);
        return acc;
      }

      if (isClassGroupsNamespace(config)) {
        const validators = Object.entries(config.classGroups).map(
          ([id, prefix]) => {
            const space = JSON.stringify(id);
            const token = JSON.stringify(`${prefix}-vesper`);
            const validatorName = toValidatorName(namespace);

            return `${space}: [{ ${token}: [${validatorName}] }],`;
          },
        );

        acc.classGroups.push(...validators);
        return acc;
      }

      return acc;
    },
    { theme: [], classGroups: [] },
  );

  const utilityClassGroupDefinitions = utilityClassGroups.map(
    ({ id, utilities }) => `${JSON.stringify(id)}: [
        ${utilities
          .map(({ name, namespace }) =>
            namespace
              ? `{ ${JSON.stringify(name)}: [${toValidatorName(namespace)}] }`
              : JSON.stringify(name),
          )
          .join(",\n")}
      ],`,
  );

  const conflictingClassGroups = [...conflicts].map(
    ([{ id }, classGroups]) =>
      `${JSON.stringify(id)}: [${toList(classGroups.map(({ id }) => id))}],`,
  );

  const vesperClassGroupIds =
    utilityClassGroups.map(({ id }) => JSON.stringify(id)).join(" | ") ||
    "never";

  return `${AUTO_GENERATED_WARNING}

import {
  type Config,
  type DefaultClassGroupIds,
  type DefaultThemeGroupIds,
  mergeConfigs,
} from "tailwind-merge";

/*
  Theme variables declared in \`@/styles/tailwind.css\`, listed by namespace
  without their \`--{namespace}-vesper-\` prefix.

  eg. \`--color-vesper-stone-500\` -> \`stone-500\` (used as \`bg-vesper-stone-500\`)

  Validators are used rather than listing every class, which keeps
  tailwind-merge's (lazily built) class map small.
*/

${constants.join("\n")}

${validators.join("\n")}

/*
  Custom class groups for the utilities in \`@/styles/tailwind-utilities.css\`

  Class group IDs are prefixed with \`vesper.\` (as recommended for plugins) to
  avoid clashing with tailwind-merge's default class groups.
*/
type VesperClassGroupIds = ${vesperClassGroupIds};

/**
 * A \`tailwind-merge\` plugin to support vesper theme variables and utilities.
 *
 * @example
 * import { extendTailwindMerge } from "tailwind-merge";
 * import { withVesper } from "@tenstorrent/vesper/tailwind-merge";
 *
 * const twMerge = extendTailwindMerge(withVesper);
 *
 * twMerge("p-vesper-2 p-vesper-4"); // "p-vesper-4"
 * twMerge("border-vesper-base border-vesper-border-primary"); // unchanged (width + color)
 * twMerge("bg-red-500 bg-vesper-dot-pattern-primary"); // "bg-vesper-dot-pattern-primary"
 *
 * @example
 * import { extendTailwindMerge } from "tailwind-merge";
 * import { withVesper } from "@tenstorrent/vesper/tailwind-merge";
 *
 * // combined with your own config extension and/or other plugins
 * const twMerge = extendTailwindMerge({ extend: { ... } }, withVesper);
 */
export const withVesper = (
  config: Config<string, string>,
): Config<string, string> =>
  mergeConfigs<
    DefaultClassGroupIds | VesperClassGroupIds,
    DefaultThemeGroupIds
  >(config, {
    extend: {
      theme: {
        ${validatorMappings.theme.join("\n")}
      },
      classGroups: {
        // theme variable namespaces without a tailwind-merge theme scale
        ${validatorMappings.classGroups.join("\n")}
        // custom utilities
        ${utilityClassGroupDefinitions.join("\n")}
      },
      // class groups which override the class groups (or parts of them) that
      // come before them
      conflictingClassGroups: {
        ${conflictingClassGroups.join("\n")}
      },
    },
  });
`;
};

const generateTests = (
  themeVariables: Map<string, string[]>,
  utilityClassGroups: ClassGroup[],
  defaultClassGroups: ClassGroup[],
  conflicts: Map<ClassGroup, ClassGroup[]>,
) => {
  const namespaces = [...themeVariables.keys()];

  const constants = namespaces.map(
    (namespace) => `
      /** \`--${namespace}-vesper-*\` */
      const ${toConstantName(namespace)} = [
        ${toList(themeVariables.get(namespace)!)}
      ];`,
  );

  const themeTests = namespaces.map((namespace) => {
    const cases = NAMESPACES[namespace]!.tests("${name}");

    return `
      test.each(${toConstantName(namespace)})("--${namespace}-vesper-%s", (name) => {
        ${cases
          .map(
            ([input, expected]) =>
              `expect(twMerge(${toTemplate(input)})).toBe(${toTemplate(expected)});`,
          )
          .join("\n")}
      });`;
  });

  const utilityTests = utilityClassGroups.map((classGroup) => {
    const utility = "${utility}";
    const cases: TestCase[] = [[`${classGroup.example} ${utility}`, utility]];

    // class groups which set any of the same properties
    for (const other of [...utilityClassGroups, ...defaultClassGroups]) {
      if (
        other === classGroup ||
        !other.properties.some((property) =>
          classGroup.properties.includes(property),
        )
      ) {
        continue;
      }

      const overrides = (a: ClassGroup, b: ClassGroup) =>
        conflicts.get(a)?.includes(b) ?? false;

      cases.push(
        [
          `${other.example} ${utility}`,
          overrides(classGroup, other)
            ? utility
            : `${other.example} ${utility}`,
        ],
        [
          `${utility} ${other.example}`,
          overrides(other, classGroup)
            ? other.example
            : `${utility} ${other.example}`,
        ],
      );
    }

    const utilities = classGroup.utilities.map(({ name, namespace }) =>
      namespace
        ? `...${toConstantName(namespace)}.map((name) => \`${name}-\${name}\`)`
        : JSON.stringify(name),
    );

    return `
      describe(${JSON.stringify(classGroup.id)}, () => {
        test.each([
          ${utilities.join(",\n")}
        ])("%s", (utility) => {
          ${cases
            .map(
              ([input, expected]) =>
                `expect(twMerge(${toTemplate(input)})).toBe(${toTemplate(expected)});`,
            )
            .join("\n")}
        });
      });`;
  });

  return `${AUTO_GENERATED_WARNING}

import { extendTailwindMerge } from "tailwind-merge";
import { describe, expect, test } from "vitest";

import { withVesper } from "@/utils/tailwind-merge";

const twMerge = extendTailwindMerge(withVesper);

${constants.join("\n")}

describe("withVesper", () => {
  test("does not change the merging of default tailwind classes", () => {
    expect(twMerge("p-2 p-4 bg-red-500 bg-blue-500")).toBe("p-4 bg-blue-500");
    expect(twMerge("border-2 border-red-500")).toBe("border-2 border-red-500");
    expect(twMerge("shadow-md shadow-red-500")).toBe("shadow-md shadow-red-500");
  });

  test("can be combined with other config extensions", () => {
    const customTwMerge = extendTailwindMerge(
      { extend: { theme: { spacing: ["gutter"] } } },
      withVesper,
    );

    expect(customTwMerge("p-gutter p-vesper-4")).toBe("p-vesper-4");
    expect(customTwMerge("p-vesper-4 p-gutter")).toBe("p-gutter");
  });

  describe("theme variables", () => {
    ${themeTests.join("\n")}
  });

  describe("utilities", () => {
    ${utilityTests.join("\n")}
  });
});
`;
};

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

const rules = parseRules();
const themeVariables = parseThemeVariables(rules);

if (themeVariables.size === 0) {
  throw new Error(`No theme variables found in ${SOURCE_FILES.join(", ")}`);
}

const utilities = parseUtilities(rules, themeVariables);
const utilityClassGroups = getUtilityClassGroups(utilities, themeVariables);
const { conflicts, defaultClassGroups } =
  getConflictingClassGroups(utilityClassGroups);

fs.writeFileSync(
  path.resolve(__dirname, "..", OUTPUT_FILE),
  generatePlugin(themeVariables, utilityClassGroups, conflicts),
);

fs.writeFileSync(
  path.resolve(__dirname, "..", OUTPUT_TEST_FILE),
  generateTests(
    themeVariables,
    utilityClassGroups,
    defaultClassGroups,
    conflicts,
  ),
);
