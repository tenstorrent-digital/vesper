import fs from "node:fs";
import path from "node:path";

import { PlopTypes } from "@turbo/gen";

/** a component name, or a separator between groups of components */
type ComponentChoice = string | { type: "separator"; line: string };

/** vesper components, relative to the monorepo root */
export const COMPONENTS_PATH = "packages/vesper/src/components";

/** vesper component documentation, relative to the monorepo root */
const DOCS_PATH = "docs/components";

/** every `@tenstorrent/vesper/*` import in the website's `mdx-components.tsx` */
const VESPER_IMPORT =
  /^import \{[^}]+\} from "@tenstorrent\/vesper\/([a-z0-9-]+)";$/gm;

/** the `// components below...` comment and the mappings that follow it */
const COMPONENT_MAPPING = /(\/\/ components below[^\n]*\n)((?: {2}\w+,\n)+)/;

/**
 * lists every documentable component in `packages/vesper/src/components` (eg.
 * `show-more`), grouped so components that have no page in `docs/components`
 * come first - `icons` is skipped since it has no `icons.tsx` entrypoint
 *
 * @param plop used to resolve the monorepo root from the generator's location
 */
export const getComponentChoices = (
  plop: PlopTypes.NodePlopAPI,
): ComponentChoice[] => {
  const root = path.resolve(plop.getPlopfilePath(), "../..");
  const componentsPath = path.join(root, COMPONENTS_PATH);

  const components = fs
    .readdirSync(componentsPath, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(
          path.join(componentsPath, entry.name, `${entry.name}.tsx`),
        ),
    )
    .map((entry) => entry.name)
    .sort();

  const isDocumented = (component: string) =>
    fs.existsSync(path.join(root, DOCS_PATH, `${component}.mdx`));

  const undocumented = components.filter(
    (component) => !isDocumented(component),
  );
  const documented = components.filter(isDocumented);

  return [
    ...(undocumented.length
      ? [
          { type: "separator" as const, line: "── needs documentation ──" },
          ...undocumented,
        ]
      : []),
    ...(documented.length
      ? [
          { type: "separator" as const, line: "── already documented ──" },
          ...documented,
        ]
      : []),
  ];
};

/**
 * narrows the component list as the user types, dropping any group separator
 * that is left without components under it
 *
 * @param choices the grouped component list from `getComponentChoices`
 * @param input the current search term, eg. `showm`
 */
export const searchComponentChoices = (
  choices: ComponentChoice[],
  input = "",
): ComponentChoice[] => {
  // ignore case and dashes so `ShowMore` and `showmore` both match `show-more`
  const normalize = (value: string) => value.toLowerCase().replace(/-/g, "");
  const search = normalize(input);

  const matches = choices.filter(
    (choice) =>
      typeof choice !== "string" || normalize(choice).includes(search),
  );

  // a separator is only kept when a component follows it
  return matches.filter(
    (choice, index) =>
      typeof choice === "string" || typeof matches[index + 1] === "string",
  );
};

/**
 * adds a component to the documentation website's `mdx-components.tsx` so it
 * can be used in any document without an import
 *
 * the import is inserted in module path order (how `simple-import-sort` sorts
 * imports) and the mapping is inserted alphabetically
 *
 * @param contents the current contents of `mdx-components.tsx`
 * @param name the component's name, eg. `ShowMore`
 * @param component the component's export path, eg. `show-more`
 */
export const addToMdxComponents = (
  contents: string,
  name: string,
  component: string,
): string => {
  const statement = `import { ${name} } from "@tenstorrent/vesper/${component}";`;

  // the component is already exposed to documents, nothing to do
  if (contents.includes(statement)) {
    return contents;
  }

  const imports: { component: string; start: number; end: number }[] = [];

  let match: RegExpExecArray | null;
  while ((match = VESPER_IMPORT.exec(contents)) !== null) {
    imports.push({
      component: match[1] ?? "",
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  const next = imports.find((existing) => existing.component > component);
  const last = imports[imports.length - 1];

  if (next) {
    contents = `${contents.slice(0, next.start)}${statement}\n${contents.slice(next.start)}`;
  } else if (last) {
    contents = `${contents.slice(0, last.end)}\n${statement}${contents.slice(last.end)}`;
  }

  return contents.replace(
    COMPONENT_MAPPING,
    (_, comment: string, mappings: string) => {
      const entries = mappings.trimEnd().split("\n");
      const index = entries.findIndex((entry) => entry.trim() > `${name},`);

      entries.splice(index === -1 ? entries.length : index, 0, `  ${name},`);

      return `${comment}${entries.join("\n")}\n`;
    },
  );
};
