import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { optimize } from "svgo";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// transform an svg file name into its component name, ie. user-multiple.svg -> UserMultiple
const getComponentName = (fileName: string) => {
  const componentName =
    // get the icon name by trimming the .svg extension ("icon.svg" -> "icon")
    fileName
      .slice(0, -4)
      .split("-")
      .map((part) => {
        // special string mappings for abbreviations and PascalCase brand names
        if (part === "ai") return "AI";
        if (part === "fe") return "FE";
        if (part === "llk") return "LLK";
        if (part === "nn") return "NN";
        if (part === "tt") return "TT";
        if (part === "xla") return "XLA";
        if (part === "deepseek") return "DeepSeek";
        if (part === "youtube") return "YouTube";
        if (part === "github") return "GitHub";
        if (part === "linkedin") return "LinkedIn";
        if (part === "linkedin") return "LinkedIn";

        return part.charAt(0).toUpperCase().concat(part.slice(1));
      })
      .join("");

  return componentName;
};

const iconFiles = fs
  .readdirSync(path.resolve(__dirname, "../assets/icons"))
  .filter((file) => file.endsWith(".svg"));

const icons = iconFiles.map((fileName) => {
  // get the icon svg as utf-8
  const raw = fs.readFileSync(
    path.resolve(__dirname, "../assets/icons", fileName),
    "utf-8",
  );

  const name = getComponentName(fileName);

  // prefix ids using the icon id to prevent collisions between elements inside other svgs
  const { data } = optimize(raw, {
    plugins: [{ name: "prefixIds", params: { prefix: name } }],
  });

  // convert the optimized icon svg to a tree
  const tree = unified().use(rehypeParse, { fragment: true }).parse(data);

  // traverse and patch the tree
  visit(tree, "element", (node, _, parent) => {
    // convert the root <svg> element into a <symbol> element and remove extraneous properties
    if (node.tagName === "svg" && parent?.type === "root") {
      delete node.properties.width;
      delete node.properties.height;
      delete node.properties.fill;
      return;
    }

    const shouldPatchValue = (value: unknown) =>
      typeof value === "string" &&
      value !== "none" &&
      value !== "currentColor" &&
      !value.startsWith("url(");

    // patch non-colored icons so their fills and strokes use currentColor
    if (!name.includes("color")) {
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

  // serialize tree into a string again now that it's been optimized and patched
  const markdown = unified().use(rehypeStringify).stringify(tree);

  return { name, markdown };
});

fs.rmSync(path.resolve(__dirname, "../src/icons"), { recursive: true });
fs.mkdirSync(path.resolve(__dirname, "../src/icons"), { recursive: true });

icons.forEach((icon) => {
  // spread {...props} into the opening svg tag
  const markdown = icon.markdown.replace(/<svg([^>]*)>/, (_, attrs) => {
    return `<svg${attrs} {...props}>`;
  });

  const fileContents = `
import type { ComponentProps } from 'react';

export const ${icon.name} = (props: ComponentProps<'svg'>) => {
  return ${markdown}
}
`;

  fs.writeFileSync(
    path.resolve(__dirname, `../src/icons/${icon.name}.tsx`),
    fileContents,
  );
});

fs.writeFileSync(
  path.resolve(__dirname, `../src/icons/index.tsx`),
  icons.map((icon) => `export * from './${icon.name}'`).join("\n"),
);
