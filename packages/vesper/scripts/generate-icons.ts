import { jsx, toJs } from "estree-util-to-js";
import fs from "fs";
import { toEstree } from "hast-util-to-estree";
import rehypeParse from "rehype-parse";
import { optimize } from "svgo";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import { getGeneratedCodeWarning, resolvePackagePath } from "./utils";

// whether a fill/stroke value is a color that should be patched to `currentColor`
const shouldPatchValue = (value: unknown) =>
  typeof value === "string" &&
  value !== "none" &&
  value !== "currentColor" &&
  !value.startsWith("url(");

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning("yarn generate:icons");

// transform an svg file name into its kind, ie. user-multiple.svg → user-multiple
const getIconKind = (fileName: string) => fileName.slice(0, -4);

// transform an svg kind into its component name, ie. model-openai → ModelOpenAI
const getIconComponentName = (iconKind: string) => {
  return iconKind
    .split("-")
    .map((part) => {
      if (part === "ai") return "AI";
      if (part === "fe") return "FE";
      if (part === "tt") return "TT";
      if (part === "llk") return "LLK";
      if (part === "xla") return "XLA";
      if (part === "nn") return "NN";
      if (part === "quietbox") return "QuietBox";
      if (part === "loudbox") return "LoudBox";
      if (part === "youtube") return "YouTube";
      if (part === "github") return "GitHub";
      if (part === "deepseek") return "DeepSeek";
      if (part === "openai") return "OpenAI";
      if (part === "linkedin") return "LinkedIn";

      return part.charAt(0).toUpperCase().concat(part.slice(1));
    })
    .join("");
};

const iconFiles = fs
  .readdirSync(resolvePackagePath(`./assets/icons`))
  .filter((file) => file.endsWith(".svg"));

if (iconFiles.length === 0) {
  throw new Error("No SVG files found in assets/icons directory");
}

const icons = iconFiles.map((fileName) => {
  // get the raw contents of the icon svg as utf-8
  const raw = fs.readFileSync(
    resolvePackagePath(`./assets/icons/${fileName}`),
    "utf-8",
  );

  // get the kind of icon and its name
  const kind = getIconKind(fileName);
  const componentName = getIconComponentName(kind);

  // optimize the raw svg with SVGO, and prefix IDs using the icon id to prevent
  // collisions between elements inside other svgs
  const optimizedSvg = optimize(raw, {
    plugins: [{ name: "prefixIds", params: { prefix: kind } }],
  }).data;

  // convert the optimized icon svg to a syntax tree that we can traverse and manipulate
  const tree = unified()
    .use(rehypeParse, { fragment: true })
    .parse(optimizedSvg);

  // walk through the tree so we can manipulate it
  visit(tree, "element", (node, _, parent) => {
    // remove extraneous properties from the tree's root svg element
    if (node.tagName === "svg" && parent?.type === "root") {
      delete node.properties.width;
      delete node.properties.height;
      node.properties.fill = "none";
      return;
    }

    // patch non-colored icons so their fills and strokes use currentColor
    if (!kind.endsWith("-color")) {
      if ("fill" in node.properties && shouldPatchValue(node.properties.fill)) {
        node.properties.fill = "currentColor";
      }
      if (
        "stroke" in node.properties &&
        shouldPatchValue(node.properties.stroke)
      ) {
        node.properties.stroke = "currentColor";
      }
    }
  });

  // get the tree for our patched svg element
  const svg = tree.children.find(
    (node) => node.type === "element" && node.tagName === "svg",
  );
  if (!svg) {
    throw new Error(`No root <svg> element found in ${fileName}`);
  }

  // convert the patched svg element tree into a JSX estree syntax tree,
  // using the attribute names react expects
  //
  // eg:
  // - `fill-rule` → `fillRule`
  // - `xlink:href` → `xlinkHref`
  // - etc
  const estree = toEstree(svg, { elementAttributeNameCase: "react" });
  const [statement] = estree.body;
  if (
    statement?.type !== "ExpressionStatement" ||
    statement.expression.type !== "JSXElement"
  ) {
    throw new Error(`Failed to convert ${fileName} to JSX`);
  }

  // spread {...props} into the estree syntax tree's opening svg tag
  statement.expression.openingElement.attributes.push({
    type: "JSXSpreadAttribute",
    argument: { type: "Identifier", name: "props" },
  });

  // serialize the JSX estree syntax tree back into a JS string that
  // we can write into the generated icon's component file
  //
  // eg. `<svg {...props}>...</svg>;`
  const componentCode = toJs(estree, { handlers: jsx }).value;

  return { kind, componentName, componentCode };
});

// remove existing files in icons component folder
fs.rmSync(resolvePackagePath(`./src/components/icons`), {
  recursive: true,
  force: true,
});

// recreate icons component folder
fs.mkdirSync(resolvePackagePath(`./src/components/icons`), {
  recursive: true,
});

// create an individual component file for each icon
icons.forEach((icon) => {
  const fileContents = `
${AUTO_GENERATED_WARNING}

import type { ComponentProps } from 'react';

export const ${icon.componentName} = (props: ComponentProps<'svg'>) => {
  return ${icon.componentCode}
};
`;

  fs.writeFileSync(
    resolvePackagePath(`./src/components/icons/${icon.kind}.tsx`),
    fileContents,
  );
});

// create icons components registry file
fs.writeFileSync(
  resolvePackagePath(`./src/components/icons/registry.tsx`),
  `
  ${AUTO_GENERATED_WARNING}

  import type { ComponentProps, ComponentType } from "react"
  import type { IconKind } from "./types"
  ${icons.map((icon) => `import { ${icon.componentName} } from './${icon.kind}'`).join("\n")}

  export const registry: { [K in IconKind]: ComponentType<ComponentProps<"svg">> } = {
    ${icons.map((icon) => `"${icon.kind}": ${icon.componentName},`).join("\n")}
  }`,
);

// create master component that imports and renders via registry (not tree-shakeable)
fs.writeFileSync(
  resolvePackagePath(`./src/components/icons/icon.tsx`),
  `
  ${AUTO_GENERATED_WARNING}

  import type { ComponentProps } from "react";
  import type { IconKind } from "./types";
  import { registry } from "./registry";

  export interface IconProps extends ComponentProps<"svg"> {
    kind: IconKind;
  }

  export function Icon({ kind, ...props }: IconProps) {
    const Component = registry[kind]
    if (!Component) return null

    return (
      <Component {...props} />
    );
  }`,
);

// create types file with exported IconType
fs.writeFileSync(
  resolvePackagePath(`./src/components/icons/types.ts`),
  `${AUTO_GENERATED_WARNING}

  export type IconKind = ${icons.map((icon) => `"${icon.kind}"`).join("|")}`,
);

// create constants file with exported ICON_KINDS
fs.writeFileSync(
  resolvePackagePath(`./src/components/icons/constants.ts`),
  `${AUTO_GENERATED_WARNING}

  import type { IconKind } from "./types";

  export const ICON_KINDS: IconKind[] = [${icons.map((icon) => `"${icon.kind}"`).join(",")}]`,
);

// create barrel file with exports for each icon component, constants, and types (tree-shakeable)
const barrelExports = [
  "export { Icon } from './icon'",
  "export { ICON_KINDS } from './constants'",
  "export type { IconKind } from './types'",
  ...icons.map(
    (icon) => `export { ${icon.componentName} } from './${icon.kind}'`,
  ),
].toSorted((a, b) => {
  // sort exports by their module path
  const fromA = a.slice(a.indexOf("from"));
  const fromB = b.slice(b.indexOf("from"));

  return fromA < fromB ? -1 : fromB > fromA ? 1 : 0;
});

fs.writeFileSync(
  resolvePackagePath(`./src/components/icons/icons.ts`),
  `${AUTO_GENERATED_WARNING}

  ${barrelExports.join("\n")}`,
);

// create story file for icon component
fs.writeFileSync(
  resolvePackagePath(`./src/components/icons/icons.stories.tsx`),
  `import type { Meta, StoryObj } from "@storybook/react-vite";

import { Icon } from "@/components/icons/icons";

const meta = {
  component: Icon,
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { kind: "tenstorrent" },
  render: (props) => (
    <Icon width={32} height={32} color="var(--vesper-stone-900)" {...props} />
  ),
};
Playground.storyName = "icons";
`,
);
